import { COLORS, FONTS } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';

export default function VerifyCodeScreen() {
    const router = useRouter();

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    const handleVerify = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push('/auth/reset-password');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back Button */}
                    <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                        <Feather name="arrow-left" size={22} color={COLORS.textDark} />
                    </TouchableOpacity>

                    {/* Progress Indicator */}
                    <View style={styles.progressWrapper}>
                        <View style={styles.progressItem}>
                            <View style={[styles.progressBar, styles.progressBarActive]} />
                            <Text style={[styles.progressText, styles.progressTextActive]}>Email</Text>
                        </View>
                        <View style={styles.progressItem}>
                            <View style={[styles.progressBar, styles.progressBarActive]} />
                            <Text style={[styles.progressText, styles.progressTextActive]}>Verify</Text>
                        </View>
                        <View style={styles.progressItem}>
                            <View style={[styles.progressBar, styles.progressBarInactive]} />
                            <Text style={[styles.progressText, styles.progressTextInactive]}>Password</Text>
                        </View>
                    </View>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Check your email.</Text>
                        <Text style={styles.subtitle}>We sent a 6-digit code to rafi**@gmail.com.</Text>
                    </View>

                    {/* OTP Code Inputs (visual representation only per screenshot) */}
                    <View style={styles.otpWrapper}>
                        {[...Array(6)].map((_, i) => (
                            <View key={i} style={styles.otpBox}>
                                <TextInput
                                    style={styles.otpInput}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    textAlign="center"
                                />
                            </View>
                        ))}
                    </View>

                    {/* Resend Link */}
                    <View style={styles.resendWrapper}>
                        <Text style={styles.resendPrompt}>Didn't receive it? </Text>
                        <TouchableOpacity style={styles.resendBtn}>
                            <Feather name="refresh-cw" size={12} color={COLORS.accentGreen} style={{ marginRight: 4 }} />
                            <Text style={styles.resendText}>Resend code</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Primary Button */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.primaryBtn}
                            onPress={handleVerify}
                        >
                            <Text style={styles.primaryBtnText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        paddingHorizontal: '24@ms',
        paddingTop: '20@vs',
        paddingBottom: '40@vs',
    },
    backBtn: {
        width: '40@ms',
        height: '40@ms',
        borderRadius: '20@ms',
        backgroundColor: '#EFEFF0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20@vs',
    },
    progressWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '40@vs',
        gap: '10@s',
    },
    progressItem: {
        flex: 1,
        alignItems: 'center',
        gap: '6@vs',
    },
    progressBar: {
        height: '4@vs',
        width: '100%',
        borderRadius: '2@vs',
    },
    progressBarActive: {
        backgroundColor: '#8FA181',
    },
    progressBarInactive: {
        backgroundColor: '#E5E4E2',
    },
    progressText: {
        fontFamily: FONTS.sans,
        fontSize: '11@ms',
        letterSpacing: 0.5,
    },
    progressTextActive: {
        color: COLORS.accentGreen,
    },
    progressTextInactive: {
        color: '#A09EB3',
    },
    header: {
        marginBottom: '35@vs',
    },
    title: {
        fontFamily: FONTS.serif,
        fontSize: '38@ms',
        lineHeight: '42@ms',
        fontWeight: '600',
        color: COLORS.textDark,
        marginBottom: '12@vs',
    },
    subtitle: {
        fontFamily: FONTS.sans,
        fontSize: '15@ms',
        lineHeight: '22@ms',
        color: COLORS.accentGreen,
        letterSpacing: 0.2,
    },
    otpWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '30@vs',
    },
    otpBox: {
        width: '44@ms',
        height: '52@ms',
        backgroundColor: COLORS.inputBg,
        borderRadius: '12@ms',
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpInput: {
        fontFamily: FONTS.sans,
        fontSize: '20@ms',
        fontWeight: '600',
        color: COLORS.textDark,
        width: '100%',
        height: '100%',
    },
    resendWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '40@vs',
    },
    resendPrompt: {
        fontFamily: FONTS.sans,
        fontSize: '13@ms',
        color: '#7F7D8D',
    },
    resendBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resendText: {
        fontFamily: FONTS.sans,
        fontSize: '15@ms',
        fontWeight: '500',
        color: COLORS.accentGreen,
    },
    footer: {
        marginTop: '10@vs',
    },
    primaryBtn: {
        backgroundColor: COLORS.primaryAlt,
        height: '56@vs',
        width: '100%',
        borderRadius: '14@ms',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    primaryBtnText: {
        fontFamily: FONTS.serif,
        color: '#FFFFFF',
        fontSize: '18@ms',
        fontWeight: '700',
    },
});
