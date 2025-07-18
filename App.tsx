
import React, { useEffect, useMemo, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { useAppContext } from './context/AppContext';
import { appData } from './data';

import Card from './components/Card';
import ToggleSwitch from './components/ToggleSwitch';
import Modal from './components/Modal';
import { DynamicIcon, GlobeAltIcon, SunIcon, MoonIcon, ChevronLeftIcon, ChevronRightIcon, EnvelopeIcon, PhoneIcon, WhatsAppIcon, FacebookIcon, InstagramIcon, MapPinIcon } from './components/Icons';
import type { CountryID, PlatformID, ContentPost, AIPost } from './types';

// Main App Component
const App = () => {
  const { isDarkMode, language } = useAppContext();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [isDarkMode, language]);

  const [modalState, setModalState] = React.useState<{ isOpen: boolean; day: number; dayOfWeek: number; month: number }>({ isOpen: false, day: 0, dayOfWeek: 0, month: 6 });
  
  const openModal = (day: number, dayOfWeek: number, month: number) => {
    setModalState({ isOpen: true, day, dayOfWeek, month });
  };

  return (
    <div className="text-foreground min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <main className="mt-12">
          <AnimatedSection>
            <UserBehaviorSection />
          </AnimatedSection>
          <AnimatedSection>
            <AgricultureSection />
          </AnimatedSection>
          <AnimatedSection>
            <ContentCalendar openModal={openModal} />
          </AnimatedSection>
        </main>
        <Footer />
      </div>
      <CalendarModal 
        modalState={modalState} 
        setModalState={setModalState}
      />
    </div>
  );
};

// --- Sub Components ---

const AnimatedSection = ({ children }: { children: React.ReactNode }) => {
    const [isVisible, setVisible] = React.useState(false);
    const domRef = React.useRef<HTMLDivElement>(null);
  
    React.useEffect(() => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      });
      const currentRef = domRef.current;
      if (currentRef) {
        observer.observe(currentRef);
      }
      return () => {
        if(currentRef) observer.unobserve(currentRef);
      };
    }, []);
  
    return (
      <section ref={domRef} className={`transition-opacity duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {children}
      </section>
    );
  };

const Header = () => {
  const { t, isDarkMode, setIsDarkMode, language, setLanguage } = useAppContext();
  return (
    <header className="relative">
      <div className="absolute top-0 right-0 flex items-center gap-x-6 gap-y-2 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <SunIcon className="w-5 h-5 text-yellow-400" />
          <ToggleSwitch id="dark-mode-toggle" checked={isDarkMode} onChange={setIsDarkMode} />
          <MoonIcon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <GlobeAltIcon className="w-5 h-5" />
          <span>EN</span>
          <ToggleSwitch id="language-toggle" checked={language === 'ar'} onChange={(checked) => setLanguage(checked ? 'ar' : 'en')} />
          <span>AR</span>
        </div>
      </div>
      
      <div className="flex justify-center items-center gap-8 pt-8">
        <img src="./brandi-logo.png" alt="Brandi Digital Marketing Agency Logo" className="h-16 md:h-20 object-contain"/>
        <img src="./seedtech-logo.png" alt="Seedtech Logo" className="h-16 md:h-20 object-contain"/>
      </div>

      <div className="text-center pt-8 md:pt-12">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-2 gradient-text">
          {t('mainTitle')}
        </h1>
        <p className="text-md md:text-lg text-muted-foreground">{t('mainSubtitle')}</p>
      </div>

      <AnimatedSection>
        <div className="mt-8 flex justify-center">
            <img 
                src="./main-image.png" 
                alt="A 3D isometric illustration of a content calendar team working underground beneath a thriving farm" 
                className="rounded-2xl shadow-large max-w-full md:max-w-3xl w-full object-cover"
            />
        </div>
      </AnimatedSection>
      
      <Navigation />
    </header>
  );
};

const Navigation = () => {
    const { country, setCountry, platformFilter, setPlatformFilter, t } = useAppContext();
    const countries: CountryID[] = ['sudan', 'oman', 'uganda'];
    const platforms: PlatformID[] = ['all', 'facebook', 'tiktok', 'instagram', 'linkedin', 'youtube', 'whatsapp'];

    const getCountryIcon = (countryId: CountryID) => {
        switch (countryId) {
            case 'sudan': return 'SudanFlagIcon';
            case 'oman': return 'OmanFlagIcon';
            case 'uganda': return 'UgandaFlagIcon';
            default: return '';
        }
    };

    return (
        <Card className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Countries">
                    {countries.map(c => (
                        <button
                            key={c}
                            onClick={() => setCountry(c)}
                            role="tab"
                            aria-selected={country === c}
                            className={`flex items-center gap-2 text-md font-semibold py-2 px-4 rounded-md transition-all duration-300 transform hover:-translate-y-0.5
                            ${country === c 
                                ? 'bg-primary text-primary-foreground shadow-md' 
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                        >
                            <DynamicIcon name={getCountryIcon(c)} className="w-5 h-5 rounded-sm" />
                            <span>{t(c)}</span>
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Platforms">
                    {platforms.map(p => (
                        <button
                            key={p}
                            onClick={() => setPlatformFilter(p)}
                            className={`capitalize text-sm font-semibold py-1.5 px-4 rounded-full transition-all duration-200 border-2
                            ${platformFilter === p 
                                ? 'bg-primary/20 text-primary-foreground border-primary' 
                                : 'bg-transparent text-muted-foreground border-transparent hover:border-primary/50'}`}
                        >
                            {p === 'all' ? t(p) : p}
                        </button>
                    ))}
                </div>
            </div>
        </Card>
    );
};

const UserBehaviorSection = () => {
    const { country, t } = useAppContext();
    const data = appData[country].behavior;
  
    return (
      <section className="my-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-heading mb-2 gradient-text">{t('sectionTitleBehavior')}</h2>
          <p className="max-w-3xl mx-auto text-muted-foreground">{t('behaviorIntro')}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-bold font-heading text-center mb-6 text-card-foreground">{t('peakTimesTitle')}</h3>
            <div className="space-y-4">
              {data.peakTimes.map(pt => (
                <div key={pt.time} className="flex items-center bg-background/50 dark:bg-background/50 p-3 rounded-lg">
                  <DynamicIcon name={pt.icon} className="w-8 h-8 mr-4 text-primary" />
                  <div>
                    <p className="font-bold text-lg">{pt.time}</p>
                    <p className="text-sm text-muted-foreground">{pt.platforms}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-xl font-bold font-heading text-center mb-6 text-card-foreground">{t('engagingContentTitle')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              {data.engagingContent.map(c => (
                <div key={c.nameKey} className="p-3 bg-background/50 dark:bg-background/50 rounded-lg flex flex-col items-center justify-center">
                  <DynamicIcon name={c.icon} className="w-8 h-8 mb-2 text-primary" />
                  <p className="font-semibold text-sm text-muted-foreground">{t(c.nameKey)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    );
};
  
const AgricultureSection = () => {
    const { country, t } = useAppContext();
    const data = appData[country].agriculture;
    const [activeTopic, setActiveTopic] = React.useState(0);
  
    return (
      <section className="my-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-heading mb-2 gradient-text">{t('sectionTitleAgri')}</h2>
          <p className="max-w-3xl mx-auto text-muted-foreground">{t(`agriIntro_${country}`)}</p>
        </div>
        <Card>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold font-heading mb-4">{t('agriTopicsTitle')}</h3>
              <p className="text-muted-foreground mb-6">{t('agriTopicsSubtitle')}</p>
              <div className="flex flex-wrap gap-3 mb-6">
                {data.topics.map((topic, index) => (
                  <button key={topic.titleKey} onClick={() => setActiveTopic(index)} className={`text-sm font-semibold py-2 px-4 rounded-full transition-colors duration-200 ${activeTopic === index ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {t(topic.titleKey)}
                  </button>
                ))}
              </div>
              <div className="p-4 bg-background/50 dark:bg-background/50 rounded-lg min-h-[100px]">
                {t(data.topics[activeTopic].descriptionKey)}
              </div>
            </div>
            <div className="lg:border-l lg:border-border lg:pl-8">
              <h3 className="text-xl font-bold font-heading mb-4">{t('agriPlatformsTitle')}</h3>
              <div className="space-y-4">
                {data.platforms.map(p => (
                  <div key={p.name} className="flex items-start">
                    <DynamicIcon name={p.icon} className="w-7 h-7 mr-3 mt-1 text-primary" />
                    <div>
                      <p className="font-bold">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{t(p.descriptionKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>
    );
};

const ContentCalendar = ({ openModal }: { openModal: (day: number, dayOfWeek: number, month: number) => void }) => {
    const { country, t } = useAppContext();
    const [currentDate, setCurrentDate] = React.useState(new Date(2025, 6, 1)); // Start in July 2025
  
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    const handleMonthNav = (dir: 'prev' | 'next') => {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(prev.getMonth() + (dir === 'prev' ? -1 : 1));
        return newDate;
      });
    };

    const countryCalendarData = appData[country].calendar;
    const weekdays = t('weekdays');
    const months = t('months');
    
    const getCountryIcon = (countryId: CountryID) => {
        switch (countryId) {
            case 'sudan': return 'SudanFlagIcon';
            case 'oman': return 'OmanFlagIcon';
            case 'uganda': return 'UgandaFlagIcon';
            default: return '';
        }
    };

    return (
      <section className="my-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-heading mb-2 gradient-text">{t('sectionTitleCalendar')}</h2>
          <p className="max-w-3xl mx-auto text-muted-foreground flex justify-center items-center gap-2">{t('calendarIntro', { country: t(country) as string })} <DynamicIcon name={getCountryIcon(country)} className="w-5 h-5 rounded-sm" /></p>
        </div>
        <Card>
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => handleMonthNav('prev')} className="p-2 rounded-full hover:bg-secondary transition-colors"><ChevronLeftIcon className="w-6 h-6" /></button>
            <h3 className="text-xl font-bold font-heading">{Array.isArray(months) ? months[month] : ''} {year}</h3>
            <button onClick={() => handleMonthNav('next')} className="p-2 rounded-full hover:bg-secondary transition-colors"><ChevronRightIcon className="w-6 h-6" /></button>
          </div>
          <div className="grid grid-cols-7 text-center font-bold text-muted-foreground mb-4">
            {Array.isArray(weekdays) && weekdays.map(day => <div key={day}>{day.slice(0, 3)}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="h-24 rounded-lg"></div>)}
            {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
              const day = dayIndex + 1;
              const postDate = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const hasPost = Object.values(countryCalendarData).some(val => Array.isArray(val) && val.some(post => (post as ContentPost).date === postDate));

              return (
                <div key={day} onClick={() => openModal(day, new Date(year, month, day).getDay(), month)} className={`h-24 p-2 border border-border rounded-lg cursor-pointer transition-all duration-300 bg-background/20 hover:border-primary hover:bg-background/50`}>
                  <span className="font-semibold">{day}</span>
                  {hasPost && <div className="mx-auto mt-2 w-2 h-2 rounded-full bg-primary"></div>}
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    );
};

interface CalendarModalProps {
  modalState: { isOpen: boolean; day: number; dayOfWeek: number; month: number };
  setModalState: React.Dispatch<React.SetStateAction<{ isOpen: boolean; day: number; dayOfWeek: number; month: number }>>;
}


const CalendarModal = ({ modalState, setModalState }: CalendarModalProps) => {
    const { country, platformFilter, t } = useAppContext();
    const { isOpen, day, dayOfWeek, month } = modalState;
    const [aiContent, setAiContent] = React.useState<AIPost[]>([]);
    const [isLoadingAI, setIsLoadingAI] = React.useState(false);
    const [aiError, setAiError] = React.useState<string | null>(null);
    const [aiInstructions, setAiInstructions] = React.useState<string>('');
    
    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);

    useEffect(() => {
        if (isOpen) {
            setAiContent([]);
            setIsLoadingAI(false);
            setAiError(null);
            setAiInstructions('');
        }
    }, [isOpen]);

    const handleGenerateClick = useCallback(async () => {
        setIsLoadingAI(true);
        setAiError(null);
        setAiContent([]);
        
        const { day, month } = modalState;
        const months = t('months');
        const monthName = Array.isArray(months) ? months[month] : '';
        const date = `${monthName} ${day}`;
        const platform = platformFilter === 'all' ? 'various social media platforms' : platformFilter;

        const basePrompt = `You are an expert social media strategist for Seedtech, an agricultural technology company. Your audience is farmers and agricultural professionals in ${t(country) as string}.

    Generate 2 creative and culturally relevant social media post ideas for ${platform} to be published on ${date}.

    The tone should be professional yet engaging, and align with Seedtech's mission to improve food security and empower farmers through technology and quality seeds.`;

        const instructionsPrompt = aiInstructions ? `\n\nPlease also follow these specific instructions: "${aiInstructions}"` : '';

        const prompt = `${basePrompt}${instructionsPrompt}\n\nProvide a short, catchy title and a detailed description for each post.`;

        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: 'A short, catchy title for the social media post.'
                    },
                    description: {
                        type: Type.STRING,
                        description: 'A detailed description of the post content, including call to action if any.'
                    }
                },
                required: ['title', 'description']
            }
        };

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });

            const generatedText = response.text.trim();
            if (generatedText) {
                const parsedContent = JSON.parse(generatedText);
                setAiContent(parsedContent);
            } else {
                 setAiError(t('modalNoContent') as string);
            }
        } catch (error) {
            console.error("AI Generation Error:", error);
            setAiError("Sorry, we couldn't generate ideas right now. Please try again later.");
        } finally {
            setIsLoadingAI(false);
        }
    }, [ai, modalState, platformFilter, country, t, aiInstructions]);

    if (!isOpen) return null;

    const months = t('months');
    const monthName = Array.isArray(months) ? months[month] : '';
    const countryCalendarData = appData[country].calendar;

    const renderPlatformPosts = (platformKey: PlatformID, platformName: string, postsArray: ContentPost[], style: { base: string, border: string, text: string, name: string }) => {
        if (!postsArray) return null;
        const postDate = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const postsForThisDay = postsArray.filter(post => post.date === postDate);
        
        if ((platformFilter === 'all' || platformFilter === platformKey) && postsForThisDay.length > 0) {
            return (
                <div>
                    <h4 className={`font-bold font-heading mt-4 mb-2 ${style.name}`}>{t('modalSuggestedPosts', { platform: platformName })}</h4>
                    {postsForThisDay.map((item, index) => (
                        <div key={index} className={`p-3 rounded-lg border mb-2 ${style.base} ${style.border}`}>
                            <h5 className={`font-semibold ${style.text}`}>{item.title}</h5>
                            <p className="text-sm opacity-80 text-card-foreground">{item.description}</p>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };
    
    return (
        <Modal isOpen={isOpen} onClose={() => setModalState({ ...modalState, isOpen: false })} title={t('modalTitle', { month: monthName, day: String(day) }) as string}>
            { (countryCalendarData.activePeriods[dayOfWeek] || []).length > 0 &&
                <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <h4 className="font-bold text-primary font-heading">{t('modalActiveHours')}</h4>
                    <p>{(countryCalendarData.activePeriods[dayOfWeek] || []).join(', ')}</p>
                </div>
            }
            {renderPlatformPosts('facebook', 'Facebook', countryCalendarData.facebookPosts, { base: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', name: 'text-blue-400' })}
            {renderPlatformPosts('tiktok', 'TikTok', countryCalendarData.tiktokPosts, { base: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', name: 'text-red-400' })}
            {renderPlatformPosts('instagram', 'Instagram', countryCalendarData.instagramPosts, { base: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', name: 'text-pink-400' })}
            {renderPlatformPosts('linkedin', 'LinkedIn', countryCalendarData.linkedinPosts, { base: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-400', name: 'text-sky-400' })}
            {renderPlatformPosts('youtube', 'YouTube', countryCalendarData.youtubePosts, { base: 'bg-rose-600/10', border: 'border-rose-600/30', text: 'text-rose-400', name: 'text-rose-400' })}
            {renderPlatformPosts('whatsapp', 'WhatsApp', countryCalendarData.whatsappPosts, { base: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', name: 'text-emerald-400' })}

            <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-lg font-bold font-heading mb-3 gradient-text w-fit">
                    ✨ AI Creative Ideas
                </h4>
                <div className="mb-4">
                    <label htmlFor="ai-instructions" className="block text-sm font-medium text-muted-foreground mb-2">
                        Add instructions for the AI (optional)
                    </label>
                    <textarea
                        id="ai-instructions"
                        rows={3}
                        className="w-full p-2 rounded-lg bg-secondary border border-border focus:ring-2 focus:ring-ring focus:border-ring transition-colors duration-200 placeholder:text-muted-foreground"
                        placeholder="e.g., 'Focus on tomato seeds for small gardens' or 'Create a post in a quiz format'"
                        value={aiInstructions}
                        onChange={(e) => setAiInstructions(e.target.value)}
                        disabled={isLoadingAI}
                    />
                </div>
                
                <div className="flex justify-end items-center mb-4">
                    <button
                        onClick={handleGenerateClick}
                        disabled={isLoadingAI}
                        className="btn-gradient flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <DynamicIcon name="SparklesIcon" className="w-5 h-5" />
                        {isLoadingAI ? "Generating..." : "Generate with AI"}
                    </button>
                </div>

                {isLoadingAI && <div className="text-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div><p className="mt-2 text-muted-foreground">Generating creative ideas...</p></div>}
                {aiError && <p className="text-center text-red-500 dark:text-red-400">{aiError}</p>}
                {aiContent.length > 0 && (
                    <div className="space-y-3">
                        {aiContent.map((item, index) => (
                            <div key={index} className="p-3 rounded-lg border bg-secondary border-primary/30">
                                <h5 className="font-semibold text-primary">{item.title}</h5>
                                <p className="text-sm opacity-90 text-secondary-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

const Footer = () => {
    const { t } = useAppContext();
    return (
        <footer className="text-center mt-16 pt-8 border-t border-border/50">
            <p className="text-muted-foreground mb-6">{t('footerPreparedBy')}</p>
            
            <div className="max-w-4xl mx-auto text-sm text-muted-foreground space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-5 h-5"/>
                        <a href="mailto:care@branddi.co.site" className="hover:text-primary transition-colors">care@branddi.co.site</a>
                    </div>
                    <div className="flex items-center gap-2">
                        <PhoneIcon className="w-5 h-5"/>
                        <a href="tel:+905433400087" className="hover:text-primary transition-colors">+90 543 340 00 87</a>
                    </div>
                     <div className="flex items-center gap-2">
                         <WhatsAppIcon className="w-5 h-5"/>
                         <a href="https://wa.me/905433400087" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+90 543 340 00 87</a>
                         <span className="mx-1">|</span>
                         <a href="https://wa.me/249963777777" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+249 963 777 777</a>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2 px-4">
                    <MapPinIcon className="w-5 h-5 flex-shrink-0"/>
                    <span className="text-center">Çamlık, Sevin Sokağı No:2-14, 34774 Ümraniye/İstanbul</span>
                </div>
            </div>

            <div className="flex justify-center gap-6 mt-8">
                <a href="https://www.facebook.com/profile.php?id=100046358752051" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-[#1877F2] transition-colors">
                    <FacebookIcon className="w-7 h-7"/>
                </a>
                <a href="https://www.instagram.com/brandi.adv/#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-[#E4405F] transition-colors">
                    <InstagramIcon className="w-7 h-7"/>
                </a>
            </div>
        </footer>
    );
};

export default App;
