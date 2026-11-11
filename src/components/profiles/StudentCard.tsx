import React from 'react';
import { StudentProfile } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Bookmark,
  Sparkles,
  UserPlus,
  Check,
  Clock,
  MessageSquare,
  Eye,
  GraduationCap,
} from 'lucide-react';

interface StudentCardProps {
  student: StudentProfile;
  onViewDetails: (student: StudentProfile) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onViewDetails }) => {
  const {
    getStudentCompatibility,
    getConnectionStatus,
    sendConnectionRequest,
    cancelConnectionRequest,
    toggleSaveStudent,
    isStudentSaved,
    openChatWithStudent,
  } = useApp();

  const compatibility = getStudentCompatibility(student);
  const connStatus = getConnectionStatus(student.id);
  const saved = isStudentSaved(student.id);

  // Score color badge
  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 70) return 'bg-violet-50 text-violet-700 border-violet-200';
    if (score >= 50) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-violet-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Header & Cover accent */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          
          {/* Avatar & Online status */}
          <div className="relative cursor-pointer" onClick={() => onViewDetails(student)}>
            <img
              src={student.avatar}
              alt={student.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-violet-200 transition-all shadow-xs"
            />
            {student.isOnline && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
                title="Online on campus"
              />
            )}
          </div>

          {/* Compatibility Badge & Bookmark */}
          <div className="flex items-center gap-1.5">
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border ${getScoreBadgeColor(
                compatibility.overallScore
              )}`}
              title={compatibility.summarySentence}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{compatibility.overallScore}% Match</span>
            </div>

            <button
              onClick={() => toggleSaveStudent(student.id)}
              className={`p-1.5 rounded-xl transition-colors border ${
                saved
                  ? 'bg-amber-50 text-amber-500 border-amber-200'
                  : 'bg-white text-slate-400 hover:text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title={saved ? 'Remove bookmark' : 'Bookmark student'}
              aria-label="Bookmark student"
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Student Name & Academic info */}
        <div>
          <h4
            className="text-base font-bold text-slate-900 font-heading hover:text-violet-600 cursor-pointer transition-colors leading-tight"
            onClick={() => onViewDetails(student)}
          >
            {student.name}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{student.department}</span>
            <span>•</span>
            <span className="shrink-0 font-medium text-slate-600">{student.academicYear}</span>
          </div>
        </div>

        {/* Bio preview */}
        <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
          {student.bio}
        </p>

        {/* Shared Interests Highlight Banner */}
        {compatibility.sharedInterests.length > 0 && (
          <div className="mt-3 p-2 rounded-xl bg-violet-50/70 border border-violet-100/80">
            <div className="flex items-center gap-1 text-[11px] font-bold text-violet-800 mb-1">
              <Sparkles className="w-3 h-3 text-violet-600" />
              <span>{compatibility.sharedInterests.length} Mutual Passions</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {compatibility.sharedInterests.slice(0, 3).map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white text-violet-700 border border-violet-200/60 shadow-2xs"
                >
                  {interest}
                </span>
              ))}
              {compatibility.sharedInterests.length > 3 && (
                <span className="text-[10px] text-violet-600 font-medium self-center pl-1">
                  +{compatibility.sharedInterests.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Top Skills Tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {student.skills.slice(0, 3).map((skill) => (
            <span
              key={skill.name}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700"
            >
              {skill.name}
            </span>
          ))}
          {student.skills.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center pl-1">
              +{student.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetails(student)}
          className="flex-1 py-1.5 px-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>Profile</span>
        </button>

        {/* Connection status action button */}
        {connStatus === 'connected' ? (
          <button
            onClick={() => openChatWithStudent(student.id)}
            className="flex-1 py-1.5 px-2.5 text-xs font-semibold text-violet-700 bg-violet-100/80 hover:bg-violet-200 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
        ) : connStatus === 'pending_sent' ? (
          <button
            onClick={() => cancelConnectionRequest(student.id)}
            className="flex-1 py-1.5 px-2.5 text-xs font-medium text-slate-500 bg-slate-200/80 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all flex items-center justify-center gap-1.5 group/cancel"
            title="Click to cancel outgoing request"
          >
            <Clock className="w-3.5 h-3.5 group-hover/cancel:hidden" />
            <span className="group-hover/cancel:hidden">Pending</span>
            <span className="hidden group-hover/cancel:inline">Cancel</span>
          </button>
        ) : connStatus === 'pending_received' ? (
          <button
            onClick={() => onViewDetails(student)}
            className="flex-1 py-1.5 px-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Respond</span>
          </button>
        ) : (
          <button
            onClick={() => sendConnectionRequest(student.id)}
            className="flex-1 py-1.5 px-2.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Connect</span>
          </button>
        )}
      </div>
    </div>
  );
};
