import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import UserAvatar from '@/components/UserAvatar';
import Tag from '@/components/Tag';
import type { Demand } from '@/types';
import { formatDistance, formatBudget, formatUrgency, getCategoryEmoji } from '@/utils';

interface DemandCardProps {
  data: Demand;
  onClick?: () => void;
}

const DemandCard: React.FC<DemandCardProps> = ({ data, onClick }) => {
  const urgency = formatUrgency(data.urgency);
  const budget = formatBudget(data.budget, data.budgetType);
  const distance = formatDistance(data.distance);
  const emoji = getCategoryEmoji(data.category);

  const handleClick = () => {
    onClick?.();
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <UserAvatar src={data.userAvatar} size="sm" />
        <View className={styles.userInfo}>
          <Text className={styles.userName}>{data.userName}</Text>
          <Text className={styles.meta}>{distance} · {data.createdAt}</Text>
        </View>
        <Tag
          text={urgency.label}
          color={urgency.color}
          bg={urgency.bg}
        />
      </View>

      <View className={styles.content}>
        <View className={styles.titleRow}>
          <Text className={styles.emoji}>{emoji}</Text>
          <Text className={styles.title}>{data.title}</Text>
        </View>
        <Text className={styles.description}>{data.description}</Text>
      </View>

      <View className={styles.footer}>
        <View className={styles.tags}>
          <Tag text={data.category} />
          <Tag text={data.location.split('').slice(0, 6).join('')} color="#4B5563" bg="#F3F4F6" />
        </View>
        <View className={styles.budget}>
          <Text className={styles.budgetText}>{budget}</Text>
        </View>
      </View>
    </View>
  );
};

export default DemandCard;
