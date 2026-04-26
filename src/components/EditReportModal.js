import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import { updateItem } from '../services/api';

export default function EditReportModal({ visible, item, onClose, onSaveSuccess }) {
    const [itemName, setItemName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (item) {
            setItemName(item.item || '');
            setLocation(item.location || '');
            setDescription(item.description || '');
            setContactInfo(item.contact_info || '');
        }
    }, [item]);

    if (!item) return null;

    const handleSave = async () => {
        if (!itemName.trim() || !location.trim()) {
            Alert.alert('Missing Fields', 'Please fill in item name and location.');
            return;
        }

        setIsSaving(true);
        try {
            await updateItem(item.id, {
                item_name: itemName,
                location: location,
                description: description,
                contact_info: contactInfo
            });
            Alert.alert('Success', 'Report updated successfully.');
            onSaveSuccess();
        } catch (error) {
            Alert.alert('Update Failed', 'Could not update report.');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

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
                        <Text style={styles.modalTitle}>Edit Report</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close-circle" size={28} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <View style={styles.formContainer}>
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
                                    editable={!isSaving}
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
                                    editable={!isSaving}
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
                                    editable={!isSaving}
                                />
                            </View>

                            {/* Contact Info */}
                            <Text style={styles.label}>Contact Info</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="call-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone or email"
                                    placeholderTextColor={COLORS.textLight}
                                    value={contactInfo}
                                    onChangeText={setContactInfo}
                                    editable={!isSaving}
                                />
                            </View>

                            {/* Save Button */}
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8} disabled={isSaving}>
                                <Ionicons name="save" size={18} color={COLORS.white} />
                                <Text style={styles.saveBtnText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.bgColor,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        height: '80%',
        ...SHADOWS.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
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
        paddingBottom: SPACING.xxxl,
    },
    formContainer: {
        padding: SPACING.xl,
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
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.white,
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
    saveBtn: {
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
    saveBtnText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
    },
});
