import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    SafeAreaView,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import ItemCard from '../components/ItemCard';
import { recentItems } from '../data/mockData';

export default function HomeScreen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const filteredItems = recentItems.filter((item) => {
        const term = searchTerm.toLowerCase();
        return (
            item.item.toLowerCase().includes(term) ||
            item.location.toLowerCase().includes(term) ||
            item.submittedBy.toLowerCase().includes(term)
        );
    });

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const stats = {
        total: recentItems.length,
        lost: recentItems.filter((i) => i.type === 'Lost').length,
        found: recentItems.filter((i) => i.type === 'Found').length,
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Hello, User! 👋</Text>
                <Text style={styles.subtitle}>Browse lost & found items</Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={[styles.statCard, { borderLeftColor: COLORS.primary }]}>
                    <Text style={styles.statNumber}>{stats.total}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={[styles.statCard, { borderLeftColor: COLORS.error }]}>
                    <Text style={[styles.statNumber, { color: COLORS.error }]}>{stats.lost}</Text>
                    <Text style={styles.statLabel}>Lost</Text>
                </View>
                <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
                    <Text style={[styles.statNumber, { color: COLORS.success }]}>{stats.found}</Text>
                    <Text style={styles.statLabel}>Found</Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={18} color={COLORS.textLight} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search items, location..."
                    placeholderTextColor={COLORS.textLight}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
                {searchTerm.length > 0 && (
                    <Ionicons
                        name="close-circle"
                        size={18}
                        color={COLORS.textLight}
                        onPress={() => setSearchTerm('')}
                        style={styles.clearIcon}
                    />
                )}
            </View>

            {/* Items List */}
            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ItemCard item={item} />}
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
                        <Ionicons name="search" size={48} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>No items found.</Text>
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
    greeting: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.extrabold,
        color: COLORS.primary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textMedium,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.xl,
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        borderLeftWidth: 3,
        ...SHADOWS.sm,
    },
    statNumber: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.extrabold,
        color: COLORS.primary,
    },
    statLabel: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textMedium,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 2,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        marginHorizontal: SPACING.xl,
        marginBottom: SPACING.lg,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        paddingHorizontal: SPACING.md,
        ...SHADOWS.sm,
    },
    searchIcon: {
        marginRight: SPACING.sm,
    },
    searchInput: {
        flex: 1,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textDark,
    },
    clearIcon: {
        marginLeft: SPACING.sm,
    },
    listContent: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: SPACING.xxxl,
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
