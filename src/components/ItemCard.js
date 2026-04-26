import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import StatusBadge from './StatusBadge';

export default function ItemCard({ item, onPress }) {
    const isLost = item.type === 'Lost';
    const typeColor = isLost ? COLORS.error : COLORS.success;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.92}>
            {/* ── Post Header (like FB) ── */}
            <View style={styles.postHeader}>
                <View style={[styles.avatarCircle, { backgroundColor: typeColor }]}>
                    <Ionicons
                        name={isLost ? 'search-outline' : 'checkmark-circle-outline'}
                        size={20}
                        color={COLORS.white}
                    />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.item}</Text>
                    <Text style={styles.submittedBy}>
                        {item.submittedBy} · {item.date}
                    </Text>
                </View>
                <StatusBadge status={item.type} />
            </View>

            {/* ── Description preview ── */}
            {item.description ? (
                <Text style={styles.descriptionPreview} numberOfLines={2}>
                    {item.description}
                </Text>
            ) : null}

            {/* ── Full-width photo ── */}
            {item.image_url ? (
                <Image
                    source={{ uri: item.image_url }}
                    style={styles.postImage}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.noImagePlaceholder}>
                    <Ionicons name="image-outline" size={36} color={COLORS.textLight} />
                    <Text style={styles.noImageText}>No photo</Text>
                </View>
            )}

            {/* ── Footer info ── */}
            <View style={styles.footer}>
                <View style={styles.footerItem}>
                    <Ionicons name="location-outline" size={14} color={COLORS.textLight} />
                    <Text style={styles.footerText} numberOfLines={1}>{item.location}</Text>
                </View>
                <Text style={styles.tapHint}>Tap for details</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.lg,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: COLORS.primaryLight,
        overflow: 'hidden',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        paddingBottom: SPACING.sm,
        gap: SPACING.md,
    },
    avatarCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        flex: 1,
    },
    itemName: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textDark,
    },
    submittedBy: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
        marginTop: 2,
    },
    descriptionPreview: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMedium,
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.sm,
        lineHeight: 20,
    },
    postImage: {
        width: '100%',
        height: 220,
        backgroundColor: COLORS.bgColor,
    },
    noImagePlaceholder: {
        width: '100%',
        height: 120,
        backgroundColor: COLORS.bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
    },
    noImageText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textLight,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    footerText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textLight,
        flex: 1,
    },
    tapHint: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.primary,
        fontWeight: FONT_WEIGHTS.semibold,
    },
});
