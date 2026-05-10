import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ms, vs } from 'react-native-size-matters';
import { FONTS } from '@/constants/theme';

interface CollectorProps {
    palette: any;
    isDarkMode: boolean;
}

// ====================================================
// PHOTO COLLECTOR (Retains dual buttons: Browse + Camera)
// ====================================================
export const PhotoCollector: React.FC<CollectorProps> = ({ palette, isDarkMode }) => (
    <>
        <Text style={[styles.sectionHeader, { color: palette.textDark, marginBottom: vs(12) }]}>
            Choose a photo from your device or take one now.
        </Text>
        <View style={[styles.uploadContainer, { backgroundColor: palette.uploadBg, borderColor: palette.uploadBorder }]}>
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
    </>
);

// ====================================================
// VIDEO COLLECTOR (Removed Record trigger, Single Button)
// ====================================================
export const VideoCollector: React.FC<CollectorProps> = ({ palette, isDarkMode }) => (
    <>
        <Text style={[styles.sectionHeader, { color: palette.textDark, marginBottom: vs(12) }]}>
            Add a video clip from your library.
        </Text>
        <View style={[
            styles.uploadContainer,
            { backgroundColor: isDarkMode ? 'transparent' : '#A9A9C0', borderColor: '#9A9ABD' }
        ]}>
            <View style={[styles.uploadInnerIcon, { backgroundColor: palette.iconBack }]}>
                <Feather name="video" size={ms(28)} color="#9A9ABD" />
            </View>
            <Text style={[styles.uploadTitle, { color: isDarkMode ? '#9A9ABD' : '#FFFFFF' }]}>Upload a video</Text>
            <Text style={[styles.uploadSub, { color: isDarkMode ? '#A0A0A0' : '#FFFFFF' }]}>MP4, MOV, HEVC · Up to 100 MB</Text>
            <View style={styles.uploadBtnRow}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#7F7FA0', width: '100%' }]}>
                    <Feather name="upload" size={ms(14)} color="#FFFFFF" style={{ marginRight: ms(6) }} />
                    <Text style={styles.actionBtnText}>Browse clips</Text>
                </TouchableOpacity>
            </View>
        </View>
    </>
);

// ====================================================
// VOICE COLLECTOR (Removed Record trigger, Single Button)
// ====================================================
export const VoiceCollector: React.FC<CollectorProps> = ({ palette, isDarkMode }) => (
    <>
        <Text style={[styles.sectionHeader, { color: palette.textDark, marginBottom: vs(12) }]}>
            Load an existing voice memory file.
        </Text>
        <View style={[
            styles.uploadContainer,
            { backgroundColor: isDarkMode ? 'transparent' : '#A2B6C2', borderColor: '#7D9CAE' }
        ]}>
            <View style={[styles.uploadInnerIcon, { backgroundColor: palette.iconBack }]}>
                <Feather name="mic" size={ms(28)} color="#7D9CAE" />
            </View>
            <Text style={[styles.uploadTitle, { color: isDarkMode ? '#7D9CAE' : '#FFFFFF' }]}>Add a voice note</Text>
            <Text style={[styles.uploadSub, { color: isDarkMode ? '#A0A0A0' : '#FFFFFF' }]}>MP3, WAV, M4A · Max 30 mins</Text>
            <View style={styles.uploadBtnRow}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#5F7A8B', width: '100%' }]}>
                    <Feather name="upload" size={ms(14)} color="#FFFFFF" style={{ marginRight: ms(6) }} />
                    <Text style={styles.actionBtnText}>Load audio file</Text>
                </TouchableOpacity>
            </View>
        </View>
    </>
);

const styles = StyleSheet.create({
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
        borderStyle: 'dashed',
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
        width: '100%', // Ensure explicit width logic for centering
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
    }
});
