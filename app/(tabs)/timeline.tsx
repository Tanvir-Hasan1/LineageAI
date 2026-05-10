import { TimelineDataPoint, TimelineEntry } from '@/components/TimelineEntry';
import { FONTS } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms, vs } from 'react-native-size-matters';

// Asset injection
const IMAGES = {
    lake: require('@/assets/images/dashboard/lake.png'),
    wedding: require('@/assets/images/dashboard/wedding.png'),
    coast: require('@/assets/images/dashboard/coast.png'),
    birthday: require('@/assets/images/dashboard/birthday.png'),
    margaret: require('@/assets/images/dashboard/margaret.png'),
    robert: require('@/assets/images/dashboard/robert.png'),
};

const DATA: TimelineDataPoint[] = [
    {
        id: '1',
        year: '2001',
        type: 'text',
        title: "Dad's Recipe for Life",
        author: 'Robert Mitchell',
        date: 'December 12, 2001',
        content: `"Work hard, rest often, love always. And never, ever rush a good meal." — Written in Robert's journal, found after he passed.`,
        tags: ['#Journal', '#Wisdom', '#Legacy'],
        bgColor: '#E5E4DF',
        darkBgColor: '#242420',
    },
    {
        id: '2',
        year: '1994',
        type: 'audio',
        title: 'Mom Singing in the Kitchen',
        author: 'Margaret Mitchell',
        date: 'December 24, 1994',
        bgColor: '#DFE6EE',
        darkBgColor: '#252B35',
    },
    {
        id: '3',
        year: '1991',
        type: 'image',
        title: "Sarah's 7th Birthday",
        author: 'Margaret Mitchell',
        date: 'April 5, 1991',
        image: IMAGES.birthday,
        bgColor: '#E5E2EE',
        darkBgColor: '#3E3D47', // The exact Purple Dark mode requested
    },
    {
        id: '4',
        year: '1986',
        type: 'image',
        title: 'Morning at the Oregon Coast',
        author: 'Robert Mitchell',
        date: 'July 2, 1983',
        image: IMAGES.coast,
        bgColor: '#E5E2EE',
        darkBgColor: '#3E3D47',
    },
    {
        id: '5',
        year: '1978',
        type: 'image',
        title: 'Summer at Lake Geneva',
        author: 'Margaret Mitchell',
        date: 'August 14, 1978',
        image: IMAGES.lake,
        bgColor: '#E6E7DF',
        darkBgColor: '#1C1C19', // The exact Sage Dark mode requested
    },
    {
        id: '6',
        year: '1967',
        type: 'image',
        title: "Margaret's Wedding Day",
        author: 'Margaret Mitchell',
        date: 'June 4, 1967',
        image: IMAGES.wedding,
        bgColor: '#E6E7DF',
        darkBgColor: '#1C1C19',
    },
];

export default function TimelineScreen() {
    const colors = useAppTheme();
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState('Yours');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Sticky Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: colors.textDark }]}>Life Timeline</Text>
                    <Text style={[styles.subtitle, { color: colors.textMuted }]}>6 events across 6 years</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.iconBtn, { borderColor: colors.border }]}
                    onPress={() => router.push('/notifications')}
                >
                    <Feather name="bell" size={ms(20)} color={colors.textMuted} />
                </TouchableOpacity>
            </View>

            {/* Member Filtering Row */}
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {['Yours', 'Margaret', 'Robert'].map((filter) => {
                        const isActive = activeFilter === filter;
                        return (
                            <TouchableOpacity
                                key={filter}
                                onPress={() => setActiveFilter(filter)}
                                style={[
                                    styles.filterBtn,
                                    {
                                        backgroundColor: isActive ? colors.primaryAlt : colors.cardBg,
                                        borderWidth: isActive ? 0 : 1,
                                        borderColor: colors.border
                                    }
                                ]}
                            >
                                {filter !== 'Yours' && (
                                    <Image
                                        source={filter === 'Margaret' ? IMAGES.margaret : IMAGES.robert}
                                        style={styles.filterAvatar}
                                    />
                                )}
                                <Text style={[
                                    styles.filterText,
                                    { color: isActive ? '#FFFFFF' : colors.textMuted }
                                ]}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Timeline Container */}
            <View style={styles.timelineWrapper}>
                {/* The continuous running line */}
                <View style={[styles.timelineAxis, { backgroundColor: isDarkMode ? '#3E403A' : '#C4D0C8' }]} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentPadding}
                >
                    {DATA.map((item, index) => (
                        <TimelineEntry
                            key={item.id}
                            item={item}
                            index={index}
                            isDarkMode={isDarkMode}
                            colors={colors}
                        />
                    ))}
                    {/* Bottom spacing to guarantee not cutoff by the float tab bar */}
                    <View style={{ height: vs(100) }} />
                </ScrollView>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingVertical: vs(16),
    },
    title: {
        fontFamily: FONTS.serif,
        fontSize: ms(28),
        fontWeight: '700',
    },
    subtitle: {
        fontFamily: FONTS.sans,
        fontSize: ms(13),
        marginTop: vs(2),
    },
    iconBtn: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterScroll: {
        paddingHorizontal: ms(20),
        gap: ms(12),
        paddingBottom: vs(16),
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(16),
        paddingVertical: vs(2),
        borderRadius: ms(20),
    },
    filterAvatar: {
        width: ms(24),
        height: ms(24),
        borderRadius: ms(12),
        marginRight: ms(8),
    },
    filterText: {
        fontFamily: FONTS.sans,
        fontWeight: '600',
        fontSize: ms(13),
    },
    timelineWrapper: {
        flex: 1,
        position: 'relative',
    },
    timelineAxis: {
        position: 'absolute',
        left: ms(30),
        top: 0,
        bottom: 0,
        width: ms(2),
    },
    contentPadding: {
        paddingLeft: ms(45),
        paddingRight: ms(16),
    },
});
