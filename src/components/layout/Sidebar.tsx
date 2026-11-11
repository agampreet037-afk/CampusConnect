import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  Users2,
  CalendarDays,
  UserPlus,
  MessageSquare,
  User,
  Settings,
  Sparkles,
  Bookmark,
  ChevronRight,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    connections,
    conversations,
    savedStudentIds,
    currentUser,
  } = useApp();

  const pendingReceivedCount = connections.filter((c) => c.status === 'pending_received').length;
  const unreadMessagesCount = conversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'discover', label: 'Discover Students', icon: Compass, badge: 'Match' },
    { id: 'communities', label: 'Communities', icon: Users2 },
    { id: 'circles', label: 'Activity Circles', icon: CalendarDays },
    {
      id: 'connections',
      label: 'Connections',
      icon: UserPlus,
      count: pendingReceivedCount > 0 ? pendingReceivedCount : undefined,
      countColor: 'bg-violet-600 text-white',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      count: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      countColor: 'bg-rose-500 text-white',
    },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-violet-50 text-violet-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-violet-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && !item.count && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.countColor}`}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Shortcut Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-purple-500/10 border border-violet-100">
          <div className="flex items-center gap-2 text-violet-900 mb-1.5">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <h5 className="text-xs font-bold font-heading">Find Hackathon Teammates</h5>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
            Looking for devs or designers? Filter the discovery feed by hackathon goals.
          </p>
          <button
            onClick={() => setActiveView('discover')}
            className="w-full py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1"
          >
            <span>Explore Matches</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Profile Snippet */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={() => setActiveView('profile')}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100/70 transition-colors text-left"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-500/20"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{currentUser.college}</p>
          </div>
        </button>
      </div>
    </aside>
  );
};
