export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | "Master's" | 'PhD';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface StudentSkill {
  name: string;
  level: SkillLevel;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  college: string;
  department: string;
  academicYear: AcademicYear;
  bio: string;
  interests: string[];
  skills: StudentSkill[];
  goals: string[];
  lookingFor: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
  };
  joinedDate: string;
  isOnline?: boolean;
  statusMessage?: string;
  saved?: boolean;
}

export interface CompatibilityScore {
  overallScore: number;
  sharedInterests: string[];
  sharedSkills: string[];
  sharedGoals: string[];
  departmentMatch: boolean;
  breakdown: {
    interestsScore: number; // max 45
    skillsScore: number;    // max 25
    goalsScore: number;     // max 20
    academicScore: number;  // max 10
  };
  summarySentence: string;
  explanation: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorDept: string;
  timestamp: string;
  content: string;
  likes: number;
  likedByMe?: boolean;
  comments: {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    timestamp: string;
  }[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendeesCount: number;
  isAttending?: boolean;
}

export type CommunityCategory = 
  | 'Technology' 
  | 'Sports & Fitness' 
  | 'Creative Arts' 
  | 'Business & Startups' 
  | 'Lifestyle & Hobbies'
  | 'Academics & Research';

export interface Community {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: CommunityCategory;
  coverImage: string;
  avatarImage: string;
  membersCount: number;
  isJoined: boolean;
  creatorId: string;
  creatorName: string;
  tags: string[];
  recentActivity: string;
  posts: CommunityPost[];
  events: CommunityEvent[];
}

export interface ActivityCircle {
  id: string;
  title: string;
  description: string;
  category: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorDept: string;
  members: {
    id: string;
    name: string;
    avatar: string;
    role: 'host' | 'member';
  }[];
  maxMembers: number;
  date: string;
  time: string;
  location: string;
  tags: string[];
  status: 'open' | 'full' | 'completed';
}

export type ConnectionStatus = 'connected' | 'pending_sent' | 'pending_received';

export interface ConnectionRecord {
  id: string;
  studentId: string;
  status: ConnectionStatus;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
