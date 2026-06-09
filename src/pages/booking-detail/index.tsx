import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import UserAvatar from '@/components/UserAvatar';
import EmptyState from '@/components/EmptyState';
import { useAppStore } from '@/store';
import type { Booking } from '@/types';

interface TimelineStep {
  key: Booking['status'] | 'pending';
  label: string;
  desc: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { key: 'pending', label: '发起预约', desc: '等待对方确认' },
  { key: 'confirmed', label: '已确认', desc: '预约已确认，按时赴约' },
  { key: 'rescheduled', label: '已改期', desc: '预约时间已调整' },
  { key: 'completed', label: '已完成', desc: '服务已完成，感谢互助' }
];

const BookingDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params?.id as string;

  const bookings = useAppStore(state => state.bookings);
  const updateBookingStatus = useAppStore(state => state.updateBookingStatus);

  const booking = bookings.find(b => b.id === id);

  if (!booking) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyContainer}>
          <EmptyState
            icon="📋"
            title="预约不存在"
            description="该预约可能已被删除或不存在"
          />
        </View>
      </View>
    );
  }

  const mockCreditScore = 780;
  const mockCompletedCount = 23;
  const mockRating = 4.9;

  const getSourceLabel = () => {
    return booking.demandTitle ? '需求来源' : '技能来源';
  };

  const getSourceTitle = () => {
    return booking.demandTitle || booking.skillTitle || '';
  };

  const getStepStatus = (stepKey: string) => {
    if (booking.status === 'cancelled') {
      return '';
    }

    const currentIndex = TIMELINE_STEPS.findIndex(s => s.key === booking.status);
    const stepIndex = TIMELINE_STEPS.findIndex(s => s.key === stepKey);

    if (stepIndex < currentIndex) return 'done';
    if (stepIndex === currentIndex) return 'active';
    return '';
  };

  const handleCancel = () => {
    Taro.showModal({
      title: '确认取消',
      content: `确定要取消「${getSourceTitle()}」的预约吗？`,
      success: (res) => {
        if (res.confirm) {
          updateBookingStatus(booking.id, 'cancelled');
          Taro.showToast({ title: '预约已取消', icon: 'success' });
        }
      }
    });
  };

  const handleConfirm = () => {
    updateBookingStatus(booking.id, 'confirmed');
    Taro.showToast({ title: '预约已确认', icon: 'success' });
  };

  const handleReschedule = () => {
    Taro.navigateTo({
      url: `/pages/reschedule/index?id=${booking.id}`
    });
  };

  const handleContact = () => {
    Taro.navigateTo({
      url: `/pages/chat/index?sessionId=c_${booking.partnerId}&userId=${booking.partnerId}&userName=${encodeURIComponent(booking.partnerName)}&userAvatar=${encodeURIComponent(booking.partnerAvatar)}`
    });
  };

  const handleComplete = () => {
    Taro.navigateTo({
      url: `/pages/review-thanks/index?id=${booking.id}`
    });
  };

  const handleReview = () => {
    Taro.navigateTo({
      url: `/pages/review-thanks/index?id=${booking.id}`
    });
  };

  const renderActionBar = () => {
    if (booking.status === 'cancelled') {
      return null;
    }

    if (booking.status === 'pending') {
      return (
        <View className={styles.actionBar}>
          <View className={styles.secondaryBtn} onClick={handleCancel}>
            <Text className={styles.secondaryBtnText}>取消预约</Text>
          </View>
          <View className={styles.primaryBtn} onClick={handleConfirm}>
            <Text className={styles.primaryBtnText}>确认预约</Text>
          </View>
        </View>
      );
    }

    if (booking.status === 'confirmed' || booking.status === 'rescheduled') {
      return (
        <View className={styles.actionBar}>
          <View className={styles.secondaryBtn} onClick={handleCancel}>
            <Text className={styles.secondaryBtnText}>取消预约</Text>
          </View>
          <View className={styles.warningBtn} onClick={handleReschedule}>
            <Text className={styles.warningBtnText}>申请改期</Text>
          </View>
          <View className={styles.contactBtn} onClick={handleContact}>
            <Text className={styles.contactBtnIcon}>💬</Text>
            <Text className={styles.contactBtnText}>联系对方</Text>
          </View>
          <View className={styles.primaryBtn} onClick={handleComplete}>
            <Text className={styles.primaryBtnText}>标记完成</Text>
          </View>
        </View>
      );
    }

    if (booking.status === 'completed') {
      return (
        <View className={styles.actionBar}>
          <View className={styles.primaryBtn} onClick={handleReview}>
            <Text className={styles.primaryBtnIcon}>⭐</Text>
            <Text className={styles.primaryBtnText}>去评价</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View className={styles.page}>
      <View className={styles.userCard}>
        <UserAvatar src={booking.partnerAvatar} size="md" name={booking.partnerName} />
        <View className={styles.userInfo}>
          <View className={styles.userNameRow}>
            <Text className={styles.userName}>{booking.partnerName}</Text>
            <View className={styles.creditBadge}>
              <Text className={styles.creditIcon}>⭐</Text>
              <Text className={styles.creditText}>{mockCreditScore}</Text>
            </View>
          </View>
          <View className={styles.userMeta}>
            <View className={styles.metaItem}>
              <Text className={styles.metaIcon}>✅</Text>
              <Text>完成 {mockCompletedCount} 次</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.metaIcon}>⭐</Text>
              <Text>{mockRating} 分</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.infoCard}>
        <View className={styles.infoRow}>
          <Text className={styles.infoIcon}>📌</Text>
          <View className={styles.infoContent}>
            <Text className={styles.infoLabel}>{getSourceLabel()}</Text>
            <Text className={styles.infoTitle}>{getSourceTitle()}</Text>
          </View>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoIcon}>📅</Text>
          <View className={styles.infoContent}>
            <Text className={styles.infoLabel}>预约时间</Text>
            <Text className={styles.infoValue}>{booking.date} {booking.timeSlot}</Text>
          </View>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoIcon}>📍</Text>
          <View className={styles.infoContent}>
            <Text className={styles.infoLabel}>服务地点</Text>
            <Text className={styles.infoValue}>{booking.location}</Text>
          </View>
        </View>
        {booking.notes && (
          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>📝</Text>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>备注</Text>
              <Text className={styles.infoValue}>{booking.notes}</Text>
            </View>
          </View>
        )}
      </View>

      <View className={styles.timeline}>
        <Text className={styles.timelineTitle}>预约状态</Text>
        {TIMELINE_STEPS.map((step) => {
          const status = getStepStatus(step.key);
          const isCancelled = booking.status === 'cancelled';
          return (
            <View
              key={step.key}
              className={classnames(
                styles.timelineItem,
                status && styles[status],
                isCancelled && step.key === 'pending' && ''
              )}
            >
              <View className={styles.timelineNode}>
                <View className={styles.timelineDot}>
                  <Text className={styles.timelineDotIcon}>
                    {status === 'done' ? '✓' : status === 'active' ? '•' : ''}
                  </Text>
                </View>
                <View className={styles.timelineLine} />
              </View>
              <View className={styles.timelineContent}>
                <Text className={styles.timelineLabel}>
                  {isCancelled && step.key === 'pending' ? '已取消' : step.label}
                </Text>
                <Text className={styles.timelineDesc}>
                  {isCancelled && step.key === 'pending' ? '预约已取消' : step.desc}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {renderActionBar()}
    </View>
  );
};

export default BookingDetailPage;
