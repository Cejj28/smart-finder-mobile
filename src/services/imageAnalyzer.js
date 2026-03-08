/**
 * On-device ML image analysis service
 * Uses TensorFlow.js + MobileNet for object classification
 * and simple pixel sampling for dominant color extraction.
 */
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as jpeg from 'jpeg-js';

let model = null;
let tfReady = false;

/* ──────────────────── Initialization ──────────────────── */

/**
 * Initialize TensorFlow runtime and load the MobileNet model.
 * Call once (e.g. on component mount). Subsequent calls are no-ops.
 */
export async function initModel() {
    if (model) return;           // already loaded
    if (!tfReady) {
        await tf.ready();
        tfReady = true;
    }
    // version 2, alpha 0.5 → smallest model (~3.5 MB), still good accuracy
    model = await mobilenet.load({ version: 2, alpha: 0.5 });
}

/** Returns true once the model is ready for inference. */
export function isModelReady() {
    return model !== null;
}

/* ──────────────────── Analysis ──────────────────── */

/**
 * Analyse a photo and return auto-generated tags + dominant colours.
 *
 * @param {string} imageUri  – local file URI from ImagePicker
 * @returns {{ labels: string[], colors: string[] }}
 */
export async function analyzeImage(imageUri) {
    if (!model) {
        throw new Error('ML model not loaded – call initModel() first.');
    }

    /* 1. Resize to 224×224 (MobileNet input size) & save as JPEG */
    const resized = await manipulateAsync(
        imageUri,
        [{ resize: { width: 224, height: 224 } }],
        { format: SaveFormat.JPEG, compress: 0.8, base64: true },
    );

    /* 2. Decode JPEG → raw pixel Uint8Array */
    const rawBytes = _base64ToArrayBuffer(resized.base64);
    const { width, height, data: pixels } = jpeg.decode(rawBytes, { useTArray: true });

    /* 3. Convert pixels → TF tensor [1, 224, 224, 3] normalised 0-1 */
    const imageTensor = tf.tensor3d(
        new Uint8Array(pixels),       // RGBA
        [height, width, 4],
    )
        .slice([0, 0, 0], [-1, -1, 3]) // drop alpha → RGB
        .toFloat()
        .div(255.0);                    // normalise

    /* 4. Classify */
    const predictions = await model.classify(imageTensor);

    /* 5. Extract dominant colours from the raw pixel data */
    const colors = _extractDominantColors(pixels, width, height);

    /* 6. Tidy up tensors */
    imageTensor.dispose();

    /* 7. Simplify label names (MobileNet returns comma-separated synonyms) */
    const labels = predictions
        .filter((p) => p.probability > 0.05)          // keep only confident
        .slice(0, 3)                                     // top 3
        .map((p) => p.className.split(',')[0].trim());   // first synonym

    return { labels, colors };
}

/* ──────────────────── Helpers ──────────────────── */

/** Base-64 string → ArrayBuffer */
function _base64ToArrayBuffer(base64) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const lookup = new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;

    const len = base64.length;
    let bufLen = (len * 3) / 4;
    if (base64[len - 1] === '=') bufLen--;
    if (base64[len - 2] === '=') bufLen--;

    const bytes = new Uint8Array(bufLen);
    let p = 0;
    for (let i = 0; i < len; i += 4) {
        const e1 = lookup[base64.charCodeAt(i)];
        const e2 = lookup[base64.charCodeAt(i + 1)];
        const e3 = lookup[base64.charCodeAt(i + 2)];
        const e4 = lookup[base64.charCodeAt(i + 3)];
        bytes[p++] = (e1 << 2) | (e2 >> 4);
        if (p < bufLen) bytes[p++] = ((e2 & 15) << 4) | (e3 >> 2);
        if (p < bufLen) bytes[p++] = ((e3 & 3) << 6) | e4;
    }
    return bytes.buffer;
}

/**
 * Sample pixels across the image and map dominant RGB values
 * to the nearest named colour.
 */
function _extractDominantColors(pixels, width, height) {
    // Named-colour lookup (common item colours)
    const COLOR_MAP = [
        { name: 'Red', r: 220, g: 50, b: 50 },
        { name: 'Blue', r: 50, g: 80, b: 220 },
        { name: 'Green', r: 50, g: 180, b: 70 },
        { name: 'Yellow', r: 240, g: 220, b: 50 },
        { name: 'Orange', r: 240, g: 150, b: 30 },
        { name: 'Purple', r: 150, g: 50, b: 200 },
        { name: 'Pink', r: 240, g: 130, b: 170 },
        { name: 'Brown', r: 140, g: 80, b: 40 },
        { name: 'Black', r: 30, g: 30, b: 30 },
        { name: 'White', r: 240, g: 240, b: 240 },
        { name: 'Gray', r: 140, g: 140, b: 140 },
        { name: 'Beige', r: 220, g: 200, b: 170 },
        { name: 'Navy', r: 30, g: 40, b: 100 },
        { name: 'Maroon', r: 120, g: 30, b: 30 },
        { name: 'Teal', r: 0, g: 130, b: 130 },
    ];

    const freq = {};
    const step = 4; // sample every 4th pixel for speed
    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
            const idx = (y * width + x) * 4; // RGBA
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];

            // Find nearest named colour (Euclidean distance)
            let minDist = Infinity;
            let best = 'Unknown';
            for (const c of COLOR_MAP) {
                const d = (r - c.r) ** 2 + (g - c.g) ** 2 + (b - c.b) ** 2;
                if (d < minDist) {
                    minDist = d;
                    best = c.name;
                }
            }
            freq[best] = (freq[best] || 0) + 1;
        }
    }

    // Sort by frequency, return top 2
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([name]) => name);
}
