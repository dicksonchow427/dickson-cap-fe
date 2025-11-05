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
    <article id={`campaign-card-${campaign.id}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden px-6 pt-2 pb-3" data-testid={`campaign-card-${campaign.id}`}>
      {/* Campaign Header - Corporate Communications Style */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            {/* Corporate Communications Avatar */}
            <div className="w-10 h-10 bg-primary-background rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">CC</span>
            </div>
            <div>
              <p className="text-md font-semibold text-gray-900">{campaign.host}</p>
              <p className="text-sm text-gray-500">{formatDateTime(campaign.datetime)}</p>
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
      <div className="py-4">
        {/* Campaign Title */}
        <h2 className="text-lg font-bold text-primary-background mb-3">{campaign.name}</h2>

        {/* Campaign Message */}
        <div className="mb-3">
          <p className="text-gray-700 text-sm leading-relaxed">
            {campaign.message}
          </p>
        </div>

        {/* Badge Information */}
        <div className="mb-2 py-2 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
            >
              <img
                src={badgeImageInfo.imagePath}
                alt={badgeImageInfo.altText}
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800 text-base">{campaign.badges.name} Badge</p>
            </div>
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="flex items-center justify-start text-base text-gray-600 mt-3">
          <span>{participantCount} participants</span>

        </div>

      </div>
    </article>
  );
};

export default CampaignCard;
