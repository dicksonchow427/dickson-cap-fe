import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';

// Import types
import { TabType, FilterType, RecognitionFormData, Badge } from '../../types/dashboard';
import { useUsers } from '../../hooks/useUsers';
import { usePaginatedRecognitions } from '../../hooks/usePaginatedRecognitions';
import { useRecognitionActions } from '../../hooks/useRecognitionActions';
import { useCampaigns } from '../../hooks/useCampaigns';
import userService from '../../services/userService';
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
  const [currentPersonFilter, setCurrentPersonFilter] = useState<string | undefined>(undefined);

  // Recognition modal state
  const [isRecognitionModalOpen, setIsRecognitionModalOpen] = useState(false);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [preselectedUserId, setPreselectedUserId] = useState<string | undefined>(undefined);



  // Use the custom users hook
  const {
    users,
    colleagues,
    currentUser,
    loading: usersLoading,
    error: usersError,
    refreshUsers
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
    createRecognition,
    getTrendData,
    getDistributionData,
    getAvailableBadges
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
    onLikeToggle: () => {
      // Refresh recognitions to show updated like status
      refreshRecognitions();
    }
  });

  // Use campaigns hook
  const {
    campaigns,
    loading: campaignsLoading,
    error: campaignsError,
    getCampaignDistributionData
  } = useCampaigns({ autoLoad: true });


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


  // Get current user badges with colors
  const userBadges = useMemo(() => {
    if (!currentUser) return [];
    return userService.getBadgesWithColors(currentUser.received_badges)
      .filter(badge => badge.number > 0);
  }, [currentUser]);

  // Generate chart data from real recognitions and campaigns
  const [recognitionDistributionData, setRecognitionDistributionData] = useState<{ name: string; value: number; color: string; }[]>([]);
  const [campaignDistributionData, setCampaignDistributionData] = useState<{ name: string; value: number; color: string; }[]>([]);
  const [recognitionTrendData, setRecognitionTrendData] = useState<{ month: string; received: number; given: number; }[]>([]);

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




  // Get campaign context for recognitions (unused - for future use)
  /*
  const getCampaignContext = async (recognition: Recognition) => {
    // Mock implementation - in real app would use recognition.campaign field
    if (recognition.category === 'Risk Awareness') {
      const campaign = campaigns.find(c => c.badges.name === recognition.category);
      if (campaign) {
        return {
          name: campaign.name,
          host: campaign.host,
          participantCount: Math.floor(Math.random() * 50) + 10 // Mock participant count
        };
      }
    }
    return undefined;
  };
  */

  // Combined loading state
  const loading = usersLoading || recognitionsLoading || campaignsLoading;

  // Combined error state
  const error = usersError || recognitionsError || campaignsError;

  // Loading state
  if (loading) {
    return (
      <div id="dashboard-loading" className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="dashboard-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13426B] mx-auto mb-5"></div>
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
          <div className="text-red-500 text-xl mb-5">⚠️</div>
          <p className="text-red-600 mb-5">Error loading dashboard: {error}</p>
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
            <main id="dashboard-main-feed" className="lg:col-span-6 space-y-8 text-[17px] sm:text-[18px]" data-testid="dashboard-content-feed">
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
                currentPersonFilter={currentPersonFilter}
                onClearPersonFilter={handleClearPersonFilter}
              />

              {/* Feed Content */}
              {activeTab === 'feed' && (
                <>
                  <div id="recognition-feed-container" className="space-y-16" data-testid="recognition-feed-list">
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
                  {campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                      <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        participantCount={Math.floor(Math.random() * 50) + 10} // Mock data
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-base text-gray-500">No campaigns found.</p>
                      <p className="text-base text-gray-400 mt-2">Check back later for new campaigns!</p>
                    </div>
                  )}

                  {/* User Appreciation Cards Section */}
                  {campaigns.length > 0 && (
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
                      <div className="space-y-12">
                        {recognitions
                          .filter(recognition => {
                            // Filter recognitions that are related to campaigns
                            return recognition.category === 'Risk Awareness' ||
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
            <aside id="dashboard-right-sidebar" className="lg:col-span-3 space-y-6 text-sm" data-testid="dashboard-sidebar-right">
              <BadgesGrid
                badges={userBadges}
              />

              {/* Show different charts based on active tab */}
              {activeTab === 'feed' && recognitionDistributionData.length > 0 && (
                <DistributionChart data={recognitionDistributionData} title="My Recognitions" />
              )}

              {activeTab === 'campaign' && (
                <>
                  {/* Show campaign distribution chart for campaign tab */}
                  {campaignDistributionData.length > 0 && (
                    <DistributionChart
                      data={campaignDistributionData}
                      title="Campaign Recognitions"
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


      </main>
    </>
  );
};

export default Dashboard;
