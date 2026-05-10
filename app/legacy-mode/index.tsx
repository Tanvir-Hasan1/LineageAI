import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    useColorScheme,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ms, vs } from 'react-native-size-matters';
import { FONTS } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

export default function TrustedContactsScreen() {
    const router = useRouter();
    const isDarkMode = useColorScheme() === 'dark';

    // Local State for Ingestion Form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [relation, setRelation] = useState('');

    const triggerHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const palette = {
        bg: isDarkMode ? '#121212' : '#F9F8F6',
        textDark: isDarkMode ? '#D4DEC5' : '#2D2C39',
        textSub: isDarkMode ? '#8E8E93' : '#8A9981',

        backBtnBg: isDarkMode ? '#323239' : '#E3E4E3',
        backBtnIcon: isDarkMode ? '#FFFFFF' : '#5A5B66',

        trackActive: '#92A38D',
        trackInactive: isDarkMode ? '#3A3A3A' : '#E8E8E8',

        // Information Banner specifics
        bannerBg: isDarkMode ? '#232B32' : '#E4EAEE',
        bannerText: isDarkMode ? '#A0AEBB' : '#677685',

        // Input Container Pod
        formBg: isDarkMode ? '#2D2C35' : '#EAE9EF', // Soft lavender container seen in screenshot
        inputBg: isDarkMode ? '#3D3D49' : '#D6D7DE', // Tinted input fields seen in screenshot
        placeholder: isDarkMode ? '#8E8E9B' : '#7A7B85',

        // Secondary Action Button
        secondaryBtn: isDarkMode ? '#4D4C5D' : '#A2A1BA',
        secondaryBtnText: '#FFFFFF',

        btnPrimary: '#92A38D'
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1 }}>
                        
                        <View style={styles.header}>
                <TouchableOpacity 
                    style={[styles.backBtn, { backgroundColor: palette.backBtnBg }]}
                    onPress={() => router.back()}
                >
                    <Feather name="arrow-left" size={ms(20)} color={palette.backBtnIcon} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                <Text style={[styles.pageTitle, { color: isDarkMode ? '#D4DEC5' : '#2D2C39' }]}>Legacy Mode</Text>
                <Text style={[styles.pageSubtitle, { color: isDarkMode ? '#8E8E93' : '#8A9981' }]}>
                    Set up what happens to your archive after a period of inactivity.
                </Text>

                {/* Step 1 View: Only first bar active */}
                <View style={styles.stepperBlock}>
                    <View style={styles.stepTracksRow}>
                        <View style={[styles.track, { backgroundColor: palette.trackActive }]} />
                        <View style={[styles.track, { backgroundColor: palette.trackInactive }]} />
                        <View style={[styles.track, { backgroundColor: palette.trackInactive }]} />
                    </View>
                    <View style={styles.stepLabelsRow}>
                        <Text style={[styles.stepLabel, { color: palette.trackActive }]}>Trusted Contacts</Text>
                        <Text style={[styles.stepLabel, { color: isDarkMode ? '#555' : '#AFAFAF' }]}>Define Rules</Text>
                        <Text style={[styles.stepLabel, { color: isDarkMode ? '#555' : '#AFAFAF' }]}>Data Transfer</Text>
                    </View>
                </View>

                {/* Info Banner Row */}
                <View style={[styles.infoBanner, { backgroundColor: palette.bannerBg }]}>
                    <Ionicons name="information-circle-outline" size={ms(18)} color={palette.bannerText} style={{ marginRight: ms(10), marginTop: vs(2) }} />
                    <Text style={[styles.infoText, { color: palette.bannerText }]}>
                        Trusted contacts are the people who will be notified and granted access to your archive when Legacy Mode activates.
                    </Text>
                </View>

                {/* High Fidelity Input Pod */}
                <View style={[styles.formContainer, { backgroundColor: palette.formBg }]}>
                    <Text style={[styles.formTitle, { color: isDarkMode ? '#FFFFFF' : '#3A3B45' }]}>Add Trusted Contact</Text>

                    <TextInput 
                        style={[styles.input, { backgroundColor: palette.inputBg, color: palette.textDark }]}
                        placeholder="Full name"
                        placeholderTextColor={palette.placeholder}
                        value={name}
                        onChangeText={setName}
                    />

                    <TextInput 
                        style={[styles.input, { backgroundColor: palette.inputBg, color: palette.textDark }]}
                        placeholder="Email address"
                        placeholderTextColor={palette.placeholder}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TextInput 
                        style={[styles.input, { backgroundColor: palette.inputBg, color: palette.textDark }]}
                        placeholder="e.g. Sister, Son, Friend"
                        placeholderTextColor={palette.placeholder}
                        value={relation}
                        onChangeText={setRelation}
                    />

                    {/* Secondary Button Inner */}
                    <TouchableOpacity 
                        style={[styles.innerBtn, { backgroundColor: palette.secondaryBtn }]}
                        activeOpacity={0.8}
                        onPress={triggerHaptic}
                    >
                        <Text style={[styles.innerBtnText, { color: palette.secondaryBtnText }]}>+ Add Contact</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            {/* Route Forward to Step 2 (Rules.tsx) - Fixed anchored to screen root */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.continueBtn, { backgroundColor: palette.btnPrimary }]}
                    activeOpacity={0.9}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        router.push('/legacy-mode/rules');
                    }}
                >
                    <Text style={styles.continueBtnText}>Continue</Text>
                </TouchableOpacity>
            </View>

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
        marginBottom: vs(10),
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
        paddingBottom: vs(100),
    },
    pageTitle: {
        fontFamily: FONTS.serif,
        fontSize: ms(32),
        fontWeight: '500',
        marginTop: vs(10),
        marginBottom: vs(8),
    },
    pageSubtitle: {
        fontFamily: FONTS.sans,
        fontSize: ms(15),
        lineHeight: vs(22),
        marginBottom: vs(24),
    },
    stepperBlock: {
        marginBottom: vs(30),
    },
    stepTracksRow: {
        flexDirection: 'row',
        gap: ms(10),
        marginBottom: vs(8),
    },
    track: {
        flex: 1,
        height: vs(5),
        borderRadius: ms(2),
    },
    stepLabelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stepLabel: {
        fontFamily: FONTS.sans,
        fontSize: ms(10),
        textAlign: 'center',
        flex: 1,
    },
    infoBanner: {
        width: '100%',
        borderRadius: ms(16),
        padding: ms(16),
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: vs(24),
    },
    infoText: {
        flex: 1,
        fontFamily: FONTS.sans,
        fontSize: ms(13),
        lineHeight: vs(18),
    },
    formContainer: {
        width: '100%',
        borderRadius: ms(22),
        padding: ms(20),
        gap: vs(12),
    },
    formTitle: {
        fontFamily: FONTS.serif,
        fontSize: ms(18),
        fontWeight: '500',
        marginBottom: vs(6),
    },
    input: {
        width: '100%',
        height: vs(46),
        borderRadius: ms(14),
        paddingHorizontal: ms(16),
        fontFamily: FONTS.sans,
        fontSize: ms(14),
    },
    innerBtn: {
        width: '100%',
        height: vs(46),
        borderRadius: ms(14),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: vs(4),
    },
    innerBtnText: {
        fontFamily: FONTS.serif,
        fontSize: ms(15),
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: vs(30),
        left: ms(20),
        right: ms(20),
    },
    continueBtn: {
        width: '100%',
        height: vs(52),
        borderRadius: ms(14),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    continueBtnText: {
        fontFamily: FONTS.serif,
        color: '#FFFFFF',
        fontSize: ms(16),
        fontWeight: '600',
    }
});
