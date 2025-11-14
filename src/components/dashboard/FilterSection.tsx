import React from 'react';
import { FilterType } from '../../types/dashboard';

interface FilterSectionProps {
  filterBy: FilterType;
  // eslint-disable-next-line no-unused-vars
  onFilterChange?: (filterType: FilterType) => void;
  userDivision?: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filterBy,
  onFilterChange,
  userDivision
}) => {
  // Build filter options: always include Everyone and Your Own, plus user's division if available
  const filterOptions: FilterType[] = [
    'Everyone',
    'Your Own',
    ...(userDivision && ['Division A', 'Division B', 'Division C', 'Division D'].includes(userDivision)
      ? [userDivision as FilterType]
      : [])
  ];


  return (
    <div id="filter-section-container" className="space-y-4" data-testid="filter-section-wrapper">
      {/* Recognition/Campaign Count and Basic Filters */}
      <div className="flex justify-end items-center">
        <div id="filter-controls-container" className="flex items-center space-x-2" data-testid="filter-controls-wrapper">
          <span id="filter-by-label" className="text-base text-gray-600" data-testid="filter-by-text-label">Filter By:</span>

          {onFilterChange ? (
            <select
              id="filter-dropdown-select"
              value={filterBy}
              onChange={(e) => {
                const newValue = e.target.value as FilterType;
                onFilterChange(newValue);
              }}
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
