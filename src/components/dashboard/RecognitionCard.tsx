import React, { useState } from 'react';
import { Recognition } from '../../types/dashboard';
import { getBadgeColorAlphabetical, createGradientFromColor, getShortName } from '../../constants/badgeColors';

interface RecognitionCardProps {
  recognition: Recognition;
  onLike: (recognitionId: string) => void;
  onRecognize?: (userId: string) => void;
  onFilterByBadge?: (badgeName: string) => void;
  showActions?: boolean;
  campaignContext?: any;
}

const RecognitionCard: React.FC<RecognitionCardProps> = ({ 
  recognition, 
  onLike, 
  onRecognize,
  onFilterByBadge,
  showActions = true,
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

  const badgeColor = getBadgeColorAlphabetical(recognition.badges?.name || '');

  return (
    <article id={`recognition-card-${recognition.id}`} className="bg-white rounded-lg shadow-sm p-4" data-testid={`recognition-card-${recognition.id}`}>
      {/* Recognition Card */}
      <div id={`recognition-card-content-${recognition.id}`} className="relative bg-white rounded-lg p-4 pt-16" data-testid={`recognition-card-content-${recognition.id}`}>
        {/* User Avatars */}
        <div id={`recognition-avatars-${recognition.id}`} className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center justify-between w-40" data-testid={`recognition-avatars-section-${recognition.id}`}>
          <button
            onClick={() => onFilterByBadge?.(recognition.giver)}
            className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-lg hover:opacity-80 transition-opacity cursor-pointer"
            data-testid={`recognition-giver-avatar-button-${recognition.id}`}
          >
            <img
              id={`recognition-giver-avatar-${recognition.id}`}
              src={giverPhoto}
              alt={recognition.giver}
              className="w-14 h-14 rounded-full object-cover"
              data-testid={`recognition-giver-avatar-${recognition.id}`}
            />
          </button>
          <img
            id={`recognition-arrow-icon-${recognition.id}`}
            src="/images/img_group_blue_gray_600.svg"
            alt="Recognize"
            className="w-5 h-5"
            data-testid={`recognition-arrow-icon-${recognition.id}`}
          />
          <button
            onClick={() => onFilterByBadge?.(recognition.receiver)}
            className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-lg hover:opacity-80 transition-opacity cursor-pointer"
            data-testid={`recognition-receiver-avatar-button-${recognition.id}`}
          >
            <img
              id={`recognition-receiver-avatar-${recognition.id}`}
              src={receiverPhoto}
              alt={recognition.receiver}
              className="w-14 h-14 rounded-full object-cover"
              data-testid={`recognition-receiver-avatar-${recognition.id}`}
            />
          </button>
        </div>

        {/* Recognition Text */}
        <div id={`recognition-text-section-${recognition.id}`} className="text-center mb-3" data-testid={`recognition-text-wrapper-${recognition.id}`}>
          <p id={`recognition-description-${recognition.id}`} className="text-base text-gray-700" data-testid={`recognition-description-text-${recognition.id}`}>
            <button
              onClick={() => onFilterByBadge?.(recognition.giver)}
              className="font-semibold text-[#13426B] hover:underline transition-colors cursor-pointer"
              data-testid={`recognition-giver-name-button-${recognition.id}`}
            >
              {recognition.giver}
            </button>
            {' appreciated '}
            <button
              onClick={() => onFilterByBadge?.(recognition.receiver)}
              className="font-semibold text-[#13426B] hover:underline transition-colors cursor-pointer"
              data-testid={`recognition-receiver-name-button-${recognition.id}`}
            >
              {recognition.receiver}
            </button>
            {' for '}
            <span className="font-semibold text-[#13426B]">{recognition.badges?.name || recognition.category}</span>
          </p>
        </div>

        {/* Recognition Badge - Updated to match RecognitionModal design */}
        <div id={`recognition-badge-section-${recognition.id}`} className="flex justify-center mb-3" data-testid={`recognition-badge-wrapper-${recognition.id}`}>
          <div 
            id={`recognition-badge-${recognition.id}`}
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-md"
            style={{ 
              backgroundColor: badgeColor,
              '--badge-color': badgeColor
            } as React.CSSProperties}
            data-testid={`recognition-badge-circle-${recognition.id}`}
          >
            <div className="text-base font-bold text-white">{getShortName(recognition.badges?.name || 'Unknown')}</div>
          </div>
        </div>

        {/* Time */}
        <div id={`recognition-time-section-${recognition.id}`} className="text-center mb-3" data-testid={`recognition-time-wrapper-${recognition.id}`}>
          <span id={`recognition-time-text-${recognition.id}`} className="text-base text-gray-500" data-testid={`recognition-time-ago-${recognition.id}`}>{recognition.timeAgo}</span>
        </div>

        {/* Message */}
        <div id={`recognition-message-section-${recognition.id}`} className="mb-3" data-testid={`recognition-message-wrapper-${recognition.id}`}>
          <p id={`recognition-message-text-${recognition.id}`} className="text-base text-gray-700 leading-relaxed" data-testid={`recognition-message-content-${recognition.id}`}>{recognition.message}</p>
        </div>

        {/* Likes */}
        <div id={`recognition-likes-section-${recognition.id}`} className="flex items-center space-x-2 mb-3" data-testid={`recognition-likes-wrapper-${recognition.id}`}>
          <img 
            id={`recognition-likes-icon-${recognition.id}`}
            src="/images/img_facebook_like.png" 
            alt="Like"
            className="w-4 h-4"
            data-testid={`recognition-likes-icon-image-${recognition.id}`}
          />
          <span id={`recognition-likes-count-${recognition.id}`} className="text-base text-gray-600" data-testid={`recognition-likes-count-text-${recognition.id}`}>{recognition.likes} likes</span>
        </div>

        {/* Separator */}
        <hr id={`recognition-separator-${recognition.id}`} className="border-gray-200 my-3" data-testid={`recognition-content-separator-${recognition.id}`} />

        {/* Campaign Context Section - NEW */}
        {campaignContext && (
          <div id={`campaign-context-${recognition.id}`} className="mb-3 p-3 bg-[#13426B]/10 rounded-lg border-l-4 border-[#13426B]" data-testid={`campaign-context-${recognition.id}`}>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#13426B] rounded-full flex items-center justify-center">
                <span className="text-white text-base font-bold">C</span>
              </div>
              <div>
                <p className="text-base font-semibold text-[#13426B]">{campaignContext.name}</p>
                <p className="text-base text-[#13426B]">Hosted by {campaignContext.host}</p>
                {campaignContext.participantCount && (
                  <p className="text-base text-[#13426B]">{campaignContext.participantCount} participants</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div id={`recognition-actions-section-${recognition.id}`} className="flex justify-between items-center mt-3" data-testid={`recognition-actions-wrapper-${recognition.id}`}>
            <button
              id={`recognition-like-button-${recognition.id}`}
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                recognition.isLiked 
                  ? 'text-[#13426B] hover:bg-[#13426B]/10' :'text-gray-600 hover:bg-gray-50'
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
            
            <button 
              id={`recognition-recognize-too-button-${recognition.id}`} 
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 transition-colors" 
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
              <span id={`recognition-recognize-too-text-${recognition.id}`} className="text-base" data-testid={`recognition-recognize-too-text-label-${recognition.id}`}>Recognise {recognition.receiver.split(' ')[0]} too</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default RecognitionCard;