import React, { useMemo, useState } from 'react';
import { View, Text, Textarea, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import UserAvatar from '@/components/UserAvatar';
import EmptyState from '@/components/EmptyState';
import { useAppStore } from '@/store';

const POINTS_OPTIONS = [0, 10, 20, 50];

const ReviewThanksPage: React.FC = () => {
  const router = useRouter();
  const bookingId = router.params?.id as string;

  const bookings = useAppStore(state => state.bookings);
  const store = useAppStore();

  const booking = useMemo(() => {
    return bookings.find(b => b.id === bookingId);
  }, [bookings, bookingId]);

  const serviceTitle = useMemo(() => {
    return booking?.skillTitle || booking?.demandTitle || '';
  }, [booking]);

  const [rating, setRating] = useState<number>(5);
  const [reviewContent, setReviewContent] = useState('');
  const [thankMessage, setThankMessage] = useState('');
  const [points, setPoints] = useState<number>(10);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting || !booking) return;
    setSubmitting(true);

    try {
      const state = store as any;
      if (typeof state.completeBookingAndReview === 'function') {
        state.completeBookingAndReview(bookingId, rating, reviewContent, thankMessage, points);
      } else {
        if (typeof state.updateBookingStatus === 'function') {
          state.updateBookingStatus(bookingId, 'completed');
        }
        if (typeof state.addReview === 'function') {
          state.addReview({
            toUserId: booking.partnerId,
            rating,
            content: reviewContent
          });
        }
        if (typeof state.addThankCard === 'function') {
          state.addThankCard({
            toUserId: booking.partnerId,
            message: thankMessage,
            points
          });
        }
        if (typeof state.addPointRecord === 'function' && points > 0) {
          state.addPointRecord({
            type: 'spend',
            amount: points,
            description: `赠送积分给 ${booking.partnerName}`
          });
        }
      }

      Taro.showToast({ title: '感谢您的评价！', icon: 'success' });

      setTimeout(() => {
        Taro.switchTab({ url: '/pages/credit/index' });
      }, 1000);
    } catch (e) {
      console.error('[ReviewThanks] Submit failed:', e);
      Taro.showToast({ title: '提交失败，请重试', icon: 'none' });
      setSubmitting(false);
    }
  };

  if (!booking) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyContainer}>
          <EmptyState
            icon="📭"
            title="预约不存在"
            description="该预约可能已被删除或不存在"
          />
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.partnerCard}>
        <UserAvatar src={booking.partnerAvatar} size="lg" name={booking.partnerName} />
        <View className={styles.partnerInfo}>
          <Text className={styles.partnerName}>{booking.partnerName}</Text>
          <Text className={styles.serviceTitle}>{serviceTitle}</Text>
        </View>
      </View>

      <View className={styles.sectionCard}>
        <Text className={styles.sectionTitle}>服务评分</Text>
        <View className={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Text
              key={star}
              className={classnames(styles.starBtn, star <= rating && styles.activeStar)}
              onClick={() => setRating(star)}
            >
              ★
            </Text>
          ))}
        </View>
      </View>

      <View className={styles.sectionCard}>
        <Text className={styles.sectionTitle}>评价内容</Text>
        <Textarea
          className={styles.reviewTextarea}
          placeholder="说说对本次服务的感受吧~"
          maxlength={500}
          value={reviewContent}
          onInput={(e) => setReviewContent(e.detail.value)}
        />
      </View>

      <View className={styles.sectionCard}>
        <Text className={styles.sectionTitle}>感谢卡留言（选填）</Text>
        <Input
          className={styles.thanksInput}
          placeholder="写一句感谢的话..."
          maxlength={50}
          value={thankMessage}
          onInput={(e) => setThankMessage(e.detail.value)}
        />
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.pointsSection}>
          <Text className={styles.sectionTitle}>赠送积分</Text>
          <View className={styles.pointsChipList}>
            {POINTS_OPTIONS.map((p) => (
              <View
                key={p}
                className={classnames(styles.pointsChip, points === p && styles.activePointsChip)}
                onClick={() => setPoints(p)}
              >
                <Text>{p === 0 ? '不赠送' : `${p} 积分`}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.submitBtn} onClick={handleSubmit}>
        <Text className={styles.submitBtnText}>
          {submitting ? '提交中...' : '提交评价'}
        </Text>
      </View>
    </View>
  );
};

export default ReviewThanksPage;
