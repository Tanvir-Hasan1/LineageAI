import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    Modal,
    TextInput,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ms, vs } from 'react-native-size-matters';
import { FONTS } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

// ------------------- SYSTEM ROLE DATA -------------------
const ROLES = [
    { id: 'owner', label: 'Owner', desc: 'Full access & control', icon: 'crown-outline', type: 'material', color: '#92A38D', colorDark: '#516249' },
    { id: 'editor', label: 'Editor', desc: 'Can add & edit memories', icon: 'edit-2', type: 'feather', color: '#A2A1BA', colorDark: '#54526B' },
    { id: 'viewer', label: 'Viewer', desc: 'Read-only access', icon: 'eye-outline', type: 'ionicons', color: '#AAB7C0', colorDark: '#58656E' }
];

interface InviteModalProps {
    visible: boolean;
    onClose: () => void;
    isDarkMode: boolean;
}

export default function InviteModal({ visible, onClose, isDarkMode }: InviteModalProps) {

    const [selectedRoleId, setSelectedRoleId] = useState('viewer');
    const [showPicker, setShowPicker] = useState(false);

    const selectedRole = ROLES.find(r => r.id === selectedRoleId) || ROLES[2];

    const triggerTap = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Permission Rule Mapping
    const hasPerm = (perm: string) => {
        if (selectedRoleId === 'owner') return true;
        if (selectedRoleId === 'editor') {
            return ['view_mem', 'view_timeline', 'add_mem', 'edit_prof'].includes(perm);
        }
        return ['view_mem', 'view_timeline'].includes(perm);
    };

    const modalPal = {
        bg: isDarkMode ? '#1A1A1A' : '#F9F8F6',
        inputBg: isDarkMode ? '#2D2C35' : '#E5E3EA',
        inputText: isDarkMode ? '#FFFFFF' : '#2D2C39',
        label: isDarkMode ? '#C0C0C0' : '#5A5A5F',
        closeBg: isDarkMode ? '#333333' : '#EAEAEA',
        closeIcon: isDarkMode ? '#AFAFAF' : '#5F5F5F',

        // Dropdown
        selectBg: isDarkMode ? '#2D333A' : '#E4EAEF',
        selectText: isDarkMode ? '#B0B8C0' : '#5C6975',

        // Role Picker Specifics
        pickerBg: isDarkMode ? '#2D333A' : '#E4EAEF',
        pickerDivider: isDarkMode ? '#3B434A' : '#D5DDE4',
        pickerTextMain: isDarkMode ? '#FFFFFF' : '#3A3A45',
        pickerTextSub: isDarkMode ? '#9FA7AE' : '#888E95',

        // Permission Table
        tableBg: isDarkMode ? '#242B22' : '#E1E6DE',
        tableHeader: isDarkMode ? '#879F80' : '#8A9B89',
        checkOk: '#8E9F85',
        checkOff: isDarkMode ? '#4D554B' : '#C3CDC0',

        btnMain: '#92A38D'
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="formSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: modalPal.bg }} edges={['top']}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.modalScroll}>
                        
                        {/* Modal Header */}
                        <View style={styles.modalHeaderRow}>
                            <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#3A3A45' }]}>Invite Someone</Text>
                            <TouchableOpacity 
                                style={[styles.modalCloseBtn, { backgroundColor: modalPal.closeBg }]}
                                onPress={onClose}
                            >
                                <Feather name="x" size={ms(18)} color={modalPal.closeIcon} />
                            </TouchableOpacity>
                        </View>

                        {/* Inputs Matrix */}
                        <View style={styles.formGroup}>
                            <Text style={[styles.inputLabel, { color: modalPal.label }]}>Name</Text>
                            <TextInput 
                                style={[styles.textInput, { backgroundColor: modalPal.inputBg, color: modalPal.inputText }]}
                                placeholder="Their full name"
                                placeholderTextColor={isDarkMode ? '#666' : '#8E8E99'}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={[styles.inputLabel, { color: modalPal.label }]}>Email</Text>
                            <TextInput 
                                style={[styles.textInput, { backgroundColor: modalPal.inputBg, color: modalPal.inputText }]}
                                placeholder="their@email.com"
                                placeholderTextColor={isDarkMode ? '#666' : '#8E8E99'}
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={[styles.inputLabel, { color: modalPal.label }]}>Role</Text>
                            
                            <TouchableOpacity 
                                activeOpacity={0.8}
                                style={[styles.selectBox, { backgroundColor: modalPal.selectBg }]}
                                onPress={() => {
                                    triggerTap();
                                    setShowPicker(!showPicker);
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {selectedRole.type === 'material' ? (
                                        <MaterialCommunityIcons name={selectedRole.icon as any} size={ms(16)} color={modalPal.selectText} style={{ marginRight: ms(8) }} />
                                    ) : selectedRole.type === 'ionicons' ? (
                                        <Ionicons name={selectedRole.icon as any} size={ms(16)} color={modalPal.selectText} style={{ marginRight: ms(8) }} />
                                    ) : (
                                        <Feather name={selectedRole.icon as any} size={ms(16)} color={modalPal.selectText} style={{ marginRight: ms(8) }} />
                                    )}
                                    <Text style={[styles.selectText, { color: modalPal.selectText }]}>{selectedRole.label}</Text>
                                </View>
                                <Feather name={showPicker ? "chevron-up" : "chevron-down"} size={ms(16)} color={modalPal.selectText} />
                            </TouchableOpacity>

                            {/* FLOATING ROLE PICKER */}
                            {showPicker && (
                                <View style={[styles.pickerFloat, { backgroundColor: modalPal.pickerBg }]}>
                                    {ROLES.map((role, idx) => {
                                        const isSelected = role.id === selectedRoleId;
                                        return (
                                            <React.Fragment key={role.id}>
                                                {idx > 0 && <View style={[styles.pickerDivider, { backgroundColor: modalPal.pickerDivider }]} />}
                                                <TouchableOpacity 
                                                    style={styles.pickerItem}
                                                    activeOpacity={0.7}
                                                    onPress={() => {
                                                        triggerTap();
                                                        setSelectedRoleId(role.id);
                                                        setShowPicker(false);
                                                    }}
                                                >
                                                    <View style={[
                                                        styles.pickerIconBox, 
                                                        { backgroundColor: isDarkMode ? role.colorDark : role.color }
                                                    ]}>
                                                        {role.type === 'material' ? (
                                                            <MaterialCommunityIcons name={role.icon as any} size={ms(16)} color="#FFFFFF" />
                                                        ) : role.type === 'ionicons' ? (
                                                            <Ionicons name={role.icon as any} size={ms(14)} color="#FFFFFF" />
                                                        ) : (
                                                            <Feather name={role.icon as any} size={ms(14)} color="#FFFFFF" />
                                                        )}
                                                    </View>
                                                    <View style={styles.pickerText}>
                                                        <Text style={[styles.pickerTitle, { color: modalPal.pickerTextMain }]}>{role.label}</Text>
                                                        <Text style={[styles.pickerSub, { color: modalPal.pickerTextSub }]}>{role.desc}</Text>
                                                    </View>
                                                    {isSelected && (
                                                        <Ionicons name="checkmark" size={ms(18)} color="#92A38D" />
                                                    )}
                                                </TouchableOpacity>
                                            </React.Fragment>
                                        );
                                    })}
                                </View>
                            )}
                        </View>

                        {/* PERMISSIONS MATRIX */}
                        <View style={[styles.permTable, { backgroundColor: modalPal.tableBg }]}>
                            <Text style={[styles.permTitle, { color: modalPal.tableHeader }]}>PERMISSIONS FOR {selectedRole.label.toUpperCase()}</Text>
                            
                            <View style={styles.permItem}>
                                <Ionicons 
                                    name={hasPerm('view_mem') ? "checkmark-circle" : "close-circle"} 
                                    size={ms(18)} 
                                    color={hasPerm('view_mem') ? modalPal.checkOk : modalPal.checkOff} 
                                    style={{ marginRight: ms(10) }} 
                                />
                                <Text style={[
                                    styles.permLabel, 
                                    { color: hasPerm('view_mem') ? (isDarkMode ? '#FFF' : '#4A4A4A') : (isDarkMode ? '#666' : '#9FAFA0') }
                                ]}>View Memories</Text>
                            </View>

                            <View style={styles.permItem}>
                                <Ionicons 
                                    name={hasPerm('view_timeline') ? "checkmark-circle" : "close-circle"} 
                                    size={ms(18)} 
                                    color={hasPerm('view_timeline') ? modalPal.checkOk : modalPal.checkOff} 
                                    style={{ marginRight: ms(10) }} 
                                />
                                <Text style={[
                                    styles.permLabel, 
                                    { color: hasPerm('view_timeline') ? (isDarkMode ? '#FFF' : '#4A4A4A') : (isDarkMode ? '#666' : '#9FAFA0') }
                                ]}>View Timeline</Text>
                            </View>

                            <View style={styles.permItem}>
                                <Ionicons 
                                    name={hasPerm('add_mem') ? "checkmark-circle" : "close-circle"} 
                                    size={ms(18)} 
                                    color={hasPerm('add_mem') ? modalPal.checkOk : modalPal.checkOff} 
                                    style={{ marginRight: ms(10) }} 
                                />
                                <Text style={[
                                    styles.permLabel, 
                                    { color: hasPerm('add_mem') ? (isDarkMode ? '#FFF' : '#4A4A4A') : (isDarkMode ? '#666' : '#9FAFA0') }
                                ]}>Add Memories</Text>
                            </View>

                            <View style={styles.permItem}>
                                <Ionicons 
                                    name={hasPerm('edit_prof') ? "checkmark-circle" : "close-circle"} 
                                    size={ms(18)} 
                                    color={hasPerm('edit_prof') ? modalPal.checkOk : modalPal.checkOff} 
                                    style={{ marginRight: ms(10) }} 
                                />
                                <Text style={[
                                    styles.permLabel, 
                                    { color: hasPerm('edit_prof') ? (isDarkMode ? '#FFF' : '#4A4A4A') : (isDarkMode ? '#666' : '#9FAFA0') }
                                ]}>Edit Profiles</Text>
                            </View>

                            <View style={styles.permItem}>
                                <Ionicons 
                                    name={hasPerm('manage') ? "checkmark-circle" : "close-circle"} 
                                    size={ms(18)} 
                                    color={hasPerm('manage') ? modalPal.checkOk : modalPal.checkOff} 
                                    style={{ marginRight: ms(10) }} 
                                />
                                <Text style={[
                                    styles.permLabel, 
                                    { color: hasPerm('manage') ? (isDarkMode ? '#FFF' : '#4A4A4A') : (isDarkMode ? '#666' : '#9FAFA0') }
                                ]}>Manage Access</Text>
                            </View>
                        </View>

                    </ScrollView>

                    {/* Floating Footer */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={[styles.submitBtn, { backgroundColor: modalPal.btnMain }]}
                            onPress={onClose}
                        >
                            <Text style={styles.submitBtnText}>Send Invitation</Text>
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalScroll: {
        padding: ms(24),
        paddingBottom: vs(100),
    },
    modalHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(32),
        marginTop: vs(10),
    },
    modalTitle: {
        fontFamily: FONTS.serif,
        fontSize: ms(28),
        fontWeight: '500',
    },
    modalCloseBtn: {
        width: ms(38),
        height: ms(38),
        borderRadius: ms(19),
        justifyContent: 'center',
        alignItems: 'center',
    },
    formGroup: {
        marginBottom: vs(20),
    },
    inputLabel: {
        fontFamily: FONTS.serif,
        fontSize: ms(16),
        marginBottom: vs(8),
    },
    textInput: {
        width: '100%',
        height: vs(50),
        borderRadius: ms(16),
        paddingHorizontal: ms(16),
        fontFamily: FONTS.sans,
        fontSize: ms(15),
    },
    selectBox: {
        width: '100%',
        height: vs(50),
        borderRadius: ms(16),
        paddingHorizontal: ms(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectText: {
        fontFamily: FONTS.sans,
        fontSize: ms(15),
        fontWeight: '500',
    },
    pickerFloat: {
        width: '100%',
        borderRadius: ms(18),
        marginTop: vs(8),
        padding: ms(4),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        zIndex: 10,
    },
    pickerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: ms(12),
    },
    pickerIconBox: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(16),
    },
    pickerText: {
        flex: 1,
    },
    pickerTitle: {
        fontFamily: FONTS.serif,
        fontSize: ms(16),
        fontWeight: '500',
        marginBottom: vs(2),
    },
    pickerSub: {
        fontFamily: FONTS.sans,
        fontSize: ms(12),
    },
    pickerDivider: {
        height: 1,
        width: '100%',
    },
    permTable: {
        width: '100%',
        borderRadius: ms(20),
        padding: ms(20),
        marginTop: vs(10),
    },
    permTitle: {
        fontFamily: FONTS.serif,
        fontSize: ms(13),
        letterSpacing: 0.5,
        fontWeight: '500',
        marginBottom: vs(14),
    },
    permItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    permLabel: {
        fontFamily: FONTS.sans,
        fontSize: ms(14),
        fontWeight: '500',
    },
    modalFooter: {
        position: 'absolute',
        bottom: vs(30),
        left: ms(24),
        right: ms(24),
    },
    submitBtn: {
        width: '100%',
        height: vs(54),
        borderRadius: ms(16),
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtnText: {
        fontFamily: FONTS.serif,
        color: '#FFFFFF',
        fontSize: ms(17),
        fontWeight: '600',
    }
});
