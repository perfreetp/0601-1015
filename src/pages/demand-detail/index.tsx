import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import UserAvatar from '@/components/UserAvatar';
import EmptyState from '@/components/EmptyState';
import Tag from '@/components/Tag';
import { useAppStore } from '@/store';
import { mockUsers } from '@/data/users';
import {
  getCategoryEmoji,
  formatBudget,
  formatDistance,
  formatUrgency,
  formatStatus
} from '@/utils';
import type { Demand } from '@/types';

const DemandDetailPage: React.FC = () => {
  const router = useRouter();
  const demandId = router.params?.id as string;

  const demands = useAppStore(state => state.demands);

  const demand = useMemo(() => {
    return demands.find(d => d.id === demandId);
  }, [demands, demandId]);

  const publisher = useMemo(() => {
    if (!demand) return null;
    return mockUsers.find(u => u.id === demand.userId) || null;
  }, [demand]);

  const urgencyInfo = useMemo(() => {
    if (!demand) return null;
    return formatUrgency(demand.urgency);
  }, [demand]);

  const statusInfo = useMemo(() => {
    if (!demand) return null;
    return formatStatus(demand.status);
  }, [demand]);

  const handleContact = () => {
    if (!demand) return;
    const sessionId = `c_${demand.userId}`;
    console.log('[DemandDetail] 联系对方:', demand.userId, 'sessionId:', sessionId);
    Taro.navigateTo({
      url: `/pages/chat/index?sessionId=${sessionId}&userId=${demand.userId}&userName=${encodeURIComponent(demand.userName)}&userAvatar=${encodeURIComponent(demand.userAvatar)}`
    });
  };

  const handleBook = () => {
    if (!demand) return;
    console.log('[DemandDetail] 立即预约:', demand.id, demand.title);
    Taro.navigateTo({
      url: `/pages/create-booking/index?sId=${demand.id}&title=${encodeURIComponent(demand.title)}&pId=${demand.userId}&pName=${encodeURIComponent(demand.userName)}&pAvatar=${encodeURIComponent(demand.userAvatar)}&loc=${encodeURIComponent(demand.location)}`
    });
  };

  if (!demand) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyContainer}>
          <EmptyState
            icon="📭"
            title="需求不存在"
            description="该需求可能已被删除或不存在"
          />
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY enhanced showScrollbar={false}>
        <View className={styles.userCard}>
          <UserAvatar src={demand.userAvatar} size="lg" />
          <View className={styles.userInfo}>
            <View className={styles.userNameRow}>
              <Text className={styles.userName}>{demand.userName}</Text>
              {publisher && (
                <View className={styles.creditBadge}>
                  <Text className={styles.creditIcon}>⭐</Text>
                  <Text className={styles.creditText}>{publisher.creditScore} 信用分</Text>
                </View>
              )}
            </View>
            <Text className={styles.publishTime}>发布于 {demand.createdAt}</Text>
          </View>
        </View>

        <View className={styles.infoSection}>
          <View className={styles.titleRow}>
            <Text className={styles.demandTitle}>
              {getCategoryEmoji(demand.category)} {demand.title}
            </Text>
          </View>
          <View className={styles.tagList}>
            <Tag text={demand.category} />
            <Tag
              text={formatBudget(demand.budget, demand.budgetType)}
              color="#D97706"
              bg="#FEF3C7"
            />
            <Tag
              text={`📍 ${demand.location}`}
              color="#2563EB"
              bg="#DBEAFE"
            />
            {urgencyInfo && (
              <Tag
                text={urgencyInfo.label}
                color={urgencyInfo.color}
                bg={urgencyInfo.bg}
              />
            )}
            <Tag
              text={`📏 ${formatDistance(demand.distance)}`}
              color="#4B5563"
              bg="#F3F4F6"
            />
            {statusInfo && (
              <Tag
                text={statusInfo.label}
                color={statusInfo.color}
                bg={statusInfo.bg}
              />
            )}
          </View>
        </View>

        <View className={styles.descCard}>
          <Text className={styles.descTitle}>需求描述</Text>
          <Text className={styles.descContent}>{demand.description}</Text>
        </View>
      </ScrollView>

      <View className={styles.actionBar}>
        <View className={styles.contactBtn} onClick={handleContact}>
          <Text className={styles.contactBtnIcon}>💬</Text>
          <Text className={styles.contactBtnText}>联系对方</Text>
        </View>
        <View className={styles.bookBtn} onClick={handleBook}>
          <Text className={styles.bookBtnIcon}>📅</Text>
          <Text className={styles.bookBtnText}>立即预约</Text>
        </View>
      </View>
    </View>
  );
};

export default DemandDetailPage;
