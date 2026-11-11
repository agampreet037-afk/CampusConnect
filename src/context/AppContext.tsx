import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  StudentProfile,
  Community,
  ActivityCircle,
  ConnectionRecord,
  Conversation,
  ToastMessage,
  ChatMessage,
  CompatibilityScore,
  AcademicYear,
} from '../types';
import {
  INITIAL_CURRENT_USER,
  MOCK_STUDENTS,
  MOCK_COMMUNITIES,
  MOCK_ACTIVITY_CIRCLES,
  MOCK_CONNECTIONS,
  MOCK_CONVERSATIONS,
  getInitialActivityCircles,
  getInitialConversations,
} from '../data/mockData';
import { calculateCompatibility } from '../utils/compatibility';

interface AppContextType {
  currentUser: StudentProfile;
  isOnboarded: boolean;
  activeView: string;
  setActiveView: (view: string) => void;
  students: StudentProfile[];
  communities: Community[];
  activityCircles: ActivityCircle[];
  connections: ConnectionRecord[];
  conversations: Conversation[];
  savedStudentIds: string[];
  blockedStudentIds: string[];
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  
  // Name prompt and identity
  isNamePromptOpen: boolean;
  setIsNamePromptOpen: (open: boolean) => void;
  setAppUserName: (name: string, department?: string, avatar?: string, academicYear?: AcademicYear) => void;

  // Profile actions
  updateCurrentUser: (profile: Partial<StudentProfile>) => void;
  completeOnboarding: (profile: StudentProfile) => void;
  
  // Connection actions
  sendConnectionRequest: (studentId: string) => void;
  acceptConnectionRequest: (studentId: string) => void;
  declineConnectionRequest: (studentId: string) => void;
  cancelConnectionRequest: (studentId: string) => void;
  removeConnection: (studentId: string) => void;
  getConnectionStatus: (studentId: string) => 'connected' | 'pending_sent' | 'pending_received' | 'none';
  
  // Bookmark actions
  toggleSaveStudent: (studentId: string) => void;
  isStudentSaved: (studentId: string) => boolean;

  // Community actions
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
  createCommunity: (community: Omit<Community, 'id' | 'membersCount' | 'isJoined' | 'creatorId' | 'creatorName' | 'recentActivity' | 'posts' | 'events'>) => void;
  addCommunityPost: (communityId: string, content: string) => void;
  likeCommunityPost: (communityId: string, postId: string) => void;
  toggleRsvpCommunityEvent: (communityId: string, eventId: string) => void;

  // Activity circle actions
  joinCircle: (circleId: string) => void;
  leaveCircle: (circleId: string) => void;
  createCircle: (circle: Omit<ActivityCircle, 'id' | 'creatorId' | 'creatorName' | 'creatorAvatar' | 'creatorDept' | 'members' | 'status'>) => void;

  // Messaging actions
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (participantId: string, text: string) => void;
  openChatWithStudent: (studentId: string) => void;

  // Safety actions
  reportStudent: (studentId: string, reason: string) => void;
  blockStudent: (studentId: string) => void;

  // Demo controls
  resetDemoData: () => void;
  switchDemoUser: (studentId: string) => void;

  // Helper
  getStudentById: (id: string) => StudentProfile | undefined;
  getStudentCompatibility: (student: StudentProfile) => CompatibilityScore;
}

const STORAGE_KEYS = {
  USER: 'campusconnect_current_user_v3',
  ONBOARDED: 'campusconnect_is_onboarded_v3',
  NAME_ENTERED: 'campusconnect_user_name_entered_v3',
  STUDENTS: 'campusconnect_students_v3',
  COMMUNITIES: 'campusconnect_communities_v3',
  CIRCLES: 'campusconnect_circles_v3',
  CONNECTIONS: 'campusconnect_connections_v3',
  CONVERSATIONS: 'campusconnect_conversations_v3',
  SAVED: 'campusconnect_saved_students_v3',
  BLOCKED: 'campusconnect_blocked_students_v3',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Current user & Onboarding
  const [currentUser, setCurrentUser] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.name !== 'Agam Sharma') {
          return parsed;
        }
      } catch (e) { /* ignore */ }
    }
    return INITIAL_CURRENT_USER;
  });

  // Name prompt modal state: open if user has not yet entered their custom name
  const [isNamePromptOpen, setIsNamePromptOpen] = useState<boolean>(() => {
    const entered = localStorage.getItem(STORAGE_KEYS.NAME_ENTERED);
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (!entered || !savedUser) return true;
    try {
      const parsed = JSON.parse(savedUser);
      if (parsed.name === 'Agam Sharma' || parsed.name === 'Student Explorer') return true;
    } catch (e) {
      return true;
    }
    return false;
  });

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ONBOARDED);
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Current navigation view
  const [activeView, setActiveView] = useState<string>('dashboard');

  // 2. Data Collections
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return MOCK_STUDENTS;
  });

  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMUNITIES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return MOCK_COMMUNITIES;
  });

  const [activityCircles, setActivityCircles] = useState<ActivityCircle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CIRCLES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return getInitialActivityCircles(currentUser.name);
  });

  const [connections, setConnections] = useState<ConnectionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return MOCK_CONNECTIONS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return getInitialConversations(currentUser.name);
  });

  const [savedStudentIds, setSavedStudentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return ['student-001', 'student-002'];
  });

  const [blockedStudentIds, setBlockedStudentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-001');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, JSON.stringify(isOnboarded));
  }, [isOnboarded]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CIRCLES, JSON.stringify(activityCircles));
  }, [activityCircles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedStudentIds));
  }, [savedStudentIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOCKED, JSON.stringify(blockedStudentIds));
  }, [blockedStudentIds]);

  // Toast helper
  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper getters
  const getStudentById = (id: string): StudentProfile | undefined => {
    if (id === currentUser.id) return currentUser;
    return students.find((s) => s.id === id);
  };

  const getStudentCompatibility = (student: StudentProfile): CompatibilityScore => {
    return calculateCompatibility(currentUser, student);
  };

  // Set User Name everywhere
  const setAppUserName = (
    name: string,
    department?: string,
    avatar?: string,
    academicYear?: AcademicYear
  ) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    const firstName = cleanName.split(' ')[0] || cleanName;

    setCurrentUser((prev) => ({
      ...prev,
      name: cleanName,
      ...(department ? { department } : {}),
      ...(avatar ? { avatar } : {}),
      ...(academicYear ? { academicYear } : {}),
    }));

    // Update Activity Circles with user's name
    setActivityCircles((prev) =>
      prev.map((c) => ({
        ...c,
        creatorName: c.creatorId === currentUser.id ? cleanName : c.creatorName,
        members: c.members.map((m) =>
          m.id === currentUser.id ? { ...m, name: cleanName } : m
        ),
      }))
    );

    // Update Conversations to replace "Agam" with user's first name
    setConversations((prev) =>
      prev.map((conv) => ({
        ...conv,
        messages: conv.messages.map((msg) => ({
          ...msg,
          text: msg.text
            .replace(/Hey Agam!/g, `Hey ${firstName}!`)
            .replace(/Thank you Agam!/g, `Thank you ${firstName}!`)
            .replace(/Agam Sharma/g, cleanName)
            .replace(/Agam/g, firstName),
        })),
      }))
    );

    localStorage.setItem(STORAGE_KEYS.NAME_ENTERED, 'true');
    setIsNamePromptOpen(false);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      /* ignore */
    }

    addToast(`Welcome to CampusConnect, ${firstName}!`, 'success');
  };

  // 1. User updates
  const updateCurrentUser = (partial: Partial<StudentProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...partial }));

    if (partial.name && partial.name.trim()) {
      const cleanName = partial.name.trim();
      const firstName = cleanName.split(' ')[0] || cleanName;

      setActivityCircles((prev) =>
        prev.map((c) => ({
          ...c,
          creatorName: c.creatorId === currentUser.id ? cleanName : c.creatorName,
          members: c.members.map((m) =>
            m.id === currentUser.id ? { ...m, name: cleanName } : m
          ),
        }))
      );

      setConversations((prev) =>
        prev.map((conv) => ({
          ...conv,
          messages: conv.messages.map((msg) => ({
            ...msg,
            text: msg.text
              .replace(/Hey Agam!/g, `Hey ${firstName}!`)
              .replace(/Thank you Agam!/g, `Thank you ${firstName}!`)
              .replace(/Agam Sharma/g, cleanName)
              .replace(/Agam/g, firstName),
          })),
        }))
      );
    }

    addToast('Profile updated successfully!', 'success');
  };

  const completeOnboarding = (profile: StudentProfile) => {
    setCurrentUser(profile);
    setIsOnboarded(true);
    localStorage.setItem(STORAGE_KEYS.NAME_ENTERED, 'true');
    setIsNamePromptOpen(false);
    setActiveView('dashboard');
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      /* ignore */
    }
    addToast(`Welcome to CampusConnect, ${profile.name}!`, 'success');
  };

  // 2. Connections
  const getConnectionStatus = (studentId: string): 'connected' | 'pending_sent' | 'pending_received' | 'none' => {
    const record = connections.find((c) => c.studentId === studentId);
    return record ? record.status : 'none';
  };

  const sendConnectionRequest = (studentId: string) => {
    const target = getStudentById(studentId);
    const targetName = target ? target.name : 'Student';
    setConnections((prev) => {
      const filtered = prev.filter((c) => c.studentId !== studentId);
      return [
        ...filtered,
        {
          id: 'conn-' + Date.now(),
          studentId,
          status: 'pending_sent',
          timestamp: 'Just now',
        },
      ];
    });
    addToast(`Connection request sent to ${targetName}!`, 'success');
  };

  const acceptConnectionRequest = (studentId: string) => {
    const target = getStudentById(studentId);
    const targetName = target ? target.name : 'Student';
    setConnections((prev) =>
      prev.map((c) =>
        c.studentId === studentId ? { ...c, status: 'connected', timestamp: 'Connected just now' } : c
      )
    );
    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
      });
    } catch (e) {
      /* ignore */
    }
    addToast(`You are now connected with ${targetName}!`, 'success');
  };

  const declineConnectionRequest = (studentId: string) => {
    setConnections((prev) => prev.filter((c) => c.studentId !== studentId));
    addToast('Connection request dismissed.', 'info');
  };

  const cancelConnectionRequest = (studentId: string) => {
    setConnections((prev) => prev.filter((c) => c.studentId !== studentId));
    addToast('Connection request cancelled.', 'info');
  };

  const removeConnection = (studentId: string) => {
    setConnections((prev) => prev.filter((c) => c.studentId !== studentId));
    addToast('Connection removed from your network.', 'info');
  };

  // 3. Bookmark
  const toggleSaveStudent = (studentId: string) => {
    setSavedStudentIds((prev) => {
      if (prev.includes(studentId)) {
        addToast('Removed from saved profiles', 'info');
        return prev.filter((id) => id !== studentId);
      } else {
        addToast('Profile saved to your bookmarks!', 'success');
        return [...prev, studentId];
      }
    });
  };

  const isStudentSaved = (studentId: string) => savedStudentIds.includes(studentId);

  // 4. Communities
  const joinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? { ...c, isJoined: true, membersCount: c.membersCount + 1 }
          : c
      )
    );
    const target = communities.find((c) => c.id === communityId);
    addToast(`Joined "${target?.name || 'Community'}"!`, 'success');
  };

  const leaveCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? { ...c, isJoined: false, membersCount: Math.max(1, c.membersCount - 1) }
          : c
      )
    );
    const target = communities.find((c) => c.id === communityId);
    addToast(`Left "${target?.name || 'Community'}".`, 'info');
  };

  const createCommunity = (
    data: Omit<Community, 'id' | 'membersCount' | 'isJoined' | 'creatorId' | 'creatorName' | 'recentActivity' | 'posts' | 'events'>
  ) => {
    const newComm: Community = {
      ...data,
      id: 'comm-' + Date.now(),
      membersCount: 1,
      isJoined: true,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      recentActivity: 'Created just now',
      posts: [
        {
          id: 'post-init-' + Date.now(),
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          authorDept: `${currentUser.department} ${currentUser.academicYear}`,
          timestamp: 'Just now',
          content: `Welcome to ${data.name}! We created this community to bring students passionate about ${data.tags.slice(0, 3).join(', ')} together. Introduce yourself below!`,
          likes: 1,
          likedByMe: true,
          comments: [],
        },
      ],
      events: [],
    };
    setCommunities((prev) => [newComm, ...prev]);
    addToast(`Community "${data.name}" created!`, 'success');
  };

  const addCommunityPost = (communityId: string, content: string) => {
    const newPost = {
      id: 'post-' + Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorDept: `${currentUser.department} ${currentUser.academicYear}`,
      timestamp: 'Just now',
      content,
      likes: 0,
      likedByMe: false,
      comments: [],
    };

    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? {
              ...c,
              posts: [newPost, ...c.posts],
              recentActivity: 'Active just now',
            }
          : c
      )
    );
    addToast('Post published to the community!', 'success');
  };

  const likeCommunityPost = (communityId: string, postId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id !== communityId) return c;
        return {
          ...c,
          posts: c.posts.map((p) => {
            if (p.id !== postId) return p;
            const willLike = !p.likedByMe;
            return {
              ...p,
              likedByMe: willLike,
              likes: willLike ? p.likes + 1 : Math.max(0, p.likes - 1),
            };
          }),
        };
      })
    );
  };

  const toggleRsvpCommunityEvent = (communityId: string, eventId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id !== communityId) return c;
        return {
          ...c,
          events: c.events.map((e) => {
            if (e.id !== eventId) return e;
            const willAttend = !e.isAttending;
            return {
              ...e,
              isAttending: willAttend,
              attendeesCount: willAttend ? e.attendeesCount + 1 : Math.max(0, e.attendeesCount - 1),
            };
          }),
        };
      })
    );
    addToast('RSVP updated for event!', 'success');
  };

  // 5. Activity Circles
  const joinCircle = (circleId: string) => {
    setActivityCircles((prev) =>
      prev.map((circle) => {
        if (circle.id !== circleId) return circle;
        if (circle.members.some((m) => m.id === currentUser.id)) return circle;
        const updatedMembers = [
          ...circle.members,
          {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            role: 'member' as const,
          },
        ];
        return {
          ...circle,
          members: updatedMembers,
          status: updatedMembers.length >= circle.maxMembers ? 'full' : 'open',
        };
      })
    );
    addToast('You joined the activity circle!', 'success');
  };

  const leaveCircle = (circleId: string) => {
    setActivityCircles((prev) =>
      prev.map((circle) => {
        if (circle.id !== circleId) return circle;
        const updatedMembers = circle.members.filter((m) => m.id !== currentUser.id);
        return {
          ...circle,
          members: updatedMembers,
          status: 'open',
        };
      })
    );
    addToast('You left the activity circle.', 'info');
  };

  const createCircle = (
    data: Omit<ActivityCircle, 'id' | 'creatorId' | 'creatorName' | 'creatorAvatar' | 'creatorDept' | 'members' | 'status'>
  ) => {
    const newCircle: ActivityCircle = {
      ...data,
      id: 'circle-' + Date.now(),
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      creatorDept: `${currentUser.department} ${currentUser.academicYear}`,
      members: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          role: 'host',
        },
      ],
      status: 'open',
    };
    setActivityCircles((prev) => [newCircle, ...prev]);
    addToast('Activity circle posted! Other students can now join.', 'success');
  };

  // 6. Messaging
  const sendMessage = (participantId: string, text: string) => {
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: 'm-' + Date.now(),
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: 'Just now',
      isRead: true,
    };

    setConversations((prev) => {
      const existing = prev.find((c) => c.participantId === participantId);
      if (existing) {
        return prev.map((c) =>
          c.participantId === participantId
            ? {
                ...c,
                lastMessage: text.trim(),
                lastMessageTime: 'Just now',
                messages: [...c.messages, newMessage],
              }
            : c
        );
      } else {
        const newConv: Conversation = {
          id: 'conv-' + Date.now(),
          participantId,
          lastMessage: text.trim(),
          lastMessageTime: 'Just now',
          unreadCount: 0,
          messages: [newMessage],
        };
        return [newConv, ...prev];
      }
    });

    // Realistic auto-reply simulation for the demo!
    const targetStudent = getStudentById(participantId);
    if (targetStudent && participantId !== currentUser.id) {
      setTimeout(() => {
        const userFirstName = currentUser.name.split(' ')[0] || 'Friend';
        const replies = [
          `Hey ${userFirstName}! That sounds great. Let's definitely collaborate on this!`,
          `Thanks for reaching out, ${userFirstName}! I checked out your interests and compatibility—looks like we have a lot in common.`,
          `Awesome! Are you free sometime tomorrow after classes to catch up around campus?`,
          `Glad we connected here on CampusConnect! Excited to build together.`,
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const replyMsg: ChatMessage = {
          id: 'm-reply-' + Date.now(),
          senderId: participantId,
          text: randomReply,
          timestamp: 'Just now',
          isRead: false,
        };

        setConversations((latest) =>
          latest.map((c) =>
            c.participantId === participantId
              ? {
                  ...c,
                  lastMessage: randomReply,
                  lastMessageTime: 'Just now',
                  unreadCount: c.unreadCount + 1,
                  messages: [...c.messages, replyMsg],
                }
              : c
          )
        );
        addToast(`New message from ${targetStudent.name}`, 'info');
      }, 1400);
    }
  };

  const openChatWithStudent = (studentId: string) => {
    let conv = conversations.find((c) => c.participantId === studentId);
    if (!conv) {
      const targetStudent = getStudentById(studentId);
      const newConv: Conversation = {
        id: 'conv-' + Date.now(),
        participantId: studentId,
        lastMessage: `Started conversation with ${targetStudent?.name || 'student'}`,
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    } else {
      setActiveConversationId(conv.id);
    }
    setActiveView('messages');
  };

  // 7. Safety (Report & Block)
  const reportStudent = (studentId: string, reason: string) => {
    const student = getStudentById(studentId);
    addToast(`Report submitted for ${student?.name || 'student'}. Our safety team has been notified (Demo).`, 'info');
  };

  const blockStudent = (studentId: string) => {
    const student = getStudentById(studentId);
    setBlockedStudentIds((prev) => [...prev, studentId]);
    setConnections((prev) => prev.filter((c) => c.studentId !== studentId));
    addToast(`Blocked ${student?.name || 'student'}. You will not see their profile or messages.`, 'warning');
  };

  // 8. Demo reset & Switcher
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ONBOARDED);
    localStorage.removeItem(STORAGE_KEYS.NAME_ENTERED);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.COMMUNITIES);
    localStorage.removeItem(STORAGE_KEYS.CIRCLES);
    localStorage.removeItem(STORAGE_KEYS.CONNECTIONS);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.SAVED);
    localStorage.removeItem(STORAGE_KEYS.BLOCKED);

    setCurrentUser(INITIAL_CURRENT_USER);
    setIsOnboarded(true);
    setStudents(MOCK_STUDENTS);
    setCommunities(MOCK_COMMUNITIES);
    setActivityCircles(MOCK_ACTIVITY_CIRCLES);
    setConnections(MOCK_CONNECTIONS);
    setConversations(MOCK_CONVERSATIONS);
    setSavedStudentIds(['student-001', 'student-002']);
    setBlockedStudentIds([]);
    setActiveConversationId('conv-001');
    setActiveView('dashboard');
    setIsNamePromptOpen(true);
    addToast('Demo data reset! Please enter your name to begin.', 'info');
  };

  const switchDemoUser = (studentId: string) => {
    const target = students.find((s) => s.id === studentId);
    if (!target) return;

    // Swap current user with target student
    const prevUser = currentUser;
    setCurrentUser(target);
    setStudents((prev) => [prevUser, ...prev.filter((s) => s.id !== studentId)]);
    addToast(`Switched active persona to ${target.name}!`, 'success');
  };

  // Filter out blocked students
  const visibleStudents = useMemo(() => {
    return students.filter((s) => !blockedStudentIds.includes(s.id));
  }, [students, blockedStudentIds]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isOnboarded,
        activeView,
        setActiveView,
        students: visibleStudents,
        communities,
        activityCircles,
        connections,
        conversations,
        savedStudentIds,
        blockedStudentIds,
        toasts,
        addToast,
        removeToast,
        isNamePromptOpen,
        setIsNamePromptOpen,
        setAppUserName,
        updateCurrentUser,
        completeOnboarding,
        sendConnectionRequest,
        acceptConnectionRequest,
        declineConnectionRequest,
        cancelConnectionRequest,
        removeConnection,
        getConnectionStatus,
        toggleSaveStudent,
        isStudentSaved,
        joinCommunity,
        leaveCommunity,
        createCommunity,
        addCommunityPost,
        likeCommunityPost,
        toggleRsvpCommunityEvent,
        joinCircle,
        leaveCircle,
        createCircle,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        openChatWithStudent,
        reportStudent,
        blockStudent,
        resetDemoData,
        switchDemoUser,
        getStudentById,
        getStudentCompatibility,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
