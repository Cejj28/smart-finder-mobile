import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import { submitClaim } from '../services/api';

export default function ClaimModal({ visible, item, onClose }) {
    const [proof, setProof] = useState('');
    const [contact, setContact] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!proof.trim() || !contact.trim()) {
            Alert.alert('Missing Fields', 'Please provide proof of ownership and contact info.');
            return;
        }

        setIsSubmitting(true);
        try {
            await submitClaim({
                item: item.id,
                proof: proof.trim(),
                contact_info: contact.trim(),
            });
            Alert.alert(
                'Success', 
                'Your claim has been submitted! Please go to the admin office to validate your claim in person.'
            );
            setProof('');
            setContact('');
            onClose();
        } catch (error) {
            console.error('Submit claim error:', error);
            Alert.alert('Error', 'Failed to submit claim. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!item) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
                            <Text style={styles.modalTitle}>Claim Item</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton} disabled={isSubmitting}>
                            <Ionicons name="close-circle" size={28} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemInfoText}>
                                You are claiming: <Text style={styles.itemBold}>{item.item}</Text>
                            </Text>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Proof of Ownership <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Describe details only the owner would know (e.g. specific scratches, contents, password)..."
                                placeholderTextColor={COLORS.textLight}
                                value={proof}
                                onChangeText={setProof}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                editable={!isSubmitting}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Contact Information <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Phone number or email"
                                placeholderTextColor={COLORS.textLight}
                                value={contact}
                                onChangeText={setContact}
                                editable={!isSubmitting}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                            onPress={handleSubmit}
                            activeOpacity={0.8}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <ActivityIndicator size="small" color={COLORS.white} />
                                    <Text style={styles.submitText}>Submitting...</Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="send" size={18} color={COLORS.white} />
                                    <Text style={styles.submitText}>Submit Claim</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
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
        height: '75%',
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
    scrollContent: {
        padding: SPACING.lg,
    },
    itemInfo: {
        backgroundColor: COLORS.primaryLight,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.2)',
    },
    itemInfoText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.primary,
    },
    itemBold: {
        fontWeight: FONT_WEIGHTS.bold,
    },
    formGroup: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textDark,
        marginBottom: SPACING.sm,
    },
    required: {
        color: COLORS.error,
    },
    input: {
        backgroundColor: COLORS.cardBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textDark,
    },
    textArea: {
        minHeight: 100,
    },
    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        borderRadius: RADIUS.md,
        marginTop: SPACING.md,
        ...SHADOWS.md,
    },
    submitBtnDisabled: {
        opacity: 0.7,
    },
    submitText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
    },
});
