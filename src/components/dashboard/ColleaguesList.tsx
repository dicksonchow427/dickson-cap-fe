import React, { useState } from 'react';
import { Colleague } from '../../types';

interface ColleaguesListProps {
  colleagues: Colleague[];
  onRecognizeColleague: (colleagueId: string) => void;
  onFilterByBadge?: (badgeName: string) => void;
}

const ColleaguesList: React.FC<ColleaguesListProps> = ({
  colleagues,
  onRecognizeColleague,
  onFilterByBadge
}) => {
  const [showAll, setShowAll] = useState(false);
  const initialLimit = 5;
  const displayedColleagues = showAll ? colleagues : colleagues.slice(0, initialLimit);
  const hasMore = colleagues.length > initialLimit;
  return (
    <div id="colleagues-list-card" className="bg-white rounded-lg p-4 shadow-sm" data-testid="colleagues-list-widget">
      <div id="colleagues-list-content" className="space-y-4" data-testid="colleagues-list-content-wrapper">
        <h4 id="colleagues-list-title" className="text-lg font-semibold text-gray-900 px-2" data-testid="colleagues-list-section-title">You work the most with</h4>
        
        <div id="colleagues-list-container" className="space-y-3 px-2" data-testid="colleagues-list-items-container">
          {displayedColleagues.map((colleague) => (
            <div key={colleague.id} id={`colleague-item-${colleague.id}`} className="flex items-center justify-between" data-testid={`colleague-list-item-${colleague.id}`}>
              <div id={`colleague-info-${colleague.id}`} className="flex items-center space-x-3" data-testid={`colleague-info-section-${colleague.id}`}>
                <button
                  onClick={() => onFilterByBadge?.(colleague.name)}
                  className="w-12 h-12 rounded-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
                  data-testid={`colleague-avatar-button-${colleague.id}`}
                >
                  <img 
                    id={`colleague-avatar-${colleague.id}`}
                    src={colleague.avatar} 
                    alt={colleague.name}
                    className="w-12 h-12 rounded-full object-cover"
                    data-testid={`colleague-avatar-image-${colleague.id}`}
                  />
                </button>
                <div id={`colleague-details-${colleague.id}`} data-testid={`colleague-details-wrapper-${colleague.id}`}>
                  <button
                    onClick={() => onFilterByBadge?.(colleague.name)}
                  className="text-base font-medium text-gray-900 hover:text-[#13426B] hover:underline transition-colors cursor-pointer"
                    data-testid={`colleague-name-button-${colleague.id}`}
                  >
                    <p id={`colleague-name-${colleague.id}`} data-testid={`colleague-name-text-${colleague.id}`}>{colleague.name}</p>
                  </button>
                </div>
              </div>
              <button
                id={`recognize-colleague-button-${colleague.id}`}
                onClick={() => onRecognizeColleague(colleague.id)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                data-testid={`recognize-colleague-button-${colleague.id}`}
              >
                <img 
                  id={`recognize-icon-${colleague.id}`}
                  src="/images/img_group_blue_gray_600.svg" 
                  alt="Recognize"
                  className="w-5 h-5"
                  data-testid={`recognize-colleague-icon-${colleague.id}`}
                />
              </button>
            </div>
          ))}
        </div>
        
        {hasMore && (
          <div id="colleagues-show-more-section" className="text-right px-2" data-testid="colleagues-show-more-wrapper">
            <button 
              id="colleagues-show-more-button" 
              onClick={() => setShowAll(!showAll)}
              className="text-base text-[#13426B] hover:underline" 
              data-testid="colleagues-show-more-button"
            >
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColleaguesList;