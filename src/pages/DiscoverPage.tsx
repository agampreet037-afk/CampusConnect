import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StudentProfile } from '../types';
import { StudentCard } from '../components/profiles/StudentCard';
import { ProfileDetailModal } from '../components/profiles/ProfileDetailModal';
import {
  INTEREST_CATEGORIES,
  ALL_INTERESTS,
  STUDENT_GOALS,
  DEPARTMENTS,
  ACADEMIC_YEARS,
} from '../data/mockData';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Users,
  Grid,
  List,
  RotateCcw,
} from 'lucide-react';

export const DiscoverPage: React.FC = () => {
  const { students, currentUser, getStudentCompatibility } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedInterest, setSelectedInterest] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedGoal, setSelectedGoal] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'compatibility' | 'shared_interests' | 'name' | 'year'>('compatibility');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // Filter & sort logic
  const filteredStudents = useMemo(() => {
    return students
      .filter((student: StudentProfile) => {
        // Exclude current student
        if (student.id === currentUser.id) return false;

        // Search query (name, dept, bio, skills, interests)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = student.name.toLowerCase().includes(q);
          const matchDept = student.department.toLowerCase().includes(q);
          const matchBio = student.bio.toLowerCase().includes(q);
          const matchInterest = student.interests.some((i: string) => i.toLowerCase().includes(q));
          const matchSkill = student.skills.some((s) => s.name.toLowerCase().includes(q));
          if (!matchName && !matchDept && !matchBio && !matchInterest && !matchSkill) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All') {
          const categoryInterests = INTEREST_CATEGORIES[selectedCategory as keyof typeof INTEREST_CATEGORIES] || [];
          const hasCategoryInterest = student.interests.some((i: string) => categoryInterests.includes(i));
          if (!hasCategoryInterest) return false;
        }

        // Specific interest filter
        if (selectedInterest !== 'All') {
          if (!student.interests.includes(selectedInterest)) return false;
        }

        // Department filter
        if (selectedDept !== 'All') {
          if (student.department !== selectedDept) return false;
        }

        // Academic year filter
        if (selectedYear !== 'All') {
          if (student.academicYear !== selectedYear) return false;
        }

        // Goal filter
        if (selectedGoal !== 'All') {
          if (!student.goals.includes(selectedGoal)) return false;
        }

        return true;
      })
      .sort((a: StudentProfile, b: StudentProfile) => {
        const compatA = getStudentCompatibility(a);
        const compatB = getStudentCompatibility(b);

        if (sortBy === 'compatibility') {
          return compatB.overallScore - compatA.overallScore;
        }
        if (sortBy === 'shared_interests') {
          return compatB.sharedInterests.length - compatA.sharedInterests.length;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'year') {
          return a.academicYear.localeCompare(b.academicYear);
        }
        return 0;
      });
  }, [
    students,
    currentUser,
    searchQuery,
    selectedCategory,
    selectedInterest,
    selectedDept,
    selectedYear,
    selectedGoal,
    sortBy,
    getStudentCompatibility,
  ]);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedInterest !== 'All' ? 1 : 0) +
    (selectedDept !== 'All' ? 1 : 0) +
    (selectedYear !== 'All' ? 1 : 0) +
    (selectedGoal !== 'All' ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedInterest('All');
    setSelectedDept('All');
    setSelectedYear('All');
    setSelectedGoal('All');
    setSortBy('compatibility');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Discover Campus Peers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
              {filteredStudents.length} Students
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Find fellow students matching your interests, skills, ambitions, and academic focus across all departments.
          </p>
        </div>

        {/* View Mode & Filter Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              activeFilterCount > 0
                ? 'bg-violet-50 text-violet-700 border-violet-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search and Quick Category Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, interest, skill (e.g. Python, Football, Figma) or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 text-sm bg-white rounded-2xl border border-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedInterest('All');
            }}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Categories
          </button>
          {Object.keys(INTEREST_CATEGORIES).map((catName) => (
            <button
              key={catName}
              onClick={() => {
                setSelectedCategory(catName);
                setSelectedInterest('All');
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
                selectedCategory === catName
                  ? 'bg-violet-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {catName}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded Filter Drawer */}
      {showFiltersDrawer && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-violet-600" />
              Advanced Discovery Filters
            </h4>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Specific Interest Filter */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Specific Interest</label>
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="All">All Interests</option>
                {ALL_INTERESTS.map((interest: string) => (
                  <option key={interest} value={interest}>
                    {interest}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map((dept: string) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Academic Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="All">All Academic Years</option>
                {ACADEMIC_YEARS.map((yr: string) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Campus Goal */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Campus Goal</label>
              <select
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="All">All Goals</option>
                {STUDENT_GOALS.map((goal: string) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort By Row */}
          <div className="pt-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Sort by:</span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSortBy('compatibility')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    sortBy === 'compatibility'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Highest Compatibility
                </button>
                <button
                  onClick={() => setSortBy('shared_interests')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    sortBy === 'shared_interests'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Most Shared Passions
                </button>
                <button
                  onClick={() => setSortBy('name')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    sortBy === 'name'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Name (A-Z)
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowFiltersDrawer(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Chips Bar */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Active filters:</span>
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-200">
              Category: {selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
            </span>
          )}
          {selectedInterest !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-200">
              Interest: {selectedInterest}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedInterest('All')} />
            </span>
          )}
          {selectedDept !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-200">
              Dept: {selectedDept.split('&')[0]}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDept('All')} />
            </span>
          )}
          {selectedYear !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-200">
              Year: {selectedYear}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedYear('All')} />
            </span>
          )}
          {selectedGoal !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-200">
              Goal: {selectedGoal}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedGoal('All')} />
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-slate-500 hover:text-rose-600 underline text-[11px] ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Students Directory Grid / List */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 font-heading">
            No matching campus students found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting a broader interest category, or clearing your active filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-4 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}
        >
          {filteredStudents.map((student: StudentProfile) => (
            <StudentCard
              key={student.id}
              student={student}
              onViewDetails={(s: StudentProfile) => setSelectedStudent(s)}
            />
          ))}
        </div>
      )}

      {/* Profile Detail Modal */}
      <ProfileDetailModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

    </div>
  );
};
