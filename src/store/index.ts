import { create } from 'zustand';
import type { Demand, Skill, ChatMessage, Booking, ChatSession, Review, ThankCard, PointRecord } from '@/types';
import { mockDemands } from '@/data/demands';
import { mockSkills } from '@/data/skills';
import { mockMessages, mockChatSessions } from '@/data/messages';
import { mockBookings, mockReviews, mockThankCards, mockPointRecords } from '@/data/bookings';
import { generateId } from '@/utils';

interface AppState {
  demands: Demand[];
  skills: Skill[];
  bookings: Booking[];
  messagesBySession: Record<string, ChatMessage[]>;
  sessions: ChatSession[];
  reviews: Review[];
  thankCards: ThankCard[];
  pointRecords: PointRecord[];
  creditScore: number;
  completedCount: number;
  averageRating: number;
  totalPoints: number;
  addDemand: (demand: Omit<Demand, 'id' | 'createdAt' | 'userId' | 'userName' | 'userAvatar'>) => void;
  addSkill: (skill: Omit<Skill, 'id' | 'userId' | 'createdAt'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  addBooking: (data: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  rescheduleBooking: (id: string, date: string, timeSlot: string) => void;
  addMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  getSessionMessages: (sessionId: string) => ChatMessage[];
  getOrCreateSession: (sessionId: string, userId: string, userName: string, userAvatar: string) => ChatSession;
  updateSessionLastMessage: (sessionId: string, content: string, time: string) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'fromUserId' | 'fromUserName' | 'fromUserAvatar'>) => void;
  addThankCard: (card: Omit<ThankCard, 'id' | 'createdAt' | 'fromUserId' | 'fromUserName' | 'fromUserAvatar'>) => void;
  addPointRecord: (record: Omit<PointRecord, 'id' | 'createdAt'>) => void;
  completeBookingAndReview: (bookingId: string, rating: number, reviewContent: string, thankMessage: string, points: number) => void;
  clearSessionUnread: (sessionId: string) => void;
  getSortedSessions: () => ChatSession[];
}

const STORAGE_KEY = 'neighborhood_help_app_state_v1';

const loadFromStorage = (): Partial<AppState> | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('[Store] Failed to load from storage:', e);
  }
  return null;
};

const saveToStorage = (state: Partial<AppState>) => {
  try {
    const data = {
      demands: state.demands,
      skills: state.skills,
      bookings: state.bookings,
      messagesBySession: state.messagesBySession,
      sessions: state.sessions,
      reviews: state.reviews,
      thankCards: state.thankCards,
      pointRecords: state.pointRecords,
      creditScore: state.creditScore,
      completedCount: state.completedCount,
      averageRating: state.averageRating,
      totalPoints: state.totalPoints
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('[Store] Failed to save to storage:', e);
  }
};

const stored = loadFromStorage();

export const useAppStore = create<AppState>((set, get) => ({
  demands: stored?.demands || mockDemands,
  skills: stored?.skills || mockSkills,
  bookings: stored?.bookings || mockBookings,
  messagesBySession: stored?.messagesBySession || { c1: mockMessages },
  sessions: stored?.sessions || mockChatSessions,
  reviews: stored?.reviews || mockReviews,
  thankCards: stored?.thankCards || mockThankCards,
  pointRecords: stored?.pointRecords || mockPointRecords,
  creditScore: stored?.creditScore ?? 88,
  completedCount: stored?.completedCount ?? 3,
  averageRating: stored?.averageRating ?? 4.8,
  totalPoints: stored?.totalPoints ?? 120,

  addDemand: (demandData) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newDemand: Demand = {
      ...demandData,
      id: generateId(),
      createdAt: dateStr,
      userId: 'u0',
      userName: '张小明',
      userAvatar: 'https://picsum.photos/id/64/200/200'
    };
    
    set((state) => {
      const newDemands = [newDemand, ...state.demands];
      saveToStorage({ ...state, demands: newDemands });
      return { demands: newDemands };
    });
    console.log('[Store] Added new demand:', newDemand.title);
  },

  addSkill: (skillData) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newSkill: Skill = {
      ...skillData,
      id: generateId(),
      userId: 'u0',
      createdAt: dateStr
    };

    set((state) => {
      const newSkills = [newSkill, ...state.skills];
      saveToStorage({ ...state, skills: newSkills });
      return { skills: newSkills };
    });
    console.log('[Store] Added new skill:', newSkill.title);
  },

  updateSkill: (id, updates) => {
    set((state) => {
      const newSkills = state.skills.map(s =>
        s.id === id ? { ...s, ...updates } : s
      );
      saveToStorage({ ...state, skills: newSkills });
      return { skills: newSkills };
    });
    console.log('[Store] Updated skill:', id);
  },

  addBooking: (bookingData) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newBooking: Booking = {
      ...bookingData,
      id: generateId(),
      createdAt: dateStr,
      status: 'pending'
    };

    set((state) => {
      const newBookings = [newBooking, ...state.bookings];
      saveToStorage({ ...state, bookings: newBookings });
      return { bookings: newBookings };
    });
    console.log('[Store] Added new booking:', newBooking.skillTitle || newBooking.demandTitle);
  },

  updateBookingStatus: (id, status) => {
    set((state) => {
      const newBookings = state.bookings.map(b =>
        b.id === id ? { ...b, status } : b
      );
      saveToStorage({ ...state, bookings: newBookings });
      return { bookings: newBookings };
    });
    console.log('[Store] Updated booking status:', id, '->', status);
  },

  rescheduleBooking: (id, date, timeSlot) => {
    set((state) => {
      const newBookings = state.bookings.map(b =>
        b.id === id ? { ...b, date, timeSlot, status: 'rescheduled' as const } : b
      );
      saveToStorage({ ...state, bookings: newBookings });
      return { bookings: newBookings };
    });
    console.log('[Store] Rescheduled booking:', id, date, timeSlot);
  },

  addMessage: (sessionId, msgData) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMessage: ChatMessage = {
      ...msgData,
      id: generateId(),
      timestamp: timeStr
    };

    let displayContent = msgData.content;
    if (msgData.type === 'image') displayContent = '[图片]';
    else if (msgData.type === 'voice') displayContent = '[语音]';
    else if (msgData.type === 'location') displayContent = '[位置]';

    const stateBefore = get();
    let actualSessionId = sessionId;
    let targetSession = stateBefore.sessions.find(s => s.id === sessionId);
    if (!targetSession && msgData.senderId !== 'u0') {
      targetSession = stateBefore.sessions.find(s => s.userId === msgData.senderId);
      if (targetSession) actualSessionId = targetSession.id;
    }

    set((state) => {
      const currentMessages = state.messagesBySession[actualSessionId] || [];
      const newMessagesBySession = {
        ...state.messagesBySession,
        [actualSessionId]: [...currentMessages, newMessage]
      };

      const newSessions = state.sessions.map(s =>
        s.id === actualSessionId
          ? { ...s, lastMessage: displayContent, lastMessageTime: timeStr, unreadCount: s.unreadCount + (msgData.senderId !== 'u0' ? 1 : 0) }
          : s
      );

      const updatedState = { messagesBySession: newMessagesBySession, sessions: newSessions };
      saveToStorage({ ...state, ...updatedState });
      return updatedState;
    });
    console.log('[Store] Added message to session:', actualSessionId, msgData.type);
  },

  getSessionMessages: (sessionId) => {
    return get().messagesBySession[sessionId] || [];
  },

  getOrCreateSession: (sessionId, userId, userName, userAvatar) => {
    const state = get();
    let existing = state.sessions.find(s => s.id === sessionId);
    if (existing) return existing;

    existing = state.sessions.find(s => s.userId === userId);
    if (existing) return existing;

    const newSession: ChatSession = {
      id: sessionId,
      userId,
      userName,
      userAvatar,
      lastMessage: '和邻居打个招呼吧~',
      lastMessageTime: '',
      unreadCount: 0
    };

    set((s) => {
      const newSessions = [newSession, ...s.sessions];
      saveToStorage({ ...s, sessions: newSessions });
      return { sessions: newSessions };
    });
    return newSession;
  },

  updateSessionLastMessage: (sessionId, content, time) => {
    set((state) => {
      const newSessions = state.sessions.map(s =>
        s.id === sessionId
          ? { ...s, lastMessage: content, lastMessageTime: time }
          : s
      );
      saveToStorage({ ...state, sessions: newSessions });
      return { sessions: newSessions };
    });
  },

  addReview: (reviewData) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newReview: Review = {
      ...reviewData,
      id: generateId(),
      createdAt: dateStr,
      fromUserId: 'u0',
      fromUserName: '张小明',
      fromUserAvatar: 'https://picsum.photos/id/64/200/200'
    };

    set((state) => {
      const newReviews = [newReview, ...state.reviews];
      saveToStorage({ ...state, reviews: newReviews });
      return { reviews: newReviews };
    });
    console.log('[Store] Added new review for user:', newReview.toUserId);
  },

  addThankCard: (cardData) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newCard: ThankCard = {
      ...cardData,
      id: generateId(),
      createdAt: dateStr,
      fromUserId: 'u0',
      fromUserName: '张小明',
      fromUserAvatar: 'https://picsum.photos/id/64/200/200'
    };

    set((state) => {
      const newCards = [newCard, ...state.thankCards];
      saveToStorage({ ...state, thankCards: newCards });
      return { thankCards: newCards };
    });
    console.log('[Store] Added thank card for user:', newCard.toUserId);
  },

  addPointRecord: (recordData) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRecord: PointRecord = {
      ...recordData,
      id: generateId(),
      createdAt: dateStr
    };

    set((state) => {
      const newRecords = [newRecord, ...state.pointRecords];
      saveToStorage({ ...state, pointRecords: newRecords });
      return { pointRecords: newRecords };
    });
    console.log('[Store] Added point record:', newRecord.type, newRecord.amount);
  },

  completeBookingAndReview: (bookingId, rating, reviewContent, thankMessage, points) => {
    const state = get();
    const booking = state.bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newReview: Review = {
      id: generateId(),
      createdAt: dateStr,
      fromUserId: 'u0',
      fromUserName: '张小明',
      fromUserAvatar: 'https://picsum.photos/id/64/200/200',
      toUserId: booking.partnerId,
      rating,
      content: reviewContent
    };

    const newCard: ThankCard = {
      id: generateId(),
      createdAt: dateStr,
      fromUserId: 'u0',
      fromUserName: '张小明',
      fromUserAvatar: 'https://picsum.photos/id/64/200/200',
      toUserId: booking.partnerId,
      message: thankMessage,
      points
    };

    const newRecord: PointRecord = {
      id: generateId(),
      createdAt: dateStr,
      type: 'earn',
      amount: points,
      description: `完成服务 - ${booking.skillTitle || booking.demandTitle || '互助服务'}`
    };

    set((s) => {
      const newBookings = s.bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'completed' as const } : b
      );

      const newReviews = [newReview, ...s.reviews];
      const newCards = [newCard, ...s.thankCards];
      const newRecords = [newRecord, ...s.pointRecords];

      const newCompletedCount = s.completedCount + 1;
      const totalRatingSum = s.averageRating * s.completedCount + rating;
      const newAverageRating = totalRatingSum / newCompletedCount;
      const newCreditScore = Math.min(100, 70 + newCompletedCount * 2 + newAverageRating * 3);
      const newTotalPoints = s.totalPoints + points;

      const updatedState = {
        bookings: newBookings,
        reviews: newReviews,
        thankCards: newCards,
        pointRecords: newRecords,
        completedCount: newCompletedCount,
        averageRating: newAverageRating,
        creditScore: newCreditScore,
        totalPoints: newTotalPoints
      };

      saveToStorage({ ...s, ...updatedState });
      return updatedState;
    });

    console.log('[Store] Completed booking with review:', bookingId);
  },

  clearSessionUnread: (sessionId) => {
    set((state) => {
      const newSessions = state.sessions.map(s =>
        s.id === sessionId ? { ...s, unreadCount: 0 } : s
      );
      saveToStorage({ ...state, sessions: newSessions });
      return { sessions: newSessions };
    });
  },

  getSortedSessions: () => {
    const state = get();
    const getTimeWeight = (timeStr: string): number => {
      if (!timeStr) return -1;
      if (/^\d{2}:\d{2}$/.test(timeStr)) {
        const [h, m] = timeStr.split(':').map(Number);
        return 10000 + h * 60 + m;
      }
      if (timeStr === '昨天') return 5000;
      const daysAgo = timeStr.match(/^(\d+)天前/);
      if (daysAgo) return 1000 - Number(daysAgo[1]) * 100;
      return 0;
    };
    return [...state.sessions].sort((a, b) => {
      return getTimeWeight(b.lastMessageTime) - getTimeWeight(a.lastMessageTime);
    });
  }
}));
