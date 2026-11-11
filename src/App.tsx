/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/Toast';
import { NamePromptModal } from './components/common/NamePromptModal';

import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { CirclesPage } from './pages/CirclesPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  // If on Landing page, render full landing view with NamePromptModal & Toasts
  if (activeView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <LandingPage />
        <NamePromptModal />
        <ToastContainer />
      </div>
    );
  }

  // If on Onboarding flow, render focused onboarding view
  if (activeView === 'onboarding') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <OnboardingPage />
        <NamePromptModal />
        <ToastContainer />
      </div>
    );
  }

  // Main Authenticated Application Layout
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Scrollable Main Content View */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeView === 'dashboard' && <DashboardPage />}
          {activeView === 'discover' && <DiscoverPage />}
          {activeView === 'communities' && <CommunitiesPage />}
          {activeView === 'circles' && <CirclesPage />}
          {activeView === 'connections' && <ConnectionsPage />}
          {activeView === 'messages' && <MessagesPage />}
          {activeView === 'profile' && <ProfilePage />}
          {activeView === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Welcome Name Prompt Gate Modal */}
      <NamePromptModal />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
