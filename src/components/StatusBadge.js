import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/theme';

const STATUS_STYLES = {
    Lost: { color: COLORS.error, bg: COLORS.errorBg },
    Found: { color: COLORS.success, bg: COLORS.successBg },
    'Pending Review': { color: COLORS.warning, bg: COLORS.warningBg },
    Pending: { color: COLORS.warning, bg: COLORS.warningBg },
    Approved: { color: COLORS.success, bg: COLORS.successBg },
    Rejected: { color: COLORS.error, bg: COLORS.errorBg },
    Claimed: { color: COLORS.indigo, bg: COLORS.indigoBg },
    Released: { color: COLORS.primary, bg: COLORS.primaryLight },
};

export default function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] || { color: COLORS.textMedium, bg: COLORS.bgColor };

    return (
        <View style={[styles.badge, { backgroundColor: style.bg }]}>
            <Text style={[styles.text, { color: style.color }]}>{status}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.bold,
    },
});
