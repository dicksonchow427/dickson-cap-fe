import React from 'react';
import { FilterType } from '../../types/dashboard';

interface FilterSectionProps {
  filterBy: FilterType;
  // eslint-disable-next-line no-unused-vars
  onFilterChange?: (filterType: FilterType) => void;
  recognitionCount?: number;
  currentPersonFilter?: string;
  onClearPersonFilter?: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filterBy,
  onFilterChange,
  recognitionCount,
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


  return (
    <div id="filter-section-container" className="space-y-4" data-testid="filter-section-wrapper">
      {/* Recognition/Campaign Count and Basic Filters */}
      <div className="flex justify-between items-center">
        <div id="new-recognitions-badge" className="bg-gray-100 px-3 py-1 rounded-md" data-testid="new-recognitions-indicator">
          <span id="new-recognitions-text" className="text-base text-gray-600" data-testid="new-recognitions-label">
            {recognitionCount !== undefined ? `${recognitionCount} Recognitions` : 'New Recognitions'}
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

    </div>
  );
};

export default FilterSection;
