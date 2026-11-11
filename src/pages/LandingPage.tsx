import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Users2,
  CalendarDays,
  Target,
  CheckCircle2,
  Zap,
  Heart,
  Globe,
  Layers,
  Award,
} from 'lucide-react';
import { INTEREST_CATEGORIES } from '../data/mockData';

export const LandingPage: React.FC = () => {
  const { setActiveView, communities } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-950 text-white text-xs py-2 px-4 text-center font-medium">
        <span>🎓 CampusConnect Hackathon Showcase • Built for students to discover genuine campus peers.</span>
        <button
          onClick={() => setActiveView('dashboard')}
          className="ml-3 underline hover:text-violet-200 font-bold inline-flex items-center gap-1"
        >
          <span>Launch Demo Dashboard</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-violet-300/30 to-indigo-300/20 blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-violet-100/90 text-violet-800 border border-violet-200 shadow-2xs mb-6">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span>Find your people. Share your passions. Build something together.</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 font-heading max-w-4xl mx-auto leading-tight sm:leading-none">
            Your People Are Out There.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              Find Them.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover students who share your interests, build meaningful connections and turn common passions into something bigger.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveView('onboarding')}
              className="w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-2xl shadow-lg shadow-violet-600/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Find Your Community</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('discover')}
              className="w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Student Directory</span>
            </button>
          </div>

          {/* Demo Hero Graphic Preview / Cards Mosaic */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-white/90 to-slate-100/90 border border-slate-200 shadow-2xl backdrop-blur-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                
                {/* Sample Card 1: Coding + Hackathons */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-violet-100 text-violet-700">
                      Tech & Hackathons
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      94% Match
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Aarav Patel</h4>
                  <p className="text-[11px] text-slate-500">CSE • 3rd Year</p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    "Prepping for national collegiate hackathons and looking for an AI/ML collaborator."
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">#Python</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">#AI/ML</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">#Football</span>
                  </div>
                </div>

                {/* Sample Card 2: Sports & Fitness */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      Sports & Fitness
                    </span>
                    <span className="text-xs font-extrabold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200">
                      89% Match
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Rohan Mehra</h4>
                  <p className="text-[11px] text-slate-500">Mechanical • 3rd Year</p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    "Organizing weekend 5v5 turf matches. Looking for players across all departments."
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">#Football</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">#Turf</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">#Fitness</span>
                  </div>
                </div>

                {/* Sample Card 3: Creative & Design */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-800">
                      Design & Photo
                    </span>
                    <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      91% Match
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Diya Sen</h4>
                  <p className="text-[11px] text-slate-500">Design • 2nd Year</p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    "Figma nerd, street photographer, and badminton player. Let's make things look stunning."
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">#Figma</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">#UI/UX</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">#Photography</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How CampusConnect Works */}
      <section className="py-16 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              How CampusConnect Works
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              No endless doomscrolling. CampusConnect helps you discover genuine collaborators and friends based on real interests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 font-heading">Define Your Passions</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Select your interests across coding, athletics, music, design, business, and campus life during a quick onboarding.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 font-heading">Dynamic Compatibility Matching</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Our mathematical algorithm weights shared interests (45%), skills (25%), goals (20%), and academic ties (10%) to highlight peers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 font-heading">Form Circles & Communities</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Join campus clubs or initiate Activity Circles: grab a hackathon team, organize a photo walk, or assemble a weekend football squad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interest Categories Showcase */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Explore Campus Passions
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Sports, creative arts, and entrepreneurship receive equal spotlight alongside engineering and technology.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(INTEREST_CATEGORIES).map(([catName, items]: [string, string[]]) => (
              <div
                key={catName}
                className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-violet-300 transition-all cursor-pointer"
                onClick={() => setActiveView('discover')}
              >
                <h5 className="text-sm font-bold text-violet-900 font-heading mb-3">{catName}</h5>
                <ul className="space-y-1.5">
                  {items.slice(0, 5).map((item: string) => (
                    <li key={item} className="text-xs text-slate-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-violet-600 flex items-center justify-between">
                  <span>+{items.length - 5} more</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Showcase (Clearly Labelled Demo Data) */}
      <section className="py-14 bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 border border-white/20 text-violet-200">
              Campus Demonstration Statistics
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold font-heading text-white">1,400+</p>
              <p className="text-xs sm:text-sm text-violet-200 mt-1">Active Campus Profiles</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold font-heading text-white">35+</p>
              <p className="text-xs sm:text-sm text-violet-200 mt-1">Student Communities</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold font-heading text-white">250+</p>
              <p className="text-xs sm:text-sm text-violet-200 mt-1">Collaborative Projects Built</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold font-heading text-white">92%</p>
              <p className="text-xs sm:text-sm text-violet-200 mt-1">Reported Compatibility Fit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Testimonials (Fictional Sample Students) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Stories From Campus
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Sample student feedback demonstrating real campus networking impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "I needed a designer for HackSprint. Within 10 minutes on CampusConnect, I found Diya, whose visual design and UI skills matched our stack. We won 2nd prize!"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Aarav Patel</p>
                  <p className="text-[10px] text-slate-500">Computer Science • 3rd Year</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Moving from another state, I missed playing football. Activity Circles let me post a weekend 5v5 turf match and 6 people showed up on Saturday!"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Rohan Mehra</p>
                  <p className="text-[10px] text-slate-500">Mechanical Engineering • 3rd Year</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "CampusConnect feels like an authentic community directory, not an ad-heavy social feed. It makes finding acoustic jam buddies effortless."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Sneha Banerjee</p>
                  <p className="text-[10px] text-slate-500">Literature & Media • 1st Year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
            Ready to find your campus circle?
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
            Join thousands of college peers collaborating on projects, playing sports, and building memories.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setActiveView('onboarding')}
              className="px-8 py-3.5 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-2xl shadow-md transition-all"
            >
              Start Quick Onboarding
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-2xs transition-all"
            >
              Enter Demo Mode
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-xs">
              C
            </div>
            <span className="font-bold text-slate-800">CampusConnect</span>
            <span>• Interest-based student discovery and networking</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setActiveView('discover')} className="hover:text-violet-600">
              Discover
            </button>
            <button onClick={() => setActiveView('communities')} className="hover:text-violet-600">
              Communities
            </button>
            <button onClick={() => setActiveView('circles')} className="hover:text-violet-600">
              Activity Circles
            </button>
            <button onClick={() => setActiveView('settings')} className="hover:text-violet-600">
              Settings & Demo
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
