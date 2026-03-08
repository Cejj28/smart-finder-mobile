import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';

const MENU_ITEMS = [
    { icon: 'person-outline', label: 'Edit Profile', color: COLORS.primary },
    { icon: 'lock-closed-outline', label: 'Change Password', color: COLORS.primary },
];

export default function ProfileScreen({ onLogout }) {
    const handleLogout = () => {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out', style: 'destructive', onPress: () => onLogout && onLogout() },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.profileAccent} />
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={40} color={COLORS.white} />
                        </View>
                    </View>
                    <Text style={styles.userName}>Juan Dela Cruz</Text>
                    <Text style={styles.userEmail}>juan.delacruz@email.com</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.profileStat}>
                            <Text style={styles.profileStatNumber}>3</Text>
                            <Text style={styles.profileStatLabel}>Reports</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.profileStat}>
                            <Text style={styles.profileStatNumber}>1</Text>
                            <Text style={styles.profileStatLabel}>Claimed</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.profileStat}>
                            <Text style={styles.profileStatNumber}>2</Text>
                            <Text style={styles.profileStatLabel}>Found</Text>
                        </View>
                    </View>
                </View>

                {/* Menu */}
                <View style={styles.menuCard}>
                    {MENU_ITEMS.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} activeOpacity={0.6}>
                            <View style={[styles.menuIconWrap, { backgroundColor: item.color + '15' }]}>
                                <Ionicons name={item.icon} size={20} color={item.color} />
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
                    <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                {/* Version */}
                <Text style={styles.version}>SmartFinder Mobile v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgColor,
    },
    scrollContent: {
        paddingBottom: SPACING.xxxl,
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
    },
    profileCard: {
        backgroundColor: COLORS.cardBg,
        marginHorizontal: SPACING.xl,
        borderRadius: RADIUS.lg,
        padding: SPACING.xxl,
        alignItems: 'center',
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: COLORS.primaryLight,
        overflow: 'hidden',
        marginBottom: SPACING.lg,
    },
    profileAccent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: COLORS.primary,
    },
    avatarContainer: {
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.md,
    },
    userName: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textDark,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMedium,
        marginBottom: SPACING.xl,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    profileStat: {
        flex: 1,
        alignItems: 'center',
    },
    profileStatNumber: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.extrabold,
        color: COLORS.primary,
    },
    profileStatLabel: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textMedium,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: COLORS.border,
    },
    menuCard: {
        backgroundColor: COLORS.cardBg,
        marginHorizontal: SPACING.xl,
        borderRadius: RADIUS.lg,
        ...SHADOWS.sm,
        overflow: 'hidden',
        marginBottom: SPACING.lg,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.bgColor,
    },
    menuIconWrap: {
        width: 36,
        height: 36,
        borderRadius: RADIUS.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    menuLabel: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.medium,
        color: COLORS.textDark,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        marginHorizontal: SPACING.xl,
        paddingVertical: SPACING.lg,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.error,
        backgroundColor: COLORS.errorBg,
        marginBottom: SPACING.lg,
    },
    logoutText: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.error,
    },
    version: {
        textAlign: 'center',
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
    },
});
