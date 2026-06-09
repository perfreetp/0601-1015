import type { Booking, Review, ThankCard, PointRecord, Announcement, Activity, BlacklistItem, Report, Dispute } from '@/types';

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    demandId: 'd1',
    demandTitle: '雨伞坏了需要维修',
    partnerId: 'u1',
    partnerName: '李阿姨',
    partnerAvatar: 'https://picsum.photos/id/91/200/200',
    date: '2024-01-16',
    timeSlot: '10:00 - 11:00',
    status: 'confirmed',
    location: '阳光花园3栋2单元302',
    notes: '带上修伞工具，两把伞都需要检查',
    createdAt: '2024-01-15 10:30'
  },
  {
    id: 'b2',
    demandId: 'd5',
    demandTitle: '周末帮忙照看猫咪',
    partnerId: 'u5',
    partnerName: '孙姐姐',
    partnerAvatar: 'https://picsum.photos/id/237/200/200',
    date: '2024-01-13',
    timeSlot: '每天 19:00',
    status: 'completed',
    location: '阳光花园7栋1单元501',
    notes: '钥匙在门口地毯下，猫粮在柜子里',
    createdAt: '2024-01-12 15:00'
  },
  {
    id: 'b3',
    demandId: 'd3',
    demandTitle: '羽毛球陪练1小时',
    partnerId: 'u3',
    partnerName: '陈老师',
    partnerAvatar: 'https://picsum.photos/id/338/200/200',
    date: '2024-01-20',
    timeSlot: '09:00 - 10:00',
    status: 'pending',
    location: '阳光花园会所羽毛球馆',
    notes: '初学者陪练，场地费用AA',
    createdAt: '2024-01-14 20:30'
  },
  {
    id: 'b4',
    demandId: 'd7',
    demandTitle: '深度清洁厨房',
    partnerId: 'u7',
    partnerName: '吴小姐',
    partnerAvatar: 'https://picsum.photos/id/718/200/200',
    date: '2024-01-18',
    timeSlot: '14:00 - 17:00',
    status: 'confirmed',
    location: '阳光花园1栋3单元1101',
    notes: '重点清洗抽油烟机和灶台',
    createdAt: '2024-01-14 09:00'
  },
  {
    id: 'b5',
    demandId: 'd9',
    demandTitle: '取快递帮忙',
    partnerId: 'u9',
    partnerName: '林同学',
    partnerAvatar: 'https://picsum.photos/id/1025/200/200',
    date: '2024-01-11',
    timeSlot: '18:00',
    status: 'completed',
    location: '阳光花园快递驿站',
    notes: '快递单号：SF1234567890',
    createdAt: '2024-01-10 16:00'
  }
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    fromUserId: 'u5',
    fromUserName: '孙姐姐',
    fromUserAvatar: 'https://picsum.photos/id/237/200/200',
    toUserId: 'u0',
    rating: 5,
    content: '非常负责，猫咪被照顾得很好，每天都发视频给我，太感谢了！',
    createdAt: '2024-01-15'
  },
  {
    id: 'r2',
    fromUserId: 'u7',
    fromUserName: '吴小姐',
    fromUserAvatar: 'https://picsum.photos/id/718/200/200',
    toUserId: 'u0',
    rating: 5,
    content: '打扫得非常干净，厨房像新的一样，强烈推荐！',
    createdAt: '2024-01-10'
  },
  {
    id: 'r3',
    fromUserId: 'u10',
    fromUserName: '黄阿姨',
    fromUserAvatar: 'https://picsum.photos/id/787/200/200',
    toUserId: 'u0',
    rating: 5,
    content: '小伙子很有耐心，一步一步教我怎么用手机挂号，太贴心了。',
    createdAt: '2024-01-08'
  },
  {
    id: 'r4',
    fromUserId: 'u9',
    fromUserName: '林同学',
    fromUserAvatar: 'https://picsum.photos/id/1025/200/200',
    toUserId: 'u0',
    rating: 4,
    content: '快递取的很及时，保管得很好，谢谢！',
    createdAt: '2024-01-05'
  },
  {
    id: 'r5',
    fromUserId: 'u3',
    fromUserName: '陈老师',
    fromUserAvatar: 'https://picsum.photos/id/338/200/200',
    toUserId: 'u0',
    rating: 5,
    content: '陪练很认真，羽毛球技术也不错，下次还约！',
    createdAt: '2023-12-28'
  }
];

export const mockThankCards: ThankCard[] = [
  {
    id: 't1',
    fromUserId: 'u5',
    fromUserName: '孙姐姐',
    fromUserAvatar: 'https://picsum.photos/id/237/200/200',
    toUserId: 'u0',
    message: '感谢你出差期间帮我照顾小橘，它很喜欢你！下次回来请你吃饭~',
    points: 50,
    createdAt: '2024-01-15'
  },
  {
    id: 't2',
    fromUserId: 'u10',
    fromUserName: '黄阿姨',
    fromUserAvatar: 'https://picsum.photos/id/787/200/200',
    toUserId: 'u0',
    message: '小张小张，热心帮忙！你教会我用手机挂号，真是帮了大忙了。',
    points: 30,
    createdAt: '2024-01-08'
  },
  {
    id: 't3',
    fromUserId: 'u7',
    fromUserName: '吴小姐',
    fromUserAvatar: 'https://picsum.photos/id/718/200/200',
    toUserId: 'u0',
    message: '新年大扫除辛苦啦！厨房打扫得一尘不染，给你点赞！',
    points: 40,
    createdAt: '2024-01-10'
  }
];

export const mockPointRecords: PointRecord[] = [
  { id: 'p1', type: 'earn', amount: 50, description: '获得感谢卡-孙姐姐', createdAt: '2024-01-15' },
  { id: 'p2', type: 'earn', amount: 30, description: '完成宠物照看订单', createdAt: '2024-01-14' },
  { id: 'p3', type: 'earn', amount: 40, description: '获得感谢卡-吴小姐', createdAt: '2024-01-10' },
  { id: 'p4', type: 'spend', amount: 100, description: '兑换超市购物券', createdAt: '2024-01-09' },
  { id: 'p5', type: 'earn', amount: 30, description: '获得感谢卡-黄阿姨', createdAt: '2024-01-08' },
  { id: 'p6', type: 'earn', amount: 20, description: '完成快递代取订单', createdAt: '2024-01-05' },
  { id: 'p7', type: 'earn', amount: 40, description: '完成家政清洁订单', createdAt: '2023-12-28' },
  { id: 'p8', type: 'spend', amount: 200, description: '兑换物业费抵扣券', createdAt: '2023-12-20' }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: '社区新年互助活动火热报名中',
    content: '各位邻居大家好！社区将于1月20日举办新年邻里互助日活动，届时将有技能展示、免费维修、积分兑换等丰富活动，欢迎大家积极报名参与！活动地点：阳光花园社区广场',
    createdAt: '2024-01-15',
    isImportant: true
  },
  {
    id: 'a2',
    title: '互助积分兑换商场新增礼品',
    content: '为感谢大家对邻里互助平台的支持，积分兑换商场新增了超市购物券、物业费抵扣券、家政服务券等多种礼品，欢迎大家前去兑换！',
    createdAt: '2024-01-12',
    isImportant: false
  },
  {
    id: 'a3',
    title: '关于维护平台良好环境的通知',
    content: '请各位邻居在使用平台时遵守社区公约，友好交流、诚信互助。如遇到纠纷可通过平台举报功能提交，管理员会及时处理。',
    createdAt: '2024-01-05',
    isImportant: false
  }
];

export const mockActivities: Activity[] = [
  {
    id: 'act1',
    title: '新年邻里互助日',
    description: '社区大型互助活动，包含免费维修、技能展示、积分兑换等',
    date: '2024-01-20 09:00',
    location: '阳光花园社区广场',
    maxParticipants: 200,
    currentParticipants: 128,
    points: 50,
    image: 'https://picsum.photos/id/1015/750/500'
  },
  {
    id: 'act2',
    title: '周末羽毛球友谊赛',
    description: '邻里间羽毛球友谊赛，参与者均可获得积分奖励',
    date: '2024-01-21 14:00',
    location: '阳光花园会所羽毛球馆',
    maxParticipants: 32,
    currentParticipants: 24,
    points: 30,
    image: 'https://picsum.photos/id/1044/750/500'
  },
  {
    id: 'act3',
    title: '老年智能手机培训班',
    description: '教授社区老人使用智能手机挂号、打车、视频通话等',
    date: '2024-01-25 10:00',
    location: '阳光花园社区服务中心',
    maxParticipants: 50,
    currentParticipants: 35,
    points: 40,
    image: 'https://picsum.photos/id/1036/750/500'
  }
];

export const mockBlacklist: BlacklistItem[] = [
  {
    id: 'bl1',
    userId: 'u11',
    userName: '神秘用户',
    userAvatar: 'https://picsum.photos/id/1025/200/200',
    reason: '多次爽约，不守信用',
    createdAt: '2024-01-05'
  }
];

export const mockReports: Report[] = [
  {
    id: 'rp1',
    reporterId: 'u0',
    reportedUserId: 'u12',
    reason: '发布虚假信息',
    description: '该用户发布的技能服务与实际不符',
    status: 'pending',
    createdAt: '2024-01-14'
  },
  {
    id: 'rp2',
    reporterId: 'u3',
    reportedUserId: 'u11',
    reason: '恶意骚扰',
    description: '多次发送无关消息骚扰',
    status: 'resolved',
    createdAt: '2024-01-03'
  }
];

export const mockDisputes: Dispute[] = [
  {
    id: 'ds1',
    demandId: 'd15',
    demandTitle: '家电维修纠纷',
    partyAId: 'u4',
    partyBId: 'u8',
    description: '维修后设备仍有问题，双方就退款问题产生争议',
    status: 'pending',
    createdAt: '2024-01-13'
  },
  {
    id: 'ds2',
    demandId: 'd18',
    demandTitle: '家政服务质量纠纷',
    partyAId: 'u7',
    partyBId: 'u1',
    description: '服务方认为已按标准完成，雇主认为清洁不够彻底',
    status: 'resolved',
    createdAt: '2024-01-02'
  }
];
