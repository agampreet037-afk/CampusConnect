import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Sparkles,
  GraduationCap,
  Bookmark,
  MessageSquare,
  UserPlus,
  Check,
  X,
  ShieldAlert,
  Github,
  Linkedin,
  Globe,
  Share2,
  Calendar,
  Compass,
  Award,
  Target,
} from 'lucide-react';

interface ProfileDetailModalProps {
  student: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    getStudentCompatibility,
    getConnectionStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    cancelConnectionRequest,
    removeConnection,
    toggleSaveStudent,
    isStudentSaved,
    openChatWithStudent,
    reportStudent,
    blockStudent,
  } = useApp();

  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate content or impersonation');

  if (!student) return null;

  const isSelf = student.id === currentUser.id;
  const compatibility = getStudentCompatibility(student);
  const connStatus = getConnectionStatus(student.id);
  const saved = isStudentSaved(student.id);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
        <div className="space-y-6">
          
          {/* Header Banner & Profile Information */}
          <div className="relative -mt-6 -mx-6 p-6 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 text-white rounded-t-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-md"
                  />
                  {student.isOnline && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-white" />
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold font-heading text-white tracking-tight">
                    {student.name}
                  </h3>
                  <div className="flex items-center gap-2 text-violet-100 text-xs sm:text-sm mt-0.5">
                    <GraduationCap className="w-4 h-4 text-violet-200" />
                    <span>{student.department}</span>
                    <span>•</span>
                    <span>{student.academicYear}</span>
                  </div>
                  <p className="text-violet-200 text-xs mt-0.5">{student.college}</p>
                </div>
              </div>

              {/* Match Score Badge */}
              {!isSelf && (
                <div className="flex sm:flex-col items-center sm:items-end gap-1.5 bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 self-stretch sm:self-auto justify-between">
                  <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-lg">
                    <Sparkles className="w-4 h-4" />
                    <span>{compatibility.overallScore}%</span>
                  </div>
                  <span className="text-[11px] text-white/90 font-medium">Compatibility</span>
                </div>
              )}
            </div>
          </div>

          {/* Compatibility Breakdown (If not self) */}
          {!isSelf && (
            <div className="p-4 rounded-2xl bg-violet-50/80 border border-violet-100 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold uppercase tracking-wider text-violet-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  Compatibility Analysis
                </h5>
                <span className="text-xs font-semibold text-violet-700">
                  {compatibility.summarySentence}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-violet-100/60">
                "{compatibility.explanation}"
              </p>

              {/* Progress meters for 4 algorithm pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-white p-2.5 rounded-xl border border-violet-100/70 text-center">
                  <p className="text-[10px] text-slate-500 font-medium">Shared Interests</p>
                  <p className="text-sm font-bold text-violet-700 mt-0.5">
                    {compatibility.breakdown.interestsScore} <span className="text-[10px] text-slate-400">/ 45</span>
                  </p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className="bg-violet-600 h-full rounded-full"
                      style={{ width: `${(compatibility.breakdown.interestsScore / 45) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-violet-100/70 text-center">
                  <p className="text-[10px] text-slate-500 font-medium">Shared Skills</p>
                  <p className="text-sm font-bold text-indigo-700 mt-0.5">
                    {compatibility.breakdown.skillsScore} <span className="text-[10px] text-slate-400">/ 25</span>
                  </p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${(compatibility.breakdown.skillsScore / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-violet-100/70 text-center">
                  <p className="text-[10px] text-slate-500 font-medium">Goal Alignment</p>
                  <p className="text-sm font-bold text-purple-700 mt-0.5">
                    {compatibility.breakdown.goalsScore} <span className="text-[10px] text-slate-400">/ 20</span>
                  </p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: `${(compatibility.breakdown.goalsScore / 20) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-violet-100/70 text-center">
                  <p className="text-[10px] text-slate-500 font-medium">Department/Campus</p>
                  <p className="text-sm font-bold text-pink-700 mt-0.5">
                    {compatibility.breakdown.academicScore} <span className="text-[10px] text-slate-400">/ 10</span>
                  </p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className="bg-pink-600 h-full rounded-full"
                      style={{ width: `${(compatibility.breakdown.academicScore / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bio & Looking For */}
          <div className="space-y-3">
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">About</h5>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">{student.bio}</p>
            </div>

            {student.lookingFor && (
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
                <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-amber-600" />
                  Currently Looking For:
                </p>
                <p className="text-xs text-amber-800 mt-1">{student.lookingFor}</p>
              </div>
            )}
          </div>

          {/* Interests */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Interests & Passions
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {student.interests.map((interest) => {
                const isShared = currentUser.interests
                  .map((i) => i.toLowerCase().trim())
                  .includes(interest.toLowerCase().trim());

                return (
                  <span
                    key={interest}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                      isShared
                        ? 'bg-violet-600 text-white border-violet-600 shadow-2xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isShared && '★ '}
                    {interest}
                  </span>
                );
              })}
            </div>
            {!isSelf && (
              <p className="text-[11px] text-slate-400 mt-1.5">
                ★ Marked interests represent passions shared with you.
              </p>
            )}
          </div>

          {/* Skills with Proficiency Level */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Skills & Experience
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {student.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-slate-800 truncate mr-2">
                    {skill.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-violet-700 shrink-0">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Campus Goals
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {student.goals.map((goal) => (
                <span
                  key={goal}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links & Meta */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Joined {student.joinedDate}
            </span>

            <div className="flex items-center gap-2">
              {student.socialLinks?.github && (
                <a
                  href={student.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {student.socialLinks?.linkedin && (
                <a
                  href={student.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {student.socialLinks?.portfolio && (
                <a
                  href={student.socialLinks.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                  aria-label="Portfolio"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Action Footer */}
          {!isSelf && (
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSaveStudent(student.id)}
                  className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-medium ${
                    saved
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500' : ''}`} />
                  <span>{saved ? 'Saved' : 'Bookmark'}</span>
                </button>

                <button
                  onClick={() => setShowReportDialog(true)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors text-xs flex items-center gap-1"
                  title="Safety & Report options"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span className="hidden sm:inline">Safety</span>
                </button>
              </div>

              {/* Main connect / message buttons */}
              <div className="flex items-center gap-2">
                {connStatus === 'connected' ? (
                  <>
                    <button
                      onClick={() => {
                        removeConnection(student.id);
                        onClose();
                      }}
                      className="px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
                    >
                      Remove Connection
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        openChatWithStudent(student.id);
                      }}
                      className="px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </>
                ) : connStatus === 'pending_received' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        declineConnectionRequest(student.id);
                        onClose();
                      }}
                      className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => {
                        acceptConnectionRequest(student.id);
                        onClose();
                      }}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Request</span>
                    </button>
                  </div>
                ) : connStatus === 'pending_sent' ? (
                  <button
                    onClick={() => {
                      cancelConnectionRequest(student.id);
                      onClose();
                    }}
                    className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-xl border border-slate-200 transition-colors"
                  >
                    Cancel Outgoing Request
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sendConnectionRequest(student.id);
                    }}
                    className="px-5 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Connect with {student.name.split(' ')[0]}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Report / Block Dialog */}
      {showReportDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-rose-600 mb-3">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="text-base font-bold text-slate-900">Safety & Moderation</h4>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              CampusConnect is committed to a friendly and safe student environment. How would you like to handle this profile?
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-slate-700">Reason for reporting</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option>Inappropriate bio or profile content</option>
                  <option>Spam or commercial promotion</option>
                  <option>Harassment or unwelcome messages</option>
                  <option>Impersonation of another student</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  reportStudent(student.id, reportReason);
                  setShowReportDialog(false);
                }}
                className="w-full py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors"
              >
                Submit Safety Report
              </button>
              <button
                onClick={() => {
                  blockStudent(student.id);
                  setShowReportDialog(false);
                  onClose();
                }}
                className="w-full py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors"
              >
                Block Student Profile
              </button>
              <button
                onClick={() => setShowReportDialog(false)}
                className="w-full py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
