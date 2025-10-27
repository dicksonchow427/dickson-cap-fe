import React from 'react';
import { FilterType } from '../../types/dashboard';

interface FilterSectionProps {
  filterBy: FilterType;
  onFilterChange?: (filter: FilterType) => void;
  recognitionCount?: number;
  campaignCount?: number;
  showCampaignFilters?: boolean;
  campaignStatus?: 'All' | 'Active' | 'Inactive';
  onCampaignStatusChange?: (status: 'All' | 'Active' | 'Inactive') => void;
  campaignType?: 'All' | 'Values' | 'Campaign';
  onCampaignTypeChange?: (type: 'All' | 'Values' | 'Campaign') => void;
  currentPersonFilter?: string;
  onClearPersonFilter?: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  filterBy, 
  onFilterChange,
  recognitionCount,
  campaignCount,
  showCampaignFilters = false,
  campaignStatus = 'All',
  onCampaignStatusChange,
  campaignType = 'All',
  onCampaignTypeChange,
  currentPersonFilter,
  onClearPersonFilter
}) => {
  const filterOptions: FilterType[] = [
    'Everyone', 
    'Your Own',
    'Department A', 
    'Department B', 
    'Department C', 
    'Department D'
  ];

  const statusOptions = ['All', 'Active', 'Inactive'] as const;
  const typeOptions = ['All', 'Values', 'Campaign'] as const;

  return (
    <div id="filter-section-container" className="space-y-4" data-testid="filter-section-wrapper">
      {/* Recognition/Campaign Count and Basic Filters */}
      <div className="flex justify-between items-center">
        <div id="new-recognitions-badge" className="bg-gray-100 px-3 py-1 rounded-md" data-testid="new-recognitions-indicator">
          <span id="new-recognitions-text" className="text-base text-gray-600" data-testid="new-recognitions-label">
            {showCampaignFilters 
              ? (campaignCount !== undefined ? `${campaignCount} Campaigns` : 'Active Campaigns')
              : (recognitionCount !== undefined ? `${recognitionCount} Recognitions` : 'New Recognitions')
            }
          </span>
        </div>
        
        <div id="filter-controls-container" className="flex items-center space-x-2" data-testid="filter-controls-wrapper">
          <span id="filter-by-label" className="text-base text-gray-600" data-testid="filter-by-text-label">Filter By:</span>
          
          {/* Person Filter Display */}
          {currentPersonFilter && (
            <div className="flex items-center space-x-1">
              <span className="text-base text-[#13426B] font-medium">Person: {currentPersonFilter}</span>
              <button
                onClick={onClearPersonFilter}
                className="text-base text-gray-400 hover:text-gray-600 ml-1"
                data-testid="clear-person-filter-button"
              >
                ✕
              </button>
            </div>
          )}
          
          {onFilterChange ? (
            <select
              id="filter-dropdown-select"
              value={filterBy}
              onChange={(e) => onFilterChange(e.target.value as FilterType)}
              className="text-base font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
              data-testid="filter-dropdown-select"
            >
              {filterOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <div id="filter-dropdown-container" className="flex items-center space-x-1" data-testid="filter-dropdown-wrapper">
              <span id="filter-value-display" className="text-base font-semibold text-gray-800" data-testid="filter-current-value">{filterBy}</span>
              <img 
                id="filter-dropdown-arrow"
                src="/images/img_vector_gray_800.svg" 
                alt="Dropdown"
                className="w-2 h-1"
                data-testid="filter-dropdown-arrow-icon"
              />
            </div>
          )}
        </div>
      </div>

      {/* Campaign-specific Filters */}
      {showCampaignFilters && (
        <div id="campaign-filters-container" className="flex items-center justify-between bg-gray-50 p-3 rounded-lg" data-testid="campaign-filters-section">
          <div className="flex items-center space-x-4">
            {/* Campaign Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-base text-gray-600">Status:</span>
              {onCampaignStatusChange ? (
                <select
                  value={campaignStatus}
                  onChange={(e) => onCampaignStatusChange(e.target.value as 'All' | 'Active' | 'Inactive')}
                  className="text-base font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-base font-semibold text-gray-800">{campaignStatus}</span>
              )}
            </div>

            {/* Campaign Type Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-base text-gray-600">Type:</span>
              {onCampaignTypeChange ? (
                <select
                  value={campaignType}
                  onChange={(e) => onCampaignTypeChange(e.target.value as 'All' | 'Values' | 'Campaign')}
                  className="text-base font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
                >
                  {typeOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-base font-semibold text-gray-800">{campaignType}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;