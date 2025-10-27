import React from 'react';
import { Campaign } from '../../types/dashboard';
import { getBadgeColorAlphabetical, createGradientFromColor, getShortName } from '../../constants/badgeColors';

interface CampaignCardProps {
  campaign: Campaign;
  onJoin?: (campaignId: string) => void;
  onLeave?: (campaignId: string) => void;
  onViewDetails?: (campaignId: string) => void;
  isParticipant?: boolean;
  participantCount?: number;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onJoin,
  onLeave,
  onViewDetails,
  isParticipant = false,
  participantCount = 0
}) => {
  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleJoinLeave = () => {
    if (isParticipant && onLeave) {
      onLeave(campaign.id);
    } else if (!isParticipant && onJoin) {
      onJoin(campaign.id);
    }
  };

  return (
    <article id={`campaign-card-${campaign.id}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" data-testid={`campaign-card-${campaign.id}`}>
      {/* Campaign Header - Corporate Communications Style */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Corporate Communications Avatar */}
            <div className="w-10 h-10 bg-[#13426B] rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">CC</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{campaign.host}</h3>
              <p className="text-lg text-gray-500">{formatDateTime(campaign.datetime)}</p>
            </div>
          </div>
          
          {/* Pin Icon */}
          <div className="flex items-center">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Campaign Cover Image - Large Hero Image */}
      {campaign.cover && (
        <div className="relative">
          <img 
            src={`/images/${campaign.cover}`}
            alt={campaign.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              // Fallback to a placeholder image
              e.currentTarget.src = '/images/img_image.png';
            }}
          />
        </div>
      )}

      {/* Campaign Content */}
      <div className="p-4">
        {/* Campaign Title */}
        <h2 className="text-lg font-bold text-[#13426B] mb-3">{campaign.name}</h2>
        
        {/* Campaign Message */}
        <div className="mb-4">
          <p className="text-gray-700 text-lg leading-relaxed">
            {campaign.message}
          </p>
        </div>

        {/* Badge Information */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: createGradientFromColor(getBadgeColorAlphabetical(campaign.badges.name)) }}
            >
              <div className="text-base font-bold text-white">{getShortName(campaign.badges.name)}</div>
            </div>
            <div>
              <p className="font-medium text-gray-800">{campaign.badges.name} Badge</p>
              <p className="text-base text-gray-600">{campaign.badges.type} Campaign</p>
            </div>
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="mb-4 flex items-center justify-between text-lg text-gray-600">
          <span>{participantCount} participants</span>
          <span className={`px-2 py-1 rounded text-base ${
            campaign.badges.type === 'Values' ?'bg-[#13426B]/10 text-[#13426B]' :'bg-green-100 text-green-800'
          }`}>
            {campaign.badges.type}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {campaign.status === 'Active' && (
            <button
              onClick={handleJoinLeave}
              className={`flex-1 py-2 px-4 rounded-lg text-lg font-medium transition-colors ${
                isParticipant
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' :'bg-[#13426B] text-white hover:bg-[#13426B]'
              }`}
            >
              {isParticipant ? 'Leave Campaign' : 'Join Campaign'}
            </button>
          )}
          
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(campaign.id)}
              className="px-4 py-2 text-lg font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default CampaignCard;