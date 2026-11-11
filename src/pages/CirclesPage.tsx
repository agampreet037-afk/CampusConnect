import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ActivityCircle } from '../types';
import { CircleCard } from '../components/activity-circles/CircleCard';
import { CreateCircleModal } from '../components/activity-circles/CreateCircleModal';
import {
  CalendarDays,
  Plus,
  Search,
} from 'lucide-react';

export const CirclesPage: React.FC = () => {
  const { activityCircles, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'hosting' | 'open'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories = ['All', 'Hackathons', 'Sports', 'Creative', 'Study', 'Startups', 'Gaming'];

  const filteredCircles = useMemo(() => {
    return activityCircles.filter((circle: ActivityCircle) => {
      // Tab filter
      if (activeTab === 'my') {
        const isMember = circle.members.some((m) => m.id === currentUser.id);
        if (!isMember) return false;
      }
      if (activeTab === 'hosting') {
        if (circle.creatorId !== currentUser.id) return false;
      }
      if (activeTab === 'open') {
        if (circle.members.length >= circle.maxMembers) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && circle.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = circle.title.toLowerCase().includes(q);
        const matchDesc = circle.description.toLowerCase().includes(q);
        const matchLoc = circle.location.toLowerCase().includes(q);
        const matchTag = circle.tags.some((t: string) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchLoc && !matchTag) return false;
      }

      return true;
    });
  }, [activityCircles, activeTab, selectedCategory, searchQuery, currentUser]);

  const myCirclesCount = activityCircles.filter((c: ActivityCircle) =>
    c.members.some((m) => m.id === currentUser.id)
  ).length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Activity Circles
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
              {activityCircles.length} Active Circles
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Micro-gatherings organized by students. Assemble a hackathon team, find weekend sports partners, organize study groups, or plan photo walks.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Start a Circle</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/90 rounded-2xl shadow-2xs self-start">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-violet-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Circles ({activityCircles.length})
          </button>
          <button
            onClick={() => setActiveTab('open')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'open'
                ? 'bg-violet-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Open Spots
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my'
                ? 'bg-violet-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Joined ({myCirclesCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circles by title, activity or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
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

      {/* Grid of Circles */}
      {filteredCircles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 font-heading">
            No activity circles found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Be the first to gather peers for an upcoming project, sport, or hobby by starting a circle!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors"
          >
            Start a Circle Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCircles.map((circle: ActivityCircle) => (
            <CircleCard key={circle.id} circle={circle} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateCircleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

    </div>
  );
};
