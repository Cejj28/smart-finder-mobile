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
    ScrollView,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import { registerStudent } from '../services/api';

export default function RegisterScreen({ onLogin, onBack }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!fullName.trim() || !email.trim() || !department.trim() || !password.trim() || !confirmPassword.trim()) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const data = await registerStudent({
                full_name: fullName,
                email,
                department,
                password,
                confirm_password: confirmPassword,
            });
            // Auto-login after successful registration
            onLogin({
                username: data.username,
                email: data.email,
                token: data.token,
                is_staff: data.is_staff,
            });
        } catch (err) {
            // Parse server validation errors
            let message = 'Registration failed. Please try again.';
            if (err && typeof err === 'object') {
                const msgs = Object.values(err).flat();
                if (msgs.length) message = msgs.join('\n');
            }
            Alert.alert('Registration Failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Logo Area */}
                    <View style={styles.logoArea}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.appName}>SmartFinder</Text>
                        <Text style={styles.tagline}>Create a Student Account</Text>
                    </View>

                    {/* Register Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Sign Up</Text>
                        <Text style={styles.cardSubtitle}>Fill in your details to get started</Text>

                        {/* Full Name */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="rgba(255,255,255,0.35)"
                                value={fullName}
                                onChangeText={setFullName}
                                autoCapitalize="words"
                                editable={!loading}
                            />
                        </View>

                        {/* Email */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor="rgba(255,255,255,0.35)"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                editable={!loading}
                            />
                        </View>

                        {/* Department / Course */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="school-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Department / Course"
                                placeholderTextColor="rgba(255,255,255,0.35)"
                                value={department}
                                onChangeText={setDepartment}
                                editable={!loading}
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password (min. 6 characters)"
                                placeholderTextColor="rgba(255,255,255,0.35)"
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

                        {/* Confirm Password */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor="rgba(255,255,255,0.35)"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={18}
                                    color={COLORS.textLight}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Register Button */}
                        <TouchableOpacity
                            style={[styles.registerBtn, loading && styles.btnDisabled]}
                            onPress={handleRegister}
                            activeOpacity={0.8}
                            disabled={loading}
                        >
                            <Text style={styles.registerBtnText}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Text>
                        </TouchableOpacity>

                        {/* Back to Login */}
                        <TouchableOpacity style={styles.backLink} onPress={onBack}>
                            <Ionicons name="arrow-back-outline" size={16} color="rgba(255,255,255,0.5)" />
                            <Text style={styles.backLinkText}>Back to Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
    scrollContent: {
        paddingHorizontal: SPACING.xxl,
        paddingVertical: SPACING.xxl,
    },
    logoArea: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    logoImage: {
        width: 80,
        height: 80,
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
    registerBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        marginTop: SPACING.sm,
        ...SHADOWS.md,
    },
    btnDisabled: {
        opacity: 0.7,
    },
    registerBtnText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
    },
    backLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        marginTop: SPACING.xl,
        paddingTop: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.08)',
    },
    backLinkText: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255, 255, 255, 0.5)',
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
        zIndex: -1,
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
        zIndex: -1,
    },
});
