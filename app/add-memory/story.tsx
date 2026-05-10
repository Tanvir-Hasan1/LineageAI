import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    useColorScheme,
    TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ms, vs } from 'react-native-size-matters';
import { FONTS } from '@/constants/theme';

const STEPS = ['Type', 'Story', 'Tags', 'Save'];

export default function StoryStepScreen() {
    const router = useRouter();
    const isDarkMode = useColorScheme() === 'dark';

    // Logic: Form Inputs
    const [title, setTitle] = useState('');
    const [narrative, setNarrative] = useState('');
    const [date, setDate] = useState('');

    // Chromatic Synchronization
    const palette = {
        bg: isDarkMode ? '#121212' : '#F9F8F6',
        textDark: isDarkMode ? '#FFFFFF' : '#2D2C39',
        backBg: isDarkMode ? '#2E2E33' : '#E2E3E5',
        trackBg: isDarkMode ? '#2C2C2C' : '#EBECE8',
        trackActive: '#8EA281',
        btnPrimary: '#8EA281',
        
        // Story-specific visual variables
        uploadBg: isDarkMode ? 'transparent' : '#BAC5B6',
        uploadBorder: '#8EA281',
        iconBack: isDarkMode ? '#2E2E33' : '#FFFFFF',
        inputBg: isDarkMode ? '#3E4348' : '#E4E3EC',
        placeholder: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(45,44,57,0.4)',
        browseBtn: isDarkMode ? '#8EA281' : '#97A58E',
        cameraBtn: isDarkMode ? '#9A9ABD' : '#A5B7C6',
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]}>
            {/* Header Context Lock */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={[styles.backBtn, { backgroundColor: palette.backBg }]}
                    onPress={() => router.back()}
                >
                    <Feather name="arrow-left" size={ms(20)} color={isDarkMode ? '#FFFFFF' : '#2D2C39'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: palette.textDark }]}>Add a Memory</Text>
            </View>

            {/* Step Serialization (Now both Step 1 & 2 are Active) */}
            <View style={styles.stepperContainer}>
                <View style={styles.stepperRow}>
                    {STEPS.map((step, index) => {
                        const isFilled = index <= 1; // Both Type and Story are unlocked!
                        return (
                            <View key={step} style={styles.stepWrapper}>
                                <View style={[
                                    styles.stepTrack, 
                                    { backgroundColor: isFilled ? palette.trackActive : palette.trackBg }
                                ]} />
                                <Text style={[
                                    styles.stepLabel, 
                                    { color: isFilled ? palette.trackActive : '#BDBDBD' }
                                ]}>
                                    {step}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Section 1: Massive Asset Uploader Dropzone */}
                <Text style={[styles.sectionHeader, { color: palette.textDark, marginBottom: vs(12) }]}>
                    Choose a photo from your device or take one now.
                </Text>

                <View style={[
                    styles.uploadContainer,
                    { 
                        backgroundColor: palette.uploadBg,
                        borderColor: palette.uploadBorder,
                    }
                ]}>
                    <View style={[styles.uploadInnerIcon, { backgroundColor: palette.iconBack }]}>
                        <Feather name="image" size={ms(28)} color={isDarkMode ? '#8EA281' : '#B6C3B0'} />
                    </View>

                    <Text style={[styles.uploadTitle, { color: isDarkMode ? '#8EA281' : '#FFFFFF' }]}>Upload a photo</Text>
                    <Text style={[styles.uploadSub, { color: isDarkMode ? '#A0A0A0' : '#FFFFFF' }]}>JPG, PNG, HEIC, WebP · Up to 50 MB</Text>

                    <View style={styles.uploadBtnRow}>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: palette.browseBtn }]}>
                            <Feather name="upload" size={ms(14)} color="#FFFFFF" style={{ marginRight: ms(6) }} />
                            <Text style={styles.actionBtnText}>Browse files</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: palette.cameraBtn }]}>
                            <Feather name="camera" size={ms(14)} color="#FFFFFF" style={{ marginRight: ms(6) }} />
                            <Text style={styles.actionBtnText}>Camera</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Section 2: Narrative Form Controls */}
                <Text style={[styles.sectionHeader, { color: palette.textDark, marginTop: vs(24), marginBottom: vs(12) }]}>
                    Tell the story behind this memory.
                </Text>

                {/* Field: Title */}
                <Text style={[styles.label, { color: palette.textDark }]}>Title</Text>
                <View style={[styles.inputWrapper, { backgroundColor: palette.inputBg }]}>
                    <TextInput
                        placeholder="Give this memory a name"
                        placeholderTextColor={palette.placeholder}
                        style={[styles.input, { color: palette.textDark }]}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Field: Narrative (Multi-line) */}
                <Text style={[styles.label, { color: palette.textDark, marginTop: vs(16) }]}>Narrative</Text>
                <View style={[styles.textAreaWrapper, { backgroundColor: palette.inputBg }]}>
                    <TextInput
                        placeholder="What happened? How did it feel? What do you want to remember most?"
                        placeholderTextColor={palette.placeholder}
                        style={[styles.textArea, { color: palette.textDark }]}
                        multiline
                        textAlignVertical="top"
                        value={narrative}
                        onChangeText={setNarrative}
                    />
                </View>

                {/* Field: Date */}
                <Text style={[styles.label, { color: palette.textDark, marginTop: vs(16) }]}>Date</Text>
                <View style={[styles.inputWrapper, { backgroundColor: palette.inputBg }]}>
                    <TextInput
                        placeholder="e.g. August 14, 1978"
                        placeholderTextColor={palette.placeholder}
                        style={[styles.input, { color: palette.textDark }]}
                        value={date}
                        onChangeText={setDate}
                    />
                </View>

            </ScrollView>

            {/* Bottom Anchor Button */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.continueBtn, { backgroundColor: palette.btnPrimary }]}
                    activeOpacity={0.9}
                >
                    <Text style={styles.continueText}>Continue</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingVertical: vs(12),
    },
    backBtn: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(16),
    },
    headerTitle: {
        fontFamily: FONTS.serif,
        fontSize: ms(20),
        fontWeight: '500',
    },
    stepperContainer: {
        paddingHorizontal: ms(20),
        marginTop: vs(10),
        marginBottom: vs(10),
    },
    stepperRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: ms(10),
    },
    stepWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    stepTrack: {
        height: vs(4),
        width: '100%',
        borderRadius: ms(2),
        marginBottom: vs(6),
    },
    stepLabel: {
        fontFamily: FONTS.serif,
        fontSize: ms(11),
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingTop: vs(15),
        paddingBottom: vs(120),
    },
    sectionHeader: {
        fontFamily: FONTS.serif,
        fontSize: ms(16),
        fontWeight: '500',
    },
    uploadContainer: {
        width: '100%',
        padding: ms(20),
        borderRadius: ms(20),
        borderWidth: 1.5,
        borderStyle: 'dashed', // Match specification visual
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadInnerIcon: {
        width: ms(56),
        height: ms(56),
        borderRadius: ms(16),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(14),
    },
    uploadTitle: {
        fontFamily: FONTS.serif,
        fontSize: ms(15),
        fontWeight: '600',
        marginBottom: vs(4),
    },
    uploadSub: {
        fontFamily: FONTS.sans,
        fontSize: ms(11),
        opacity: 0.85,
        marginBottom: vs(20),
    },
    uploadBtnRow: {
        flexDirection: 'row',
        gap: ms(12),
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(16),
        paddingVertical: vs(10),
        borderRadius: ms(12),
        flex: 1,
        justifyContent: 'center',
    },
    actionBtnText: {
        fontFamily: FONTS.sans,
        color: '#FFFFFF',
        fontSize: ms(13),
        fontWeight: '600',
    },
    label: {
        fontFamily: FONTS.serif,
        fontSize: ms(15),
        fontWeight: '600',
        marginBottom: vs(8),
    },
    inputWrapper: {
        width: '100%',
        height: vs(44),
        borderRadius: ms(14),
        paddingHorizontal: ms(16),
        justifyContent: 'center',
    },
    textAreaWrapper: {
        width: '100%',
        height: vs(120),
        borderRadius: ms(14),
        paddingHorizontal: ms(16),
        paddingVertical: vs(14),
    },
    input: {
        fontFamily: FONTS.sans,
        fontSize: ms(14),
        padding: 0, // Strip default RN inputs padding
    },
    textArea: {
        fontFamily: FONTS.sans,
        fontSize: ms(14),
        flex: 1,
        padding: 0,
    },
    footer: {
        position: 'absolute',
        bottom: vs(30),
        left: ms(20),
        right: ms(20),
    },
    continueBtn: {
        width: '100%',
        paddingVertical: vs(14),
        borderRadius: ms(12),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    continueText: {
        fontFamily: FONTS.serif,
        color: '#FFFFFF',
        fontSize: ms(16),
        fontWeight: '600',
    }
});
