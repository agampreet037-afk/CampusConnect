import { StudentProfile, CompatibilityScore } from '../types';

/**
 * Calculates a dynamic compatibility score between the logged-in student and another student.
 * 
 * Weights:
 * - Shared Interests: 45%
 * - Shared Skills: 25%
 * - Similar Goals: 20%
 * - Department / Academic Environment: 10%
 */
export function calculateCompatibility(
  currentStudent: StudentProfile,
  targetStudent: StudentProfile
): CompatibilityScore {
  if (currentStudent.id === targetStudent.id) {
    return {
      overallScore: 100,
      sharedInterests: [...currentStudent.interests],
      sharedSkills: currentStudent.skills.map(s => s.name),
      sharedGoals: [...currentStudent.goals],
      departmentMatch: true,
      breakdown: {
        interestsScore: 45,
        skillsScore: 25,
        goalsScore: 20,
        academicScore: 10,
      },
      summarySentence: "This is your profile.",
      explanation: "You have 100% affinity with yourself!",
    };
  }

  // 1. Shared Interests (45%)
  const currentInterestsLower = currentStudent.interests.map(i => i.toLowerCase().trim());
  const sharedInterests = targetStudent.interests.filter(interest =>
    currentInterestsLower.includes(interest.toLowerCase().trim())
  );

  // Score scales based on Jaccard or shared count relative to current student's interests
  const totalUniqueInterests = new Set([
    ...currentInterestsLower,
    ...targetStudent.interests.map(i => i.toLowerCase().trim())
  ]).size;
  
  const interestRatio = totalUniqueInterests > 0 
    ? sharedInterests.length / Math.min(Math.max(currentStudent.interests.length, 3), 7)
    : 0;
  const interestsScore = Math.min(45, Math.round(Math.min(interestRatio, 1) * 45));

  // 2. Shared Skills (25%)
  const currentSkillsLower = currentStudent.skills.map(s => s.name.toLowerCase().trim());
  const sharedSkills = targetStudent.skills
    .filter(skill => currentSkillsLower.includes(skill.name.toLowerCase().trim()))
    .map(s => s.name);

  const skillsRatio = currentStudent.skills.length > 0
    ? sharedSkills.length / Math.min(Math.max(currentStudent.skills.length, 2), 5)
    : 0;
  const skillsScore = Math.min(25, Math.round(Math.min(skillsRatio, 1) * 25));

  // 3. Similar Goals (20%)
  const currentGoalsLower = currentStudent.goals.map(g => g.toLowerCase().trim());
  const sharedGoals = targetStudent.goals.filter(goal =>
    currentGoalsLower.includes(goal.toLowerCase().trim())
  );

  const goalsRatio = currentStudent.goals.length > 0
    ? sharedGoals.length / Math.min(Math.max(currentStudent.goals.length, 2), 4)
    : 0;
  const goalsScore = Math.min(20, Math.round(Math.min(goalsRatio, 1) * 20));

  // 4. Same Department or Academic Environment (10%)
  const isDeptMatch = currentStudent.department.toLowerCase().trim() === targetStudent.department.toLowerCase().trim();
  const isCollegeMatch = currentStudent.college.toLowerCase().trim() === targetStudent.college.toLowerCase().trim();
  
  let academicScore = 0;
  if (isCollegeMatch) academicScore += 4;
  if (isDeptMatch) academicScore += 6;

  const totalRaw = interestsScore + skillsScore + goalsScore + academicScore;
  // Ensure realistic bounds: floor at 15 if there is at least something common or campus peer, clamp to 100
  const overallScore = Math.max(12, Math.min(99, totalRaw));

  // Generate dynamic explanation
  const explanation = buildExplanation(
    targetStudent.name,
    sharedInterests,
    sharedSkills,
    sharedGoals,
    isDeptMatch,
    targetStudent.department
  );

  const summarySentence = buildSummarySentence(overallScore, sharedInterests.length, sharedGoals.length);

  return {
    overallScore,
    sharedInterests,
    sharedSkills,
    sharedGoals,
    departmentMatch: isDeptMatch,
    breakdown: {
      interestsScore,
      skillsScore,
      goalsScore,
      academicScore,
    },
    summarySentence,
    explanation,
  };
}

function buildSummarySentence(score: number, sharedInterestsCount: number, sharedGoalsCount: number): string {
  if (score >= 85) {
    return `Exceptional alignment with ${sharedInterestsCount} mutual passions and aligned campus ambitions.`;
  } else if (score >= 70) {
    return `Strong potential connection with ${sharedInterestsCount} shared interests and common goals.`;
  } else if (score >= 50) {
    return `Moderate connection with overlapping areas of curiosity and campus activities.`;
  } else {
    return `Great opportunity to explore different perspectives and broaden your circle.`;
  }
}

function buildExplanation(
  targetName: string,
  sharedInterests: string[],
  sharedSkills: string[],
  sharedGoals: string[],
  isDeptMatch: boolean,
  dept: string
): string {
  const parts: string[] = [];

  if (sharedInterests.length > 0) {
    const formattedInterests = sharedInterests.slice(0, 3).join(', ');
    const more = sharedInterests.length > 3 ? ` and ${sharedInterests.length - 3} more` : '';
    parts.push(`You both enjoy ${formattedInterests}${more}.`);
  }

  if (sharedGoals.length > 0) {
    const firstGoal = sharedGoals[0].toLowerCase();
    parts.push(`You share similar ambitions like ${firstGoal}.`);
  }

  if (sharedSkills.length > 0) {
    parts.push(`Complementary background in ${sharedSkills.slice(0, 2).join(' & ')}.`);
  }

  if (isDeptMatch) {
    parts.push(`You are both in the ${dept} department.`);
  }

  if (parts.length === 0) {
    return `${targetName} is an active campus member interested in discovering new collaborations and study partners.`;
  }

  return parts.join(' ');
}
