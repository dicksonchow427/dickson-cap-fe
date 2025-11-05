import React, { useState } from 'react';
import { Recognition } from '../../types/dashboard';
import { getBadgeImage } from '../../utils/badgeImages';

interface RecognitionCardProps {
  recognition: Recognition;
  // eslint-disable-next-line no-unused-vars
  onLike: (id: string) => void;
  // eslint-disable-next-line no-unused-vars
  onRecognize?: (id: string) => void;
  showActions?: boolean;
  currentUserId?: string;
  campaignContext?: {
    name: string;
    host: string;
    participantCount?: number;
  };
}

const RecognitionCard: React.FC<RecognitionCardProps> = ({
  recognition,
  onLike,
  onRecognize,
  showActions = true,
  currentUserId,
  campaignContext
}) => {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking || !onLike) return;

    setIsLiking(true);
    try {
      await onLike(recognition.id);
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleRecognize = () => {
    if (onRecognize && recognition.receiverId) {
      onRecognize(recognition.receiverId);
    }
  };

  // Use real user photos if available, fallback to default
  const giverPhoto = recognition.giverPhoto
    ? `/images/${recognition.giverPhoto}`
    : "/images/img_image_8.png";

  const receiverPhoto = recognition.receiverPhoto
    ? `/images/${recognition.receiverPhoto}`
    : "/images/img_image_7.png";

  const badgeImageInfo = getBadgeImage(recognition.badges?.name || recognition.category);

  return (
    <article id={`recognition-card-${recognition.id}`} className="bg-white rounded-lg shadow-sm p-6 pb-3" data-testid={`recognition-card-${recognition.id}`}>
      {/* Recognition Card */}
      <div id={`recognition-card-content-${recognition.id}`} className="relative bg-white rounded-lg pb-0 p-6 pt-20" data-testid={`recognition-card-content-${recognition.id}`}>
        {/* User Avatars */}
        <div id={`recognition-avatars-${recognition.id}`} className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center justify-between w-[70%]" data-testid={`recognition-avatars-section-${recognition.id}`}>
          <div
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            data-testid={`recognition-giver-avatar-button-${recognition.id}`}
          >
            <img
              id={`recognition-giver-avatar-${recognition.id}`}
              src={giverPhoto}
              alt={recognition.giver}
              className="w-20 h-20 rounded-full object-cover"
              data-testid={`recognition-giver-avatar-${recognition.id}`}
            />
          </div>
          <div className="h-20 flex items-center">
            <img
              id={`recognition-arrow-icon-${recognition.id}`}
              src="/images/img_group_blue_gray_600.svg"
              alt="Recognize"
              className="w-5 h-5"
              data-testid={`recognition-arrow-icon-${recognition.id}`}
            />
          </div>
          {/* Recognition Badge - Updated to use images */}
          <div id={`recognition-badge-section-${recognition.id}`} className="flex justify-center" data-testid={`recognition-badge-wrapper-${recognition.id}`}>
            <img
              src={badgeImageInfo.imagePath}
              alt={badgeImageInfo.altText}
              className="w-20 h-20 object-contain"
            />
          </div>
          <div className="h-20 flex items-center">
            <img
              id={`recognition-arrow-icon-${recognition.id}`}
              src="/images/img_group_blue_gray_600.svg"
              alt="Recognize"
              className="w-5 h-5"
              data-testid={`recognition-arrow-icon-${recognition.id}`}
            />
          </div>
          <div
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            data-testid={`recognition-receiver-avatar-button-${recognition.id}`}
          >
            <img
              id={`recognition-receiver-avatar-${recognition.id}`}
              src={receiverPhoto}
              alt={recognition.receiver}
              className="w-20 h-20 rounded-full object-cover"
              data-testid={`recognition-receiver-avatar-${recognition.id}`}
            />
          </div>
        </div>

        {/* Recognition Text */}
        <div id={`recognition-text-section-${recognition.id}`} className="text-center mb-5" data-testid={`recognition-text-wrapper-${recognition.id}`}>
          <p id={`recognition-description-${recognition.id}`} className="text-base text-gray-700" data-testid={`recognition-description-text-${recognition.id}`}>
            <span className="font-semibold text-primary-background" data-testid={`recognition-giver-name-button-${recognition.id}`}>
              {recognition.giver}
            </span>
            {' appreciated '}
            <span className="font-semibold text-primary-background" data-testid={`recognition-receiver-name-button-${recognition.id}`}>
              {recognition.receiver}
            </span>
            {' for '}
            <span className="font-semibold text-primary-background">{recognition.badges?.name || recognition.category}</span>
          </p>
        </div>

        {/* Message */}
        <div id={`recognition-message-section-${recognition.id}`} className="mb-5" data-testid={`recognition-message-wrapper-${recognition.id}`}>
          <p id={`recognition-message-text-${recognition.id}`} className="text-center text-base text-gray-700 leading-relaxed" data-testid={`recognition-message-content-${recognition.id}`}>{recognition.message}</p>
        </div>
        <div className="flex items-center justify-between space-x-2">
          {/* Likes */}
          <div id={`recognition-likes-section-${recognition.id}`} className="flex items-center space-x-2 px-3 py-3" data-testid={`recognition-likes-wrapper-${recognition.id}`}>
            <img
              id={`recognition-likes-icon-${recognition.id}`}
              src="/images/img_facebook_like.png"
              alt="Like"
              className="w-4 h-4"
              data-testid={`recognition-likes-icon-image-${recognition.id}`}
            />
            <span id={`recognition-likes-count-${recognition.id}`} className="text-base text-gray-600" data-testid={`recognition-likes-count-text-${recognition.id}`}>{recognition.likes} likes</span>
          </div>
          {/* Time */}
          <div id={`recognition-time-section-${recognition.id}`} className="text-center py-3 px-3" data-testid={`recognition-time-wrapper-${recognition.id}`}>
            <span id={`recognition-time-text-${recognition.id}`} className="text-base text-gray-500" data-testid={`recognition-time-ago-${recognition.id}`}>{recognition.timeAgo}</span>
          </div>

        </div>

        {/* Separator */}
        <hr id={`recognition-separator-${recognition.id}`} className="border-gray-200 my-2" data-testid={`recognition-content-separator-${recognition.id}`} />

        {/* Campaign Context Section - NEW */}
        {campaignContext && (
          <div id={`campaign-context-${recognition.id}`} className="mb-3 p-3 bg-primary-background/10 rounded-lg border-l-4 border-primary-background" data-testid={`campaign-context-${recognition.id}`}>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-background rounded-full flex items-center justify-center">
                <span className="text-white text-base font-bold">C</span>
              </div>
              <div>
                <p className="text-base font-semibold text-primary-background">{campaignContext.name}</p>
                <p className="text-base text-primary-background">Hosted by {campaignContext.host}</p>
                {campaignContext.participantCount && (
                  <p className="text-base text-primary-background">{campaignContext.participantCount} participants</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div id={`recognition-actions-section-${recognition.id}`} className="flex justify-between items-center" data-testid={`recognition-actions-wrapper-${recognition.id}`}>
            <button
              id={`recognition-like-button-${recognition.id}`}
              type="button"
              onClick={handleLike}
              className={`flex items-center space-x-2 py-3 px-3 rounded-md transition-colors min-h-[44px] ${recognition.isLiked
                ? 'text-primary-background hover:bg-primary-background/10' : 'text-gray-600 hover:bg-gray-50'
                } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
              data-testid={`recognition-like-action-button-${recognition.id}`}
            >
              <img
                id={`recognition-like-icon-${recognition.id}`}
                src={recognition.isLiked ? "/images/img_mask_group.png" : "/images/img_vector_black_900.svg"}
                alt="Like"
                className="w-4 h-4"
                data-testid={`recognition-like-button-icon-${recognition.id}`}
              />
              <span id={`recognition-like-text-${recognition.id}`} className="text-base" data-testid={`recognition-like-button-text-${recognition.id}`}>{recognition.isLiked ? 'Liked' : 'Like'}</span>
            </button>

            {recognition.receiverId !== currentUserId && (
              <button
                id={`recognition-recognize-too-button-${recognition.id}`}
                type="button"
                className="flex items-center space-x-2 px-3 py-3 rounded-md text-gray-600 hover:bg-gray-50 transition-colors min-h-[44px]"
                data-testid={`recognition-recognize-too-button-${recognition.id}`}
                onClick={handleRecognize}
              >
                <img
                  id={`recognition-recognize-too-icon-${recognition.id}`}
                  src="/images/img_group_blue_gray_600.svg"
                  alt="Recognize"
                  className="w-4 h-4"
                  data-testid={`recognition-recognize-too-icon-image-${recognition.id}`}
                />
                <span id={`recognition-recognize-too-text-${recognition.id}`} className="text-base" data-testid={`recognition-recognize-too-text-label-${recognition.id}`}>Recognise {recognition.receiver?.split(' ')[0] || recognition.receiver} too</span>
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default RecognitionCard;
