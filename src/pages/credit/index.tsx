import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import UserAvatar from '@/components/UserAvatar';
import { currentUser } from '@/data/users';
import { mockReviews, mockThankCards, mockDisputes } from '@/data/bookings';
import type { Review, ThankCard, Dispute } from '@/types';

const CreditPage: React.FC = () => {
  const getCreditLevel = (score: number): string => {
    if (score >= 95) return '⭐ 优秀邻居';
    if (score >= 85) return '👍 信任邻居';
    if (score >= 70) return '😊 友好邻居';
    return '🌱 新邻居';
  };

  const handleViewAll = (type: string) => {
    console.log('[Credit] 查看全部:', type);
    Taro.showToast({ title: '更多内容开发中', icon: 'none' });
  };

  const renderStars = (rating: number) => {
    return (
      <View className={styles.reviewRating}>
        {[1, 2, 3, 4, 5].map(i => (
          <Text key={i} className={styles.reviewStar}>
            {i <= rating ? '★' : '☆'}
          </Text>
        ))}
      </View>
    );
  };

  const getDisputeStatus = (status: string) => {
    return status === 'pending'
      ? { label: '处理中', color: '#D97706', bg: '#FEF3C7' }
      : { label: '已解决', color: '#16A34A', bg: '#DCFCE7' };
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.creditScoreCard}>
          <Text className={styles.creditScoreLabel}>我的信用分</Text>
          <View>
            <Text className={styles.creditScoreValue}>{currentUser.creditScore}</Text>
          </View>
          <View className={styles.creditScoreLevel}>
            <Text className={styles.creditScoreLevelText}>
              {getCreditLevel(currentUser.creditScore)}
            </Text>
          </View>

          <View className={styles.creditStats}>
            <View className={styles.creditStatItem}>
              <Text className={styles.creditStatValue}>{currentUser.completedCount}</Text>
              <Text className={styles.creditStatLabel}>完成次数</Text>
            </View>
            <View className={styles.creditStatItem}>
              <Text className={styles.creditStatValue}>{currentUser.rating}</Text>
              <Text className={styles.creditStatLabel}>综合评分</Text>
            </View>
            <View className={styles.creditStatItem}>
              <Text className={styles.creditStatValue}>{mockThankCards.length}</Text>
              <Text className={styles.creditStatLabel}>感谢卡</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView scrollY enhanced showScrollbar={false}>
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>收到的评价</Text>
            <Text className={styles.sectionMore} onClick={() => handleViewAll('reviews')}>
              查看全部 ›
            </Text>
          </View>
          {mockReviews.slice(0, 3).map((review: Review) => (
            <View key={review.id} className={styles.reviewCard}>
              <View className={styles.reviewHeader}>
                <UserAvatar src={review.fromUserAvatar} size="sm" />
                <View className={styles.reviewUserInfo}>
                  <Text className={styles.reviewUserName}>{review.fromUserName}</Text>
                  {renderStars(review.rating)}
                </View>
                <Text className={styles.reviewDate}>{review.createdAt}</Text>
              </View>
              <Text className={styles.reviewContent}>{review.content}</Text>
            </View>
          ))}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>💝 收到的感谢卡</Text>
            <Text className={styles.sectionMore} onClick={() => handleViewAll('thanks')}>
              查看全部 ›
            </Text>
          </View>
          {mockThankCards.map((card: ThankCard) => (
            <View key={card.id} className={styles.thanksCard}>
              <View className={styles.thanksHeader}>
                <UserAvatar src={card.fromUserAvatar} size="sm" />
                <View className={styles.thanksUserInfo}>
                  <Text className={styles.thanksUserName}>{card.fromUserName}</Text>
                </View>
                <View className={styles.thanksPoints}>
                  <Text className={styles.thanksPointsText}>+{card.points} 积分</Text>
                </View>
              </View>
              <Text className={styles.thanksMessage}>「{card.message}」</Text>
              <Text className={styles.thanksDate}>{card.createdAt}</Text>
            </View>
          ))}
        </View>

        {mockDisputes.length > 0 && (
          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>纠纷记录</Text>
              <Text className={styles.sectionMore} onClick={() => handleViewAll('disputes')}>
                查看全部 ›
              </Text>
            </View>
            {mockDisputes.map((dispute: Dispute) => {
              const statusInfo = getDisputeStatus(dispute.status);
              return (
                <View
                  key={dispute.id}
                  className={classnames(
                    styles.disputeCard,
                    dispute.status === 'pending' ? styles.disputePending : styles.disputeResolved
                  )}
                >
                  <View className={styles.disputeHeader}>
                    <Text className={styles.disputeTitle}>{dispute.demandTitle}</Text>
                    <View
                      className={styles.disputeStatus}
                      style={{ background: statusInfo.bg }}
                    >
                      <Text
                        className={styles.disputeStatusText}
                        style={{ color: statusInfo.color }}
                      >
                        {statusInfo.label}
                      </Text>
                    </View>
                  </View>
                  <Text className={styles.disputeDesc}>{dispute.description}</Text>
                  <Text className={styles.disputeDate}>{dispute.createdAt}</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CreditPage;
