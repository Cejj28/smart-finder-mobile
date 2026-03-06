import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';

const REPORT_TYPES = ['Lost', 'Found'];

export default function ReportScreen() {
    const [type, setType] = useState('Lost');
    const [itemName, setItemName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [contactInfo, setContactInfo] = useState('');

    const handleSubmit = () => {
        if (!itemName.trim() || !location.trim()) {
            Alert.alert('Missing Fields', 'Please fill in item name and location.');
            return;
        }
        Alert.alert(
            'Report Submitted!',
            `Your ${type.toLowerCase()} item report for "${itemName}" has been submitted for review.`,
            [{ text: 'OK', onPress: resetForm }]
        );
    };

    const resetForm = () => {
        setItemName('');
        setLocation('');
        setDescription('');
        setContactInfo('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Report an Item</Text>
                        <Text style={styles.subtitle}>Fill out the details below</Text>
                    </View>

                    {/* Card */}
                    <View style={styles.card}>
                        <View style={styles.cardAccent} />

                        {/* Type Selector */}
                        <Text style={styles.label}>Report Type</Text>
                        <View style={styles.typeSelector}>
                            {REPORT_TYPES.map((t) => (
                                <TouchableOpacity
                                    key={t}
                                    style={[styles.typeBtn, type === t && styles.typeBtnActive]}
                                    onPress={() => setType(t)}
                                >
                                    <Ionicons
                                        name={t === 'Lost' ? 'search-outline' : 'checkmark-circle-outline'}
                                        size={18}
                                        color={type === t ? COLORS.white : COLORS.textMedium}
                                    />
                                    <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>
                                        {t}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Item Name */}
                        <Text style={styles.label}>Item Name *</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="cube-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Blue Backpack"
                                placeholderTextColor={COLORS.textLight}
                                value={itemName}
                                onChangeText={setItemName}
                            />
                        </View>

                        {/* Location */}
                        <Text style={styles.label}>Location *</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="location-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Library 2nd Floor"
                                placeholderTextColor={COLORS.textLight}
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>

                        {/* Description */}
                        <Text style={styles.label}>Description</Text>
                        <View style={[styles.inputWrapper, { alignItems: 'flex-start' }]}>
                            <Ionicons name="document-text-outline" size={18} color={COLORS.textLight} style={[styles.inputIcon, { marginTop: 12 }]} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Describe the item in detail..."
                                placeholderTextColor={COLORS.textLight}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Contact */}
                        <Text style={styles.label}>Contact Info</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="call-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone or email"
                                placeholderTextColor={COLORS.textLight}
                                value={contactInfo}
                                onChangeText={setContactInfo}
                            />
                        </View>

                        {/* Submit */}
                        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
                            <Ionicons name="send" size={18} color={COLORS.white} />
                            <Text style={styles.submitText}>Submit Report</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        marginBottom: 4,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textMedium,
    },
    card: {
        backgroundColor: COLORS.cardBg,
        marginHorizontal: SPACING.xl,
        borderRadius: RADIUS.lg,
        padding: SPACING.xl,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: COLORS.primaryLight,
        overflow: 'hidden',
    },
    cardAccent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: COLORS.primary,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textMedium,
        marginBottom: SPACING.sm,
        marginTop: SPACING.lg,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    typeSelector: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    typeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        backgroundColor: COLORS.bgColor,
    },
    typeBtnActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    typeBtnText: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textMedium,
    },
    typeBtnTextActive: {
        color: COLORS.white,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.bgColor,
        paddingHorizontal: SPACING.md,
    },
    inputIcon: {
        marginRight: SPACING.sm,
    },
    input: {
        flex: 1,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textDark,
    },
    textArea: {
        minHeight: 100,
        paddingTop: SPACING.md,
    },
    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        borderRadius: RADIUS.md,
        marginTop: SPACING.xxl,
        ...SHADOWS.md,
    },
    submitText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
    },
});
