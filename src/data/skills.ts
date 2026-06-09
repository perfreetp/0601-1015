import type { Skill } from '@/types';

export const mockSkills: Skill[] = [
  {
    id: 's1',
    userId: 'u0',
    title: '家电维修',
    category: '修伞维修',
    description: '擅长各类家用电器简单维修，水电小问题也可以处理，有5年经验。',
    price: 50,
    priceType: 'negotiable',
    availableTimes: ['周六全天', '周日上午', '工作日晚上'],
    serviceRange: 2,
    createdAt: '2023-10-01'
  },
  {
    id: 's2',
    userId: 'u0',
    title: '英语翻译',
    category: '翻译服务',
    description: '英语专业八级，擅长商务文件、日常文档翻译，准时交付。',
    price: 100,
    priceType: 'negotiable',
    availableTimes: ['工作日晚上', '周末全天'],
    serviceRange: 5,
    createdAt: '2023-09-15'
  },
  {
    id: 's3',
    userId: 'u1',
    title: '家政保洁',
    category: '家政清洁',
    description: '有3年家政经验，干活细致干净，可以做日常清洁和深度清洁。',
    price: 40,
    priceType: 'fixed',
    availableTimes: ['周一至周五 9:00-17:00'],
    serviceRange: 1,
    createdAt: '2023-08-20'
  },
  {
    id: 's4',
    userId: 'u2',
    title: '羽毛球陪练',
    category: '运动陪练',
    description: '业余羽毛球爱好者，水平中等，可以陪练，也可以一起健身。',
    price: 0,
    priceType: 'free',
    availableTimes: ['周六上午', '周日下午'],
    serviceRange: 1,
    createdAt: '2023-11-05'
  },
  {
    id: 's5',
    userId: 'u3',
    title: '数学辅导',
    category: '课业辅导',
    description: '退休数学老师，30年教学经验，擅长小学到初中数学辅导。',
    price: 80,
    priceType: 'fixed',
    availableTimes: ['周一至周五 15:00-20:00', '周末全天'],
    serviceRange: 3,
    createdAt: '2023-07-10'
  },
  {
    id: 's6',
    userId: 'u4',
    title: '代买跑腿',
    category: '代购跑腿',
    description: '时间灵活，可以帮忙代购、取快递、缴费等各类跑腿服务。',
    price: 10,
    priceType: 'negotiable',
    availableTimes: ['每天 8:00-20:00'],
    serviceRange: 2,
    createdAt: '2023-12-01'
  },
  {
    id: 's7',
    userId: 'u5',
    title: '宠物照看',
    category: '宠物照看',
    description: '自己养猫三年，有经验，可上门喂养、遛狗、清理等。',
    price: 30,
    priceType: 'fixed',
    availableTimes: ['每天均可'],
    serviceRange: 1,
    createdAt: '2023-11-20'
  },
  {
    id: 's8',
    userId: 'u6',
    title: '修伞修鞋',
    category: '修伞维修',
    description: '传统手艺，修伞、修鞋、配钥匙都可以，价格公道。',
    price: 15,
    priceType: 'negotiable',
    availableTimes: ['周二、周四下午', '周六上午'],
    serviceRange: 1,
    createdAt: '2023-06-15'
  },
  {
    id: 's9',
    userId: 'u7',
    title: '日语翻译',
    category: '翻译服务',
    description: '日本留学归来，N1水平，可做日常翻译、旅游翻译。',
    price: 120,
    priceType: 'negotiable',
    availableTimes: ['周末全天'],
    serviceRange: 3,
    createdAt: '2023-10-25'
  },
  {
    id: 's10',
    userId: 'u8',
    title: '跑腿代办',
    category: '代购跑腿',
    description: '做事认真负责，可代排队、代缴费、代办各类事务。',
    price: 20,
    priceType: 'negotiable',
    availableTimes: ['工作日全天'],
    serviceRange: 3,
    createdAt: '2023-09-01'
  }
];
