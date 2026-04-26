import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import { loginApi } from '../services/api';
import RegisterScreen from './RegisterScreen';

export default function LoginScreen({ onLogin }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    if (showRegister) {
        return <RegisterScreen onLogin={onLogin} onBack={() => setShowRegister(false)} />;
    }

    const handleLogin = async () => {
        if (!identifier.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter both username/email and password.');
            return;
        }
        setLoading(true);
        try {
            const data = await loginApi(identifier, password);
            setLoading(false);
            onLogin({ 
                username: data.username, 
                email: data.email,
                token: data.token,
                is_staff: data.is_staff
            });
        } catch (err) {
            setLoading(false);
            Alert.alert('Login Failed', 'Invalid username/email or password.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    {/* Logo Area */}
                    <View style={styles.logoArea}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.appName}>SmartFinder</Text>
                        <Text style={styles.tagline}>Lost & Found System</Text>
                    </View>

                    {/* Login Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Welcome Back</Text>
                        <Text style={styles.cardSubtitle}>Sign in to continue</Text>

                        {/* Identifier */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Username or Email"
                                placeholderTextColor={COLORS.textLight}
                                value={identifier}
                                onChangeText={setIdentifier}
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={COLORS.textLight}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={18}
                                    color={COLORS.textLight}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                            disabled={loading}
                        >
                            <Text style={styles.loginBtnText}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Text>
                        </TouchableOpacity>

                        {/* Create Account Link */}
                        <TouchableOpacity style={styles.registerLink} onPress={() => setShowRegister(true)}>
                            <Text style={styles.registerLinkText}>
                                Don't have an account?{' '}
                                <Text style={styles.registerLinkBold}>Create one</Text>
                            </Text>
                        </TouchableOpacity>

                        {/* Footer */}
                        <Text style={styles.footer}>SmartFinder © 2026</Text>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* Background shapes */}
            <View style={styles.shape1} />
            <View style={styles.shape2} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.sidebarBg,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: SPACING.xxl,
    },
    logoArea: {
        alignItems: 'center',
        marginBottom: SPACING.xxxl,
    },
    logoImage: {
        width: 100,
        height: 100,
        marginBottom: SPACING.md,
    },
    appName: {
        fontSize: FONT_SIZES.title,
        fontWeight: FONT_WEIGHTS.extrabold,
        color: COLORS.white,
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 4,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: RADIUS.xl,
        padding: SPACING.xxl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    cardTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: SPACING.xxl,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    inputIcon: {
        marginRight: SPACING.sm,
    },
    input: {
        flex: 1,
        paddingVertical: SPACING.lg,
        fontSize: FONT_SIZES.md,
        color: COLORS.white,
    },
    loginBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        marginTop: SPACING.sm,
        ...SHADOWS.md,
    },
    loginBtnDisabled: {
        opacity: 0.8,
    },
    loginBtnText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
    },
    footer: {
        textAlign: 'center',
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255, 255, 255, 0.3)',
        marginTop: SPACING.lg,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.08)',
    },
    registerLink: {
        alignItems: 'center',
        paddingVertical: SPACING.lg,
    },
    registerLinkText: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255, 255, 255, 0.45)',
    },
    registerLinkBold: {
        color: COLORS.primary,
        fontWeight: FONT_WEIGHTS.bold,
    },
    shape1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: COLORS.primary,
        opacity: 0.06,
        top: -80,
        right: -80,
    },
    shape2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#38BDF8',
        opacity: 0.06,
        bottom: -60,
        left: -60,
    },
});
