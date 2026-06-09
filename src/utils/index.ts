export const formatDate = (dateStr: string): string => {
  return dateStr;
};

export { DEMAND_CATEGORIES } from '@/types';

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

export const formatBudget = (budget: number, type: 'free' | 'fixed' | 'negotiable'): string => {
  if (type === 'free' || budget === 0) return '免费互助';
  if (type === 'negotiable') return `¥${budget} 面议`;
  return `¥${budget}`;
};

export const formatUrgency = (urgency: 'low' | 'medium' | 'high'): {
  label: string;
  color: string;
  bg: string;
} => {
  switch (urgency) {
    case 'high':
      return { label: '紧急', color: '#DC2626', bg: '#FEE2E2' };
    case 'medium':
      return { label: '一般', color: '#D97706', bg: '#FEF3C7' };
    case 'low':
      return { label: '不急', color: '#16A34A', bg: '#DCFCE7' };
  }
};

export const formatStatus = (status: string): {
  label: string;
  color: string;
  bg: string;
} => {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    open: { label: '招募中', color: '#16A34A', bg: '#DCFCE7' },
    matched: { label: '已匹配', color: '#2563EB', bg: '#DBEAFE' },
    completed: { label: '已完成', color: '#6B7280', bg: '#F3F4F6' },
    cancelled: { label: '已取消', color: '#DC2626', bg: '#FEE2E2' },
    pending: { label: '待确认', color: '#D97706', bg: '#FEF3C7' },
    confirmed: { label: '已确认', color: '#16A34A', bg: '#DCFCE7' },
    rescheduled: { label: '已改期', color: '#6366F1', bg: '#E0E7FF' }
  };
  return map[status] || { label: status, color: '#6B7280', bg: '#F3F4F6' };
};

export const getCategoryEmoji = (category: string): string => {
  const map: Record<string, string> = {
    '修伞维修': '🔧',
    '代购跑腿': '🏃',
    '运动陪练': '⚽',
    '翻译服务': '📚',
    '家政清洁': '🧹',
    '宠物照看': '🐱',
    '课业辅导': '📖',
    '其他': '💡'
  };
  return map[category] || '💡';
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};
