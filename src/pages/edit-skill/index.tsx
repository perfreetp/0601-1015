import React, { useState, useEffect } from 'react';
import { View, Text, Input, Textarea, Slider } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { DEMAND_CATEGORIES, getCategoryEmoji } from '@/utils';
import { useAppStore } from '@/store';
import type { Skill } from '@/types';

type PriceType = 'free' | 'fixed' | 'negotiable';

const TIME_OPTIONS = [
  { value: '工作日上午', label: '工作日上午 (9:00-12:00)' },
  { value: '工作日下午', label: '工作日下午 (14:00-18:00)' },
  { value: '工作日晚上', label: '工作日晚上 (19:00-22:00)' },
  { value: '周六全天', label: '周六全天' },
  { value: '周日全天', label: '周日全天' },
  { value: '周末上午', label: '周末上午' },
  { value: '周末下午', label: '周末下午' }
];

const RANGE_OPTIONS = [0.5, 1, 2, 3, 5];

const EditSkillPage: React.FC = () => {
  const router = useRouter();
  const skillId = router.params?.id as string;
  const isEdit = !!skillId;

  const addSkill = useAppStore(state => state.addSkill);
  const updateSkill = useAppStore(state => state.updateSkill);
  const skills = useAppStore(state => state.skills);

  const existingSkill = isEdit ? skills.find(s => s.id === skillId) : null;

  const [title, setTitle] = useState(existingSkill?.title || '');
  const [category, setCategory] = useState(existingSkill?.category || '');
  const [description, setDescription] = useState(existingSkill?.description || '');
  const [price, setPrice] = useState(existingSkill?.price?.toString() || '');
  const [priceType, setPriceType] = useState<PriceType>(existingSkill?.priceType || 'negotiable');
  const [availableTimes, setAvailableTimes] = useState<string[]>(existingSkill?.availableTimes || []);
  const [serviceRange, setServiceRange] = useState<number>(existingSkill?.serviceRange || 2);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      console.log('[EditSkill] Editing skill:', skillId, existingSkill?.title);
    } else {
      console.log('[EditSkill] Creating new skill');
    }
  }, []);

  const canSubmit = title.trim().length > 0 && category && description.trim().length > 0 && availableTimes.length > 0;

  const handleToggleTime = (time: string) => {
    setAvailableTimes(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const handleSubmit = () => {
    if (!canSubmit || submitting) return;

    console.log('[EditSkill] Submitting:', { title, category, description, price, priceType, availableTimes, serviceRange });
    setSubmitting(true);

    try {
      const skillData = {
        title: title.trim(),
        category,
        description: description.trim(),
        price: priceType === 'free' ? 0 : (parseInt(price) || 0),
        priceType,
        availableTimes,
        serviceRange
      };

      if (isEdit) {
        updateSkill(skillId, skillData);
        Taro.showToast({ title: '保存成功！', icon: 'success' });
      } else {
        addSkill(skillData);
        Taro.showToast({ title: '添加成功！', icon: 'success' });
      }

      setTimeout(() => {
        Taro.navigateBack();
      }, 800);
    } catch (e) {
      console.error('[EditSkill] Submit failed:', e);
      Taro.showToast({ title: '保存失败，请重试', icon: 'none' });
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
            {isEdit ? '技能名称' : '新增技能名称'}
          </Text>
          <View className={styles.inputBox}>
            <Input
              className={styles.inputField}
              placeholder="如：家电维修、英语翻译等"
              maxlength={20}
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
            技能描述
          </Text>
          <View className={styles.textareaBox}>
            <Textarea
              className={styles.textareaField}
              placeholder="介绍一下你的技能、经验、能为邻居提供什么帮助..."
              maxlength={300}
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
            />
          </View>
        </View>
      </View>

      <View className={styles.formCard}>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            可用时间
          </Text>
          <View className={styles.timeOptions}>
            {TIME_OPTIONS.map(opt => (
              <View
                key={opt.value}
                className={classnames(styles.timeOption, availableTimes.includes(opt.value) && styles.active)}
                onClick={() => handleToggleTime(opt.value)}
              >
                <View className={styles.timeCheckbox}>
                  {availableTimes.includes(opt.value) && (
                    <Text className={styles.timeCheckIcon}>✓</Text>
                  )}
                </View>
                <Text className={styles.timeLabel}>{opt.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.formCard}>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>服务价格</Text>
          <View className={styles.priceTypeList}>
            <View
              className={classnames(styles.priceTypeItem, priceType === 'free' && styles.active)}
              onClick={() => setPriceType('free')}
            >
              <Text>免费互助</Text>
            </View>
            <View
              className={classnames(styles.priceTypeItem, priceType === 'fixed' && styles.active)}
              onClick={() => setPriceType('fixed')}
            >
              <Text>固定价格</Text>
            </View>
            <View
              className={classnames(styles.priceTypeItem, priceType === 'negotiable' && styles.active)}
              onClick={() => setPriceType('negotiable')}
            >
              <Text>价格面议</Text>
            </View>
          </View>
          {priceType !== 'free' && (
            <View className={styles.priceRow}>
              <View className={styles.priceInputBox}>
                <Text className={styles.pricePrefix}>¥</Text>
                <Input
                  className={styles.inputField}
                  type="number"
                  placeholder={priceType === 'fixed' ? '输入每次/每小时价格' : '输入期望价格'}
                  value={price}
                  onInput={(e) => setPrice(e.detail.value)}
                />
              </View>
            </View>
          )}
        </View>

        <View className={styles.formItem}>
          <View className={styles.rangeRow}>
            <Text className={styles.formLabel} style={{ marginBottom: 0 }}>服务范围</Text>
            <Text className={styles.rangeValue}>{serviceRange} km</Text>
          </View>
          <View style={{ marginTop: 16 }}>
            <Slider
              min={0}
              max={10}
              step={1}
              value={serviceRange}
              activeColor="#22C55E"
              backgroundColor="#E5E7EB"
              blockColor="#22C55E"
              blockSize={24}
              onChange={(e) => setServiceRange(e.detail.value)}
            />
          </View>
          <View className={styles.rangeOptions}>
            {RANGE_OPTIONS.map(r => (
              <View
                key={r}
                className={classnames(styles.rangeOption, serviceRange === r && styles.active)}
                onClick={() => setServiceRange(r)}
              >
                <Text>{r}km</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.cancelBtn} onClick={handleCancel}>
          <Text className={styles.cancelBtnText}>取消</Text>
        </View>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitBtnText}>
            {submitting ? '保存中...' : isEdit ? '保存修改' : '添加技能'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default EditSkillPage;
