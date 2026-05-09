import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMatches } from '../services/api';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import StatusBadge from './StatusBadge';
import ClaimModal from './ClaimModal';

// showStatus=false hides the Approval status row (used in public feed)
// showStatus=true shows it (used in My Posts where status matters)
export default function ReportDetailsModal({ visible, item, onClose, showStatus = false, onMatchPress }) {
    const [matches, setMatches] = useState([]);
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [claimModalVisible, setClaimModalVisible] = useState(false);

    useEffect(() => {
        if (visible && item?.id && item?.category) {
            (async () => {
                setLoadingMatches(true);
                try {
                    const data = await getMatches(item.id);
                    setMatches(data);
                } catch (e) {
                    console.warn('Matches fetch failed:', e);
                } finally {
                    setLoadingMatches(false);
                }
            })();
        } else {
            setMatches([]);
        }
    }, [visible, item]);

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

                            {/* Category badge */}
                            {item.category ? (
                                <View style={styles.detailRow}>
                                    <Text style={styles.label}>Category</Text>
                                    <View style={styles.categoryChip}>
                                        <Ionicons name="sparkles" size={12} color={COLORS.primary} />
                                        <Text style={styles.categoryText}>{item.category}</Text>
                                    </View>
                                </View>
                            ) : null}

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

                            {/* Smart Matches Section */}
                            {(loadingMatches || matches.length > 0) && (
                                <>
                                    <View style={styles.divider} />
                                    <View style={styles.matchHeader}>
                                        <Text style={styles.matchTitle}>🤖 AI Smart Matches</Text>
                                        {loadingMatches && <ActivityIndicator size="small" color={COLORS.primary} />}
                                    </View>
                                    <Text style={styles.matchSubtitle}>Items that might be related based on AI category analysis:</Text>
                                    
                                    <View style={styles.matchList}>
                                        {matches.map((match) => (
                                            <TouchableOpacity
                                                key={match.id}
                                                style={styles.matchCard}
                                                activeOpacity={0.7}
                                                onPress={() => {
                                                    onClose();
                                                    setTimeout(() => {
                                                        if (onMatchPress) onMatchPress(match);
                                                    }, 350); // wait for modal close animation
                                                }}
                                            >
                                                <View style={styles.matchIconWrap}>
                                                    <Ionicons 
                                                        name={match.type === 'Lost' ? 'search' : 'checkmark-circle'} 
                                                        size={16} 
                                                        color={match.type === 'Lost' ? COLORS.error : COLORS.success} 
                                                    />
                                                </View>
                                                <View style={styles.matchInfo}>
                                                    <Text style={styles.matchItemName} numberOfLines={1}>{match.item}</Text>
                                                    <Text style={styles.matchLocation} numberOfLines={1}>{match.location}</Text>
                                                </View>
                                                <View style={styles.viewBtn}>
                                                    <Text style={styles.viewBtnText}>View</Text>
                                                    <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </>
                            )}
                        </View>
                    </ScrollView>

                    {/* Sticky Claim Button Footer for Found items */}
                    {item.type === 'Found' && item.status === 'Approved' && (
                        <View style={styles.footer}>
                            <TouchableOpacity 
                                style={styles.claimButton}
                                onPress={() => setClaimModalVisible(true)}
                            >
                                <Ionicons name="hand-right" size={20} color={COLORS.white} />
                                <Text style={styles.claimButtonText}>Claim This Item</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            <ClaimModal 
                visible={claimModalVisible} 
                item={item} 
                onClose={() => setClaimModalVisible(false)} 
            />
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
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
    },
    categoryText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
        textTransform: 'uppercase',
    },
    matchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.xs,
    },
    matchTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
    },
    matchSubtitle: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
        marginBottom: SPACING.md,
    },
    matchList: {
        gap: SPACING.sm,
    },
    matchCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.sm,
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    viewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
    },
    viewBtnText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
    },
    matchIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.sm,
    },
    matchInfo: {
        flex: 1,
    },
    matchItemName: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textDark,
    },
    matchLocation: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
    },
    footer: {
        padding: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        backgroundColor: COLORS.white,
    },
    claimButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        gap: SPACING.sm,
        ...SHADOWS.md,
    },
    claimButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.bold,
    },
});
