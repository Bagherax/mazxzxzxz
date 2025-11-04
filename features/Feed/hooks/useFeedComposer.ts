import { useState, useEffect, useRef, useCallback } from 'react';
import { FeedItem, Ad, PaidAd, LiveTrade, Auction, AiSuggestion, FeedItemData } from '../types';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

type AllAdsType = {
  ads: Ad[];
  paidAds: PaidAd[];
  liveTrades: LiveTrade[];
  auctions: Auction[];
  aiSuggestions: AiSuggestion[];
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const useFeedComposer = (sortOption: string) => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dataCache = useRef<AllAdsType | null>(null);

  const fetchData = useCallback(async (): Promise<AllAdsType | null> => {
    try {
      const [adsRes, paidAdsRes, liveTradesRes, auctionsRes, aiSuggestionsRes] = await Promise.all([
        fetch('/features/Feed/data/masonryAds.json'),
        fetch('/features/Feed/data/paidAds.json'),
        fetch('/features/Feed/data/liveTrades.json'),
        fetch('/features/Feed/data/auctions.json'),
        fetch('/features/Feed/data/aiFeed.json'),
      ]);
      const ads: Ad[] = await adsRes.json();
      const paidAds: PaidAd[] = await paidAdsRes.json();
      const liveTrades: LiveTrade[] = await liveTradesRes.json();
      const auctions: Auction[] = await auctionsRes.json();
      const aiSuggestions: AiSuggestion[] = await aiSuggestionsRes.json();
      return { ads, paidAds, liveTrades, auctions, aiSuggestions };
    } catch (error) {
      console.error("Failed to fetch feed data:", error);
      return null;
    }
  }, []);
  
  const recomposeAndSort = useCallback((data: AllAdsType | null, currentSortOption: string) => {
    if (!data) return [];
    
    const composed: FeedItem[] = [
      ...data.ads.map((item): FeedItem => ({ id: item.id, type: 'ad', data: item })),
      ...data.paidAds.map((item): FeedItem => ({ id: item.id, type: 'paid', data: item })),
      ...data.liveTrades.map((item): FeedItem => ({ id: item.id, type: 'trade', data: item })),
      ...data.auctions.map((item): FeedItem => ({ id: item.id, type: 'auction', data: item })),
      ...data.aiSuggestions.map((item): FeedItem => ({ id: item.id, type: 'ai', data: item })),
    ];
    
    let itemsToSort = shuffleArray(composed);

    const getPrice = (itemData: FeedItemData, sortOrder: 'asc' | 'desc'): number => {
      if ('price' in itemData && typeof itemData.price === 'string') {
        const price = parseFloat(itemData.price);
        if (!isNaN(price)) return price;
      }
      return sortOrder === 'asc' ? Infinity : -1;
    };

    switch (currentSortOption) {
      case 'price_asc':
        itemsToSort.sort((a, b) => getPrice(a.data, 'asc') - getPrice(b.data, 'asc'));
        break;
      case 'price_desc':
        itemsToSort.sort((a, b) => getPrice(b.data, 'desc') - getPrice(a.data, 'desc'));
        break;
      case 'newest':
        itemsToSort.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'popular':
      default:
        // 'popular' uses the default shuffle which is already done.
        break;
    }
    return itemsToSort;
  }, []);

  // Effect for initial load and background refresh setup
  useEffect(() => {
    const initialLoad = async () => {
      const initialData = await fetchData();
      dataCache.current = initialData;
      if (initialData) {
        const initialFeed = recomposeAndSort(initialData, sortOption);
        setFeedItems(initialFeed);
      }
      setIsLoading(false);
    };

    initialLoad();

    const intervalId = setInterval(async () => {
      const newData = await fetchData();
      if (newData) {
        dataCache.current = newData; // Silently update the cache
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, recomposeAndSort]); // This effect should run only once.

  // Effect to apply new sort option using the latest cached data
  useEffect(() => {
    if (isLoading) return; // Avoid running during initial load

    if (dataCache.current) {
      const sortedFeed = recomposeAndSort(dataCache.current, sortOption);
      setFeedItems(sortedFeed);
    }
  }, [sortOption, isLoading, recomposeAndSort]);

  return { feedItems, isLoading };
};

export default useFeedComposer;