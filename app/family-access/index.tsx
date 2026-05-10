import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    Image, 
    useColorScheme
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ms, vs } from 'react-native-size-matters';
import { FONTS } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

// STANDALONE SUBCOMPONENT IMPORT
import InviteModal from '@/components/InviteModal';

// ------------------- MOCK ASSET PATHS -------------------
const IMG_AVATAR_SARAH = require('@/assets/images/dashboard/margaret.png'); 
const IMG_AVATAR_JAMES = require('@/assets/images/dashboard/robert.png');

export default function FamilyAccessScreen() {
    const router = useRouter();
    const isDarkMode = useColorScheme() === 'dark';

    // Local Orchestrator
    const [inviteVisible, setInviteVisible] = useState(false);

    const triggerHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const palette = {
        bg: isDarkMode ? '#121212' : '#F9F8F6',
        textDark: isDarkMode ? '#D8DECB' : '#2D2C39',
        textSub: isDarkMode ? '#8F918B' : '#8A9981',

        backBtnBg: isDarkMode ? '#323239' : '#E3E4E3',
        backBtnIcon: isDarkMode ? '#FFFFFF' : '#5A5B66',

        dashedBg: isDarkMode ? '#232A20' : '#E2E6DC',
        dashedBorder: isDarkMode ? '#516249' : '#92A489',
        dashedIconBg: '#8E9E86',

        card1Bg: isDarkMode ? '#2C2B33' : '#E1DFE8',
        badge1Bg: isDarkMode ? '#5A5670' : '#A09DB6',
        
        card2Bg: isDarkMode ? '#272D33' : '#DDE4E8',
        badge2Bg: isDarkMode ? '#4E5D68' : '#A8B7C1',

        infoPodBg: isDarkMode ? '#1F1E24' : '#E6E4EB',
        infoPodText: isDarkMode ? '#A0A0B0' : '#5F5F6A'
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={['top']}>
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={[styles.backBtn, { backgroundColor: palette.backBtnBg }]}
                    onPress={() => router.back()}
                >
                    <Feather name="arrow-left" size={ms(20)} color={palette.backBtnIcon} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                <Text style={[styles.pageTitle, { color: palette.textDark }]}>Family Access</Text>
                <Text style={[styles.pageSubText, { color: palette.textSub }]}>2 members with access</Text>

                {/* TOP ACTION POD */}
                <TouchableOpacity 
                    activeOpacity={0.8}
                    style={[styles.inviteBox, { backgroundColor: palette.dashedBg, borderColor: palette.dashedBorder }]}
                    onPress={() => {
                        triggerHaptic();
                        setInviteVisible(true);
                    }}
                >
                    <View style={[styles.inviteIconCont, { backgroundColor: palette.dashedIconBg }]}>
                        <Feather name="user-plus" size={ms(20)} color="#FFFFFF" />
                    </View>
                    <View>
                        <Text style={[styles.inviteTitle, { color: isDarkMode ? '#E0EED5' : '#3A3C39' }]}>Invite a Family Member</Text>
                        <Text style={[styles.inviteSub, { color: isDarkMode ? '#859E75' : '#8CA087' }]}>Share access with loved ones</Text>
                    </View>
                </TouchableOpacity>

                <Text style={[styles.sectionHeader, { color: isDarkMode ? '#AFAFB9' : '#3A3C45' }]}>MEMBERS</Text>

                {/* MEMBER CARD 1 */}
                <View style={[styles.memberCard, { backgroundColor: palette.card1Bg }]}>
                    <Image source={IMG_AVATAR_SARAH} style={styles.avatar} />
                    <View style={styles.memberText}>
                        <Text style={[styles.memberName, { color: isDarkMode ? '#FFFFFF' : '#2D2C39' }]}>Sarah Mitchell</Text>
                        <Text style={[styles.memberEmail, { color: isDarkMode ? '#8F8F9E' : '#8A8A95' }]}>sarah@example.com</Text>
                    </View>
                    <View style={[styles.roleBadge, { backgroundColor: palette.badge1Bg }]}>
                        <MaterialCommunityIcons name="crown-outline" size={ms(13)} color="#FFFFFF" style={{ marginRight: ms(4) }} />
                        <Text style={styles.badgeText}>Owner</Text>
                    </View>
                    <TouchableOpacity style={styles.dotsBtn}>
                        <MaterialCommunityIcons name="dots-vertical" size={ms(20)} color={isDarkMode ? '#8F8F9E' : '#2D2C39'} />
                    </TouchableOpacity>
                </View>

                {/* MEMBER CARD 2 */}
                <View style={[styles.memberCard, { backgroundColor: palette.card2Bg }]}>
                    <Image source={IMG_AVATAR_JAMES} style={styles.avatar} />
                    <View style={styles.memberText}>
                        <Text style={[styles.memberName, { color: isDarkMode ? '#FFFFFF' : '#2D2C39' }]}>James Mitchell</Text>
                        <Text style={[styles.memberEmail, { color: isDarkMode ? '#8F9E9E' : '#8A9595' }]}>james@example.com</Text>
                    </View>
                    <View style={[styles.roleBadge, { backgroundColor: palette.badge2Bg }]}>
                        <Feather name="edit-2" size={ms(11)} color="#FFFFFF" style={{ marginRight: ms(4) }} />
                        <Text style={styles.badgeText}>Editor</Text>
                    </View>
                    <TouchableOpacity style={styles.dotsBtn}>
                        <MaterialCommunityIcons name="dots-vertical" size={ms(20)} color={isDarkMode ? '#8F8F9E' : '#2D2C39'} />
                    </TouchableOpacity>
                </View>

                {/* BOTTOM CAPSULE */}
                <View style={[styles.infoCapsule, { backgroundColor: palette.infoPodBg }]}>
                    <Feather name="shield" size={ms(14)} color={palette.infoPodText} style={{ marginRight: ms(10), marginTop: vs(2) }} />
                    <Text style={[styles.infoCapsuleText, { color: palette.infoPodText }]}>
                        All members access the archive based on their role. Owners can revoke access at any time. Sensitive settings are always private.
                    </Text>
                </View>

            </ScrollView>

            {/* CLEAN STANDALONE MODAL */}
            <InviteModal 
                visible={inviteVisible} 
                onClose={() => setInviteVisible(false)} 
                isDarkMode={isDarkMode} 
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: ms(20),
        paddingTop: vs(10),
    },
    backBtn: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingTop: vs(20),
        paddingBottom: vs(40),
    },
    pageTitle: {
        fontFamily: FONTS.serif,
        fontSize: ms(34),
        fontWeight: '500',
        marginBottom: vs(4),
    },
    pageSubText: {
        fontFamily: FONTS.sans,
        fontSize: ms(16),
        marginBottom: vs(28),
    },
    inviteBox: {
        width: '100%',
        borderRadius: ms(20),
        borderWidth: 1,
        borderStyle: 'dashed',
        padding: ms(18),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(36),
    },
    inviteIconCont: {
        width: ms(44),
        height: ms(44),
        borderRadius: ms(14),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(16),
    },
    inviteTitle: {
        fontFamily: FONTS.serif,
        fontSize: ms(18),
        fontWeight: '500',
        marginBottom: vs(2),
    },
    inviteSub: {
        fontFamily: FONTS.sans,
        fontSize: ms(13),
    },
    sectionHeader: {
        fontFamily: FONTS.serif,
        fontSize: ms(14),
        letterSpacing: 1,
        fontWeight: '600',
        marginBottom: vs(16),
    },
    memberCard: {
        width: '100%',
        height: vs(72),
        borderRadius: ms(20),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(14),
        marginBottom: vs(12),
    },
    avatar: {
        width: ms(48),
        height: ms(48),
        borderRadius: ms(24),
        marginRight: ms(12),
    },
    memberText: {
        flex: 1,
    },
    memberName: {
        fontFamily: FONTS.serif,
        fontSize: ms(16),
        fontWeight: '500',
        marginBottom: vs(2),
    },
    memberEmail: {
        fontFamily: FONTS.sans,
        fontSize: ms(12),
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(6),
        paddingHorizontal: ms(10),
        borderRadius: ms(14),
        marginRight: ms(4),
    },
    badgeText: {
        fontFamily: FONTS.serif,
        color: '#FFFFFF',
        fontSize: ms(13),
        fontWeight: '500',
    },
    dotsBtn: {
        padding: ms(8),
    },
    infoCapsule: {
        width: '100%',
        borderRadius: ms(18),
        padding: ms(18),
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: vs(12),
    },
    infoCapsuleText: {
        flex: 1,
        fontFamily: FONTS.sans,
        fontSize: ms(13),
        lineHeight: vs(18),
    }
});
