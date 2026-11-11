import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EditProfileModal } from '../components/profiles/EditProfileModal';
import { CommunityCard } from '../components/communities/CommunityCard';
import { CommunityDetailModal } from '../components/communities/CommunityDetailModal';
import { CircleCard } from '../components/activity-circles/CircleCard';
import { Community, ActivityCircle, StudentSkill } from '../types';
import {
  GraduationCap,
  Edit3,
  Award,
  Target,
  Users2,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, communities, activityCircles } = useApp();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'communities' | 'circles'>('overview');
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  const joinedCommunities = communities.filter((c: Community) => c.isJoined);
  const myCircles = activityCircles.filter((c: ActivityCircle) =>
    c.members.some((m) => m.id === currentUser.id)
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Profile Header Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Colorful Gradient Cover */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 relative" />

        <div className="px-6 pb-6 pt-0 sm:flex sm:items-end sm:justify-between -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-md bg-white"
              />
              <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white" />
            </div>

            <div className="mt-2 sm:mt-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  {currentUser.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700">
                  <ShieldCheck className="w-3 h-3 text-violet-600" />
                  <span>Campus Verified</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <GraduationCap className="w-3.5 h-3.5 text-violet-600" />
                  {currentUser.department}
                </span>
                <span>•</span>
                <span>{currentUser.academicYear}</span>
                <span>•</span>
                <span>{currentUser.college}</span>
              </div>

              {currentUser.statusMessage && (
                <p className="text-xs font-semibold text-violet-700 mt-1.5 bg-violet-50 px-2.5 py-1 rounded-lg inline-block border border-violet-100/80">
                  {currentUser.statusMessage}
                </p>
              )}
            </div>
          </div>

          {/* Action button */}
          <div className="mt-4 sm:mt-0 flex justify-center">
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-4 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Edit3 className="w-4 h-4 text-slate-600" />
              <span>Edit Profile & Passions</span>
            </button>
          </div>
        </div>

        {/* Bio row */}
        <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>{currentUser.bio}</p>

          {currentUser.lookingFor && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
              <Target className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Currently Looking For: </span>
                <span>{currentUser.lookingFor}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-violet-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Passions & Skills
        </button>
        <button
          onClick={() => setActiveTab('communities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'communities'
              ? 'bg-violet-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users2 className="w-3.5 h-3.5" />
          <span>My Communities ({joinedCommunities.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('circles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'circles'
              ? 'bg-violet-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Activity Circles ({myCircles.length})</span>
        </button>
      </div>

      {/* TAB 1: Passions & Skills */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Interests Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <Compass className="w-4 h-4 text-violet-600" />
                <span>Interests & Passions ({currentUser.interests.length})</span>
              </h3>
              <button
                onClick={() => setIsEditOpen(true)}
                className="text-xs font-bold text-violet-600 hover:underline"
              >
                Edit
              </button>
            </div>

            <p className="text-xs text-slate-500">
              These tags contribute 45% of your mathematical matching score across the discovery directory.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {currentUser.interests.map((interest: string) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200/80 shadow-2xs"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Skills Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <Award className="w-4 h-4 text-violet-600" />
                <span>Skills & Proficiency ({currentUser.skills.length})</span>
              </h3>
              <button
                onClick={() => setIsEditOpen(true)}
                className="text-xs font-bold text-violet-600 hover:underline"
              >
                Edit
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Shared technical and creative competencies calculate 25% of your compatibility.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentUser.skills.map((skill: StudentSkill) => (
                <div
                  key={skill.name}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-800">{skill.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-violet-700">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Goals Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3 md:col-span-2">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Target className="w-4 h-4 text-violet-600" />
              <span>Campus Ambitions ({currentUser.goals.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Aligned intentions (e.g. finding hackathon teammates, sports partners) form 20% of the affinity score.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {currentUser.goals.map((goal: string) => (
                <span
                  key={goal}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{goal}</span>
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Joined Communities */}
      {activeTab === 'communities' && (
        <div>
          {joinedCommunities.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
              <Users2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">You haven't joined any campus clubs yet.</p>
              <p className="text-xs text-slate-500 mt-1">Browse our active communities and join discussions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {joinedCommunities.map((comm: Community) => (
                <CommunityCard
                  key={comm.id}
                  community={comm}
                  onViewDetails={(c: Community) => setSelectedCommunity(c)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Activity Circles */}
      {activeTab === 'circles' && (
        <div>
          {myCircles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
              <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No activity circles joined yet.</p>
              <p className="text-xs text-slate-500 mt-1">Join an open sports, hackathon, or study circle.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myCircles.map((circle: ActivityCircle) => (
                <CircleCard key={circle.id} circle={circle} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />

      <CommunityDetailModal
        community={selectedCommunity}
        isOpen={!!selectedCommunity}
        onClose={() => setSelectedCommunity(null)}
      />

    </div>
  );
};
