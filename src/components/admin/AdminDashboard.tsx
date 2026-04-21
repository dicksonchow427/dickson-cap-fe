import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

interface AdminDashboardProps {
  onExitAdminMode: () => void;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  badge: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: string;
  image: string;
}

interface Activity {
  id: string;
  actor: string;
  action: string;
  target: string;
  category: string;
  message: string;
  time: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdminMode }) => {
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
  const [selectedColleague, setSelectedColleague] = useState<string | null>(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const menuItems = ['Dashboard', 'Campaigns', 'Badges', 'Colleagues'];

  // Dummy colleague data
  const colleagues = [
    { id: '1', name: 'Peter Chan', division: 'Division 1', department: 'Department C', photo: 'img_corpday2022websiteweb_top_banner_1.png' },
    { id: '2', name: 'Alice Chen', division: 'Division 2', department: 'Department A', photo: 'img_corpday2022websiteweb_top_banner_1.png' },
    { id: '3', name: 'Bob Smith', division: 'Division 1', department: 'Department B', photo: 'img_corpday2022websiteweb_top_banner_1.png' },
    { id: '4', name: 'Carol Davis', division: 'Division 3', department: 'Department D', photo: 'img_corpday2022websiteweb_top_banner_1.png' },
    { id: '5', name: 'David Wilson', division: 'Division 2', department: 'Department C', photo: 'img_corpday2022websiteweb_top_banner_1.png' },
    { id: '6', name: 'Emma Brown', division: 'Division 1', department: 'Department A', photo: 'img_corpday2022websiteweb_top_banner_1.png' },
    { id: '7', name: 'Frank Miller', division: 'Division 3', department: 'Department B', photo: 'img_corpday2022websiteweb_top_banner_1.png' },
  ];

  // Dummy activity data for each colleague
  const colleagueActivities: Record<string, Activity[]> = {
    '1': [
      { id: '1', actor: 'Peter Chan', action: 'appreciated', target: 'Iris Tam', category: 'Wellness', message: 'Your dedication to team wellness creates a positive work environment!', time: '20 minutes ago' },
      { id: '2', actor: 'Peter Chan', action: 'appreciated', target: 'Iris Tam', category: 'Wellness', message: 'Your dedication to team wellness creates a positive work environment!', time: '20 minutes ago' },
      { id: '3', actor: 'Peter Chan', action: 'appreciated', target: 'Iris Tam', category: 'Wellness', message: 'Your dedication to team wellness creates a positive work environment!', time: '20 minutes ago' },
      { id: '4', actor: 'Peter Chan', action: 'appreciated', target: 'Iris Tam', category: 'Wellness', message: 'Your dedication to team wellness creates a positive work environment!', time: '20 minutes ago' },
    ],
    '2': [
      { id: '1', actor: 'Alice Chen', action: 'gave recognition to', target: 'Bob Smith', category: 'Innovation', message: 'Outstanding creative problem-solving skills!', time: '1 hour ago' },
      { id: '2', actor: 'Alice Chen', action: 'joined campaign', target: 'Green Initiative', category: '', message: 'Committed to sustainability goals', time: '3 hours ago' },
      { id: '3', actor: 'Alice Chen', action: 'received', target: '5 recognitions', category: 'Team Player', message: 'Recognized by multiple team members', time: '5 hours ago' },
    ],
    '3': [
      { id: '1', actor: 'Bob Smith', action: 'appreciated', target: 'Carol Davis', category: 'Excellence', message: 'Exceptional work quality on the recent project', time: '2 hours ago' },
      { id: '2', actor: 'Bob Smith', action: 'created campaign', target: 'Tech Innovation', category: '', message: 'Launched new innovation campaign', time: '1 day ago' },
    ],
  };

  // Dummy badge data
  const badges = [
    { id: '1', name: 'Integrity', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum porttitor massa, sit amet efficitur elit. Nulla commodo enim at cursus tincidunt. Vestibulum ac laoreet eros. Etiam quis efficitur lectus.', image: 'badge_integrity.png' },
    { id: '2', name: 'Diversity', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum porttitor massa, sit amet efficitur elit. Nulla commodo enim at cursus tincidunt. Vestibulum ac laoreet eros. Etiam quis efficitur lectus.', image: 'badge_diversity.png' },
    { id: '3', name: 'Excellence', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum porttitor massa, sit amet efficitur elit. Nulla commodo enim at cursus tincidunt. Vestibulum ac laoreet eros. Etiam quis efficitur lectus.', image: 'badge_excellence.png' },
    { id: '4', name: 'Collaboration', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum porttitor massa, sit amet efficitur elit. Nulla commodo enim at cursus tincidunt. Vestibulum ac laoreet eros. Etiam quis efficitur lectus.', image: 'badge_collaboration.png' },
    { id: '5', name: 'Engagement', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum porttitor massa, sit amet efficitur elit. Nulla commodo enim at cursus tincidunt. Vestibulum ac laoreet eros. Etiam quis efficitur lectus.', image: 'badge_engagement.png' },
    { id: '6', name: 'Wellness', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum porttitor massa, sit amet efficitur elit. Nulla commodo enim at cursus tincidunt. Vestibulum ac laoreet eros. Etiam quis efficitur lectus.', image: 'badge_wellness.png' },
  ];

  const handleAddNewBadge = () => {
    setEditingBadge(null);
    setIsBadgeModalOpen(true);
  };

  const handleEditBadge = (badge: Badge) => {
    setEditingBadge(badge);
    setIsBadgeModalOpen(true);
  };

  const handleSaveBadge = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save logic
    setIsBadgeModalOpen(false);
    setEditingBadge(null);
  };

  const handleCloseBadgeModal = () => {
    setIsBadgeModalOpen(false);
    setEditingBadge(null);
  };

  const handleAddNewCampaign = () => {
    setEditingCampaign(null);
    setIsCampaignModalOpen(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsCampaignModalOpen(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save logic
    setIsCampaignModalOpen(false);
    setEditingCampaign(null);
  };

  const handleCloseCampaignModal = () => {
    setIsCampaignModalOpen(false);
    setEditingCampaign(null);
  };

  // Dummy campaign data
  const campaigns: Campaign[] = [
    { id: '1', name: 'Wellness', description: 'Recognize colleagues who demonstrate unwavering honesty, ethical behavior, and strong moral principles in everything they do. Integrity is the foundation of trust in our workplace.', badge: 'Wellness Badge', startDate: '2026/01/15', endDate: '2026/01/17', participants: 56, status: 'Active', image: 'wellness_campaign.jpg' },
  ];

  const allCampaigns: Campaign[] = [
    { id: '1', name: 'Campaign name', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ...', badge: 'Wellness', status: 'Ongoing', startDate: '2026/01/15', endDate: '2026/01/15', participants: 100, image: 'campaign.jpg' },
    { id: '2', name: 'Campaign name', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ...', badge: 'Wellness', status: 'Ongoing', startDate: '2026/01/15', endDate: '2026/01/15', participants: 100, image: 'campaign.jpg' },
    { id: '3', name: 'Campaign name', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ...', badge: 'Wellness', status: 'Completed', startDate: '2026/01/15', endDate: '2026/01/15', participants: 100, image: 'campaign.jpg' },
    { id: '4', name: 'Campaign name', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ...', badge: 'Wellness', status: 'Completed', startDate: '2026/01/15', endDate: '2026/01/15', participants: 100, image: 'campaign.jpg' },
    { id: '5', name: 'Campaign name', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ...', badge: 'Wellness', status: 'Completed', startDate: '2026/01/15', endDate: '2026/01/15', participants: 100, image: 'campaign.jpg' },
  ];

  // Dummy data for metrics
  const statsCards = [
    { title: 'Total Users', value: '2,847', change: '+12.5%', positive: true },
    { title: 'Recognitions Given', value: '15,234', change: '+8.2%', positive: true },
    { title: 'Active Campaigns', value: '12', change: '+3', positive: true },
    { title: 'Engagement Rate', value: '68.4%', change: '-2.1%', positive: false },
  ];

  const weeklyData = [
    { day: 'Mon', recognitions: 145, campaigns: 23 },
    { day: 'Tue', recognitions: 198, campaigns: 31 },
    { day: 'Wed', recognitions: 167, campaigns: 28 },
    { day: 'Thu', recognitions: 234, campaigns: 35 },
    { day: 'Fri', recognitions: 189, campaigns: 29 },
    { day: 'Sat', recognitions: 98, campaigns: 15 },
    { day: 'Sun', recognitions: 76, campaigns: 12 },
  ];

  const topBadges = [
    { name: 'Team Player', count: 456, color: 'bg-blue-500' },
    { name: 'Innovation', count: 389, color: 'bg-purple-500' },
    { name: 'Excellence', count: 342, color: 'bg-green-500' },
    { name: 'Collaboration', count: 298, color: 'bg-yellow-500' },
    { name: 'Leadership', count: 267, color: 'bg-red-500' },
  ];

  const recentActivity = [
    { user: 'Alice Chen', action: 'gave recognition to', target: 'Bob Smith', badge: 'Excellence', time: '2 min ago' },
    { user: 'Carol Davis', action: 'joined campaign', target: 'Wellness Challenge', badge: '', time: '15 min ago' },
    { user: 'David Wilson', action: 'received', target: '5 recognitions', badge: 'Team Player', time: '1 hour ago' },
    { user: 'Emma Brown', action: 'created campaign', target: 'Green Initiative', badge: '', time: '3 hours ago' },
    { user: 'Frank Miller', action: 'gave recognition to', target: 'Grace Lee', badge: 'Innovation', time: '5 hours ago' },
  ];

  const divisionData = [
    { division: 'Engineering', percentage: 35, users: 892 },
    { division: 'Sales', percentage: 25, users: 534 },
    { division: 'Marketing', percentage: 18, users: 412 },
    { division: 'HR', percentage: 12, users: 289 },
    { division: 'Operations', percentage: 10, users: 720 },
  ];

  let HelmetAny = Helmet as any; // Type assertion to bypass TypeScript issues with HelmetAny

  return (
    <>
      <HelmetAny>
        <title>CAP Admin Platform</title>
        <meta name="description" content="Admin dashboard for managing the Colleague Appreciation Platform" />
      </HelmetAny>

      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Search Bar */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search colleague"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Right: Exit Admin Mode Button */}
            <button
              onClick={onExitAdminMode}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Exit Admin Mode</span>
            </button>
          </div>
        </header>

        <div className="flex">
          {/* Left Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)]">
            <nav className="p-4">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => setActiveMenuItem(item)}
                      className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                        activeMenuItem === item
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">{activeMenuItem}</h1>
            
            {/* Dashboard Content */}
            {activeMenuItem === 'Dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statsCards.map((stat, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                      <p className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} from last week
                      </p>
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Weekly Activity Bar Chart */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                      {weeklyData.map((day, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full flex gap-1 items-end justify-center">
                            <div
                              className="bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                              style={{ height: `${(day.recognitions / 250) * 200}px` }}
                              title={`Recognitions: ${day.recognitions}`}
                            ></div>
                            <div
                              className="bg-purple-500 rounded-t transition-all hover:bg-purple-600"
                              style={{ height: `${(day.campaigns / 40) * 200}px` }}
                              title={`Campaigns: ${day.campaigns}`}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{day.day}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-sm text-gray-600">Recognitions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                        <span className="text-sm text-gray-600">Campaigns</span>
                      </div>
                    </div>
                  </div>

                  {/* Division Distribution Pie Chart */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recognition by Division</h3>
                    <div className="flex items-center gap-6">
                      <div className="relative w-48 h-48">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                          {divisionData.reduce((acc, div, index) => {
                            const offset = acc.offset;
                            const circle = (
                              <circle
                                key={index}
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke={['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'][index]}
                                strokeWidth="20"
                                strokeDasharray={`${div.percentage * 2.51} ${251 - div.percentage * 2.51}`}
                                strokeDashoffset={-offset}
                                className="transition-all duration-500"
                              />
                            );
                            acc.offset += div.percentage * 2.51;
                            acc.elements.push(circle);
                            return acc;
                          }, { offset: 0, elements: [] as React.ReactElement[] }).elements}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">2,847</p>
                            <p className="text-xs text-gray-600">Total Users</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        {divisionData.map((div, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded ${['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'][index]}`}></div>
                              <span className="text-sm text-gray-700">{div.division}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{div.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Badges */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Badges Awarded</h3>
                    <div className="space-y-4">
                      {topBadges.map((badge, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 ${badge.color} rounded-full flex items-center justify-center text-white font-bold`}>
                                {badge.name[0]}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{badge.name}</p>
                                <p className="text-sm text-gray-600">{badge.count} times awarded</p>
                              </div>
                            </div>
                            <span className="text-lg font-semibold text-gray-900">#{index + 1}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`${badge.color} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${(badge.count / 456) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {activity.user.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">{activity.user}</span>
                              {' '}{activity.action}{' '}
                              {activity.target && <span className="font-medium">{activity.target}</span>}
                              {activity.badge && (
                                <>
                                  {' '}
                                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                    {activity.badge}
                                  </span>
                                </>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Campaigns Content */}
            {activeMenuItem === 'Campaigns' && (
              <div className="space-y-6">
                {/* Active Campaign Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Campaign</h2>
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">{campaign.name}</h3>
                          <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>
                          
                          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{campaign.badge}</span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{campaign.startDate} - {campaign.endDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span>{campaign.participants} participants</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleEditCampaign(campaign)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Edit campaign
                          </button>
                        </div>
                        
                        <div>
                          <img
                            src="/images/wellness_campaign.jpg"
                            alt={campaign.name}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* All Campaigns Table */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">All campaigns</h2>
                    <button
                      onClick={handleAddNewCampaign}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      New campaign
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badge</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {allCampaigns.map((campaign) => (
                          <tr key={campaign.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{campaign.description}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                campaign.status === 'Ongoing'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {campaign.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{campaign.startDate}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{campaign.endDate}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{campaign.participants}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditCampaign(campaign)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button className="text-gray-400 hover:text-red-600">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Campaign Modal */}
                {isCampaignModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                          {editingCampaign ? 'Edit Campaign' : 'New/Edit Campaign'}
                        </h2>
                        
                        <form onSubmit={handleSaveCampaign}>
                          <div className="space-y-4">
                            {/* Campaign Name */}
                            <div>
                              <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign name
                              </label>
                              <input
                                type="text"
                                id="campaignName"
                                defaultValue={editingCampaign?.name || ''}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter campaign name"
                                required
                              />
                            </div>

                            {/* Campaign Badge */}
                            <div>
                              <label htmlFor="campaignBadge" className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign badge
                              </label>
                              <select
                                id="campaignBadge"
                                defaultValue={editingCampaign?.badge || ''}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              >
                                <option value="">Select badge</option>
                                <option value="Wellness">Wellness</option>
                                <option value="Integrity">Integrity</option>
                                <option value="Diversity">Diversity</option>
                                <option value="Excellence">Excellence</option>
                                <option value="Collaboration">Collaboration</option>
                                <option value="Engagement">Engagement</option>
                              </select>
                            </div>

                            {/* Campaign Description */}
                            <div>
                              <label htmlFor="campaignDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign description
                              </label>
                              <textarea
                                id="campaignDescription"
                                defaultValue={editingCampaign?.description || ''}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter campaign description"
                                required
                              />
                            </div>

                            {/* Start and End Date */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                                  Start date
                                </label>
                                <input
                                  type="date"
                                  id="startDate"
                                  defaultValue={editingCampaign?.startDate || ''}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                                  End date
                                </label>
                                <input
                                  type="date"
                                  id="endDate"
                                  defaultValue={editingCampaign?.endDate || ''}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-6">
                            <button
                              type="button"
                              onClick={handleCloseCampaignModal}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors font-medium"
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Badges Content */}
            {activeMenuItem === 'Badges' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Badges</h2>
                  <button
                    onClick={handleAddNewBadge}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New badge
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col items-center text-center">
                        {/* Badge Image Placeholder */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-4">
                          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{badge.name}</h3>
                        <p className="text-sm text-gray-600 mb-6 line-clamp-4">{badge.description}</p>
                        
                        <button
                          onClick={() => handleEditBadge(badge)}
                          className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Badge Modal */}
                {isBadgeModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                          {editingBadge ? 'Edit Badge' : 'New/Edit Badge'}
                        </h2>
                        
                        <form onSubmit={handleSaveBadge}>
                          <div className="space-y-4">
                            {/* Badge Name */}
                            <div>
                              <label htmlFor="badgeName" className="block text-sm font-medium text-gray-700 mb-2">
                                Badge name
                              </label>
                              <input
                                type="text"
                                id="badgeName"
                                defaultValue={editingBadge?.name || ''}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter badge name"
                                required
                              />
                            </div>

                            {/* Upload Badge Image */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload badge image
                              </label>
                              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  id="badgeImage"
                                />
                                <label htmlFor="badgeImage" className="cursor-pointer">
                                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  <p className="mt-2 text-sm text-gray-600">
                                    Upload image or drop image here
                                  </p>
                                </label>
                              </div>
                            </div>

                            {/* Badge Description */}
                            <div>
                              <label htmlFor="badgeDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                Badge description
                              </label>
                              <textarea
                                id="badgeDescription"
                                defaultValue={editingBadge?.description || ''}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter badge description"
                                required
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-6">
                            <button
                              type="button"
                              onClick={handleCloseBadgeModal}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors font-medium"
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Colleagues Content */}
            {activeMenuItem === 'Colleagues' && (
              <div className="space-y-6">
                {!selectedColleague ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Colleagues</h2>
                      <p className="text-sm text-gray-600">{colleagues.length} colleagues found</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {colleagues.map((colleague) => (
                        <div
                          key={colleague.id}
                          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => setSelectedColleague(colleague.id)}
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={`/images/${colleague.photo}`}
                              alt={colleague.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{colleague.name}</h3>
                              <p className="text-sm text-gray-600">{colleague.division}</p>
                              <p className="text-sm text-gray-600">{colleague.department}</p>
                            </div>
                          </div>
                          <button
                            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedColleague(colleague.id);
                            }}
                          >
                            View activities
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Colleague Detail View */}
                    <button
                      onClick={() => setSelectedColleague(null)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to search
                    </button>

                    {/* Colleague Profile Header */}
                    <div className="flex items-start gap-4 mb-8">
                      <img
                        src={`/images/${colleagues.find(c => c.id === selectedColleague)?.photo}`}
                        alt={colleagues.find(c => c.id === selectedColleague)?.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                          {colleagues.find(c => c.id === selectedColleague)?.name}
                        </h2>
                        <p className="text-gray-600">{colleagues.find(c => c.id === selectedColleague)?.division}</p>
                        <p className="text-gray-600">{colleagues.find(c => c.id === selectedColleague)?.department}</p>
                      </div>
                    </div>

                    {/* Activity Section */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Activity</h3>
                      <p className="text-sm text-gray-600 mb-6">
                        {(colleagueActivities[selectedColleague] || []).length} activities
                      </p>

                      <div className="space-y-4">
                        {(colleagueActivities[selectedColleague] || []).map((activity) => (
                          <div
                            key={activity.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                          >
                            <p className="text-sm text-gray-900 mb-2">
                              <span className="font-semibold text-blue-900">{activity.actor}</span>
                              {' '}{activity.action}{' '}
                              {activity.target && (
                                <span className="font-semibold text-blue-900">{activity.target}</span>
                              )}
                              {activity.category && (
                                <>
                                  {' '}for{' '}
                                  <span className="font-semibold text-blue-900">{activity.category}</span>
                                </>
                              )}
                            </p>
                            <p className="text-sm text-gray-700 mb-3">{activity.message}</p>
                            <p className="text-xs text-gray-500 mb-3">{activity.time}</p>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                              Go to original post
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
