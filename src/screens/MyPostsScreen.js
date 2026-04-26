import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import StatusBadge from '../components/StatusBadge';
import ReportDetailsModal from '../components/ReportDetailsModal';
import EditReportModal from '../components/EditReportModal';
import { fetchMyItems, deleteItem } from '../services/api';

const FILTERS = ['All', 'Lost', 'Found'];

export default function MyPostsScreen() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedItem, setSelectedItem] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadPosts = async () => {
        try {
            const data = await fetchMyItems();
            setPosts(data);
        } catch (error) {
            console.error('Failed to load posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadPosts();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadPosts();
        setRefreshing(false);
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteItem(id);
                            loadPosts(); // Refresh list after deletion
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete the post.');
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    const filteredPosts = activeFilter === 'All'
        ? posts
        : posts.filter((p) => p.type === activeFilter);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.postCard} onPress={() => setSelectedItem(item)} activeOpacity={0.7}>
            <View style={styles.postHeader}>
                <View style={styles.postIconWrap}>
                    <Ionicons
                        name={item.type === 'Lost' ? 'search-outline' : 'checkmark-circle-outline'}
                        size={20}
                        color={COLORS.white}
                    />
                </View>
                <View style={styles.postInfo}>
                    <Text style={styles.postName}>{item.item}</Text>
                    <Text style={styles.postMeta}>{item.location} • {item.date}</Text>
                </View>
            </View>
            <View style={styles.postFooter}>
                <View style={styles.badgesRow}>
                    <StatusBadge status={item.type} />
                    <StatusBadge status={item.status} />
                </View>
                <View style={styles.actionsRow}>
                    <TouchableOpacity 
                        style={styles.actionBtn} 
                        onPress={() => setEditingItem(item)}
                    >
                        <Ionicons name="pencil" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.actionBtn} 
                        onPress={() => handleDelete(item.id)}
                    >
                        <Ionicons name="trash" size={20} color={COLORS.error} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>My Posts</Text>
                <Text style={styles.subtitle}>Track your submissions</Text>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterRow}>
                {FILTERS.map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
                        onPress={() => setActiveFilter(f)}
                    >
                        <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                            {f}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Posts List */}
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredPosts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={COLORS.primary}
                            colors={[COLORS.primary]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="document-text-outline" size={48} color={COLORS.textLight} />
                            <Text style={styles.emptyText}>No posts yet.</Text>
                        </View>
                    }
                />
            )}

            <ReportDetailsModal 
                visible={!!selectedItem} 
                item={selectedItem} 
                onClose={() => setSelectedItem(null)}
                showStatus={true}
            />

            <EditReportModal
                visible={!!editingItem}
                item={editingItem}
                onClose={() => setEditingItem(null)}
                onSaveSuccess={() => {
                    setEditingItem(null);
                    loadPosts();
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgColor,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.md,
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
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.xl,
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    filterBtn: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.cardBg,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
    },
    filterBtnActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textMedium,
    },
    filterTextActive: {
        color: COLORS.white,
    },
    listContent: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: SPACING.xxxl,
    },
    postCard: {
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: COLORS.primaryLight,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    postIconWrap: {
        width: 36,
        height: 36,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    postInfo: {
        flex: 1,
    },
    postName: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textDark,
    },
    postMeta: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textLight,
        marginTop: 2,
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.inputBorder,
        marginTop: SPACING.sm,
    },
    badgesRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    actionBtn: {
        padding: SPACING.sm,
        marginLeft: SPACING.xs,
        backgroundColor: COLORS.bgColor,
        borderRadius: RADIUS.full,
        ...SHADOWS.sm,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textMedium,
        marginTop: SPACING.md,
    },
});
