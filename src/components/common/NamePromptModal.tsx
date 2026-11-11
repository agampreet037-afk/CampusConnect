import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AcademicYear } from '../../types';
import { DEPARTMENTS, ACADEMIC_YEARS } from '../../data/mockData';
import { Sparkles, ArrowRight, Check, User } from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
];

export const NamePromptModal: React.FC = () => {
  const { isNamePromptOpen, setAppUserName, currentUser } = useApp();

  const [enteredName, setEnteredName] = useState(
    currentUser.name === 'Student Explorer' || currentUser.name === 'Agam Sharma' ? '' : currentUser.name
  );
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar || AVATAR_PRESETS[0]);
  const [selectedDept, setSelectedDept] = useState(currentUser.department || DEPARTMENTS[0]);
  const [selectedYear, setSelectedYear] = useState<AcademicYear>(currentUser.academicYear || '3rd Year');
  const [error, setError] = useState('');

  if (!isNamePromptOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = enteredName.trim();
    if (!cleanName) {
      setError('Please enter your name to continue.');
      return;
    }
    setError('');
    setAppUserName(cleanName, selectedDept, selectedAvatar, selectedYear);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto transform transition-all">
        
        {/* Header Ribbon */}
        <div className="p-6 pb-5 bg-gradient-to-r from-violet-700 via-indigo-600 to-purple-700 text-white text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center mb-3 shadow-inner border border-white/30">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight font-heading">
            Welcome to CampusConnect
          </h2>
          <p className="text-xs sm:text-sm text-violet-100/90 mt-1 max-w-sm mx-auto leading-relaxed">
            Discover students who share your passions, hobbies, skills, and campus ambitions.
          </p>

          {/* Decorative blur ball */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          
          {/* Name Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              What's your name? *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                required
                placeholder="Enter your name (e.g. Alex Sharma, Maya, Jordan...)"
                value={enteredName}
                onChange={(e) => {
                  setEnteredName(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-10 pr-4 py-3 text-sm font-semibold rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-2xs transition-all placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
            {error ? (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">{error}</p>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1.5">
                This name will be displayed on your profile, activity circles, and peer messages.
              </p>
            )}
          </div>

          {/* Avatar Preset Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Choose an Avatar
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {AVATAR_PRESETS.map((avatarUrl) => (
                <button
                  type="button"
                  key={avatarUrl}
                  onClick={() => setSelectedAvatar(avatarUrl)}
                  className={`relative shrink-0 rounded-2xl p-0.5 transition-all ${
                    selectedAvatar === avatarUrl
                      ? 'ring-3 ring-violet-600 scale-105'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={avatarUrl}
                    alt="Preset avatar"
                    className="w-11 h-11 rounded-xl object-cover"
                  />
                  {selectedAvatar === avatarUrl && (
                    <span className="absolute -bottom-1 -right-1 bg-violet-600 text-white p-0.5 rounded-full shadow-2xs">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Department and Academic Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Academic Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value as AcademicYear)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
              >
                {ACADEMIC_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Start Exploring Campus</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
