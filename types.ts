
export type CountryID = 'sudan' | 'oman' | 'uganda';
export type PlatformID = 'all' | 'facebook' | 'tiktok' | 'instagram' | 'linkedin' | 'youtube' | 'whatsapp';
export type Language = 'en' | 'ar';

interface PlatformData {
    labels: string[];
    data: number[];
    colors: string[];
}

interface PeakTime {
    time: string;
    platforms: string;
    icon: string;
}

interface EngagingContent {
    nameKey: string;
    icon: string;
}

interface BehaviorData {
    peakTimes: PeakTime[];
    engagingContent: EngagingContent[];
}

interface AgriTopic {
    titleKey: string;
    descriptionKey: string;
}

interface AgriPlatform {
    name: string;
    descriptionKey: string;
    icon: string;
}

interface AgricultureData {
    topics: AgriTopic[];
    platforms: AgriPlatform[];
}

export interface ContentPost {
    date: string;
    title: string;
    description: string;
}

interface CalendarData {
    activeDays: number[];
    activePeriods: Record<number, string[]>;
    facebookActiveDays: number[];
    facebookPosts: ContentPost[];
    tiktokActiveDays: number[];
    tiktokPosts: ContentPost[];
    instagramActiveDays: number[];
    instagramPosts: ContentPost[];
    linkedinActiveDays: number[];
    linkedinPosts: ContentPost[];
    youtubeActiveDays: number[];
    youtubePosts: ContentPost[];
    whatsappActiveDays: number[];
    whatsappPosts: ContentPost[];
}

export interface CountryData {
    name: string;
    landscape: {
        penetration: string;
        socialUsers: string;
        keyInsight: string;
        platforms: PlatformData;
    };
    behavior: BehaviorData;
    agriculture: AgricultureData;
    calendar: CalendarData;
}

export type AppData = Record<CountryID, CountryData>;

export type TranslationSet = Record<string, string | string[]>;
export type Translations = Record<Language, TranslationSet>;

export type AIPost = {
    title: string;
    description: string;
};
