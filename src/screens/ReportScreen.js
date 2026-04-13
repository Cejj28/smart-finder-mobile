import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Image,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import { initModel, isModelReady, analyzeImage } from '../services/imageAnalyzer';
import { createItem } from '../services/api';

const REPORT_TYPES = ['Lost', 'Found'];

export default function ReportScreen() {
    const [type, setType] = useState('Lost');
    const [itemName, setItemName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ML states
    const [modelLoading, setModelLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [tags, setTags] = useState([]);

    /* ── Load ML model on mount ── */
    useEffect(() => {
        (async () => {
            try {
                await initModel();
            } catch (e) {
                console.warn('ML init failed:', e);
            } finally {
                setModelLoading(false);
            }
        })();
    }, []);

    /* ── Run ML analysis whenever a new image is set ── */
    const runAnalysis = async (uri) => {
        if (!isModelReady()) return;
        setAnalyzing(true);
        try {
            const { labels, colors } = await analyzeImage(uri);
            setTags([...labels, ...colors.map((c) => `${c}`)]);

            // Auto-fill description if empty
            if (!description.trim()) {
                const parts = [];
                if (labels.length) parts.push(labels.join(', '));
                if (colors.length) parts.push(`Colors: ${colors.join(', ')}`);
                if (parts.length) setDescription(parts.join(' — '));
            }
        } catch (e) {
            console.warn('Image analysis failed:', e);
        } finally {
            setAnalyzing(false);
        }
    };

    /* ── Image handlers ── */
    const handleImageResult = (result) => {
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
            setTags([]);          // clear old tags
            runAnalysis(uri);     // trigger ML
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera access is needed to take a photo.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
        });
        handleImageResult(result);
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Gallery access is needed to pick a photo.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
        });
        handleImageResult(result);
    };

    const removeImage = () => {
        setImage(null);
        setTags([]);
    };

    /* ── Form ── */
    const handleSubmit = async () => {
        if (!itemName.trim() || !location.trim()) {
            Alert.alert('Missing Fields', 'Please fill in item name and location.');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('type', type);
            formData.append('item_name', itemName);
            formData.append('location', location);
            formData.append('description', description);
            formData.append('contact_info', contactInfo);

            if (image) {
                const filename = image.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const fileType = match ? `image/${match[1]}` : `image`;
                formData.append('image', {
                    uri: image,
                    name: filename,
                    type: fileType,
                });
            }

            await createItem(formData);

            Alert.alert(
                'Report Submitted!',
                `Your ${type.toLowerCase()} item report for "${itemName}" has been successfully pushed to the system database.`,
                [{ text: 'OK', onPress: resetForm }],
            );
        } catch (err) {
            console.error(err);
            Alert.alert('Submission Failed', 'Could not save report to server. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setItemName('');
        setLocation('');
        setDescription('');
        setContactInfo('');
        setImage(null);
        setTags([]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Report an Item</Text>
                        <Text style={styles.subtitle}>Fill out the details below</Text>
                    </View>

                    {/* Card */}
                    <View style={styles.card}>
                        <View style={styles.cardAccent} />

                        {/* Type Selector */}
                        <Text style={styles.label}>Report Type</Text>
                        <View style={styles.typeSelector}>
                            {REPORT_TYPES.map((t) => (
                                <TouchableOpacity
                                    key={t}
                                    style={[
                                        styles.typeBtn,
                                        type === t && { 
                                            backgroundColor: t === 'Lost' ? COLORS.error : COLORS.success,
                                            borderColor: t === 'Lost' ? COLORS.error : COLORS.success,
                                        }
                                    ]}
                                    onPress={() => setType(t)}
                                >
                                    <Ionicons
                                        name={t === 'Lost' ? 'search-outline' : 'checkmark-circle-outline'}
                                        size={18}
                                        color={type === t ? COLORS.white : COLORS.textMedium}
                                    />
                                    <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>
                                        {t}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* ── Item Photo + ML ── */}
                        <Text style={styles.label}>Item Photo</Text>
                        {image ? (
                            <View style={styles.imagePreviewContainer}>
                                <Image source={{ uri: image }} style={styles.imagePreview} />
                                <TouchableOpacity
                                    style={styles.removeBtn}
                                    onPress={removeImage}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close" size={16} color={COLORS.white} />
                                </TouchableOpacity>

                                {/* Analysing overlay */}
                                {analyzing && (
                                    <View style={styles.analyzingOverlay}>
                                        <ActivityIndicator size="small" color={COLORS.white} />
                                        <Text style={styles.analyzingText}>Analyzing image…</Text>
                                    </View>
                                )}

                                {/* ML Tags */}
                                {!analyzing && tags.length > 0 && (
                                    <View style={styles.tagsRow}>
                                        <Ionicons name="sparkles" size={14} color={COLORS.primary} />
                                        {tags.map((tag, i) => (
                                            <View key={i} style={styles.tagChip}>
                                                <Text style={styles.tagText}>{tag}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                <View style={styles.retakeRow}>
                                    <TouchableOpacity style={styles.retakeBtn} onPress={takePhoto} activeOpacity={0.7}>
                                        <Ionicons name="camera-outline" size={16} color={COLORS.primary} />
                                        <Text style={styles.retakeBtnText}>Retake</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.retakeBtn} onPress={pickImage} activeOpacity={0.7}>
                                        <Ionicons name="images-outline" size={16} color={COLORS.primary} />
                                        <Text style={styles.retakeBtnText}>Change</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.photoActions}>
                                <TouchableOpacity style={styles.photoBtn} onPress={takePhoto} activeOpacity={0.7}>
                                    <View style={styles.photoBtnIconWrap}>
                                        <Ionicons name="camera" size={22} color={COLORS.primary} />
                                    </View>
                                    <Text style={styles.photoBtnText}>Take Photo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.photoBtn} onPress={pickImage} activeOpacity={0.7}>
                                    <View style={styles.photoBtnIconWrap}>
                                        <Ionicons name="images" size={22} color={COLORS.primary} />
                                    </View>
                                    <Text style={styles.photoBtnText}>Gallery</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* ML status badge */}
                        {modelLoading && (
                            <View style={styles.mlStatusRow}>
                                <ActivityIndicator size="small" color={COLORS.textLight} />
                                <Text style={styles.mlStatusText}>Loading AI model…</Text>
                            </View>
                        )}

                        {/* Item Name */}
                        <Text style={styles.label}>Item Name *</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="cube-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Blue Backpack"
                                placeholderTextColor={COLORS.textLight}
                                value={itemName}
                                onChangeText={setItemName}
                            />
                        </View>

                        {/* Location */}
                        <Text style={styles.label}>Location *</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="location-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Library 2nd Floor"
                                placeholderTextColor={COLORS.textLight}
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>

                        {/* Description (auto-filled by ML) */}
                        <Text style={styles.label}>Description</Text>
                        <View style={[styles.inputWrapper, { alignItems: 'flex-start' }]}>
                            <Ionicons name="document-text-outline" size={18} color={COLORS.textLight} style={[styles.inputIcon, { marginTop: 12 }]} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Describe the item in detail..."
                                placeholderTextColor={COLORS.textLight}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                        {tags.length > 0 && (
                            <Text style={styles.autoFillHint}>
                                ✨ Description auto-filled by AI — feel free to edit
                            </Text>
                        )}

                        {/* Contact */}
                        <Text style={styles.label}>Contact Info</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="call-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone or email"
                                placeholderTextColor={COLORS.textLight}
                                value={contactInfo}
                                onChangeText={setContactInfo}
                            />
                        </View>

                        {/* Submit */}
                        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
                            <Ionicons name="send" size={18} color={COLORS.white} />
                            <Text style={styles.submitText}>Submit Report</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgColor,
    },
    scrollContent: {
        paddingBottom: SPACING.xxxl,
    },
    header: {
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.extrabold,
        color: COLORS.primary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textMedium,
    },
    card: {
        backgroundColor: COLORS.cardBg,
        marginHorizontal: SPACING.xl,
        borderRadius: RADIUS.lg,
        padding: SPACING.xl,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: COLORS.primaryLight,
        overflow: 'hidden',
    },
    cardAccent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: COLORS.primary,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textMedium,
        marginBottom: SPACING.sm,
        marginTop: SPACING.lg,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    typeSelector: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    typeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        backgroundColor: COLORS.bgColor,
    },
    typeBtnActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    typeBtnText: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textMedium,
    },
    typeBtnTextActive: {
        color: COLORS.white,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.bgColor,
        paddingHorizontal: SPACING.md,
    },
    inputIcon: {
        marginRight: SPACING.sm,
    },
    input: {
        flex: 1,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textDark,
    },
    textArea: {
        minHeight: 100,
        paddingTop: SPACING.md,
    },

    /* ── Photo Section ── */
    photoActions: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    photoBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.lg,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: COLORS.primaryLight,
        borderStyle: 'dashed',
        backgroundColor: COLORS.bgColor,
        gap: SPACING.sm,
    },
    photoBtnIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoBtnText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.primary,
    },
    imagePreviewContainer: {
        position: 'relative',
        borderRadius: RADIUS.md,
        overflow: 'hidden',
        backgroundColor: COLORS.bgColor,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
    },
    imagePreview: {
        width: '100%',
        height: 200,
    },
    removeBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.55)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    analyzingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    analyzingText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.xs,
        padding: SPACING.sm,
        paddingHorizontal: SPACING.md,
        alignItems: 'center',
        backgroundColor: COLORS.primaryLight,
    },
    tagChip: {
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 3,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    tagText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.primary,
    },
    retakeRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        padding: SPACING.sm,
    },
    retakeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.primaryLight,
    },
    retakeBtnText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.primary,
    },
    mlStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.sm,
    },
    mlStatusText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
    },
    autoFillHint: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.primary,
        marginTop: SPACING.xs,
        fontStyle: 'italic',
    },

    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        borderRadius: RADIUS.md,
        marginTop: SPACING.xxl,
        ...SHADOWS.md,
    },
    submitText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
    },
});
