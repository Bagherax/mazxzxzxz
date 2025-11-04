import React from 'react';
import { FeedItem, Ad, PaidAd, Auction, LiveTrade, AiSuggestion } from '../types';
import AdCard from './AdCard';
import PaidAdCard from './PaidAdCard';
import TradeCard from './TradeCard';
import AuctionCard from './AuctionCard';
import AiCard from './AiCard';

interface FeedCardProps {
  item: FeedItem;
  isActive: boolean;
  onClick: () => void;
  onShowDetails: (ad: Ad | PaidAd | Auction) => void;
  onShare: (ad: Ad | PaidAd | Auction) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ item, isActive, onClick, onShowDetails, onShare }) => {
  const { type, data } = item;

  const renderCard = () => {
    switch (type) {
      case 'ad':
        return <AdCard data={data as Ad} isActive={isActive} onClick={onClick} onShowDetails={() => onShowDetails(data as Ad)} onShare={() => onShare(data as Ad)} />;
      case 'paid':
        return <PaidAdCard data={data as PaidAd} isActive={isActive} onClick={onClick} onShowDetails={() => onShowDetails(data as PaidAd)} onShare={() => onShare(data as PaidAd)} />;
      case 'trade':
        return <TradeCard data={data as LiveTrade} isActive={isActive} onClick={onClick} />;
      case 'auction':
        return <AuctionCard data={data as Auction} isActive={isActive} onClick={onClick} onShowDetails={() => onShowDetails(data as Auction)} />;
      case 'ai':
        return <AiCard data={data as AiSuggestion} isActive={isActive} onClick={onClick} />;
      default:
        return null;
    }
  };

  return <div className="w-full h-fit">{renderCard()}</div>;
};

export default FeedCard;
