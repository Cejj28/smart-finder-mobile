import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import StatusBadge from './StatusBadge';

export default function ItemCard({ item, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            {/* Top accent bar */}
            <View style={styles.accentBar} />

            <View style={styles.cardContent}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={item.type === 'Lost' ? 'search-outline' : 'checkmark-circle-outline'}
                            size={22}
                            color={COLORS.white}
                        />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.itemName} numberOfLines={1}>{item.item}</Text>
                        <Text style={styles.submittedBy}>{item.submittedBy}</Text>
                    </View>
                    <StatusBadge status={item.type} />
                </View>

                {/* Details */}
                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={14} color={COLORS.textLight} />
                        <Text style={styles.detailText}>{item.location}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={14} color={COLORS.textLight} />
                        <Text style={styles.detailText}>{item.date}</Text>
                    </View>
                </View>

                {/* Status Footer */}
                <View style={styles.footer}>
                    <StatusBadge status={item.status} />
                </View>
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
    accentBar: {
        height: 4,
        backgroundColor: COLORS.primary,
    },
    cardContent: {
        padding: SPACING.lg,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    headerText: {
        flex: 1,
        marginRight: SPACING.sm,
    },
    itemName: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textDark,
    },
    submittedBy: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMedium,
        marginTop: 2,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: SPACING.lg,
        marginBottom: SPACING.md,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textLight,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});
