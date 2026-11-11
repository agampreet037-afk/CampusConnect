import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Community } from '../types';
import { CommunityCard } from '../components/communities/CommunityCard';
import { CommunityDetailModal } from '../components/communities/CommunityDetailModal';
import { CreateCommunityModal } from '../components/communities/CreateCommunityModal';
import {
  Users2,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';

export const CommunitiesPage: React.FC = () => {
  const { communities, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'recommended'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories = [
    'All',
    'Technology',
    'Sports & Fitness',
    'Creative Arts',
    'Business & Startups',
    'Lifestyle & Hobbies',
  ];

  const filteredCommunities = useMemo(() => {
    return communities.filter((comm: Community) => {
      // Tab filter
      if (activeTab === 'my' && !comm.isJoined) return false;
      if (activeTab === 'recommended') {
        // Recommend if category matches user's interests or not joined
        const hasMutualTag = comm.tags.some((tag: string) =>
          currentUser.interests.some((i: string) => i.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMutualTag && !comm.isJoined) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && comm.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = comm.name.toLowerCase().includes(q);
        const matchTagline = comm.tagline.toLowerCase().includes(q);
        const matchTag = comm.tags.some((t: string) => t.toLowerCase().includes(q));
        if (!matchName && !matchTagline && !matchTag) return false;
      }

      return true;
    });
  }, [communities, activeTab, selectedCategory, searchQuery, currentUser]);

  const myJoinedCount = communities.filter((c: Community) => c.isJoined).length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Campus Communities
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
              {communities.length} Clubs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Discover student-run societies, interest hubs, and athletic guilds. Join discussions, share announcements, and attend meetups.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Community</span>
        </button>
      </div>

      {/* Tabs & Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/90 rounded-2xl shadow-2xs self-start">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-violet-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Communities ({communities.length})
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my'
                ? 'bg-violet-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Joined Clubs ({myJoinedCount})
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'recommended'
                ? 'bg-violet-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search communities by name or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Communities */}
      {filteredCommunities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
          <Users2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 font-heading">
            No communities found in this category
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try choosing a different tab or start a brand new campus community yourself!
          </p>
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors"
          >
            View All Communities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCommunities.map((comm: Community) => (
            <CommunityCard
              key={comm.id}
              community={comm}
              onViewDetails={(c: Community) => setSelectedCommunity(c)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CommunityDetailModal
        community={selectedCommunity}
        isOpen={!!selectedCommunity}
        onClose={() => setSelectedCommunity(null)}
      />

      <CreateCommunityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

    </div>
  );
};
