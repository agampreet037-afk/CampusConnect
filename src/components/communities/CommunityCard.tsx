import React from 'react';
import { Community } from '../../types';
import { useApp } from '../../context/AppContext';
import { Users, Calendar, ArrowRight, Check, Plus } from 'lucide-react';

interface CommunityCardProps {
  community: Community;
  onViewDetails: (community: Community) => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ community, onViewDetails }) => {
  const { joinCommunity, leaveCommunity } = useApp();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-violet-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      
      {/* Cover Image & Category Badge */}
      <div className="relative h-32 sm:h-36 overflow-hidden cursor-pointer" onClick={() => onViewDetails(community)}>
        <img
          src={community.coverImage}
          alt={community.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
        
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-2xs">
          {community.category}
        </span>

        {/* Member count overlay */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white text-xs font-semibold">
          <Users className="w-3.5 h-3.5 text-violet-300" />
          <span>{community.membersCount} members</span>
          <span className="text-white/40">•</span>
          <span className="text-[11px] text-white/80">{community.recentActivity}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4
            onClick={() => onViewDetails(community)}
            className="text-base font-bold text-slate-900 font-heading hover:text-violet-600 cursor-pointer transition-colors leading-snug"
          >
            {community.name}
          </h4>
          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
            {community.tagline}
          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1">
            {community.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700"
              >
                #{tag}
              </span>
            ))}
            {community.tags.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center pl-1">
                +{community.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onViewDetails(community)}
            className="text-xs font-semibold text-slate-600 hover:text-violet-600 transition-colors flex items-center gap-1"
          >
            <span>View Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {community.isJoined ? (
            <button
              onClick={() => leaveCommunity(community.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-rose-50 hover:text-rose-600 border border-emerald-200 hover:border-rose-200 transition-all flex items-center gap-1 group/leave"
            >
              <Check className="w-3.5 h-3.5 group-hover/leave:hidden" />
              <span className="group-hover/leave:hidden">Joined</span>
              <span className="hidden group-hover/leave:inline">Leave</span>
            </button>
          ) : (
            <button
              onClick={() => joinCommunity(community.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all shadow-2xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Join Club</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
