import { FONTS, LightTheme } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    NativeSyntheticEvent,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';

export default function VerifyCodeScreen() {
    const router = useRouter();
    const colors = useAppTheme();
    const colorScheme = useColorScheme();

    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const inputsRef = useRef<Array<TextInput | null>>([]);

    const styles = useMemo(() => getStyles(colors), [colors]);

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    const handleVerify = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push('/auth/reset-password');
    };

    const handleOtpChange = (text: string, index: number) => {
        const numericText = text.replace(/[^0-9]/g, '');
        const newOtp = [...otp];
        // If user paste a long code, we can handle basic case but standard is single digit at a time
        newOtp[index] = numericText.slice(-1); 
        setOtp(newOtp);

        // Auto focus next
        if (numericText && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        if (e.nativeEvent.key === 'Backspace') {
            // If current field is empty, go to previous field and clear it
            if (!otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputsRef.current[index - 1]?.focus();
            } else if (otp[index]) {
                // Just let normal flow clear it, but stay focused or move focus later?
                // Standard react-native input behavior clears it, so usually no step required unless customizing deletion behavior
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />
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
                        <Feather name="arrow-left" size={22} color={colors.textDark} />
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

                    {/* OTP Code Inputs */}
                    <View style={styles.otpWrapper}>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <View key={index} style={styles.otpBox}>
                                <TextInput
                                    ref={(el) => { inputsRef.current[index] = el; }}
                                    style={styles.otpInput}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    textAlign="center"
                                    placeholderTextColor={colors.textMuted}
                                    value={otp[index]}
                                    onChangeText={(text) => handleOtpChange(text, index)}
                                    onKeyPress={(e) => handleOtpKeyPress(e, index)}
                                    selectTextOnFocus
                                />
                            </View>
                        ))}
                    </View>

                    {/* Resend Link */}
                    <View style={styles.resendWrapper}>
                        <Text style={styles.resendPrompt}>Didn't receive it? </Text>
                        <TouchableOpacity style={styles.resendBtn}>
                            <Feather name="refresh-cw" size={12} color={colors.accentGreen} style={{ marginRight: 4 }} />
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
                            <Text style={styles.primaryBtnText}>Verify Code</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const getStyles = (colors: typeof LightTheme) => ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
        backgroundColor: colors.btnSecondaryBg,
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
        backgroundColor: colors.primaryAlt,
    },
    progressBarInactive: {
        backgroundColor: colors.tabBgInactive,
    },
    progressText: {
        fontFamily: FONTS.sans,
        fontSize: '11@ms',
        letterSpacing: 0.5,
    },
    progressTextActive: {
        color: colors.accentGreen,
    },
    progressTextInactive: {
        color: colors.textMuted,
    },
    header: {
        marginBottom: '35@vs',
    },
    title: {
        fontFamily: FONTS.serif,
        fontSize: '38@ms',
        lineHeight: '42@ms',
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: '12@vs',
    },
    subtitle: {
        fontFamily: FONTS.sans,
        fontSize: '15@ms',
        lineHeight: '22@ms',
        color: colors.accentGreen,
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
        backgroundColor: colors.inputBg,
        borderRadius: '12@ms',
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpInput: {
        fontFamily: FONTS.sans,
        fontSize: '20@ms',
        fontWeight: '600',
        color: colors.textDark,
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
        color: colors.textMuted,
    },
    resendBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resendText: {
        fontFamily: FONTS.sans,
        fontSize: '15@ms',
        fontWeight: '500',
        color: colors.accentGreen,
    },
    footer: {
        marginTop: '10@vs',
    },
    primaryBtn: {
        backgroundColor: colors.primaryAlt,
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
