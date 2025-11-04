import React, { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ad, AiSuggestion } from '../Feed/types';

interface AdGalleryProps {
  onShowDetails: (ad: Ad) => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const AdGallery: React.FC<AdGalleryProps> = ({ onShowDetails }) => {
    const [galleryAds, setGalleryAds] = useState<(Ad | AiSuggestion)[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const autoplayIntervalRef = useRef<number | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchGalleryAds = async () => {
            try {
                const [paidAdsRes, aiSuggestionsRes] = await Promise.all([
                    fetch('/features/Feed/data/paidAds.json'),
                    fetch('/features/Feed/data/aiFeed.json'),
                ]);
                const paidAds: Ad[] = await paidAdsRes.json();
                const aiSuggestions: AiSuggestion[] = await aiSuggestionsRes.json();

                const combinedAds: (Ad | AiSuggestion)[] = [...paidAds, ...aiSuggestions];
                const shuffledAds = shuffleArray(combinedAds);

                setGalleryAds(shuffledAds.slice(0, 7));
            } catch (error) {
                console.error("Failed to fetch gallery ads:", error);
            }
        };
        fetchGalleryAds();
    }, []);

    const stopAutoplay = useCallback(() => {
        if (autoplayIntervalRef.current) {
            clearInterval(autoplayIntervalRef.current);
            autoplayIntervalRef.current = null;
        }
    }, []);

    const handleNextClick = useCallback(() => {
        if (galleryAds.length === 0) return;
        setDirection(1);
        setCurrentImageIndex((prev) => (prev + 1) % galleryAds.length);
    }, [galleryAds.length]);

    const handlePrevClick = useCallback(() => {
        if (galleryAds.length === 0) return;
        setDirection(-1);
        setCurrentImageIndex((prev) => (prev - 1 + galleryAds.length) % galleryAds.length);
    }, [galleryAds.length]);
    
    const startAutoplay = useCallback(() => {
        stopAutoplay();
        autoplayIntervalRef.current = window.setInterval(() => {
            handleNextClick();
        }, 3000); // 3-second interval
    }, [stopAutoplay, handleNextClick]);

    useEffect(() => {
        if (galleryAds.length > 0) {
            startAutoplay();
        }
        return () => stopAutoplay();
    }, [galleryAds.length, startAutoplay, stopAutoplay]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
        }),
    };

    if (galleryAds.length === 0) {
        return <div className="w-full h-[40vh] max-h-[400px] bg-gray-200 dark:bg-gray-800 animate-pulse"></div>;
    }
    
    const ad = galleryAds[currentImageIndex];

    return (
        <>
            <div
                ref={wrapperRef}
                className="w-full h-[40vh] max-h-[400px] relative z-30 overflow-hidden"
                onMouseEnter={stopAutoplay}
                onMouseLeave={startAutoplay}
            >
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentImageIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        className="absolute w-full h-full"
                        onClick={'imageUrls' in ad ? () => onShowDetails(ad as Ad) : undefined}
                        style={{ cursor: 'imageUrls' in ad ? 'pointer' : 'default' }}
                    >
                        {'imageUrls' in ad && ad.imageUrls.length > 0 ? (
                             <>
                                <img src={ad.imageUrls[0]} alt={ad.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-lg drop-shadow-md">{ad.title}</h3>
                                </div>
                            </>
                        ) : (
                             <div className="w-full h-full bg-gradient-to-br from-sky-500 to-purple-600 flex flex-col items-center justify-center p-8 text-center text-white">
                                <h3 className="text-2xl font-bold drop-shadow-md">{ad.title}</h3>
                                {'description' in ad && <p className="mt-2 text-sm opacity-90 drop-shadow-sm">{ad.description}</p>}
                                <span className="mt-4 text-xs font-bold uppercase bg-white/20 px-2 py-1 rounded-full">Media Booster</span>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-3">
                    {galleryAds.length > 1 && (
                        <button
                          className="bg-sky-500/70 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm hover:bg-sky-500 transition-colors"
                          onClick={(e) => { e.stopPropagation(); handlePrevClick(); }}
                          aria-label="Previous ad"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                    )}
                    {galleryAds.map((_, index) => (
                        <div
                            key={index}
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/50'}`}
                        />
                    ))}
                    {galleryAds.length > 1 && (
                         <button
                           className="bg-sky-500/70 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm hover:bg-sky-500 transition-colors"
                           onClick={(e) => { e.stopPropagation(); handleNextClick(); }}
                           aria-label="Next ad"
                         >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                         </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdGallery;
