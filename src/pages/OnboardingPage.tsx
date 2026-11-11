import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentProfile, StudentSkill, SkillLevel, AcademicYear } from '../types';
import {
  INTEREST_CATEGORIES,
  COMMON_SKILLS,
  STUDENT_GOALS,
  DEPARTMENTS,
  ACADEMIC_YEARS,
} from '../data/mockData';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
} from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
];

export const OnboardingPage: React.FC = () => {
  const { currentUser, completeOnboarding } = useApp();

  const [step, setStep] = useState<number>(1);

  // Step 1: Basic Info
  const [name, setName] = useState(currentUser.name);
  const [college, setCollege] = useState(currentUser.college);
  const [department, setDepartment] = useState(currentUser.department);
  const [academicYear, setAcademicYear] = useState<AcademicYear>(currentUser.academicYear);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatar, setAvatar] = useState(currentUser.avatar);

  // Step 2: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([...currentUser.interests]);

  // Step 3: Skills
  const [skills, setSkills] = useState<StudentSkill[]>([...currentUser.skills]);
  const [skillInput, setSkillInput] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Intermediate');

  // Step 4: Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([...currentUser.goals]);
  const [lookingFor, setLookingFor] = useState(currentUser.lookingFor);

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

  const addCustomSkill = () => {
    if (!skillInput.trim()) return;
    if (skills.some((s) => s.name.toLowerCase() === skillInput.trim().toLowerCase())) return;
    setSkills((prev) => [...prev, { name: skillInput.trim(), level: skillLevel }]);
    setSkillInput('');
  };

  const addPredefinedSkill = (skillName: string) => {
    if (skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) return;
    setSkills((prev) => [...prev, { name: skillName, level: 'Intermediate' }]);
  };

  const removeSkill = (nameToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== nameToRemove));
  };

  const handleFinish = () => {
    const finalProfile: StudentProfile = {
      ...currentUser,
      name: name.trim() || 'Campus Student',
      college: college.trim() || 'Apex Institute of Technology',
      department,
      academicYear,
      bio: bio.trim() || 'Excited to discover like-minded campus peers!',
      avatar,
      interests: selectedInterests.length > 0 ? selectedInterests : ['Programming', 'Photography', 'Football'],
      skills: skills.length > 0 ? skills : [{ name: 'Teamwork', level: 'Intermediate' }],
      goals: selectedGoals.length > 0 ? selectedGoals : ['Making new friends', 'Finding project collaborators'],
      lookingFor: lookingFor.trim() || 'Looking for fellow students to connect and collaborate with.',
    };

    completeOnboarding(finalProfile);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10">
        
        {/* Progress Stepper Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <span>Step {step} of 4</span>
            <span className="text-violet-600 font-bold">
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Your Passions'}
              {step === 3 && 'Skills & Strengths'}
              {step === 4 && 'Campus Goals'}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-violet-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                Let's set up your campus profile
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Tell other students who you are and where you study.
              </p>
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Choose an Avatar
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {AVATAR_OPTIONS.map((imgUrl: string) => (
                  <button
                    key={imgUrl}
                    type="button"
                    onClick={() => setAvatar(imgUrl)}
                    className={`relative shrink-0 rounded-2xl p-1 transition-all ${
                      avatar === imgUrl ? 'ring-3 ring-violet-600 scale-105' : 'opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    {avatar === imgUrl && (
                      <span className="absolute -bottom-1 -right-1 bg-violet-600 text-white p-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">College / University *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Institute of Technology"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                  >
                    {DEPARTMENTS.map((dept: string) => (
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
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                  >
                    {ACADEMIC_YEARS.map((yr: string) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Introduction *</label>
                <textarea
                  rows={2}
                  placeholder="Briefly introduce your passions, what you enjoy doing, or your current vibe..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Interests Selection */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                What are you passionate about?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select at least 3 interests. This directly powers your 45% interest affinity matching score.
              </p>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {Object.entries(INTEREST_CATEGORIES).map(([category, items]: [string, string[]]) => (
                <div key={category} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((item: string) => {
                      const isSelected = selectedInterests.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleInterest(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
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

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{selectedInterests.length} passions selected</span>
              {selectedInterests.length < 3 && (
                <span className="text-amber-600 font-semibold">Select at least {3 - selectedInterests.length} more</span>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Skills & Proficiency */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                What skills do you bring?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Share what you are good at (or currently learning) to match for hackathons and projects.
              </p>
            </div>

            {/* Selected Skills */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Your Skills ({skills.length})
              </p>

              <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                {skills.length === 0 ? (
                  <p className="text-xs text-slate-400 self-center">No skills added yet. Add below!</p>
                ) : (
                  skills.map((skill) => (
                    <span
                      key={skill.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-violet-900 border border-violet-200 shadow-2xs"
                    >
                      <span>{skill.name}</span>
                      <span className="text-[10px] text-violet-500 font-bold">({skill.level})</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill.name)}
                        className="hover:text-rose-600 ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Add Custom Skill */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs font-bold text-slate-700 mb-2">Add a skill</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. Python, Figma, Video Editing, Public Speaking"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors"
                >
                  Add Skill
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Quick pick suggestions:</p>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SKILLS.slice(0, 12).map((skillName: string) => (
                  <button
                    key={skillName}
                    type="button"
                    onClick={() => addPredefinedSkill(skillName)}
                    className="px-2.5 py-1 rounded-lg text-xs bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                  >
                    + {skillName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Campus Goals */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                What are your campus ambitions?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Tell us what you are looking for so we can match you with students with aligned intentions.
              </p>
            </div>

            {/* Goals Checkbox Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STUDENT_GOALS.map((goal: string) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-violet-50/90 border-violet-500 ring-1 ring-violet-500 shadow-2xs'
                        : 'bg-white border-slate-200/90 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-800">{goal}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-violet-600 text-white border-violet-600'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Request / Pitch
              </label>
              <input
                type="text"
                placeholder="e.g. Looking for a designer for HackSprint '26 and casual evening football players."
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
              />
            </div>
          </div>
        )}

        {/* Stepper Navigation Footer */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-7 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Complete & Discover Peers</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
