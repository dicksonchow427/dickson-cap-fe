import React from 'react';

interface UserProfileProps {
  name: string;
  title: string;
  avatar: string;
  onRecognizeClick: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  title,
  avatar,
  onRecognizeClick
}) => {
  return (
    <div id="user-profile-card" className="bg-white rounded-lg p-6 shadow-sm" data-testid="user-profile-widget">
      <div id="user-profile-content" className="space-y-4" data-testid="user-profile-content-wrapper">
        <div id="user-profile-info" className="flex items-center space-x-3" data-testid="user-profile-info-section">
          <div id="user-avatar-container" className="relative" data-testid="user-avatar-wrapper">
            <img
              id="user-profile-avatar"
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-full object-cover"
              data-testid="user-profile-avatar-image"
            />
          </div>
          <div id="user-details" data-testid="user-profile-details">
            <h3 id="user-profile-name" className="text-lg font-medium text-gray-900" data-testid="user-profile-name-text">{name}</h3>
            <p id="user-profile-title" className="text-base text-gray-500" data-testid="user-profile-title-text">{title}</p>
          </div>
        </div>

        <button
          id="recognize-colleagues-button"
          onClick={onRecognizeClick}
          className="w-full bg-primary-background text-white text-base font-semibold py-4 px-6 rounded-full flex items-center justify-center space-x-2 hover:bg-primary-background transition-colors min-h-[44px]"
          data-testid="recognize-colleagues-action-button"
        >
          <img
            id="recognize-button-icon"
            src="/images/img_group.svg"
            alt=""
            className="w-4 h-4"
            data-testid="recognize-button-icon-image"
          />
          <span id="recognize-button-text" data-testid="recognize-button-text-label">Recognise Colleagues!</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
