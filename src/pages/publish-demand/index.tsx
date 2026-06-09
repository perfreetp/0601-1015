import React, { useState } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { DEMAND_CATEGORIES, getCategoryEmoji } from '@/utils';
import { useAppStore } from '@/store';
import type { Demand } from '@/types';

type BudgetType = 'free' | 'fixed' | 'negotiable';
type Urgency = 'low' | 'medium' | 'high';

const PublishDemandPage: React.FC = () => {
  const addDemand = useAppStore(state => state.addDemand);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [budgetType, setBudgetType] = useState<BudgetType>('negotiable');
  const [location, setLocation] = useState('阳光花园小区');
  const [urgency, setUrgency] = useState<Urgency>('medium');
  const [submitting, setSubmitting] = useState(false);

  const urgencyOptions: { value: Urgency; label: string; desc: string; color: string; bg: string }[] = [
    { value: 'low', label: '不急', desc: '3天内完成即可', color: '#16A34A', bg: '#DCFCE7' },
    { value: 'medium', label: '一般', desc: '1-2天内完成', color: '#D97706', bg: '#FEF3C7' },
    { value: 'high', label: '紧急', desc: '今天就需要', color: '#DC2626', bg: '#FEE2E2' }
  ];

  const budgetTypeOptions: { value: BudgetType; label: string }[] = [
    { value: 'free', label: '免费互助' },
    { value: 'fixed', label: '固定价格' },
    { value: 'negotiable', label: '价格面议' }
  ];

  const canSubmit = title.trim().length > 0 && category && description.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || submitting) return;

    console.log('[Publish] Submitting demand:', { title, category, description, budget, budgetType, location, urgency });
    setSubmitting(true);

    try {
      const now = new Date();
      const expires = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

      addDemand({
        title: title.trim(),
        category,
        description: description.trim(),
        budget: budgetType === 'free' ? 0 : (parseInt(budget) || 0),
        budgetType,
        location: location.trim() || '阳光花园小区',
        distance: 0,
        urgency,
        status: 'open',
        expiresAt: `${expires.getFullYear()}-${String(expires.getMonth() + 1).padStart(2, '0')}-${String(expires.getDate()).padStart(2, '0')} 23:59`
      });

      Taro.showToast({ title: '发布成功！', icon: 'success' });
      
      setTimeout(() => {
        Taro.navigateBack();
      }, 800);
    } catch (e) {
      console.error('[Publish] Submit failed:', e);
      Taro.showToast({ title: '发布失败，请重试', icon: 'none' });
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.page}>
      <View className={styles.formCard}>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            需求标题
          </Text>
          <View className={styles.inputBox}>
            <Input
              className={styles.inputField}
              placeholder="请简要描述你的需求，如：雨伞坏了需要维修"
              placeholderClass={styles.placeholder}
              maxlength={30}
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            选择分类
          </Text>
          <View className={styles.categoryList}>
            {DEMAND_CATEGORIES.map(cat => (
              <View
                key={cat}
                className={classnames(styles.categoryItem, category === cat && styles.active)}
                onClick={() => setCategory(cat)}
              >
                <Text className={styles.categoryEmoji}>{getCategoryEmoji(cat)}</Text>
                <Text>{cat}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            详细描述
          </Text>
          <View className={styles.textareaBox}>
            <Textarea
              className={styles.textareaField}
              placeholder="请详细描述你的需求，方便邻居更好地帮助你~"
              placeholderClass={styles.placeholder}
              maxlength={500}
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
            />
          </View>
        </View>
      </View>

      <View className={styles.formCard}>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>报酬预算</Text>
          <View className={styles.budgetTypeList}>
            {budgetTypeOptions.map(opt => (
              <View
                key={opt.value}
                className={classnames(styles.budgetTypeItem, budgetType === opt.value && styles.active)}
                onClick={() => setBudgetType(opt.value)}
              >
                <Text>{opt.label}</Text>
              </View>
            ))}
          </View>
          {budgetType !== 'free' && (
            <View className={styles.budgetRow} style={{ marginTop: 24 }}>
              <View className={styles.inputBox} style={{ flex: 1 }}>
                <Text style={{ fontSize: 28, color: '#6B7280', marginRight: 8 }}>¥</Text>
                <Input
                  className={styles.inputField}
                  type="number"
                  placeholder={budgetType === 'fixed' ? '请输入固定金额' : '请输入期望金额'}
                  value={budget}
                  onInput={(e) => setBudget(e.detail.value)}
                />
              </View>
            </View>
          )}
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>服务地点</Text>
          <View className={styles.inputBox}>
            <Input
              className={styles.inputField}
              placeholder="请输入详细地点"
              value={location}
              onInput={(e) => setLocation(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>紧急程度</Text>
          <View className={styles.urgencyList}>
            {urgencyOptions.map(opt => (
              <View
                key={opt.value}
                className={classnames(styles.urgencyItem, urgency === opt.value && styles.active)}
                style={urgency === opt.value ? { background: opt.bg } : undefined}
                onClick={() => setUrgency(opt.value)}
              >
                <Text className={styles.urgencyLabel} style={{ color: opt.color }}>
                  {opt.label}
                </Text>
                <Text className={styles.urgencyDesc}>{opt.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.cancelBtn} onClick={handleCancel}>
          <Text className={styles.cancelBtnText}>取消</Text>
        </View>
        <View
          className={classnames(styles.submitBtn, !canSubmit && styles.submitBtnDisabled)}
          onClick={handleSubmit}
        >
          <Text className={styles.submitBtnText}>
            {submitting ? '发布中...' : '发布需求'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PublishDemandPage;
