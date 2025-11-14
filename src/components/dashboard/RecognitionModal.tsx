import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User, Badge } from '../../types/dashboard';
import { RecognitionModalState } from '../../types/dashboard';
import { getBadgeImage } from '../../utils/badgeImages';


export interface RecognitionFormData {
  receiverId: string;
  receiverName: string;
  badgeId: string;
  badgeName: string;
  message: string;
  campaign?: string;
}

interface RecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: RecognitionFormData) => Promise<void>;
  currentUserId: string;
  users: User[];
  availableBadges: Badge[];
  isLoading?: boolean;
  preselectedUserId?: string;
}

const RecognitionModal: React.FC<RecognitionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUserId,
  users,
  availableBadges,
  isLoading: externalLoading = false,
  preselectedUserId
}) => {
  const [state, setState] = useState<RecognitionModalState>({
    isOpen: true,
    selectedUser: null,
    selectedBadge: null,
    message: '',
    isLoading: false,
    errors: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Tooltip state (show after 1s, 10px text). Enabled only when text exists
  const [visibleTooltipId, setVisibleTooltipId] = useState<string | null>(null);
  const hoverTimerRef = useRef<number | null>(null);

  const badgeDescriptions: Record<string, string> = useMemo(() => ({
    Integrity: 'Acting with honesty, transparency, and accountability to uphold trust and confidence in everything we do.',
    Excellence: 'Striving for world-class performance through innovation, continuous improvement, and a commitment to quality.',
    Diversity: 'Embracing different perspectives and backgrounds to foster an inclusive and dynamic workplace.',
    Engagement: 'Building strong relationships through open dialogue, collaboration, and responsiveness to stakeholder needs.',
    Collaboration: 'Working together across teams and borders to achieve shared goals and drive collective success.'
  }), []);

  const handleTooltipEnter = (id: string, hasText: boolean) => {
    if (!hasText) return;
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    hoverTimerRef.current = window.setTimeout(() => {
      setVisibleTooltipId(id);
    }, 1000);
  };

  const handleTooltipLeave = () => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setVisibleTooltipId(null);
  };

  // Filter users (exclude current user)
  const availableUsers = useMemo(() => {
    return users.filter(user => user.id !== currentUserId);
  }, [users, currentUserId]);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      // Show all users by default, but limit dropdown to 10 for better UI
      return availableUsers.slice(0, 10);
    }
    return availableUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.division.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10); // Increased limit for search results too
  }, [availableUsers, searchTerm]);


  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setState({
        isOpen: true,
        selectedUser: null,
        selectedBadge: null,
        message: '',
        isLoading: false,
        errors: []
      });
      setSearchTerm('');
      setShowDropdown(false);
    } else {
      // Auto-select first badge if available
      setState(prev => {
        if (availableBadges.length > 0 && !prev.selectedBadge) {
          return { ...prev, selectedBadge: availableBadges[0] };
        }
        return prev;
      });

      // Pre-select user if preselectedUserId is provided
      if (preselectedUserId) {
        const preselectedUser = availableUsers.find(user => user.id === preselectedUserId);
        if (preselectedUser) {
          setState(prev => ({ ...prev, selectedUser: preselectedUser }));
          setSearchTerm(preselectedUser.name);
          setShowDropdown(false);
        }
      }
    }
  }, [isOpen, availableBadges, preselectedUserId, availableUsers]);

  // Form validation
  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!state.selectedUser) {
      errors.push('Please select a recipient');
    }

    if (!state.selectedBadge) {
      errors.push('Please select a badge');
    }

    if (!state.message.trim()) {
      errors.push('Please write an appreciation message');
    } else if (state.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    } else if (state.message.trim().length > 500) {
      errors.push('Message cannot exceed 500 characters');
    }

    return errors;
  };

  // Handle user selection
  const handleUserSelect = (user: User) => {
    setState(prev => ({ ...prev, selectedUser: user }));
    setSearchTerm(user.name);
    setShowDropdown(false);
  };

  // Handle badge selection
  const handleBadgeSelect = (badge: Badge) => {
    setState(prev => ({ ...prev, selectedBadge: badge }));
  };

  // Handle message change with character limit
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setState(prev => ({ ...prev, message: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setState(prev => ({ ...prev, errors: validationErrors }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, errors: [] }));

    try {
      const formData: RecognitionFormData = {
        receiverId: state.selectedUser!.id,
        receiverName: state.selectedUser!.name,
        badgeId: state.selectedBadge!.id,
        badgeName: state.selectedBadge!.name,
        message: state.message.trim(),
        campaign: state.selectedBadge!.type === 'Campaign' ? 'Campaign' : 'Values'
      };

      await onSubmit(formData);
      onClose();
    } catch {
      setState(prev => ({
        ...prev,
        errors: ['Failed to send recognition. Please try again.']
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Handle input focus to open dropdown
  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  // Handle input blur (with delay for dropdown selection)
  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  // Character count and limit
  const characterCount = state.message.length;
  const characterLimit = 500;
  const isCharacterLimitNear = characterCount > 400;

  if (!isOpen) return null;

  const isFormValid = state.selectedUser && state.selectedBadge &&
    state.message.trim().length >= 0 && state.message.trim().length <= 500;

  const isSubmitDisabled = !isFormValid || state.isLoading || externalLoading;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recognition-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-2/3 h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2
              id="recognition-modal-title"
              className="text-xl font-semibold text-gray-900"
            >
              New Appreciation
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Recipient Selection */}
          <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700">
              Select Recipient
            </label>
            <div className="relative z-0">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Search for a colleague..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base focus:ring-2 focus:ring-primary-background focus:border-transparent"
                />
              </div>

              {/* Dropdown */}
              {showDropdown && filteredUsers.length > 0 && (
                <div className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow max-h-48 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleUserSelect(user)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 min-h-[44px]"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={`/images/${user.photo}`}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-base text-gray-900">{user.name}</div>
                          <div className="text-base text-gray-500">{user.division}</div>
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Show indicator if there are more users available */}
                  {(!searchTerm && availableUsers.length > 10) && (
                    <div className="px-4 py-2 text-base text-gray-500 bg-gray-50 border-t border-gray-100">
                      Showing 10 of {availableUsers.length} colleagues. Type to search for specific colleagues.
                    </div>
                  )}

                  {/* Show indicator if search results are limited */}
                  {searchTerm && availableUsers.filter(user =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.division.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length > 10 && (
                      <div className="px-4 py-2 text-base text-gray-500 bg-gray-50 border-t border-gray-100">
                        Showing 10 of {availableUsers.filter(user =>
                          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.division.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length} results. Refine your search for more specific results.
                      </div>
                    )}
                </div>
              )}

              {/* Selected User Display */}
              {state.selectedUser && !showDropdown && (
                <div className="mt-2 flex items-center space-x-3 p-2 bg-primary-background/10 rounded-lg">
                  <img
                    src={`/images/${state.selectedUser.photo}`}
                    alt={state.selectedUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-base text-gray-900">{state.selectedUser.name}</div>
                    <div className="text-base text-gray-500">{state.selectedUser.division}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Badge Selection */}
          <div className="space-y-3">
            <label className="block text-base font-medium text-gray-700">
              Select Recognition Badge
            </label>
            <div className="mx-[15px] space-y-3">
              {/* First row: 5 core value badges */}
              <label className="block text-base font-medium text-gray-700">
                Corporate Value Badge
              </label>
              <div className="grid grid-cols-5 gap-2">
                {availableBadges
                  .filter(b => b.type === 'Values')
                  .sort((a, b) => {
                    // Enforce specific core values order
                    const order = ['Integrity', 'Diversity', 'Excellence', 'Collaboration', 'Engagement'];
                    return order.indexOf(a.name) - order.indexOf(b.name);
                  })
                  .map((badge) => {
                    const isSelected = state.selectedBadge?.id === badge.id;
                    const badgeImageInfo = getBadgeImage(badge.name);
                    const description = badgeDescriptions[badge.name as keyof typeof badgeDescriptions];

                    return (
                      <div key={badge.id} className="relative" onMouseEnter={() => handleTooltipEnter(badge.id, !!description)} onMouseLeave={handleTooltipLeave}>
                        <button
                          type="button"
                          onClick={() => handleBadgeSelect(badge)}
                          className={`
                          w-full p-1 rounded-lg border-2 transition-all duration-200 text-center
                          ${isSelected
                              ? 'border-[#13426B] bg-[#13426B]/10 ring-2 ring-[#13426B] ring-opacity-20' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }
                        `}
                        >
                          <div className="flex flex-col items-center space-y-0.5">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-gray-200">
                              <img
                                src={badgeImageInfo.imagePath}
                                alt={badgeImageInfo.altText}
                                className="w-8 h-8 object-contain"
                              />
                            </div>
                            <div className="flex items-center justify-center">
                              <img
                                src="/images/img_mask_group.png"
                                alt="Trophy"
                                className="w-3 h-3"
                              />
                            </div>
                            <div className="text-sm font-medium text-gray-700 leading-tight">
                              {badge.name}
                            </div>
                          </div>
                        </button>
                        {description && visibleTooltipId === badge.id && (
                          <div className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-black text-white rounded shadow text-[10px] pointer-events-none w-[750px] max-w-[calc(100%-30px)] text-center break-words">
                            {description}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Second row: other campaigns (e.g., Wellness) */}
              <label className="block text-base font-medium text-gray-700">
                Campaign Badge
              </label>
              <div className="grid grid-cols-5 gap-2">
                {availableBadges
                  .filter(b => b.type !== 'Values')
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((badge) => {
                    const isSelected = state.selectedBadge?.id === badge.id;
                    const badgeImageInfo = getBadgeImage(badge.name);
                    const description = badgeDescriptions[badge.name as keyof typeof badgeDescriptions];

                    return (
                      <div key={badge.id} className="relative" onMouseEnter={() => handleTooltipEnter(badge.id, !!description)} onMouseLeave={handleTooltipLeave}>
                        <button
                          type="button"
                          onClick={() => handleBadgeSelect(badge)}
                          className={`
                          w-full p-1 rounded-lg border-2 transition-all duration-200 text-center
                          ${isSelected
                              ? 'border-[#13426B] bg-[#13426B]/10 ring-2 ring-[#13426B] ring-opacity-20' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }
                        `}
                        >
                          <div className="flex flex-col items-center space-y-0.5">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-gray-200">
                              <img
                                src={badgeImageInfo.imagePath}
                                alt={badgeImageInfo.altText}
                                className="w-8 h-8 object-contain"
                              />
                            </div>
                            <div className="flex items-center justify-center">
                              <img
                                src="/images/img_mask_group.png"
                                alt="Trophy"
                                className="w-3 h-3"
                              />
                            </div>
                            <div className="text-sm font-medium text-gray-700 leading-tight">
                              {badge.name}
                            </div>
                          </div>
                        </button>
                        {description && visibleTooltipId === badge.id && (
                          <div className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-black text-white rounded shadow text-[10px] pointer-events-none w-[750px] max-w-[calc(100%-30px)] text-center break-words">
                            {description}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700">
              Appreciation Message
            </label>
            <div className="relative">
              <textarea
                value={state.message}
                onChange={handleMessageChange}
                placeholder="Write your appreciation message..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:ring-2 focus:ring-primary-background focus:border-transparent resize-none"
              />
              <div className={`absolute bottom-2 right-3 text-base ${isCharacterLimitNear ? 'text-orange-600' : 'text-gray-400'}`}>
                {characterCount}/{characterLimit}
              </div>
            </div>
          </div>

          {/* Error Messages */}
          {state.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-red-800">
                    Please fix the following errors:
                  </h3>
                  <div className="mt-2 text-base text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      {state.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-colors min-h-[44px]"
              disabled={state.isLoading || externalLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`
                flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all duration-200 min-h-[44px]
                ${isSubmitDisabled
                  ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-background hover:bg-primary-background focus:ring-2 focus:ring-primary-background focus:ring-opacity-20'
                }
              `}
            >
              {(state.isLoading || externalLoading) ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                'Send Appreciation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecognitionModal;
