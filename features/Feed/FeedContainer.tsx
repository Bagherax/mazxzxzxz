import React, { useState, useMemo } from 'react';
import useFeedComposer from './hooks/useFeedComposer';
import FeedCard from './components/FeedCard';
import { Ad, PaidAd, Auction, FeedItem } from './types';

interface FeedContainerProps {
  adSize: 'small' | 'medium' | 'large';
  sortOption: string;
  onShowDetails: (ad: Ad | PaidAd | Auction) => void;
  onShare: (ad: Ad | PaidAd | Auction) => void;
}

const FeedContainer: React.FC<FeedContainerProps> = ({ adSize, sortOption, onShowDetails, onShare }) => {
  const { feedItems: sortedFeedItems, isLoading } = useFeedComposer(sortOption);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    setActiveCardId(prevId => (prevId === id ? null : id));
  };

  const composedFeed = useMemo(() => {
    if (isLoading || !sortedFeedItems) return [];
    
    const normalItems = sortedFeedItems.filter(item => item.type !== 'paid' && item.type !== 'ai');
    const interstitialAds = sortedFeedItems.filter(item => item.type === 'paid' || item.type === 'ai').sort(() => 0.5 - Math.random());

    const newFeed: FeedItem[] = [];
    let interstitialIndex = 0;
    let normalAdCount = 0;

    normalItems.forEach(item => {
        newFeed.push(item);
        // An "ad" is a normal ad. After 8 of these, we insert a promotional one.
        if (item.type === 'ad') {
            normalAdCount++;
            if (normalAdCount % 8 === 0 && interstitialIndex < interstitialAds.length) {
                newFeed.push(interstitialAds[interstitialIndex]);
                interstitialIndex++;
            }
        }
    });

    return newFeed;
  }, [sortedFeedItems, isLoading]);

  const feedCSS = `
    /* Base grid styles */
    .feed-grid {
      column-gap: 0;
    }
    .feed-grid > * {
      break-inside: avoid;
      margin-bottom: 0;
    }

    /* Small size -> more columns for higher density */
    .ad-size-small .feed-grid { column-count: 2; }
    @media (min-width: 768px) { .ad-size-small .feed-grid { column-count: 3; } }
    @media (min-width: 1024px) { .ad-size-small .feed-grid { column-count: 4; } }
    @media (min-width: 1280px) { .ad-size-small .feed-grid { column-count: 5; } }

    /* Medium size -> default columns */
    .ad-size-medium .feed-grid { column-count: 1; }
    @media (min-width: 768px) { .ad-size-medium .feed-grid { column-count: 2; } }
    @media (min-width: 1024px) { .ad-size-medium .feed-grid { column-count: 3; } }

    /* Large size -> fewer columns, larger items */
    .ad-size-large .feed-grid { column-count: 1; }
    @media (min-width: 768px) { .ad-size-large .feed-grid { column-count: 1; } }
    
    /* --- ADDITIONS FOR LARGE SIZE ANIMATION & SIZING --- */
    .ad-card-image-container, .ad-card-text-container,
    .trade-card-container, .auction-card-container, .ai-card-container {
      transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .ad-size-large .ad-card-image-container {
      height: 16rem; /* double h-32 */
    }
    .ad-size-large .ad-card-text-container {
      height: 12rem; /* double h-24 */
    }
    .ad-size-large .trade-card-container,
    .ad-size-large .auction-card-container,
    .ad-size-large .ai-card-container {
      height: 28rem; /* double h-56 */
    }

    /* Active Card Styles */
    .ad-card-active, .auction-card-active {
        border: 1px solid rgb(var(--maz-primary));
    }

    .auction-card-active .relative.p-4 {
        opacity: 0; /* Hide base content to show expanded */
    }
  `;

  if (isLoading) {
    return <div className="text-center text-maz-text-secondary py-10">Loading Feed...</div>;
  }

  return (
    <div className={`ad-size-${adSize}`}>
      <style>{feedCSS}</style>
      
      <div className="feed-grid">
        {composedFeed.map(item => (
          <FeedCard
            key={item.id}
            item={item}
            isActive={activeCardId === item.id}
            onClick={() => handleCardClick(item.id)}
            onShowDetails={onShowDetails}
            onShare={onShare}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedContainer;
