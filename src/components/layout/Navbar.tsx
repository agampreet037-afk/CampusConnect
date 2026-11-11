import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Users,
  MessageSquare,
  Sparkles,
  RotateCcw,
  UserCheck,
  Search,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    resetDemoData,
    students,
    switchDemoUser,
    connections,
    conversations,
    setIsNamePromptOpen,
  } = useApp();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const pendingReceivedCount = connections.filter((c) => c.status === 'pending_received').length;
  const unreadMessagesCount = conversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView(activeView === 'landing' ? 'dashboard' : 'dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-700 via-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-heading">
                Campus<span className="text-violet-600">Connect</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 text-violet-700">
                Demo
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block leading-none">Find your people on campus</p>
          </div>
        </div>

        {/* Global Quick Search / Shortcut */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <button
            onClick={() => setActiveView('discover')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/60 rounded-xl transition-all text-left"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search students by interests, skills or dept...</span>
            </span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-500 shadow-2xs">
              /
            </kbd>
          </button>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Landing / App Toggle */}
          {activeView === 'landing' ? (
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Go to App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveView('landing')}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors hidden sm:flex items-center gap-1"
            >
              <span>Landing Page</span>
            </button>
          )}

          {/* Demo Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              title="Switch demo student persona"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-violet-500/30"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 truncate max-w-[100px]">{currentUser.department.split('&')[0]}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Persona Switcher Dropdown */}
            {showPersonaMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowPersonaMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Demo Personas</p>
                    <p className="text-[11px] text-slate-500">Switch persona to test matching & perspectives</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    <button
                      onClick={() => {
                        setShowPersonaMenu(false);
                        setActiveView('profile');
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl bg-violet-50 text-left border border-violet-100"
                    >
                      <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1 truncate">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-violet-900 truncate">{currentUser.name}</p>
                          <span className="text-[9px] bg-violet-200 text-violet-800 px-1 rounded font-medium">Active</span>
                        </div>
                        <p className="text-[11px] text-violet-700 truncate">{currentUser.department}</p>
                      </div>
                    </button>

                    <p className="text-[10px] font-semibold text-slate-400 px-3 pt-2">Switch to another student:</p>
                    {students.slice(0, 5).map((student) => (
                      <button
                        key={student.id}
                        onClick={() => {
                          switchDemoUser(student.id);
                          setShowPersonaMenu(false);
                        }}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                      >
                        <img src={student.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                        <div className="flex-1 truncate">
                          <p className="text-xs font-semibold text-slate-800 truncate">{student.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{student.department}</p>
                        </div>
                        <UserCheck className="w-3.5 h-3.5 text-slate-300 hover:text-violet-600" />
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 mt-1 border-t border-slate-100 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setShowPersonaMenu(false);
                        setIsNamePromptOpen(true);
                      }}
                      className="w-full py-1.5 text-center text-xs text-slate-700 font-semibold hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Edit My Name / Persona</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowPersonaMenu(false);
                        setActiveView('onboarding');
                      }}
                      className="w-full py-1.5 text-center text-xs text-violet-600 font-semibold hover:bg-violet-50 rounded-lg transition-colors"
                    >
                      Restart Onboarding Walkthrough
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Reset demo data to initial state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Reset Demo Data?</h4>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              This will restore all sample student profiles, communities, circles, and messages to their fresh hackathon state.
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
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-xs transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
