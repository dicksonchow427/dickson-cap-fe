import React from 'react';
import { Campaign } from '../../types/dashboard';
import { getBadgeImage } from '../../utils/badgeImages';

interface CampaignCardProps {
  campaign: Campaign;
  participantCount?: number;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  participantCount = 0
}) => {
  const badgeImageInfo = getBadgeImage(campaign.badges.name);
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


  return (
    <article id={`campaign-card-${campaign.id}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" data-testid={`campaign-card-${campaign.id}`}>
      {/* Campaign Header - Corporate Communications Style */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            {/* Corporate Communications Avatar */}
            <div className="w-10 h-10 bg-primary-background rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">CC</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{campaign.host}</h3>
              <p className="text-lg text-gray-500">{formatDateTime(campaign.datetime)}</p>
            </div>
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
        <h2 className="text-lg font-bold text-primary-background mb-3">{campaign.name}</h2>

        {/* Campaign Message */}
        <div className="mb-2">
          <p className="text-gray-700 text-lg leading-relaxed">
            {campaign.message}
          </p>
        </div>

        {/* Badge Information */}
        <div className="mb-2 p-1 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center bg-white border-2 border-gray-200"
            >
              <img
                src={badgeImageInfo.imagePath}
                alt={badgeImageInfo.altText}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  // Fallback to a default image if the badge image fails to load
                  e.currentTarget.src = '/images/badges/Wellness.png';
                }}
              />
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">{campaign.badges.name} Badge</p>
            </div>
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="mb-2 flex items-center justify-between text-lg text-gray-600">
          <span>{participantCount} participants</span>
          <span className={`px-2 py-1 rounded text-base ${campaign.badges.type === 'Values' ? 'bg-primary-background/10 text-primary-background' : 'bg-green-100 text-green-800'
            }`}>
            {campaign.badges.type}
          </span>
        </div>

      </div>
    </article>
  );
};

export default CampaignCard;
