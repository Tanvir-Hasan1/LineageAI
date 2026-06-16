import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    useColorScheme,
    ActivityIndicator,
    Alert,
    RefreshControl
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ms, vs } from 'react-native-size-matters';
import { FONTS } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { api } from '@/services/api';
import { PasswordModal } from '@/components/PasswordModal';

interface TrustedContact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status: 'pending' | 'accepted' | 'declined' | 'removed';
    inactivityDays: number;
    accessScope: {
        profile: boolean;
        documents: boolean;
        notes: boolean;
        messages: boolean;
        paymentInfo: boolean;
        accountTransfer: boolean;
    };
    createdAt: string;
}

export default function TrustedContactsListScreen() {
    const router = useRouter();
    const isDarkMode = useColorScheme() === 'dark';

    const [contacts, setContacts] = useState<TrustedContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Delete contact states
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [contactToDelete, setContactToDelete] = useState<TrustedContact | null>(null);

    const fetchContacts = useCallback(async (showIndicator = true) => {
        if (showIndicator) setLoading(true);
        setError(null);
        try {
            console.log('[TrustedContacts] Fetching list...');
            const response = await api.get('/trusted-contacts');
            console.log('[TrustedContacts] List Response:', JSON.stringify(response));
            
            if (response.success && response.data) {
                // Handle different API response structures safely
                const list = response.data?.data || response.data || [];
                setContacts(Array.isArray(list) ? list : []);
            } else {
                setError(response.message || 'Failed to retrieve trusted contacts.');
            }
        } catch (err: any) {
            console.error('[TrustedContacts] Fetch error:', err);
            setError(err?.message || 'A network error occurred.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Refresh list on screen focus (e.g. returning from success screen)
    useFocusEffect(
        useCallback(() => {
            fetchContacts(true);
        }, [fetchContacts])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchContacts(false);
    }, [fetchContacts]);

    const triggerHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const handleDeletePress = (contact: TrustedContact) => {
        triggerHaptic();
        setContactToDelete(contact);
        setDeleteModalVisible(true);
    };

    const handleDeleteConfirm = async (password: string) => {
        if (!contactToDelete) return;

        console.log(`[TrustedContacts] Deleting contact id: ${contactToDelete.id}...`);
        const response = await api.delete(`/trusted-contacts/${contactToDelete.id}`, {
            body: JSON.stringify({ currentPassword: password }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.success) {
            console.log('[TrustedContacts] Delete successful.');
            setDeleteModalVisible(false);
            setContactToDelete(null);
            Alert.alert('Success', 'Trusted contact removed successfully.');
            fetchContacts(false);
        } else {
            console.warn('[TrustedContacts] Delete failed:', response.message);
            throw new Error(response.message || 'Failed to remove trusted contact. Please check your password.');
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'accepted':
                return { bg: isDarkMode ? '#233226' : '#E8F5E9', text: isDarkMode ? '#81C784' : '#2E7D32' };
            case 'declined':
                return { bg: isDarkMode ? '#3C2929' : '#FFEBEE', text: isDarkMode ? '#E57373' : '#C62828' };
            case 'pending':
            default:
                return { bg: isDarkMode ? '#3E3424' : '#FFF3E0', text: isDarkMode ? '#FFB74D' : '#EF6C00' };
        }
    };

    const palette = {
        bg: isDarkMode ? '#121212' : '#F9F8F6',
        textDark: isDarkMode ? '#D4DEC5' : '#2D2C39',
        textSub: isDarkMode ? '#8E8E93' : '#8A9981',

        backBtnBg: isDarkMode ? '#323239' : '#E3E4E3',
        backBtnIcon: isDarkMode ? '#FFFFFF' : '#5A5B66',

        // List item styling
        itemBg: isDarkMode ? '#1E1E24' : '#EAE9EF',
        itemBorder: isDarkMode ? '#3D3D49' : '#CDD8DF',
        divider: isDarkMode ? '#2D2D35' : '#D6D5DB',

        btnPrimary: '#92A38D'
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]}>
            
            <View style={styles.header}>
                <TouchableOpacity 
                    style={[styles.backBtn, { backgroundColor: palette.backBtnBg }]}
                    onPress={() => router.replace('/profile')}
                >
                    <Feather name="arrow-left" size={ms(20)} color={palette.backBtnIcon} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: palette.textDark }]}>Trusted Contacts</Text>
                <View style={{ width: ms(36) }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={palette.btnPrimary} />
                    <Text style={[styles.loadingText, { color: palette.textSub }]}>Loading trusted contacts...</Text>
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Feather name="alert-circle" size={ms(48)} color="#E57373" />
                    <Text style={[styles.errorText, { color: palette.textDark }]}>{error}</Text>
                    <TouchableOpacity 
                        style={[styles.retryBtn, { backgroundColor: palette.btnPrimary }]}
                        onPress={() => fetchContacts(true)}
                    >
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : contacts.length === 0 ? (
                <View style={styles.center}>
                    <View style={[styles.emptyIconCirc, { backgroundColor: isDarkMode ? '#2A2E2A' : '#EBF0EA' }]}>
                        <Feather name="users" size={ms(48)} color={palette.btnPrimary} />
                    </View>
                    <Text style={[styles.emptyTitle, { color: palette.textDark }]}>No Trusted Contacts</Text>
                    <Text style={[styles.emptySubtitle, { color: palette.textSub }]}>
                        Add trusted contacts who will be notified and granted access to your memories after a period of inactivity.
                    </Text>
                </View>
            ) : (
                <ScrollView 
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[palette.btnPrimary]} />
                    }
                >
                    <View style={styles.listContainer}>
                        {contacts.map((contact) => {
                            const badge = getStatusStyles(contact.status);
                            return (
                                <View key={contact.id} style={[styles.contactCard, { backgroundColor: palette.itemBg }]}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.nameStack}>
                                            <Text style={[styles.contactName, { color: palette.textDark }]}>{contact.name}</Text>
                                            <Text style={[styles.contactEmail, { color: palette.textSub }]}>{contact.email}</Text>
                                        </View>
                                        <TouchableOpacity 
                                            style={styles.deleteBtn}
                                            onPress={() => handleDeletePress(contact)}
                                        >
                                            <Feather name="trash-2" size={ms(18)} color="#E57373" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[styles.cardDivider, { backgroundColor: palette.divider }]} />

                                    <View style={styles.cardDetails}>
                                        <View style={styles.detailRow}>
                                            <Text style={[styles.detailLabel, { color: palette.textSub }]}>Inactivity Limit:</Text>
                                            <Text style={[styles.detailValue, { color: palette.textDark }]}>{contact.inactivityDays} Days</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={[styles.detailLabel, { color: palette.textSub }]}>Status:</Text>
                                            <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                                                <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                                                    {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            )}

            {/* Bottom Add Contact Button */}
            {!loading && (
                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={[styles.addBtn, { backgroundColor: palette.btnPrimary }]}
                        activeOpacity={0.9}
                        onPress={() => {
                            triggerHaptic();
                            router.push('/legacy-mode/add');
                        }}
                    >
                        <Text style={styles.addBtnText}>+ Add Trusted Contact</Text>
                    </TouchableOpacity>
                </View>
            )}

            <PasswordModal
                visible={deleteModalVisible}
                title="Remove Trusted Contact?"
                subtitle={`Please enter your password to authorize removing ${contactToDelete?.name || 'this contact'} from your list.`}
                onClose={() => {
                    setDeleteModalVisible(false);
                    setContactToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(20),
        paddingTop: vs(10),
        marginBottom: vs(10),
    },
    backBtn: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: FONTS.serif,
        fontSize: ms(20),
        fontWeight: '600',
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(120),
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: ms(40),
    },
    loadingText: {
        fontFamily: FONTS.sans,
        fontSize: ms(14),
        marginTop: vs(12),
    },
    errorText: {
        fontFamily: FONTS.sans,
        fontSize: ms(15),
        textAlign: 'center',
        marginTop: vs(16),
        marginBottom: vs(16),
    },
    retryBtn: {
        paddingHorizontal: ms(20),
        paddingVertical: vs(10),
        borderRadius: ms(12),
    },
    retryText: {
        color: '#FFFFFF',
        fontFamily: FONTS.sans,
        fontSize: ms(14),
        fontWeight: '600',
    },
    emptyIconCirc: {
        width: ms(100),
        height: ms(100),
        borderRadius: ms(50),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(24),
    },
    emptyTitle: {
        fontFamily: FONTS.serif,
        fontSize: ms(24),
        fontWeight: '500',
        marginBottom: vs(12),
    },
    emptySubtitle: {
        fontFamily: FONTS.sans,
        fontSize: ms(15),
        textAlign: 'center',
        lineHeight: vs(22),
    },
    listContainer: {
        gap: vs(16),
        marginTop: vs(10),
    },
    contactCard: {
        borderRadius: ms(20),
        padding: ms(18),
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    nameStack: {
        flex: 1,
        marginRight: ms(12),
    },
    contactName: {
        fontFamily: FONTS.serif,
        fontSize: ms(18),
        fontWeight: '600',
        marginBottom: vs(2),
    },
    contactEmail: {
        fontFamily: FONTS.sans,
        fontSize: ms(13),
    },
    deleteBtn: {
        padding: ms(6),
        marginLeft: ms(8),
    },
    cardDivider: {
        height: 1,
        marginVertical: vs(14),
    },
    cardDetails: {
        gap: vs(8),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontFamily: FONTS.sans,
        fontSize: ms(13),
    },
    detailValue: {
        fontFamily: FONTS.sans,
        fontSize: ms(14),
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: ms(10),
        paddingVertical: vs(4),
        borderRadius: ms(10),
    },
    statusBadgeText: {
        fontFamily: FONTS.sans,
        fontSize: ms(11),
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: vs(30),
        left: ms(20),
        right: ms(20),
    },
    addBtn: {
        width: '100%',
        height: vs(52),
        borderRadius: ms(14),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    addBtnText: {
        fontFamily: FONTS.serif,
        color: '#FFFFFF',
        fontSize: ms(16),
        fontWeight: '600',
    }
});
