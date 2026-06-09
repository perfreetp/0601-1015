import type { ChatSession, ChatMessage } from '@/types';

export const mockChatSessions: ChatSession[] = [
  {
    id: 'c1',
    userId: 'u1',
    userName: '李阿姨',
    userAvatar: 'https://picsum.photos/id/91/200/200',
    lastMessage: '好的，那我明天上午10点过去修伞',
    lastMessageTime: '10:30',
    unreadCount: 2
  },
  {
    id: 'c2',
    userId: 'u5',
    userName: '孙姐姐',
    userAvatar: 'https://picsum.photos/id/237/200/200',
    lastMessage: '猫咪很可爱，谢谢你帮我照看！',
    lastMessageTime: '昨天',
    unreadCount: 0
  },
  {
    id: 'c3',
    userId: 'u3',
    userName: '陈老师',
    userAvatar: 'https://picsum.photos/id/338/200/200',
    lastMessage: '周六羽毛球馆见，记得带球拍哦',
    lastMessageTime: '昨天',
    unreadCount: 1
  },
  {
    id: 'c4',
    userId: 'u7',
    userName: '吴小姐',
    userAvatar: 'https://picsum.photos/id/718/200/200',
    lastMessage: '清洁做得很干净，下次还找你！',
    lastMessageTime: '3天前',
    unreadCount: 0
  },
  {
    id: 'c5',
    userId: 'u10',
    userName: '黄阿姨',
    userAvatar: 'https://picsum.photos/id/787/200/200',
    lastMessage: '挂号成功了，太感谢你了',
    lastMessageTime: '5天前',
    unreadCount: 0
  }
];

export const mockMessages: ChatMessage[] = [
  {
    id: 'm1',
    senderId: 'u1',
    content: '你好，看到你在广场上发的修伞需求，我可以帮忙看看',
    type: 'text',
    timestamp: '09:15',
    isRead: true
  },
  {
    id: 'm2',
    senderId: 'u0',
    content: '太好了！我在阳光花园3栋，什么时候方便过来呢？',
    type: 'text',
    timestamp: '09:20',
    isRead: true
  },
  {
    id: 'm3',
    senderId: 'u1',
    content: '我家也是3栋的，明天上午10点可以吗？',
    type: 'text',
    timestamp: '10:25',
    isRead: true
  },
  {
    id: 'm4',
    senderId: 'u0',
    content: '好的，没问题！我家有两把伞需要修，一把伞骨断了，一把开合不顺畅',
    type: 'text',
    timestamp: '10:28',
    isRead: true
  },
  {
    id: 'm5',
    senderId: 'u1',
    content: '好的，那我明天上午10点过去修伞',
    type: 'text',
    timestamp: '10:30',
    isRead: false
  }
];
