import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import StatusBadge from './StatusBadge';

// showStatus=false hides the Approval status row (used in public feed)
// showStatus=true shows it (used in My Posts where status matters)
export default function ReportDetailsModal({ visible, item, onClose, showStatus = false }) {
    if (!item) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Ionicons
                                name={item.type === 'Lost' ? 'search-outline' : 'checkmark-circle-outline'}
                                size={24}
                                color={item.type === 'Lost' ? COLORS.error : COLORS.success}
                            />
                            <Text style={styles.modalTitle} numberOfLines={1}>{item.item}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close-circle" size={28} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {/* Image — prominently displayed */}
                        {item.image_url ? (
                            <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />
                        ) : (
                            <View style={styles.noImageContainer}>
                                <Ionicons name="image-outline" size={56} color={COLORS.textLight} />
                                <Text style={styles.noImageText}>No image provided</Text>
                            </View>
                        )}

                        {/* Details */}
                        <View style={styles.detailsContainer}>
                            {/* Type badge */}
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Type</Text>
                                <StatusBadge status={item.type} />
                            </View>

                            {/* Status badge — only shown in My Posts */}
                            {showStatus && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.label}>Status</Text>
                                    <StatusBadge status={item.status} />
                                </View>
                            )}

                            <View style={styles.divider} />

                            <View style={styles.infoGroup}>
                                <Ionicons name="location-outline" size={18} color={COLORS.primary} />
                                <Text style={styles.infoText}>{item.location}</Text>
                            </View>

                            <View style={styles.infoGroup}>
                                <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
                                <Text style={styles.infoText}>{item.date}</Text>
                            </View>

                            <View style={styles.infoGroup}>
                                <Ionicons name="person-outline" size={18} color={COLORS.primary} />
                                <Text style={styles.infoText}>Reported by {item.submittedBy}</Text>
                            </View>

                            {item.contact_info ? (
                                <View style={styles.infoGroup}>
                                    <Ionicons name="call-outline" size={18} color={COLORS.primary} />
                                    <Text style={styles.infoText}>{item.contact_info}</Text>
                                </View>
                            ) : null}

                            <View style={styles.divider} />

                            <Text style={styles.label}>Description</Text>
                            <Text style={styles.descriptionText}>
                                {item.description || 'No description provided.'}
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        height: '88%',
        ...SHADOWS.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: SPACING.sm,
    },
    modalTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textDark,
        flex: 1,
    },
    closeButton: {
        padding: SPACING.xs,
    },
    scrollContent: {
        paddingBottom: SPACING.xxxl,
    },
    image: {
        width: '100%',
        height: 280,
        backgroundColor: COLORS.cardBg,
    },
    noImageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: COLORS.bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
    },
    noImageText: {
        color: COLORS.textLight,
        fontSize: FONT_SIZES.md,
    },
    detailsContainer: {
        padding: SPACING.lg,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textDark,
        marginBottom: SPACING.xs,
    },
    infoGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        gap: SPACING.md,
    },
    infoText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textMedium,
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.md,
    },
    descriptionText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textMedium,
        lineHeight: 24,
        marginTop: SPACING.xs,
    },
});
