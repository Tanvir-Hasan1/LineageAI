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
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms, vs } from 'react-native-size-matters';

const IMAGES = {
    lake: require('@/assets/images/dashboard/lake.png'),
    wedding: require('@/assets/images/dashboard/wedding.png'),
    coast: require('@/assets/images/dashboard/coast.png'),
    birthday: require('@/assets/images/dashboard/birthday.png'),
};

type VaultItem = {
    id: string;
    title: string;
    author: string;
    date: string;
    description: string;
    type: 'Photo' | 'Video' | 'Journal' | 'Voice';
    image?: any;
    tags: string[];
    bgColor?: string;
    darkBgColor?: string;
    duration?: string; // Newly unlocked field for Voice playback
};

const VAULT_DATA: VaultItem[] = [
    {
        id: '1',
        title: 'Summer at Lake Geneva',
        author: 'Margaret Mitchell',
        date: 'August 14, 1978',
        description: 'The whole family gathered at the lake house. Mom made her famous lemonade and Dad fell asleep in the hammock before noon...',
        type: 'Photo',
        image: IMAGES.lake,
        tags: ['#Family', '#Summer', '#Lake'],
        bgColor: '#E6E7DF',
        darkBgColor: '#1C1C19',
    },
    {
        id: '2',
        title: "Margaret's Wedding Day",
        author: 'Margaret Mitchell',
        date: 'June 4, 1967',
        description: 'She wore grandmother\'s pearls and carried wildflowers from the garden. Everyone said the ceremony felt like a dream.',
        type: 'Photo',
        image: IMAGES.wedding,
        tags: ['#Wedding', '#Love', '#Family'],
        bgColor: '#E6E7DF',
        darkBgColor: '#1C1C19',
    },
    {
        id: '3',
        title: "Mom Singing in the Kitchen",
        author: 'Margaret Mitchell',
        date: 'December 24, 1994',
        description: 'A recording from Christmas 1994. She always sang while cooking. We didn\'t know we were capturing something we\'d treasure...',
        type: 'Voice',
        duration: '2:34',
        tags: ['#Voice', '#Christmas', '#Home'],
        bgColor: '#E4E8EB', // Derived from User Reference
        darkBgColor: '#242729',
    },
    {
        id: '4',
        title: 'Morning at the Oregon Coast',
        author: 'Robert Mitchell',
        date: 'July 2, 1983',
        description: 'Dad always said the ocean helped him think. He brought us here every summer. The drive took five hours but felt like fiv...',
        type: 'Video',
        image: IMAGES.coast,
        tags: ['#Oregon', '#Ocean', '#Summer'],
        bgColor: '#E5E2EE',
        darkBgColor: '#3E3D47',
    },
    {
        id: '5',
        title: "Sarah's 7th Birthday",
        author: 'Margaret Mitchell',
        date: 'April 5, 1991',
        description: 'Mom baked three layers of chocolate cake and somehow lit all the candles before the wind blew them out. The whole neighb...',
        type: 'Video',
        image: IMAGES.birthday,
        tags: ['#Birthday', '#Family', '#Childhood'],
        bgColor: '#E5E2EE',
        darkBgColor: '#3E3D47',
    },
    {
        id: '6',
        title: "Dad's Recipe for Life",
        author: 'Robert Mitchell',
        date: 'December 12, 2001',
        description: '"Work hard, rest often, love always. And never, ever rush a good meal." — Written in Robert\'s journal...',
        type: 'Journal',
        tags: ['#Journal', '#Wisdom', '#Legacy'],
        bgColor: '#EAE8E4',
        darkBgColor: '#222220',
    }
];

export default function MemoryVaultScreen() {
    const colors = useAppTheme();
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Photos', 'Videos', 'Notes', 'Voice'];
    const quickTags = ['#Family', '#Summer', '#Lake', '#Wedding', '#Love'];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: colors.textDark }]}>Memory Vault</Text>
                    <Text style={[styles.subtitle, { color: colors.textMuted }]}>6 memories preserved</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.iconBtn, { borderColor: colors.border }]}
                    onPress={() => router.push('/notifications')}
                >
                    <Feather name="bell" size={ms(20)} color={colors.textMuted} />
                </TouchableOpacity>
            </View>

            {/* Scrollable Content Region */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            >
                {/* Moved Search Bar inside Scroll */}
                <View style={styles.searchSection}>
                    <View style={[styles.searchBox, { backgroundColor: '#EBEAE3' }]}>
                        <Feather name="search" size={ms(18)} color="#8A8D84" style={{ marginRight: ms(10) }} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search memories..."
                            placeholderTextColor="#8A8D84"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Moved Filters Group inside Scroll */}
                <View style={styles.filterArea}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollGap}>
                        {categories.map(cat => {
                            const isAct = activeCategory === cat;
                            return (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => setActiveCategory(cat)}
                                    style={[
                                        styles.catBadge,
                                        { backgroundColor: isAct ? colors.primaryAlt : '#E4E5DE' }
                                    ]}
                                >
                                    <Text style={[styles.catText, { color: isAct ? '#FFF' : '#8A8D84' }]}>{cat}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.scrollGap, { marginTop: vs(12) }]}>
                        {quickTags.map(tag => (
                            <TouchableOpacity key={tag} style={styles.tagOutline}>
                                <Text style={[styles.tagOutlineText, { color: '#7A9BA7' }]}>{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                {VAULT_DATA.map(item => (
                    <View key={item.id} style={[styles.memoryCard, { backgroundColor: isDarkMode ? item.darkBgColor : item.bgColor }]}>
                        {item.image && (
                            <Image source={item.image} style={styles.cardHero} />
                        )}
                        <View style={styles.cardContent}>
                            <View style={styles.topRow}>
                                {/* Enhanced Conditional Rendering for Audio/Document Layout */}
                                {!item.image && (
                                    <View style={[
                                        styles.iconCircle, 
                                        { 
                                            backgroundColor: isDarkMode ? '#4A5560' : '#A6B4BD', // Derived from provided color palette
                                            borderRadius: ms(16), // As seen in sample
                                            width: ms(48), // Enlarged to properly anchor the taller row
                                            height: ms(48)
                                        }
                                    ]}>
                                        <Feather 
                                            name={item.type === 'Voice' ? 'mic' : 'file-text'} 
                                            size={ms(24)} 
                                            color="#FFF" 
                                        />
                                    </View>
                                )}
                                <View style={{ flex: 1, marginLeft: !item.image ? ms(12) : 0 }}>
                                    <Text style={[styles.cardTitle, { color: isDarkMode ? '#8EA281' : colors.textDark }]}>{item.title}</Text>
                                    <Text style={[styles.cardMeta, { color: colors.textMuted }]}>
                                        {item.author} · {item.date}
                                    </Text>
                                    
                                    {/* Sub-Row specific to Voice content execution */}
                                    {item.duration && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: vs(6) }}>
                                            <Feather name="play" size={ms(16)} color="#8A8AA8" />
                                            <Text style={{ color: '#8A8AA8', fontSize: ms(14), marginLeft: ms(4), fontFamily: FONTS.sans }}>
                                                {item.duration}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <View style={[
                                    styles.typePill, 
                                    { 
                                        backgroundColor: isDarkMode ? '#8EA281' : (item.type === 'Voice' || item.type === 'Journal' ? '#A2B5C1' : 'rgba(0,0,0,0.15)'), 
                                        borderRadius: ms(12) 
                                    }
                                ]}>
                                    <Text style={styles.typeText}>{item.type}</Text>
                                </View>
                            </View>

                            <Text style={[styles.cardDesc, { color: isDarkMode ? '#A1A1A1' : '#5B605B', marginTop: vs(8) }]} numberOfLines={3}>
                                {item.description}
                            </Text>

                            <View style={[styles.tagRow, { marginTop: vs(8) }]}>
                                {item.tags.map(t => (
                                    <View 
                                        key={t} 
                                        style={[
                                            styles.cardTag, 
                                            { 
                                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#E2E7EA',
                                                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#B7C5CE',
                                                borderWidth: 1,
                                                borderRadius: ms(20) 
                                            }
                                        ]}
                                    >
                                        <Text style={[styles.cardTagText, { color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#8398A9' }]}>{t}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                ))}

                {/* Inline Submit Action integrated at the bottom of the feed */}
                <View style={styles.fabContainer}>
                    <TouchableOpacity
                        style={[styles.fab, { backgroundColor: '#9FA0BA' }]}
                        activeOpacity={0.8}
                        onPress={() => router.push('/add-memory')}
                    >
                        <Feather name="plus" size={ms(20)} color="#FFFFFF" style={{ marginRight: ms(6) }} />
                        <Text style={styles.fabText}>Add Memory</Text>
                    </TouchableOpacity>
                </View>

                {/* Space buffer for bottom navigation */}
                <View style={{ height: vs(120) }} />
            </ScrollView>

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
    searchSection: {
        paddingHorizontal: ms(20),
        marginBottom: vs(16),
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: vs(44),
        borderRadius: ms(10),
        paddingHorizontal: ms(12),
    },
    searchInput: {
        flex: 1,
        fontFamily: FONTS.sans,
        fontSize: ms(14),
        color: '#333',
    },
    filterArea: {
        marginBottom: vs(20),
    },
    scrollGap: {
        paddingHorizontal: ms(20),
        gap: ms(10),
    },
    catBadge: {
        paddingHorizontal: ms(20),
        paddingVertical: vs(8),
        borderRadius: ms(8),
    },
    catText: {
        fontFamily: FONTS.sans,
        fontWeight: '600',
        fontSize: ms(13),
    },
    tagOutline: {
        paddingHorizontal: ms(14),
        paddingVertical: vs(6),
        borderRadius: ms(20),
        backgroundColor: '#E4EFF5',
    },
    tagOutlineText: {
        fontFamily: FONTS.sans,
        fontSize: ms(12),
        fontWeight: '600',
    },
    listContent: {
        gap: vs(14),
    },
    memoryCard: {
        marginHorizontal: ms(16),
        borderRadius: ms(16),
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardHero: {
        width: '100%',
        height: vs(160),
        resizeMode: 'cover',
    },
    cardContent: {
        padding: ms(12),
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: vs(6),
    },
    cardTitle: {
        fontFamily: FONTS.serif,
        fontSize: ms(15),
        fontWeight: '600',
    },
    cardMeta: {
        fontFamily: FONTS.sans,
        fontSize: ms(10),
        marginTop: vs(2),
    },
    typePill: {
        backgroundColor: 'rgba(0,0,0,0.15)',
        paddingHorizontal: ms(8),
        paddingVertical: vs(2),
        borderRadius: ms(4),
    },
    typeText: {
        color: '#F5F5F5',
        fontSize: ms(10),
        fontWeight: '600',
    },
    cardDesc: {
        fontFamily: FONTS.sans,
        fontSize: ms(12),
        lineHeight: vs(16),
        marginBottom: vs(12),
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(8),
    },
    cardTag: {
        paddingHorizontal: ms(10),
        paddingVertical: vs(4),
    },
    cardTagText: {
        fontSize: ms(10),
        fontWeight: '500',
    },
    iconCircle: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabContainer: {
        width: '100%',
        alignItems: 'flex-end',
        paddingHorizontal: ms(20),
        marginTop: vs(8),
    },
    fab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(12),
        paddingHorizontal: ms(20),
        borderRadius: ms(25),
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    fabText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: ms(14),
        fontFamily: FONTS.sans,
    }
});
