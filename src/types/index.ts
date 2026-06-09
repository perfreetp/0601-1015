export interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  completedCount: number;
  distance: number;
  neighborhood: string;
  creditScore: number;
}

export interface Skill {
  id: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  price: number;
  priceType: 'free' | 'fixed' | 'negotiable';
  availableTimes: string[];
  serviceRange: number;
  createdAt: string;
}

export interface Demand {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  budgetType: 'free' | 'fixed' | 'negotiable';
  location: string;
  distance: number;
  urgency: 'low' | 'medium' | 'high';
  status: 'open' | 'matched' | 'completed' | 'cancelled';
  createdAt: string;
  expiresAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'location';
  timestamp: string;
  isRead: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Booking {
  id: string;
  demandId: string;
  demandTitle: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  location: string;
  notes: string;
  createdAt: string;
}

export interface Review {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface ThankCard {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  message: string;
  points: number;
  createdAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  points: number;
  image: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isImportant: boolean;
}

export interface PointRecord {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  createdAt: string;
}

export interface BlacklistItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  reason: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: string;
}

export interface Dispute {
  id: string;
  demandId: string;
  demandTitle: string;
  partyAId: string;
  partyBId: string;
  description: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

export type DemandCategory =
  | '修伞维修'
  | '代购跑腿'
  | '运动陪练'
  | '翻译服务'
  | '家政清洁'
  | '宠物照看'
  | '课业辅导'
  | '其他';

export const DEMAND_CATEGORIES: DemandCategory[] = [
  '修伞维修',
  '代购跑腿',
  '运动陪练',
  '翻译服务',
  '家政清洁',
  '宠物照看',
  '课业辅导',
  '其他'
];
