export interface Ad {
  id: string;
  title: string;
  price: string;
  imageUrls: string[];
  description: string;
  location: string;
  category: string;
  user: {
    name: string;
    avatarUrl: string;
  };
}

export interface PaidAd extends Ad {
  sponsored: boolean;
}

export interface LiveTrade {
  id: string;
  itemName: string;
  price: string;
  timestamp: string;
  buyer: string;
  seller: string;
}

export interface Auction {
  id: string;
  title: string;
  price: string;
  imageUrls: string[];
  description: string;
  location: string;
  category: string;
  timeLeft: string;
  user: {
    name: string;
    avatarUrl: string;
  };
}

export interface AiSuggestion {
  id: string;
  title: string;
  description: string;
  reason: string;
  category: string;
}

export type FeedItemData = Ad | PaidAd | LiveTrade | Auction | AiSuggestion;

export interface FeedItem {
  id: string;
  type: 'ad' | 'paid' | 'trade' | 'auction' | 'ai';
  data: FeedItemData;
}