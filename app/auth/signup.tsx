import { COLORS, FONTS } from '@/constants/theme';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import Animated, { Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';

export default function SignUpScreen() {
    const router = useRouter();
    const [isSecure, setIsSecure] = useState(true);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    const navigateToSignIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.replace('/auth/signin');
    };

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/onboarding');
        }
    };

    const handleSubmit = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(tabs)');
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

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Begin your legacy</Text>
                        <Text style={styles.subtitle}>Create an account to start preserving memories.</Text>
                    </View>

                    {/* Tab Control */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={navigateToSignIn}
                            style={[styles.tab, styles.tabInactive]}
                        >
                            <Text style={[styles.tabText, styles.tabTextInactive]}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={[styles.tab, styles.tabActive]}
                        >
                            <Text style={[styles.tabText, styles.tabTextActive]}>
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Inputs */}
                    <Animated.View layout={Layout.springify()} style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Your Name</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="e.g. Sarah Mitchell"
                                    placeholderTextColor="#A09EB3"
                                    style={styles.input}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email address</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="you@example.com"
                                    placeholderTextColor="#A09EB3"
                                    style={styles.input}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="At least 6 characters"
                                    placeholderTextColor="#A09EB3"
                                    style={[styles.input, { paddingRight: 45 }]}
                                    secureTextEntry={isSecure}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={() => setIsSecure(!isSecure)}
                                    style={styles.eyeBtn}
                                >
                                    <Feather
                                        name={isSecure ? 'eye-off' : 'eye'}
                                        size={18}
                                        color={COLORS.textMuted}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Re-enter your password"
                                    placeholderTextColor="#A09EB3"
                                    style={styles.input}
                                    secureTextEntry={isSecure}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                    </Animated.View>

                    {/* Primary Actions */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.primaryBtn}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.primaryBtnText}>Create Account</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setIsTermsAccepted(!isTermsAccepted)}
                            style={styles.termsContainer}
                        >
                            <View style={[styles.checkbox, isTermsAccepted && styles.checkboxChecked]}>
                                {isTermsAccepted && <Ionicons name="checkmark" size={12} color="#FFF" />}
                            </View>
                            <Text style={styles.termsText}>
                                By continuing, you agree to our{' '}
                                <Text style={styles.linkText}>Terms</Text> and{' '}
                                <Text style={styles.linkText}>Privacy Policy</Text>.
                            </Text>
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
        marginBottom: '30@vs',
    },
    header: {
        marginBottom: '30@vs',
    },
    title: {
        fontFamily: FONTS.serif,
        fontSize: '38@ms',
        lineHeight: '44@ms',
        fontWeight: '600',
        color: COLORS.textDark,
        marginBottom: '8@vs',
    },
    subtitle: {
        fontFamily: FONTS.sans,
        fontSize: '15@ms',
        color: COLORS.accentGreen,
        letterSpacing: 0.2,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.tabBgInactive,
        borderRadius: '12@ms',
        padding: '4@ms',
        height: '45@vs',
        marginBottom: '30@vs',
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '9@ms',
    },
    tabActive: {
        backgroundColor: COLORS.tabBgActive,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabInactive: {
        backgroundColor: 'transparent',
    },
    tabText: {
        fontFamily: FONTS.serif,
        fontSize: '17@ms',
        letterSpacing: 0.3,
    },
    tabTextActive: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    tabTextInactive: {
        color: '#6B6980',
    },
    formContainer: {
        gap: '18@vs',
        marginBottom: '35@vs',
    },
    inputGroup: {
        gap: '8@vs',
    },
    label: {
        fontFamily: FONTS.serif,
        fontSize: '15@ms',
        color: COLORS.textDark,
        fontWeight: '500',
        marginLeft: '2@ms',
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: COLORS.inputBg,
        height: '52@vs',
        borderRadius: '12@ms',
        paddingHorizontal: '16@ms',
        fontSize: '15@ms',
        fontFamily: FONTS.sans,
        color: COLORS.textDark,
    },
    eyeBtn: {
        position: 'absolute',
        right: '16@ms',
        padding: '4@ms',
    },
    footer: {
        gap: '30@vs',
        alignItems: 'center',
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
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '10@ms',
    },
    checkbox: {
        width: '18@ms',
        height: '18@ms',
        borderRadius: '4@ms',
        borderWidth: 1,
        borderColor: '#A09EB3',
        marginRight: '10@ms',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: COLORS.primaryAlt,
        borderColor: COLORS.primaryAlt,
    },
    termsText: {
        fontFamily: FONTS.sans,
        fontSize: '12@ms',
        color: '#7F7D8D',
        lineHeight: '18@ms',
    },
    linkText: {
        textDecorationLine: 'underline',
        color: '#7F7D8D',
    },
});
