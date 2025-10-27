import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';

// Import types
import { Recognition, TabType, FilterType, Campaign, RecognitionFormData, Badge } from '../../types/dashboard';
import { useUsers } from '../../hooks/useUsers';
import { usePaginatedRecognitions } from '../../hooks/usePaginatedRecognitions';
import { useRecognitionActions } from '../../hooks/useRecognitionActions';
import { useCampaigns } from '../../hooks/useCampaigns';
import { useCampaignActions } from '../../hooks/useCampaignActions';
import userService from '../../services/userService';
import { getBadgeColorAlphabetical, createGradientFromColor, getShortName } from '../../constants/badgeColors';
import HeroSection from '../../components/dashboard/HeroSection';

// Import components
import UserProfile from '../../components/dashboard/UserProfile';
import ColleaguesList from '../../components/dashboard/ColleaguesList';
import TabNavigation from '../../components/dashboard/TabNavigation';
import FilterSection from '../../components/dashboard/FilterSection';
import RecognitionCard from '../../components/dashboard/RecognitionCard';
import CampaignCard from '../../components/dashboard/CampaignCard';
import BadgesGrid from '../../components/dashboard/BadgesGrid';
import DistributionChart from '../../components/dashboard/DistributionChart';
import TrendChart from '../../components/dashboard/TrendChart';
import RecognitionModal from '../../components/dashboard/RecognitionModal';
import Pagination from '../../components/dashboard/Pagination';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [filterBy, setFilterBy] = useState<FilterType>('Everyone');
  const [currentUserId] = useState('20101'); // Peter Chan as current user
  // Remove filteredRecognitions state - we'll use the paginated recognitions directly
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [currentPersonFilter, setCurrentPersonFilter] = useState<string | undefined>(undefined);
  
  // Campaign filter states
  const [campaignStatus, setCampaignStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [campaignType, setCampaignType] = useState<'All' | 'Values' | 'Campaign'>('All');

  // Recognition modal state
  const [isRecognitionModalOpen, setIsRecognitionModalOpen] = useState(false);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [preselectedUserId, setPreselectedUserId] = useState<string | undefined>(undefined);

  // Campaign modal state
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaignParticipants, setCampaignParticipants] = useState<string[]>([]);
  const [userCampaigns, setUserCampaigns] = useState<Set<string>>(new Set());


  // Use the custom users hook
  const {
    users,
    colleagues,
    currentUser,
    loading: usersLoading,
    error: usersError,
    refreshUsers,
    incrementBadge
  } = useUsers(currentUserId);

  // Use the custom paginated recognitions hook
  const {
    recognitions,
    currentPage,
    totalPages,
    totalCount,
    loading: recognitionsLoading,
    error: recognitionsError,
    goToPage,
    refreshRecognitions,
    reloadWithFilters,
    createRecognition,
    getRecognitionsByTab,
    getTrendData,
    getDistributionData,
    getAvailableBadges,
    filterRecognitionsByDepartment
  } = usePaginatedRecognitions({ 
    currentUserId, 
    pageSize: 10, 
    autoLoad: true,
    departmentFilter: filterBy,
    personFilter: currentPersonFilter,
    activeTab
  });

  // Use recognition actions hook
  const { toggleLike } = useRecognitionActions({
    currentUserId,
    onLikeToggle: (recognitionId, isLiked) => {
      // Refresh recognitions to show updated like status
      refreshRecognitions();
    }
  });

  // Use campaigns hook
  const {
    campaigns,
    activeCampaigns,
    campaignStats,
    loading: campaignsLoading,
    error: campaignsError,
    refreshCampaigns,
    getFilteredCampaigns,
    getCampaignsForTab,
    getCampaignDistributionData
  } = useCampaigns({ autoLoad: true });

  // Use campaign actions hook
  const { joinCampaign, leaveCampaign, getCampaignParticipants } = useCampaignActions({
    onCampaignCreated: () => refreshCampaigns(),
    onCampaignUpdated: () => refreshCampaigns(),
    onCampaignDeleted: () => refreshCampaigns(),
    onStatusChanged: () => refreshCampaigns()
  });

  // Load available badges for the modal
  useEffect(() => {
    const loadBadges = async () => {
      try {
        const badges = await getAvailableBadges();
        setAvailableBadges(badges.map(badge => ({ 
          ...badge, 
          number: 0, // Default value for Badge interface 
          color: userService.getBadgesWithColors([{ ...badge, number: 0 }])[0]?.color 
        })));
      } catch (err) {
        console.error('Error loading badges:', err);
      }
    };

    if (isRecognitionModalOpen) {
      loadBadges();
    }
  }, [isRecognitionModalOpen, getAvailableBadges]);

  // Filtering is now handled at the service level in the paginated hook

  // Filter campaigns by active tab and filters
  useEffect(() => {
    const filterCampaigns = async () => {
      if (activeTab === 'campaign') {
        let tabCampaigns = await getCampaignsForTab(activeTab);
        
        // Apply department filter (filter campaigns by host department)
        if (filterBy !== 'Everyone') {
          if (filterBy === 'Your Own') {
            // For "Your Own", show campaigns where user has participated (given or received recognitions)
            // This is a simplified approach - in a real app, you'd track campaign participation
            // For now, we'll show all campaigns since we don't have participation tracking
            // In a real implementation, you'd filter based on user's campaign participation history
            tabCampaigns = tabCampaigns; // Show all campaigns for "Your Own"
          } else {
            tabCampaigns = tabCampaigns.filter(campaign => {
              // Filter campaigns by host department
              // Some campaigns have "Company" as host (show for all departments)
              // Others have specific departments like "Department A", "Department B", etc.
              return campaign.host === 'Company' || campaign.host === filterBy;
            });
          }
        }
        
        // Apply additional filters
        let filtered = tabCampaigns;
        
        if (campaignStatus !== 'All') {
          filtered = filtered.filter(campaign => campaign.status === campaignStatus);
        }
        
        if (campaignType !== 'All') {
          filtered = filtered.filter(campaign => campaign.badges.type === campaignType);
        }
        
        setFilteredCampaigns(filtered);
      }
    };
    
    if (activeTab === 'campaign') {
      filterCampaigns();
    }
  }, [activeTab, campaigns, campaignStatus, campaignType, filterBy, getCampaignsForTab]);

  // Get current user badges with colors
  const userBadges = useMemo(() => {
    if (!currentUser) return [];
    return userService.getBadgesWithColors(currentUser.received_badges)
      .filter(badge => badge.number > 0);
  }, [currentUser]);

  // Generate chart data from real recognitions and campaigns
  const [recognitionDistributionData, setRecognitionDistributionData] = useState<any[]>([]);
  const [campaignDistributionData, setCampaignDistributionData] = useState<any[]>([]);
  const [recognitionTrendData, setRecognitionTrendData] = useState<any[]>([]);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const [distributionData, trendData, campaignDistribution] = await Promise.all([
          getDistributionData(),
          getTrendData(),
          getCampaignDistributionData()
        ]);
        setRecognitionDistributionData(distributionData);
        setRecognitionTrendData(trendData);
        setCampaignDistributionData(campaignDistribution);
      } catch (err) {
        console.error('Error loading chart data:', err);
      }
    };

    loadChartData();
  }, [getDistributionData, getTrendData, getCampaignDistributionData]);

  // Calculate current month stats
  const currentReceived = useMemo(() => {
    if (!currentUser) return 0;
    return currentUser.received_badges.reduce((sum, badge) => sum + badge.number, 0);
  }, [currentUser]);

  const currentGiven = useMemo(() => {
    if (!currentUser) return 0;
    return currentUser.given_badges.reduce((sum, badge) => sum + badge.number, 0);
  }, [currentUser]);

  // Event handlers
  const handleLike = async (recognitionId: string) => {
    await toggleLike(recognitionId);
  };

  const handleRecognize = async (colleagueId: string) => {
    // Set the preselected user and open the recognition modal
    setPreselectedUserId(colleagueId);
    setIsRecognitionModalOpen(true);
  };

  const handleFilterByBadge = async (personName: string) => {
    // Set person filter; hook will reload via effect
    setCurrentPersonFilter(personName);
  };

  const handleClearPersonFilter = async () => {
    // Clear person filter; hook will reload via effect
    setCurrentPersonFilter(undefined);
  };

  // Handle department filter changes
  const handleFilterChange = async (newFilter: FilterType) => {
    // Update department filter; hook will reload via effect
    setFilterBy(newFilter);
  };

  const handleRecognizeFromProfile = () => {
    setPreselectedUserId(undefined); // Clear preselected user for general recognition
    setIsRecognitionModalOpen(true);
  };

  const handleCloseRecognitionModal = () => {
    setIsRecognitionModalOpen(false);
    setPreselectedUserId(undefined); // Clear preselected user when closing modal
  };

  const handleCreateRecognition = async (formData: RecognitionFormData) => {
    setModalLoading(true);
    try {
      await createRecognition(formData);
      
      // Show success message
      
      // Refresh user data to update badge counts in real-time
      await refreshUsers();
      
      // Close modal
      setIsRecognitionModalOpen(false);
      
      // Switch to feed tab to show new recognition
      setActiveTab('feed');
      
    } catch (err) {
      console.error('Error creating recognition:', err);
      // Error is already handled in the hook, just re-throw for modal to catch
      throw err;
    } finally {
      setModalLoading(false);
    }
  };

  const handleJoinCampaign = async (campaignId: string) => {
    try {
      const success = await joinCampaign(campaignId, currentUserId);
      if (success) {
        // Add to user's campaigns
        setUserCampaigns(prev => new Set([...prev, campaignId]));
        // Show success message (in real app would use toast notification)
        alert('Successfully joined the campaign!');
      } else {
        alert('Failed to join campaign. Please try again.');
      }
    } catch (error) {
      console.error('Error joining campaign:', error);
      alert('An error occurred while joining the campaign.');
    }
  };

  const handleLeaveCampaign = async (campaignId: string) => {
    try {
      const success = await leaveCampaign(campaignId, currentUserId);
      if (success) {
        // Remove from user's campaigns
        setUserCampaigns(prev => {
          const newSet = new Set(prev);
          newSet.delete(campaignId);
          return newSet;
        });
        // Show success message
        alert('Successfully left the campaign.');
      } else {
        alert('Failed to leave campaign. Please try again.');
      }
    } catch (error) {
      console.error('Error leaving campaign:', error);
      alert('An error occurred while leaving the campaign.');
    }
  };

  const handleViewCampaignDetails = async (campaignId: string) => {
    try {
      // Find the campaign
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) {
        alert('Campaign not found.');
        return;
      }

      // Get participants
      const participants = await getCampaignParticipants(campaignId);
      
      // Set modal state
      setSelectedCampaign(campaign);
      setCampaignParticipants(participants);
      setIsCampaignModalOpen(true);
    } catch (error) {
      console.error('Error loading campaign details:', error);
      alert('Failed to load campaign details.');
    }
  };

  const handleCloseCampaignModal = () => {
    setIsCampaignModalOpen(false);
    setSelectedCampaign(null);
    setCampaignParticipants([]);
  };


  // Get campaign context for recognitions
  const getCampaignContext = async (recognition: Recognition) => {
    // Mock implementation - in real app would use recognition.campaign field
    if (recognition.category === 'Fitness God' || recognition.category === 'Green Gold') {
      const campaign = campaigns.find(c => c.badges.name === recognition.category);
      if (campaign) {
        const participants = await getCampaignParticipants(campaign.id);
        return {
          name: campaign.name,
          host: campaign.host,
          participantCount: participants.length
        };
      }
    }
    return undefined;
  };

  // Combined loading state
  const loading = usersLoading || recognitionsLoading || campaignsLoading;
  
  // Combined error state
  const error = usersError || recognitionsError || campaignsError;

  // Loading state
  if (loading) {
    return (
      <div id="dashboard-loading" className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="dashboard-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13426B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div id="dashboard-error" className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="dashboard-error">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#13426B] text-white rounded hover:bg-[#13426B]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Staff Recognition Dashboard</title>
        <meta name="description" content="Employee recognition platform with real-time appreciation feeds and team analytics" />
      </Helmet>

      <main id="dashboard-main" className="min-h-screen bg-gray-50" data-testid="dashboard-page">
        {/* Hero Section */}
        <HeroSection userName={currentUser?.name} />

        {/* Main Content */}
        <section id="dashboard-content" className="max-w-7xl mx-auto px-4 py-8" data-testid="dashboard-main-content">
          <div id="dashboard-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-testid="dashboard-grid-layout">
            
            {/* Left Sidebar */}
            <aside id="dashboard-left-sidebar" className="lg:col-span-3 space-y-6" data-testid="dashboard-sidebar-left">
              <UserProfile
                name={currentUser?.name || 'Loading...'}
                title={currentUser?.department_division || 'Loading...'}
                avatar={currentUser ? `/images/${currentUser.photo}` : '/images/img_image.png'}
                onRecognizeClick={handleRecognizeFromProfile}
              />

              <ColleaguesList
                colleagues={colleagues}
                onRecognizeColleague={handleRecognize}
                onFilterByBadge={handleFilterByBadge}
              />
            </aside>

            {/* Main Feed */}
            <main id="dashboard-main-feed" className="lg:col-span-6 space-y-6 text-[17px] sm:text-[18px]" data-testid="dashboard-content-feed">
              <TabNavigation
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setFilterBy('Everyone');
                  setCurrentPersonFilter(undefined);
                  // Reset to first page when changing tabs
                  goToPage(1);
                }}
              />

              <FilterSection 
                filterBy={filterBy} 
                onFilterChange={handleFilterChange}
                recognitionCount={totalCount}
                campaignCount={filteredCampaigns.length}
                showCampaignFilters={activeTab === 'campaign'}
                campaignStatus={campaignStatus}
                onCampaignStatusChange={setCampaignStatus}
                campaignType={campaignType}
                onCampaignTypeChange={setCampaignType}
                currentPersonFilter={currentPersonFilter}
                onClearPersonFilter={handleClearPersonFilter}
              />

              {/* Feed Content */}
              {activeTab === 'feed' && (
                <>
                  <div id="recognition-feed-container" className="space-y-12" data-testid="recognition-feed-list">
                    {recognitions.length > 0 ? (
                      recognitions.map((recognition) => (
                        <RecognitionCard
                          key={recognition.id}
                          recognition={recognition}
                          onLike={handleLike}
                          onRecognize={handleRecognize}
                          onFilterByBadge={handleFilterByBadge}
                          campaignContext={undefined} // Would be populated in real app
                        />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-base text-gray-500">No recognitions found.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Pagination */}
                  {recognitions.length > 0 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={goToPage}
                      totalItems={totalCount}
                      itemsPerPage={10}
                      isLoading={recognitionsLoading}
                    />
                  )}
                </>
              )}

              {/* Campaign Content */}
              {activeTab === 'campaign' && (
                <div id="campaign-feed-container" className="space-y-6" data-testid="campaign-feed-list">
                  {/* Campaign Cards */}
                  {filteredCampaigns.length > 0 ? (
                    filteredCampaigns.map((campaign) => (
                      <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        onJoin={handleJoinCampaign}
                        onLeave={handleLeaveCampaign}
                        onViewDetails={handleViewCampaignDetails}
                        isParticipant={userCampaigns.has(campaign.id)}
                        participantCount={Math.floor(Math.random() * 50) + 10} // Mock data
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-base text-gray-500">
                        {(() => {
                          const statusText = campaignStatus === 'All' ? '' : ` ${campaignStatus.toLowerCase()}`;
                          const typeText = campaignType === 'All' ? '' : ` ${campaignType.toLowerCase()}`;
                          
                          if (statusText && typeText) {
                            return `No${statusText}${typeText} campaigns found.`;
                          } else if (statusText || typeText) {
                            return `No${statusText || typeText} campaigns found.`;
                          } else {
                            return 'No campaigns found.';
                          }
                        })()}
                      </p>
                      <p className="text-base text-gray-400 mt-2">
                        {campaignStatus === 'All' && campaignType === 'All'
                          ? 'Check back later for new campaigns!' 
                          : 'Try adjusting your filters or check back later.'
                        }
                      </p>
                    </div>
                  )}

                  {/* User Appreciation Cards Section */}
                  {filteredCampaigns.length > 0 && (
                    <>
                      {/* Section Divider */}
                      <div className="flex items-center my-8">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <div className="px-4">
                          <span className="text-base text-gray-500 font-medium">New Wellness Recognitions</span>
                        </div>
                        <div className="flex-1 border-t border-gray-200"></div>
                      </div>

                      {/* Campaign-related Recognitions */}
                      <div className="space-y-6">
                        {recognitions
                          .filter(recognition => {
                            // Filter recognitions that are related to campaigns
                            return recognition.category === 'Fitness God' || 
                                   recognition.category === 'Green God' ||
                                   recognition.category === 'Fitness Week' ||
                                   recognition.category === 'Green Week';
                          })
                          .slice(0, 5) // Show only first 5 campaign-related recognitions
                          .map((recognition) => (
                            <RecognitionCard
                              key={recognition.id}
                              recognition={recognition}
                              onLike={handleLike}
                              onRecognize={handleRecognize}
                              onFilterByBadge={handleFilterByBadge}
                              campaignContext={undefined} // Would be populated in real app
                            />
                          ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </main>

            {/* Right Sidebar */}
            <aside id="dashboard-right-sidebar" className="lg:col-span-3 space-y-6" data-testid="dashboard-sidebar-right">
              <BadgesGrid 
                badges={userBadges} 
                onBadgeClick={(badge) => {
                  // Handle badge click - could filter by badge or show details
                }}
              />

              {/* Show different charts based on active tab */}
              {activeTab === 'feed' && recognitionDistributionData.length > 0 && (
                <DistributionChart data={recognitionDistributionData} />
              )}

              {activeTab === 'campaign' && (
                <>
                  {/* Show recognition distribution chart for campaign tab */}
                  {recognitionDistributionData.length > 0 && (
                    <DistributionChart 
                      data={recognitionDistributionData} 
                      title="Recognition Distribution"
                      badgeText="By Badge"
                    />
                  )}
                  
                  {/* Show campaign distribution chart for campaign tab */}
                  {campaignDistributionData.length > 0 && (
                    <DistributionChart 
                      data={campaignDistributionData} 
                      title="Campaign Distribution"
                      badgeText="By Type"
                    />
                  )}
                </>
              )}

              {recognitionTrendData.length > 0 && (
                <TrendChart
                  data={recognitionTrendData}
                  currentReceived={currentReceived}
                  currentGiven={currentGiven}
                />
              )}
            </aside>
          </div>
        </section>

        {/* Recognition Modal */}
        <RecognitionModal
          isOpen={isRecognitionModalOpen}
          onClose={handleCloseRecognitionModal}
          onSubmit={handleCreateRecognition}
          currentUserId={currentUserId}
          users={users}
          availableBadges={availableBadges}
          isLoading={modalLoading || recognitionsLoading}
          preselectedUserId={preselectedUserId}
        />

        {/* Campaign Details Modal */}
        {isCampaignModalOpen && selectedCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCampaign.name}</h2>
                  <button
                    onClick={handleCloseCampaignModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Campaign Image */}
                {selectedCampaign.cover && (
                  <div className="mb-4">
                    <img 
                      src={`/images/${selectedCampaign.cover}`}
                      alt={selectedCampaign.name}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/images/img_image.png';
                      }}
                    />
                  </div>
                )}

                {/* Campaign Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedCampaign.message}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Badge Information</h4>
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ background: createGradientFromColor(getBadgeColorAlphabetical(selectedCampaign.badges.name)) }}
                        >
                          <div className="text-base font-bold text-white">{getShortName(selectedCampaign.badges.name)}</div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{selectedCampaign.badges.name}</p>
                          <p className="text-base text-gray-600">{selectedCampaign.badges.type} Campaign</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Campaign Stats</h4>
                      <div className="space-y-2">
                        <p className="text-base text-gray-600">
                          <span className="font-medium">Participants:</span> {campaignParticipants.length}
                        </p>
                        <p className="text-base text-gray-600">
                          <span className="font-medium">Status:</span> 
                          <span className={`ml-2 px-2 py-1 rounded text-base ${
                            selectedCampaign.badges.type === 'Values' 
                              ? 'bg-[#13426B]/10 text-[#13426B]' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {selectedCampaign.badges.type}
                          </span>
                        </p>
                        <p className="text-base text-gray-600">
                          <span className="font-medium">Host:</span> {selectedCampaign.host}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    {selectedCampaign.status === 'Active' && (
                      <button
                        onClick={() => {
                          if (userCampaigns.has(selectedCampaign.id)) {
                            handleLeaveCampaign(selectedCampaign.id);
                          } else {
                            handleJoinCampaign(selectedCampaign.id);
                          }
                          handleCloseCampaignModal();
                        }}
                        className={`flex-1 py-2 px-4 rounded-lg text-base font-medium transition-colors ${
                          userCampaigns.has(selectedCampaign.id)
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-[#13426B] text-white hover:bg-[#13426B]'
                        }`}
                      >
                        {userCampaigns.has(selectedCampaign.id) ? 'Leave Campaign' : 'Join Campaign'}
                      </button>
                    )}
                    
                    <button
                      onClick={handleCloseCampaignModal}
                      className="px-4 py-2 text-base font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  );
};

export default Dashboard;