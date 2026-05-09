import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import { View as SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';

export default function NotificationsScreen({ navigation }) {
    const [notifs, setNotifs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadNotifications = useCallback(async (isRefreshing = false) => {
        if (isRefreshing) setRefreshing(true);
        try {
            const data = await fetchNotifications();
            setNotifs(data);
        } catch (err) {
            console.error('Failed to load notifications:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadNotifications();
        });
        return unsubscribe;
    }, [navigation, loadNotifications]);

    const handleNotifClick = async (notif) => {
        try {
            if (!notif.is_read) {
                await markNotificationRead(notif.id);
                setNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
            }
            
            // Navigate based on target_page if applicable
            if (notif.target_page === '/profile') {
                navigation.navigate('Profile');
            } else if (notif.target_page === '/items' || notif.target_page === '/claims') {
                // For student mobile, they usually go to Profile/MyPosts for updates
                navigation.navigate('My Posts');
            }
        } catch (err) {
            console.error('Failed to mark read:', err);
        }
    };

    const handleMarkAllRead = () => {
        Alert.alert(
            "Mark all as read",
            "Are you sure you want to mark all notifications as read?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Mark all", 
                    onPress: async () => {
                        try {
                            await markAllNotificationsRead();
                            setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.notifCard, !item.is_read && styles.unreadCard]} 
            onPress={() => handleNotifClick(item)}
        >
            <View style={[styles.notifIcon, !item.is_read && styles.unreadIcon]}>
                <Ionicons 
                    name={item.is_read ? "notifications-outline" : "notifications"} 
                    size={20} 
                    color={!item.is_read ? COLORS.primary : COLORS.textMedium} 
                />
            </View>
            <View style={styles.notifContent}>
                <Text style={[styles.notifTitle, !item.is_read && styles.unreadTitle]}>{item.title}</Text>
                <Text style={styles.notifMessage}>{item.message}</Text>
                <Text style={styles.notifTime}>{new Date(item.created_at).toLocaleString()}</Text>
            </View>
            {!item.is_read && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    const unreadCount = notifs.filter(n => !n.is_read).length;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.title}>Notifications</Text>
                        <Text style={styles.subtitle}>Stay updated on your reports</Text>
                    </View>
                    {unreadCount > 0 && (
                        <TouchableOpacity onPress={handleMarkAllRead} style={styles.markReadBtn}>
                            <Text style={styles.markReadText}>Mark all read</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <FlatList
                data={notifs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => loadNotifications(true)} tintColor={COLORS.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="notifications-off-outline" size={48} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>No notifications yet.</Text>
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
    listContent: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: SPACING.xxxl,
    },
    notifCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    unreadCard: {
        borderColor: COLORS.primaryLight,
        backgroundColor: '#F0FDFA',
    },
    notifIcon: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    unreadIcon: {
        backgroundColor: COLORS.primaryLight,
    },
    notifContent: {
        flex: 1,
    },
    notifTitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textMedium,
        marginBottom: 2,
    },
    unreadTitle: {
        color: COLORS.primary,
    },
    notifMessage: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.medium,
        color: COLORS.textDark,
        lineHeight: 20,
    },
    notifTime: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
        marginTop: 4,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginLeft: 8,
        marginTop: 8,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    markReadBtn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: COLORS.primaryLight,
        borderRadius: RADIUS.sm,
    },
    markReadText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
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
