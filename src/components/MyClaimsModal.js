import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import { fetchMyClaims } from '../services/api';
import StatusBadge from './StatusBadge';

export default function MyClaimsModal({ visible, onClose }) {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            loadClaims();
        }
    }, [visible]);

    const loadClaims = async () => {
        setLoading(true);
        try {
            const data = await fetchMyClaims();
            setClaims(data);
        } catch (error) {
            console.error('Failed to load claims', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.claimCard}>
            <View style={styles.claimHeader}>
                <Text style={styles.itemName} numberOfLines={1}>{item.item_name}</Text>
                <StatusBadge status={item.status} />
            </View>
            <Text style={styles.claimDate}>Submitted: {new Date(item.created_at).toLocaleDateString()}</Text>
            {item.release_date && (
                <Text style={styles.releaseDate}>Released: {new Date(item.release_date).toLocaleDateString()}</Text>
            )}
        </View>
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Ionicons name="document-text" size={24} color={COLORS.primary} />
                            <Text style={styles.modalTitle}>My Claims</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close-circle" size={28} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={claims}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.centerContainer}>
                                    <Ionicons name="document-text-outline" size={48} color={COLORS.textLight} />
                                    <Text style={styles.emptyText}>You haven't claimed any items yet.</Text>
                                </View>
                            }
                        />
                    )}
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
        height: '85%',
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
        gap: SPACING.sm,
    },
    modalTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textDark,
    },
    closeButton: {
        padding: SPACING.xs,
    },
    listContent: {
        padding: SPACING.lg,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    emptyText: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    claimCard: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    claimHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    itemName: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textDark,
        marginRight: SPACING.sm,
    },
    claimDate: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMedium,
        marginTop: SPACING.xs,
    },
    releaseDate: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.success,
        fontWeight: FONT_WEIGHTS.semibold,
        marginTop: 4,
    },
});
