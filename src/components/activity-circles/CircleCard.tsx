import React from 'react';
import { ActivityCircle } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Check,
  Plus,
  ArrowRight,
} from 'lucide-react';

interface CircleCardProps {
  circle: ActivityCircle;
  onViewDetails?: (circle: ActivityCircle) => void;
}

export const CircleCard: React.FC<CircleCardProps> = ({ circle, onViewDetails }) => {
  const { currentUser, joinCircle, leaveCircle } = useApp();

  const isMember = circle.members.some((m) => m.id === currentUser.id);
  const isHost = circle.creatorId === currentUser.id;
  const isFull = circle.members.length >= circle.maxMembers;
  const spotsLeft = Math.max(0, circle.maxMembers - circle.members.length);

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'hackathons':
      case 'hackathon':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'sports':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'creative':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'study':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'startups':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-violet-300 hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between group">
      <div>
        
        {/* Header: Category Badge & Spots Remaining */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getCategoryColor(
              circle.category
            )}`}
          >
            {circle.category}
          </span>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] ${
                isFull
                  ? 'bg-rose-100 text-rose-700'
                  : spotsLeft === 1
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isFull ? 'Full circle' : `${spotsLeft} spot${spotsLeft > 1 ? 's' : ''} left`}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 font-heading leading-snug group-hover:text-violet-600 transition-colors">
          {circle.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
          {circle.description}
        </p>

        {/* Date, Time, Location pills */}
        <div className="mt-4 space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-violet-500 shrink-0" />
            <span className="font-medium text-slate-700">{circle.date}</span>
            <span className="text-slate-300">•</span>
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{circle.time}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{circle.location}</span>
          </div>
        </div>

        {/* Member Avatars & Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {circle.members.length} / {circle.maxMembers} joined
              </span>
            </span>

            {/* Member avatar stack */}
            <div className="flex -space-x-2 overflow-hidden">
              {circle.members.map((member) => (
                <img
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  title={`${member.name} (${member.role})`}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                />
              ))}
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFull ? 'bg-slate-400' : 'bg-violet-600'
              }`}
              style={{ width: `${(circle.members.length / circle.maxMembers) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Host and Action */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={circle.creatorAvatar}
            alt={circle.creatorName}
            className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
          />
          <div className="truncate">
            <p className="text-[11px] font-semibold text-slate-800 truncate">
              {isHost ? 'You (Host)' : circle.creatorName}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{circle.creatorDept}</p>
          </div>
        </div>

        {/* Action button */}
        {isHost ? (
          <span className="px-3 py-1 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 border border-violet-100">
            Hosting
          </span>
        ) : isMember ? (
          <button
            onClick={() => leaveCircle(circle.id)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-rose-50 hover:text-rose-600 border border-emerald-200 hover:border-rose-200 transition-all flex items-center gap-1 group/btn"
          >
            <Check className="w-3.5 h-3.5 group-hover/btn:hidden" />
            <span className="group-hover/btn:hidden">Joined</span>
            <span className="hidden group-hover/btn:inline">Leave</span>
          </button>
        ) : isFull ? (
          <button
            disabled
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 bg-slate-100 cursor-not-allowed"
          >
            Full
          </button>
        ) : (
          <button
            onClick={() => joinCircle(circle.id)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all shadow-2xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Join Circle</span>
          </button>
        )}
      </div>
    </div>
  );
};
