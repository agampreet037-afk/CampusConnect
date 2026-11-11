import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { StudentProfile, StudentSkill, SkillLevel, AcademicYear } from '../../types';
import {
  INTEREST_CATEGORIES,
  COMMON_SKILLS,
  STUDENT_GOALS,
  DEPARTMENTS,
  ACADEMIC_YEARS,
} from '../../data/mockData';
import { Plus, X, Sparkles, Check } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateCurrentUser } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [college, setCollege] = useState(currentUser.college);
  const [department, setDepartment] = useState(currentUser.department);
  const [academicYear, setAcademicYear] = useState<AcademicYear>(currentUser.academicYear);
  const [bio, setBio] = useState(currentUser.bio);
  const [statusMessage, setStatusMessage] = useState(currentUser.statusMessage || '');
  const [lookingFor, setLookingFor] = useState(currentUser.lookingFor || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([...currentUser.interests]);
  const [skills, setSkills] = useState<StudentSkill[]>([...currentUser.skills]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([...currentUser.goals]);

  // Skill input state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    if (skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return;
    setSkills((prev) => [...prev, { name: newSkillName.trim(), level: newSkillLevel }]);
    setNewSkillName('');
  };

  const removeSkill = (skillName: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== skillName));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name,
      avatar,
      college,
      department,
      academicYear,
      bio,
      statusMessage,
      lookingFor,
      interests: selectedInterests,
      skills,
      goals: selectedGoals,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Student Profile" subtitle="Update your campus details, passions, and skills" maxWidth="2xl">
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Avatar Preset Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Profile Avatar
          </label>
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {AVATAR_PRESETS.map((presetUrl) => (
              <button
                type="button"
                key={presetUrl}
                onClick={() => setAvatar(presetUrl)}
                className={`relative shrink-0 rounded-2xl p-1 transition-all ${
                  avatar === presetUrl ? 'ring-3 ring-violet-600 scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img src={presetUrl} alt="Avatar option" className="w-12 h-12 rounded-xl object-cover" />
                {avatar === presetUrl && (
                  <span className="absolute -bottom-1 -right-1 bg-violet-600 text-white p-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Status / Mood</label>
            <input
              type="text"
              placeholder="e.g. Building hackathon projects 🚀"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value as AcademicYear)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              {ACADEMIC_YEARS.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / Introduction</label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            placeholder="Introduce yourself to fellow campus peers..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Currently Looking For</label>
          <input
            type="text"
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            placeholder="e.g. Teammates for hackathons, weekend football players, coffee chats"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          />
        </div>

        {/* Interests Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Interests ({selectedInterests.length} selected)
            </label>
            <span className="text-[11px] text-violet-600 font-medium">
              Powers 45% of your compatibility matching
            </span>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50">
            {Object.entries(INTEREST_CATEGORIES).map(([category, items]) => (
              <div key={category}>
                <p className="text-[11px] font-bold text-slate-500 mb-1.5">{category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => {
                    const isSelected = selectedInterests.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleInterest(item)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-violet-600 text-white border-violet-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Skills & Proficiency ({skills.length})
          </label>

          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200"
              >
                <span>{skill.name}</span>
                <span className="text-[10px] text-violet-500 font-bold">({skill.level})</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill.name)}
                  className="hover:text-rose-600 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add skill row */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. React, Python, Video Editing"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            />
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
              className="px-2 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <button
              type="button"
              onClick={addSkill}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Goals Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Campus Goals
          </label>
          <div className="flex flex-wrap gap-2">
            {STUDENT_GOALS.map((goal) => {
              const isSelected = selectedGoals.includes(goal);
              return (
                <button
                  type="button"
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/60'
                  }`}
                >
                  {isSelected ? '✓ ' : ''}
                  {goal}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm transition-all"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};
