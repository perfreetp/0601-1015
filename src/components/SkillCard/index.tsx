import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import type { Skill } from '@/types';
import { formatBudget, getCategoryEmoji } from '@/utils';

interface SkillCardProps {
  data: Skill;
  showEdit?: boolean;
  onEdit?: () => void;
  onClick?: () => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ data, showEdit = false, onEdit, onClick }) => {
  const price = formatBudget(data.price, data.priceType);
  const emoji = getCategoryEmoji(data.category);

  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.header}>
        <View className={styles.titleRow}>
          <Text className={styles.emoji}>{emoji}</Text>
          <Text className={styles.title}>{data.title}</Text>
        </View>
        <Tag text={data.category} />
      </View>

      <Text className={styles.description}>{data.description}</Text>

      <View className={styles.infoRow}>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>服务时间</Text>
          <Text className={styles.infoValue}>{data.availableTimes.join(' / ')}</Text>
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.rangeInfo}>
          <Text className={styles.rangeText}>服务范围 {data.serviceRange}km</Text>
        </View>
        <View className={styles.priceRow}>
          <Text className={styles.price}>{price}</Text>
          {showEdit && (
            <Text className={styles.editBtn} onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>编辑</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default SkillCard;
