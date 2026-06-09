import { create } from 'zustand';
import type { Demand, Skill, ChatMessage, Booking, ChatSession } from '@/types';
import { mockDemands } from '@/data/demands';
import { mockSkills } from '@/data/skills';
import { mockMessages, mockChatSessions } from '@/data/messages';
import { mockBookings } from '@/data/bookings';
import { generateId } from '@/utils';

interface AppState {
  demands: Demand[];
  skills: Skill[];
  bookings: Booking[];
  messagesBySession: Record<string, ChatMessage[]>;
  sessions: ChatSession[];
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
      sessions: state.sessions
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

    set((state) => {
      const currentMessages = state.messagesBySession[sessionId] || [];
      const newMessagesBySession = {
        ...state.messagesBySession,
        [sessionId]: [...currentMessages, newMessage]
      };

      const newSessions = state.sessions.map(s =>
        s.id === sessionId
          ? { ...s, lastMessage: displayContent, lastMessageTime: timeStr, unreadCount: s.unreadCount + (msgData.senderId !== 'u0' ? 1 : 0) }
          : s
      );

      const updatedState = { messagesBySession: newMessagesBySession, sessions: newSessions };
      saveToStorage({ ...state, ...updatedState });
      return updatedState;
    });
    console.log('[Store] Added message to session:', sessionId, msgData.type);
  },

  getSessionMessages: (sessionId) => {
    return get().messagesBySession[sessionId] || [];
  },

  getOrCreateSession: (sessionId, userId, userName, userAvatar) => {
    const state = get();
    const existing = state.sessions.find(s => s.id === sessionId);
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
  }
}));
