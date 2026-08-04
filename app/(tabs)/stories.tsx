import { FONTS, LightTheme } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { api } from '@/services/api';
import { resolveMediaUrl } from '@/utils/image';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';

const FALLBACK_IMAGES = [
    require('@/assets/images/dashboard/lake.png'),
    require('@/assets/images/dashboard/wedding.png'),
    require('@/assets/images/dashboard/coast.png'),
    require('@/assets/images/dashboard/robert.png'),
];

const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
};

const formatCategory = (mem: any) => {
    if (mem.tags && mem.tags.length > 0) {
        const tag = mem.tags[0].replace(/^#/, '');
        return tag.charAt(0).toUpperCase() + tag.slice(1);
    }
    if (mem.type === 'photo') return 'Photo';
    if (mem.type === 'video') return 'Video';
    if (mem.type === 'voice') return 'Voice';
    return 'Journal';
};

const calcReadTime = (narrative?: string) => {
    const text = narrative || '';
    const words = text.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.ceil(words / 40));
    return `${mins} min read`;
};

export default function StoriesScreen() {
    const colors = useAppTheme();
    const colorScheme = useColorScheme();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const router = useRouter();

    const [memories, setMemories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    const fetchStoriesMemories = useCallback(async () => {
        try {
            const response = await api.get('/memory-vault');
            if (response.success && response.data) {
                let list: any[] = [];
                if (response.data.data && Array.isArray(response.data.data.memories)) {
                    list = response.data.data.memories;
                } else if (Array.isArray(response.data.data)) {
                    list = response.data.data;
                } else if (Array.isArray(response.data.memories)) {
                    list = response.data.memories;
                } else if (Array.isArray(response.data)) {
                    list = response.data;
                }
                setMemories(list);
            }
        } catch (e) {
            console.error('[Stories] Failed to fetch memories:', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchStoriesMemories();
        }, [fetchStoriesMemories])
    );

    // Pick recent photo memory as featured top story
    const featuredPhotoMemory = useMemo(() => {
        if (memories.length === 0) return null;
        const photoMem = memories.find((m: any) => (m.type === 'photo' || m.type === 'video') && m.files && m.files.length > 0);
        return photoMem || null;
    }, [memories]);

    // List items excluding featured memory
    const remainingMemories = useMemo(() => {
        let list = memories;
        if (featuredPhotoMemory) {
            list = memories.filter((m: any) => m.id !== featuredPhotoMemory.id);
        }
        if (activeCategory !== 'All') {
            const catLower = activeCategory.toLowerCase();
            list = list.filter((m: any) => {
                const category = formatCategory(m).toLowerCase();
                const type = (m.type || '').toLowerCase();
                return category.includes(catLower) || type.includes(catLower);
            });
        }
        return list;
    }, [memories, featuredPhotoMemory, activeCategory]);

    const categories = ['All', 'Photos', 'Milestones', 'Ancestry', 'Travel'];

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <StatusBar
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />
            
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerSubtitle}>YOUR ARCHIVE</Text>
                    <Text style={styles.headerTitle}>Stories</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity 
                        style={styles.iconBtn}
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    >
                        <Feather name="search" size={24} color={colors.textDark} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.iconBtn}
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    >
                        <Feather name="filter" size={24} color={colors.textDark} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Featured Story Card */}
                {isLoading ? (
                    <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={colors.primaryAlt || '#8EA281'} />
                    </View>
                ) : featuredPhotoMemory ? (
                    <View style={styles.section}>
                        <TouchableOpacity 
                            activeOpacity={0.9} 
                            style={styles.featuredCard}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.push({
                                    pathname: '/memory/[id]' as any,
                                    params: { id: featuredPhotoMemory.id, fromStories: 'true' }
                                });
                            }}
                        >
                            <Image 
                                source={
                                    featuredPhotoMemory.files?.[0]?.url
                                        ? { uri: resolveMediaUrl(featuredPhotoMemory.files[0].url) }
                                        : FALLBACK_IMAGES[0]
                                } 
                                style={styles.featuredImage} 
                            />
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
                                style={styles.featuredGradient}
                            >
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryText}>{formatCategory(featuredPhotoMemory)}</Text>
                                </View>
                                <Text style={styles.featuredTitle}>{featuredPhotoMemory.title}</Text>
                                <Text style={styles.featuredExcerpt} numberOfLines={2}>
                                    {featuredPhotoMemory.narrative || featuredPhotoMemory.location || 'A preserved family memory.'}
                                </Text>
                                <View style={styles.metaRow}>
                                    <Text style={styles.metaText}>
                                        {featuredPhotoMemory.whoseMemoryIsThis || 'Mine'} · {formatDate(featuredPhotoMemory.date)}
                                    </Text>
                                    <View style={styles.dotSeparator} />
                                    <Feather name="clock" size={12} color="rgba(255,255,255,0.7)" />
                                    <Text style={styles.metaText}>{calcReadTime(featuredPhotoMemory.narrative)}</Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ) : null}

                {/* Filter Tabs / Tags */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.filterTabs}
                >
                    {categories.map((tab) => {
                        const isActive = activeCategory === tab;
                        return (
                            <TouchableOpacity 
                                key={tab} 
                                style={[styles.filterTab, isActive && styles.filterTabActive]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setActiveCategory(tab);
                                }}
                            >
                                <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>{tab}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Story List */}
                <View style={styles.storyList}>
                    {remainingMemories.map((story, idx) => {
                        const isPhotoOrVideo = (story.type === 'photo' || story.type === 'video') && story.files && story.files.length > 0;
                        const isAudio = story.type === 'voice' || story.type === 'audio' || story.type === 'music';
                        const mediaUrl = story.files?.[0]?.url ? resolveMediaUrl(story.files[0].url) : null;

                        return (
                            <TouchableOpacity 
                                key={story.id} 
                                activeOpacity={0.8}
                                style={styles.storyCard}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    router.push({
                                        pathname: '/memory/[id]' as any,
                                        params: { id: story.id, fromStories: 'true' }
                                    });
                                }}
                            >
                                {isPhotoOrVideo && mediaUrl ? (
                                    <Image source={{ uri: mediaUrl }} style={styles.storyThumb} />
                                ) : isAudio ? (
                                    <View style={[styles.storyThumb, styles.iconThumb, { backgroundColor: colorScheme === 'dark' ? '#222B26' : '#E8F2EC' }]}>
                                        <Ionicons name="musical-notes-outline" size={28} color={colorScheme === 'dark' ? '#8EA281' : '#5A754E'} />
                                    </View>
                                ) : (
                                    <View style={[styles.storyThumb, styles.iconThumb, { backgroundColor: colorScheme === 'dark' ? '#282733' : '#EFEBF6' }]}>
                                        <Feather name="file-text" size={26} color={colorScheme === 'dark' ? '#A594D0' : '#6C5896'} />
                                    </View>
                                )}

                                <View style={styles.storyContent}>
                                    <Text style={styles.storyCategory}>{formatCategory(story)}</Text>
                                    <Text style={styles.storyTitle} numberOfLines={2}>{story.title}</Text>
                                    <Text style={styles.storyExcerpt} numberOfLines={2}>
                                        {story.narrative || story.location || 'Preserved family memory.'}
                                    </Text>
                                    <View style={styles.storyMetaRow}>
                                        <Text style={styles.storyMetaText}>{formatDate(story.date)}</Text>
                                        <View style={styles.dotSeparatorDark} />
                                        <Text style={styles.storyMetaText}>{calcReadTime(story.narrative)}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Call to Action */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.ctaBanner}
                    onPress={() => router.push('/add-memory' as any)}
                >
                    <View style={styles.ctaIconWrapper}>
                        <Feather name="edit-3" size={20} color={colors.textMuted} />
                    </View>
                    <View style={styles.ctaContent}>
                        <Text style={styles.ctaTitle}>Draft a New Story</Text>
                        <Text style={styles.ctaSubtitle}>
                            Preserve another piece of your family's history.
                        </Text>
                    </View>
                    <Feather name="chevron-right" size={22} color={colors.textMuted} />
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (colors: typeof LightTheme) => ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '24@ms',
        paddingTop: '16@vs',
        marginBottom: '20@vs',
    },
    headerSubtitle: {
        fontFamily: FONTS.sans,
        fontSize: '11@ms',
        color: colors.accentGreen,
        letterSpacing: 1.2,
        marginBottom: '4@vs',
        textTransform: 'uppercase',
    },
    headerTitle: {
        fontFamily: FONTS.serif,
        fontSize: '36@ms',
        fontWeight: '600',
        color: colors.textDark,
    },
    headerRight: {
        flexDirection: 'row',
        gap: '12@ms',
    },
    iconBtn: {
        width: '40@ms',
        height: '40@ms',
        borderRadius: '20@ms',
        backgroundColor: colors.cardBg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: '90@vs',
    },
    section: {
        paddingHorizontal: '24@ms',
        marginBottom: '24@vs',
    },
    featuredCard: {
        width: '100%',
        height: '340@vs',
        borderRadius: '24@ms',
        overflow: 'hidden',
        backgroundColor: colors.cardBg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    featuredImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    featuredGradient: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: '20@ms',
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: '12@ms',
        paddingVertical: '6@vs',
        borderRadius: '16@ms',
        marginBottom: '12@vs',
    },
    categoryText: {
        fontFamily: FONTS.sans,
        fontSize: '11@ms',
        color: '#FFFFFF',
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    featuredTitle: {
        fontFamily: FONTS.serif,
        fontSize: '28@ms',
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: '8@vs',
        lineHeight: '34@vs',
    },
    featuredExcerpt: {
        fontFamily: FONTS.sans,
        fontSize: '13@ms',
        color: 'rgba(255,255,255,0.85)',
        lineHeight: '20@vs',
        marginBottom: '16@vs',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: '6@ms',
    },
    metaText: {
        fontFamily: FONTS.sans,
        fontSize: '11@ms',
        color: 'rgba(255,255,255,0.7)',
    },
    dotSeparator: {
        width: '4@ms',
        height: '4@ms',
        borderRadius: '2@ms',
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    dotSeparatorDark: {
        width: '3@ms',
        height: '3@ms',
        borderRadius: '1.5@ms',
        backgroundColor: colors.textMuted,
        opacity: 0.5,
    },
    filterTabs: {
        paddingHorizontal: '24@ms',
        paddingBottom: '24@vs',
        gap: '8@ms',
    },
    filterTab: {
        paddingHorizontal: '16@ms',
        paddingVertical: '8@vs',
        borderRadius: '20@ms',
        backgroundColor: colors.cardBg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    filterTabActive: {
        backgroundColor: colors.primaryAlt,
        borderColor: colors.primaryAlt,
    },
    filterTabText: {
        fontFamily: FONTS.sans,
        fontSize: '13@ms',
        color: colors.textDark,
    },
    filterTabTextActive: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    storyList: {
        paddingHorizontal: '24@ms',
        gap: '16@vs',
        marginBottom: '24@vs',
    },
    storyCard: {
        flexDirection: 'row',
        backgroundColor: colors.backgroundAlt,
        borderRadius: '20@ms',
        padding: '12@ms',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    storyThumb: {
        width: '90@ms',
        height: '100@ms',
        borderRadius: '14@ms',
    },
    iconThumb: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    storyContent: {
        flex: 1,
        marginLeft: '14@ms',
        justifyContent: 'center',
    },
    storyCategory: {
        fontFamily: FONTS.sans,
        fontSize: '10@ms',
        color: colors.accentGreen,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: '4@vs',
    },
    storyTitle: {
        fontFamily: FONTS.serif,
        fontSize: '16@ms',
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: '6@vs',
        lineHeight: '22@vs',
    },
    storyExcerpt: {
        fontFamily: FONTS.sans,
        fontSize: '12@ms',
        color: colors.textMuted,
        lineHeight: '18@vs',
        marginBottom: '10@vs',
    },
    storyMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: '6@ms',
    },
    storyMetaText: {
        fontFamily: FONTS.sans,
        fontSize: '11@ms',
        color: colors.textMuted,
    },
    ctaBanner: {
        marginHorizontal: '24@ms',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBg,
        opacity: 0.85,
        borderRadius: '20@ms',
        padding: '16@ms',
        borderWidth: 1,
        borderColor: colors.border,
    },
    ctaIconWrapper: {
        width: '38@ms',
        height: '38@ms',
        borderRadius: '12@ms',
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ctaContent: {
        flex: 1,
        marginLeft: '14@ms',
        gap: '2@vs',
    },
    ctaTitle: {
        fontFamily: FONTS.serif,
        fontSize: '16@ms',
        fontWeight: '600',
        color: colors.textDark,
    },
    ctaSubtitle: {
        fontFamily: FONTS.sans,
        fontSize: '12@ms',
        color: colors.textMuted,
        lineHeight: '16@vs',
    },
});
