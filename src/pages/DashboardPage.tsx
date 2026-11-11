import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentProfile, Community, ActivityCircle, ConnectionRecord } from '../types';
import { StudentCard } from '../components/profiles/StudentCard';
import { ProfileDetailModal } from '../components/profiles/ProfileDetailModal';
import { CommunityCard } from '../components/communities/CommunityCard';
import { CommunityDetailModal } from '../components/communities/CommunityDetailModal';
import { CircleCard } from '../components/activity-circles/CircleCard';
import { CreateCircleModal } from '../components/activity-circles/CreateCircleModal';
import {
  Sparkles,
  ArrowRight,
  UserPlus,
  Users2,
  CalendarDays,
  Compass,
  TrendingUp,
  Plus,
  Check,
  X,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    students,
    communities,
    activityCircles,
    connections,
    acceptConnectionRequest,
    declineConnectionRequest,
    getStudentCompatibility,
    setActiveView,
    getStudentById,
  } = useApp();

  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showCreateCircle, setShowCreateCircle] = useState(false);

  // Determine greeting based on local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = currentUser.name.split(' ')[0] || 'Friend';

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let score = 0;
    if (currentUser.name) score += 15;
    if (currentUser.bio && currentUser.bio.length > 20) score += 20;
    if (currentUser.interests.length >= 3) score += 25;
    if (currentUser.skills.length >= 2) score += 20;
    if (currentUser.goals.length >= 2) score += 20;
    return Math.min(100, score);
  };

  const profileCompletion = calculateProfileCompletion();

  // Pending incoming connection requests
  const pendingRequests = connections.filter((c: ConnectionRecord) => c.status === 'pending_received');

  // Top recommended students sorted by dynamic compatibility
  const recommendedStudents = [...students]
    .map((student: StudentProfile) => ({
      student,
      compat: getStudentCompatibility(student),
    }))
    .sort((a, b) => b.compat.overallScore - a.compat.overallScore)
    .slice(0, 4)
    .map((item) => item.student);

  // Joined communities
  const joinedCommunities = communities.filter((c: Community) => c.isJoined);

  // Popular campus interests
  const campusTrending = [
    { name: 'Artificial Intelligence', count: 412, icon: '🤖' },
    { name: 'Weekend Football', count: 320, icon: '⚽' },
    { name: 'Photography Walks', count: 245, icon: '📸' },
    { name: 'Student Startups', count: 218, icon: '🚀' },
    { name: 'Figma & UI/UX', count: 195, icon: '🎨' },
    { name: 'Competitive Coding', count: 280, icon: '💻' },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Hero Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 shadow-lg shadow-violet-900/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-violet-100 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus Network Active</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight">
            {getGreeting()}, {firstName}! Ready to find your people?
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-violet-100/90 leading-relaxed max-w-xl">
            {currentUser.department} • {currentUser.academicYear} • You share active campus affinities with over 20+ peers looking for collaborators and friends.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveView('discover')}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-violet-50 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-violet-600" />
              <span>Explore Discover Feed</span>
            </button>

            <button
              onClick={() => setShowCreateCircle(true)}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl border border-white/30 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Start Activity Circle</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Pending Requests Notification Bar (if any) */}
      {pendingRequests.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-950 font-heading">
                  {pendingRequests.length} Pending Connection Request{pendingRequests.length > 1 ? 's' : ''}
                </h4>
                <p className="text-xs text-amber-800">
                  Fellow students want to connect with you based on shared campus passions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {pendingRequests.slice(0, 1).map((req: ConnectionRecord) => {
                const requester = getStudentById(req.studentId);
                if (!requester) return null;
                return (
                  <div key={req.id} className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedStudent(requester)}
                      className="text-xs font-semibold text-amber-900 underline hover:text-amber-950"
                    >
                      View {requester.name}
                    </button>
                    <button
                      onClick={() => acceptConnectionRequest(requester.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => declineConnectionRequest(requester.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-amber-100"
                      aria-label="Decline request"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              {pendingRequests.length > 1 && (
                <button
                  onClick={() => setActiveView('connections')}
                  className="text-xs font-bold text-amber-900 hover:underline ml-2"
                >
                  View All ({pendingRequests.length})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Profile Completion & Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Profile Completion Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Profile Readiness
              </span>
              <span className="text-xs font-extrabold text-violet-600">
                {profileCompletion}% Complete
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 font-heading">
              {profileCompletion === 100
                ? 'Your profile is fully optimized!'
                : 'Boost your compatibility accuracy'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Adding diverse interests and skills refines the 4-pillar matching algorithm.
            </p>

            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-violet-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {currentUser.interests.length} interests • {currentUser.skills.length} skills
            </span>
            <button
              onClick={() => setActiveView('profile')}
              className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              <span>Edit Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Network Reach Stats */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Campus Footprint
            </span>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="p-2 rounded-xl bg-slate-50">
                <p className="text-xl font-extrabold text-violet-700 font-heading">
                  {connections.filter((c: ConnectionRecord) => c.status === 'connected').length}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">Connections</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50">
                <p className="text-xl font-extrabold text-indigo-700 font-heading">
                  {joinedCommunities.length}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">Clubs Joined</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50">
                <p className="text-xl font-extrabold text-purple-700 font-heading">
                  {activityCircles.filter((c: ActivityCircle) => c.members.some((m) => m.id === currentUser.id)).length}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">My Circles</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Active campus student</span>
            <button
              onClick={() => setActiveView('connections')}
              className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              <span>Manage Network</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Trending on Campus */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-violet-600" />
                Trending on Campus
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {campusTrending.slice(0, 5).map((item) => (
                <span
                  key={item.name}
                  onClick={() => setActiveView('discover')}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-violet-50 hover:text-violet-700 cursor-pointer transition-all"
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Updated hourly from student tags</span>
            <button
              onClick={() => setActiveView('discover')}
              className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              <span>Filter by Trend</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 4. Top Recommended Students Carousel/Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>Recommended Students For You</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked dynamically based on shared interests (45%), skills (25%), and goals (20%).
            </p>
          </div>

          <button
            onClick={() => setActiveView('discover')}
            className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
          >
            <span>See All ({students.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedStudents.map((student: StudentProfile) => (
            <StudentCard
              key={student.id}
              student={student}
              onViewDetails={(s: StudentProfile) => setSelectedStudent(s)}
            />
          ))}
        </div>
      </div>

      {/* 5. Upcoming Activity Circles & Communities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Activity Circles */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-heading flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-violet-600" />
                <span>Upcoming Activity Circles</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Casual micro-groups forming for hackathons, sports, photo walks, and study.
              </p>
            </div>

            <button
              onClick={() => setActiveView('circles')}
              className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              <span>Explore Circles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activityCircles.slice(0, 4).map((circle: ActivityCircle) => (
              <CircleCard key={circle.id} circle={circle} />
            ))}
          </div>
        </div>

        {/* Right Col: Popular Communities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <Users2 className="w-4 h-4 text-violet-600" />
              <span>Campus Communities</span>
            </h3>
            <button
              onClick={() => setActiveView('communities')}
              className="text-xs font-bold text-violet-600 hover:text-violet-700"
            >
              View Hub
            </button>
          </div>

          <div className="space-y-3">
            {communities.slice(0, 3).map((comm: Community) => (
              <div
                key={comm.id}
                onClick={() => setSelectedCommunity(comm)}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-violet-300 hover:shadow-2xs transition-all cursor-pointer flex items-center gap-3.5"
              >
                <img
                  src={comm.coverImage}
                  alt={comm.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-violet-600 uppercase">
                    {comm.category}
                  </span>
                  <h5 className="text-xs font-bold text-slate-900 truncate font-heading">
                    {comm.name}
                  </h5>
                  <p className="text-[11px] text-slate-500">{comm.membersCount} active members</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modals */}
      <ProfileDetailModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      <CommunityDetailModal
        community={selectedCommunity}
        isOpen={!!selectedCommunity}
        onClose={() => setSelectedCommunity(null)}
      />

      <CreateCircleModal
        isOpen={showCreateCircle}
        onClose={() => setShowCreateCircle(false)}
      />

    </div>
  );
};
