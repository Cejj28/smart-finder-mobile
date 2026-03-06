import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import StatusBadge from '../components/StatusBadge';

const FILTERS = ['All', 'Lost', 'Found'];

const myPosts = [
    {
        id: 1,
        type: 'Lost',
        item: 'Blue Backpack',
        location: 'Library 2nd Floor',
        date: '2026-03-05',
        status: 'Pending Review',
    },
    {
        id: 3,
        type: 'Lost',
        item: 'Scientific Calculator',
        location: 'Room 301',
        date: '2026-03-04',
        status: 'Approved',
    },
    {
        id: 6,
        type: 'Found',
        item: 'Wireless Earbuds',
        location: 'Computer Lab',
        date: '2026-03-03',
        status: 'Pending Review',
    },
];

export default function MyPostsScreen() {
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredPosts = activeFilter === 'All'
        ? myPosts
        : myPosts.filter((p) => p.type === activeFilter);

    const renderItem = ({ item }) => (
        <View style={styles.postCard}>
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
                <StatusBadge status={item.type} />
                <StatusBadge status={item.status} />
            </View>
        </View>
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
            <FlatList
                data={filteredPosts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="document-text-outline" size={48} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>No posts yet.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgColor,
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
