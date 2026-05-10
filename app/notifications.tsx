import { FONTS } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { NotificationHeader } from '@/components/NotificationHeader';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms, vs } from 'react-native-size-matters';

const NOTIFICATIONS = [
    {
        id: '1',
        title: 'New AI insight for Margaret',
        time: 'Just now',
        description: 'Based on 3 recent memories, the AI noticed that Margaret often mentioned gardening during difficult times. Tap to explore.',
        actionLabel: 'Explore insight',
        iconType: 'sparkle',
        iconLib: 'MaterialCommunityIcons',
        iconName: 'star-four-points-outline',
        accentColor: '#8EA281', // Sage green
    },
    {
        id: '2',
        title: "Margaret's birthday",
        time: '1h ago',
        description: "Today would have been Margaret's 81st birthday. Her archive holds 24 memories waiting to be revisited.",
        actionLabel: 'Visit archive',
        iconType: 'birthday',
        iconLib: 'MaterialCommunityIcons',
        iconName: 'cake-variant',
        accentColor: '#9994B3', // Soft purple
    },
    {
        id: '3',
        title: 'Memory saved to vault',
        time: 'Yesterday',
        description: '"Summer in Portland, 1962" has been added to Margaret\'s archive and indexed for AI reference.',
        actionLabel: 'View in vault',
        iconType: 'memory',
        iconLib: 'Feather',
        iconName: 'camera',
        accentColor: '#8BA4B4', // Soft slate blue
    },
    {
        id: '4',
        title: 'James added a memory',
        time: '2d ago',
        description: "James Mitchell uploaded a voice recording titled \"Dad's favourite joke\" to Robert's archive.",
        actionLabel: 'Listen',
        iconType: 'family',
        iconLib: 'Feather',
        iconName: 'heart',
        accentColor: '#99A896', // Soft green-grey
    }
];

const CATEGORIES = ['All', 'AI', 'Memory', 'Family'];

export default function NotificationsScreen() {
    const colors = useAppTheme();
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();
    const [activeCat, setActiveCat] = useState('All');

    // Extract custom geometry overrides precisely from the user reference screenshots
    const dynamicStyles = {
        scaffold: isDarkMode ? '#1A1A1A' : '#F9F9F9',
        backCircle: isDarkMode ? '#2E2E33' : '#E2E3E5',
        pillActiveBg: isDarkMode ? '#474554' : '#8EA281',
        pillActiveText: '#FFFFFF',
        pillInactiveBg: isDarkMode ? '#2E2E33' : '#E5EAEF',
        pillInactiveText: isDarkMode ? '#9C9BA6' : '#646E78',
        cardBg: isDarkMode ? '#4A4856' : '#E5E8E1', // The exact Purple and Sage tints
        titleText: isDarkMode ? '#8EA281' : '#2D2C39', // Sage Title in Dark, Dark Grey in Light
        secondaryText: isDarkMode ? '#B0AFC5' : '#6B767F',
        actionText: isDarkMode ? '#A2B498' : '#2D2C39',
        btnTrashBg: isDarkMode ? 'rgba(255, 59, 48, 0.15)' : 'rgba(255, 59, 48, 0.08)',
        trashIcon: '#FF453A',
    };

    const renderIcon = (notif: typeof NOTIFICATIONS[0]) => {
        const size = ms(20);
        const color = '#FFFFFF';

        if (notif.iconLib === 'MaterialCommunityIcons') {
            return <MaterialCommunityIcons name={notif.iconName as any} size={size} color={color} />;
        }
        return <Feather name={notif.iconName as any} size={size} color={color} />;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.scaffold }]}>
            {/* Navigation Header Architecture Substituted with Core Component */}
            <NotificationHeader />

            {/* Category Classification Bar */}
            <View style={styles.catContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
                    {CATEGORIES.map(cat => {
                        const isActive = activeCat === cat;
                        return (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setActiveCat(cat)}
                                style={[
                                    styles.catPill,
                                    { backgroundColor: isActive ? dynamicStyles.pillActiveBg : dynamicStyles.pillInactiveBg }
                                ]}
                            >
                                <Text style={[
                                    styles.catText,
                                    { color: isActive ? dynamicStyles.pillActiveText : dynamicStyles.pillInactiveText }
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Notification Transaction Log */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {NOTIFICATIONS.map(item => (
                    <View
                        key={item.id}
                        style={[styles.card, { backgroundColor: dynamicStyles.cardBg }]}
                    >
                        {/* Top Header Row of Card */}
                        <View style={styles.cardTop}>
                            <View style={styles.cardLabelBox}>
                                <View style={[styles.iconBox, { backgroundColor: item.accentColor }]}>
                                    {renderIcon(item)}
                                </View>
                                <View style={styles.titleCluster}>
                                    <View style={styles.headerFlex}>
                                        <Text style={[styles.cardTitle, { color: dynamicStyles.titleText }]}>{item.title}</Text>
                                        <Text style={[styles.timeText, { color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }]}>{item.time}</Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity style={[styles.closeBtn, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' }]}>
                                <Ionicons name="close" size={ms(16)} color={isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)'} />
                            </TouchableOpacity>
                        </View>

                        {/* Description Body */}
                        <Text style={[styles.cardDesc, { color: dynamicStyles.secondaryText }]}>
                            {item.description}
                        </Text>

                        {/* Explicit Call to Action Link */}
                        <TouchableOpacity style={styles.actionBtn}>
                            <Text style={[styles.actionLabel, { color: dynamicStyles.actionText }]}>{item.actionLabel}</Text>
                            <Feather name="chevron-right" size={ms(14)} color={dynamicStyles.actionText} style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Guarding spacer for systemic tab bar containment */}
                <View style={{ height: vs(60) }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    catContainer: {
        paddingVertical: vs(12),
    },
    catList: {
        paddingHorizontal: ms(20),
        gap: ms(10),
    },
    catPill: {
        paddingHorizontal: ms(24),
        paddingVertical: vs(8),
        borderRadius: ms(20),
    },
    catText: {
        fontFamily: FONTS.sans,
        fontSize: ms(12), // Scaled down
        fontWeight: '500',
    },
    scroll: {
        flex: 1,
    },
    content: {
        paddingHorizontal: ms(20),
        paddingVertical: vs(10),
        gap: vs(16),
    },
    card: {
        borderRadius: ms(20),
        padding: ms(16), // Compacting internal container volume
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardLabelBox: {
        flexDirection: 'row',
        flex: 1,
    },
    iconBox: {
        width: ms(44),
        height: ms(44),
        borderRadius: ms(14),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    titleCluster: {
        flex: 1,
        paddingTop: vs(2),
    },
    headerFlex: {
        flex: 1,
    },
    cardTitle: {
        fontFamily: FONTS.serif,
        fontSize: ms(14), // Secondary compact locking
        fontWeight: '600',
        marginBottom: vs(2),
    },
    timeText: {
        fontFamily: FONTS.sans,
        fontSize: ms(9), // Secondary compact locking
        marginBottom: vs(4), // Compacting text gap
    },
    closeBtn: {
        width: ms(24),
        height: ms(24),
        borderRadius: ms(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: ms(8),
    },
    cardDesc: {
        fontFamily: FONTS.sans,
        fontSize: ms(11), // Micro compression
        lineHeight: vs(15), // Adjusted line height rhythm
        marginTop: vs(2),
        marginBottom: vs(10), // Compacting gap above link
        paddingLeft: ms(56),
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: ms(56),
    },
    actionLabel: {
        fontFamily: FONTS.sans,
        fontSize: ms(11), // Micro compression matching body
        fontWeight: '500',
    }
});
