import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentProfile } from '../types';
import {
  RotateCcw,
  Shield,
  Sparkles,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    students,
    switchDemoUser,
    resetDemoData,
    blockedStudentIds,
    addToast,
    setActiveView,
    getStudentById,
    setIsNamePromptOpen,
  } = useApp();

  const [visibility, setVisibility] = useState('Campus Wide (Public to Students)');
  const [allowDMs, setAllowDMs] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const blockedStudents = blockedStudentIds
    .map((id: string) => getStudentById(id))
    .filter((s): s is StudentProfile => s !== undefined);

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Settings & Demo Controls
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your student experience, explore hackathon presentation tools, and manage privacy.
        </p>
      </div>

      {/* Demo Presentation Panel (Crucial for Hackathon presentation) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-900 via-indigo-900 to-purple-950 text-white shadow-lg space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="text-lg font-bold font-heading">Hackathon Demo Controls</h3>
          </div>
          <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full bg-white/20 border border-white/20">
            Judge Toolkit
          </span>
        </div>

        <p className="text-xs text-violet-200 leading-relaxed max-w-2xl">
          Quickly switch active student personas to demonstrate the dynamic matching algorithm from multiple student viewpoints (e.g., Computer Science vs. Design vs. Sports).
        </p>

        {/* Persona quick switch grid */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-violet-300 mb-2.5">
            Switch Active Student Persona:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {students.slice(0, 6).map((student: StudentProfile) => {
              const isActive = currentUser.id === student.id;

              return (
                <button
                  key={student.id}
                  onClick={() => switchDemoUser(student.id)}
                  className={`p-3 rounded-2xl text-left flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-md ring-2 ring-amber-400'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{student.name}</p>
                    <p className={`text-[10px] truncate ${isActive ? 'text-slate-500' : 'text-violet-200'}`}>
                      {student.department.split('&')[0]}
                    </p>
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset & Onboarding actions */}
        <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsNamePromptOpen(true)}
              className="px-4 py-2 text-xs font-bold text-violet-950 bg-amber-300 hover:bg-amber-200 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-900" />
              <span>Change My Student Name</span>
            </button>

            <button
              onClick={() => setActiveView('onboarding')}
              className="px-4 py-2 text-xs font-bold text-violet-900 bg-white hover:bg-violet-50 rounded-xl transition-all shadow-xs"
            >
              Launch Onboarding Walkthrough
            </button>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 text-xs font-bold text-rose-200 hover:text-white bg-white/10 hover:bg-rose-900/60 rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial</span>
          </button>
        </div>
      </div>

      {/* Privacy & Safety Settings */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-600" />
            <span>Privacy & Communication Preferences</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Control how your profile and campus availability appear to other students.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Profile Directory Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => {
                setVisibility(e.target.value);
                addToast('Visibility updated', 'info');
              }}
              className="w-full sm:w-80 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option>Campus Wide (Public to Students)</option>
              <option>Same Department Only</option>
              <option>Hidden from Directory (Direct Links Only)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div>
              <p className="text-xs font-bold text-slate-800">Allow Direct Peer Messages</p>
              <p className="text-[11px] text-slate-500">
                Permit students with high compatibility to reach out regarding projects and circles.
              </p>
            </div>
            <button
              onClick={() => {
                setAllowDMs(!allowDMs);
                addToast(allowDMs ? 'Direct messages disabled' : 'Direct messages enabled', 'info');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                allowDMs ? 'bg-violet-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  allowDMs ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Blocked students list */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Blocked Profiles ({blockedStudents.length})
          </h4>
          {blockedStudents.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No blocked students.</p>
          ) : (
            <div className="space-y-2">
              {blockedStudents.map((b: StudentProfile) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-slate-800">{b.name}</span>
                  <button
                    onClick={() => addToast(`Unblocked ${b.name}`, 'info')}
                    className="text-xs text-violet-600 hover:underline"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* About & Campus Safety Note */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs text-slate-600">
        <h4 className="font-bold text-slate-900 font-heading">CampusConnect Safety & Integrity</h4>
        <p>
          • CampusConnect utilizes fictional student profiles and sample records for demonstration purposes during collegiate hackathons.
        </p>
        <p>
          • The compatibility scoring is calculated purely client-side through deterministic weighted matching: Shared Interests (45%), Shared Skills (25%), Similar Goals (20%), and Department Context (10%).
        </p>
        <p>
          • No external API keys or external server dependencies are required. All state changes are stored safely in your browser's localStorage.
        </p>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Reset All Demo Data?</h4>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              This will restore all 20+ student profiles, communities, circles, and messages to their initial fresh demo state.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
