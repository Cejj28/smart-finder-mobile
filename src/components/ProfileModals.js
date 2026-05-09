import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';
import { updateProfile, changePassword } from '../services/api';

export const EditProfileModal = ({ visible, onClose, profile, onUpdate }) => {
    const [form, setForm] = useState({
        full_name: profile?.full_name || '',
        email: profile?.email || '',
        department: profile?.department || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!form.full_name || !form.email) {
            Alert.alert('Error', 'Full Name and Email are required.');
            return;
        }
        setLoading(true);
        try {
            const updated = await updateProfile(form);
            onUpdate(updated);
            Alert.alert('Success', 'Profile updated successfully.');
            onClose();
        } catch (err) {
            Alert.alert('Error', 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={COLORS.textDark} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.form}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput 
                            style={styles.input} 
                            value={form.full_name} 
                            onChangeText={(t) => setForm({...form, full_name: t})} 
                        />
                        
                        <Text style={styles.label}>Email</Text>
                        <TextInput 
                            style={styles.input} 
                            value={form.email} 
                            onChangeText={(t) => setForm({...form, email: t})} 
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        
                        <Text style={styles.label}>Department</Text>
                        <TextInput 
                            style={styles.input} 
                            value={form.department} 
                            onChangeText={(t) => setForm({...form, department: t})} 
                        />
                        
                        <TouchableOpacity 
                            style={[styles.saveBtn, loading && styles.disabledBtn]} 
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export const ChangePasswordModal = ({ visible, onClose }) => {
    const [form, setForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!form.current_password || !form.new_password || !form.confirm_password) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }
        if (form.new_password !== form.confirm_password) {
            Alert.alert('Error', 'New passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            await changePassword(form);
            Alert.alert('Success', 'Password updated successfully.');
            setForm({ current_password: '', new_password: '', confirm_password: '' });
            onClose();
        } catch (err) {
            let msg = 'Failed to update password.';
            try {
                const errObj = JSON.parse(err.message);
                if (errObj.current_password) msg = 'Current password is incorrect.';
                else if (errObj.new_password) msg = errObj.new_password[0];
            } catch(e) {}
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Change Password</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={COLORS.textDark} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.form}>
                        <Text style={styles.label}>Current Password</Text>
                        <TextInput 
                            style={styles.input} 
                            value={form.current_password} 
                            onChangeText={(t) => setForm({...form, current_password: t})} 
                            secureTextEntry
                        />
                        
                        <Text style={styles.label}>New Password</Text>
                        <TextInput 
                            style={styles.input} 
                            value={form.new_password} 
                            onChangeText={(t) => setForm({...form, new_password: t})} 
                            secureTextEntry
                        />
                        
                        <Text style={styles.label}>Retype New Password</Text>
                        <TextInput 
                            style={styles.input} 
                            value={form.confirm_password} 
                            onChangeText={(t) => setForm({...form, confirm_password: t})} 
                            secureTextEntry
                        />
                        
                        <TouchableOpacity 
                            style={[styles.saveBtn, loading && styles.disabledBtn]} 
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.saveBtnText}>Update Password</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.cardBg,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        padding: SPACING.xl,
        paddingBottom: SPACING.xxxl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    modalTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textDark,
    },
    form: {
        gap: SPACING.md,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textMedium,
        marginBottom: -SPACING.xs,
    },
    input: {
        backgroundColor: COLORS.bgColor,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: FONT_SIZES.md,
        color: COLORS.textDark,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        alignItems: 'center',
        marginTop: SPACING.md,
        ...SHADOWS.sm,
    },
    disabledBtn: {
        opacity: 0.7,
    },
    saveBtnText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.bold,
    },
});
