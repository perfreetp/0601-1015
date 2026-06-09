import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import UserAvatar from '@/components/UserAvatar';
import EmptyState from '@/components/EmptyState';
import { useAppStore } from '@/store';
import type { Booking } from '@/types';
import { formatStatus } from '@/utils';

const BookingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('全部');

  const bookings = useAppStore(state => state.bookings);
  const updateBookingStatus = useAppStore(state => state.updateBookingStatus);

  useDidShow(() => {
    console.log('[Booking] Page shown, total bookings:', bookings.length);
  });

  const tabs = ['全部', '待确认', '已确认', '已完成'];

  const filteredBookings = useMemo(() => {
    if (activeTab === '全部') return bookings;
    const statusMap: Record<string, string[]> = {
      '待确认': ['pending'],
      '已确认': ['confirmed', 'rescheduled'],
      '已完成': ['completed', 'cancelled']
    };
    const statuses = statusMap[activeTab] || [];
    return bookings.filter(b => statuses.includes(b.status));
  }, [activeTab, bookings]);

  const upcomingBooking = useMemo(() => {
    const activeBookings = bookings.filter(b =>
      b.status === 'confirmed' || b.status === 'pending' || b.status === 'rescheduled'
    );
    if (activeBookings.length === 0) return null;
    activeBookings.sort((a, b) => {
      const aTime = new Date(`${a.date} ${a.timeSlot.split(' ')[0]}`).getTime();
      const bTime = new Date(`${b.date} ${b.timeSlot.split(' ')[0]}`).getTime();
      return aTime - bTime;
    });
    return activeBookings[0];
  }, [bookings]);

  const handleCancel = (booking: Booking) => {
    console.log('[Booking] 取消预约:', booking.id);
    Taro.showModal({
      title: '确认取消',
      content: `确定要取消「${booking.demandTitle || booking.skillTitle}」的预约吗？`,
      success: (res) => {
        if (res.confirm) {
          updateBookingStatus(booking.id, 'cancelled');
          Taro.showToast({ title: '预约已取消', icon: 'success' });
        }
      }
    });
  };

  const handleReschedule = (booking: Booking) => {
    console.log('[Booking] 改期预约:', booking.id);
    Taro.navigateTo({
      url: `/pages/reschedule/index?id=${booking.id}&title=${encodeURIComponent(booking.demandTitle || booking.skillTitle)}&date=${booking.date}&slot=${encodeURIComponent(booking.timeSlot)}`
    });
  };

  const handleConfirm = (booking: Booking) => {
    console.log('[Booking] 确认预约:', booking.id);
    updateBookingStatus(booking.id, 'confirmed');
    Taro.showToast({ title: '预约已确认', icon: 'success' });
  };

  const handleComplete = (booking: Booking) => {
    console.log('[Booking] 完成预约:', booking.id);
    Taro.navigateTo({ url: `/pages/review-thanks/index?id=${booking.id}` });
  };

  const handleContact = (booking: Booking) => {
    console.log('[Booking] 联系对方:', booking.partnerId);
    Taro.navigateTo({
      url: `/pages/chat/index?sessionId=c_${booking.partnerId}&userId=${booking.partnerId}&userName=${encodeURIComponent(booking.partnerName)}&userAvatar=${encodeURIComponent(booking.partnerAvatar)}`
    });
  };

  return (
    <View className={styles.page}>
      {upcomingBooking && (
        <View className={styles.reminderBanner}>
          <Text className={styles.reminderIcon}>⏰</Text>
          <View className={styles.reminderContent}>
            <Text className={styles.reminderTitle}>预约提醒</Text>
            <Text className={styles.reminderText}>
              你与{upcomingBooking.partnerName}的「{upcomingBooking.demandTitle || upcomingBooking.skillTitle}」
              预约将于 {upcomingBooking.date} {upcomingBooking.timeSlot} 进行
            </Text>
          </View>
        </View>
      )}

      <View className={styles.tabs}>
        {tabs.map(tab => (
          <View
            key={tab}
            className={classnames(styles.tabItem, activeTab === tab && styles.active)}
            onClick={() => setActiveTab(tab)}
          >
            <Text>{tab}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY enhanced showScrollbar={false}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => {
            const statusInfo = formatStatus(booking.status);
            const showActions = booking.status !== 'cancelled';

            return (
              <View
                key={booking.id}
                className={styles.bookingCard}
                onClick={() => Taro.navigateTo({ url: `/pages/booking-detail/index?id=${booking.id}` })}
              >
                <View className={styles.bookingHeader}>
                  <View className={styles.bookingUserInfo}>
                    <UserAvatar src={booking.partnerAvatar} size="sm" />
                    <Text className={styles.bookingUserName}>{booking.partnerName}</Text>
                  </View>
                  <View
                    className={styles.bookingStatus}
                    style={{ background: statusInfo.bg }}
                  >
                    <Text
                      className={styles.bookingStatusText}
                      style={{ color: statusInfo.color }}
                    >
                      {statusInfo.label}
                    </Text>
                  </View>
                </View>

                <Text className={styles.bookingTitle}>{booking.demandTitle || booking.skillTitle}</Text>

                <View className={styles.bookingInfo}>
                  <View className={styles.bookingInfoRow}>
                    <Text className={styles.bookingInfoIcon}>📅</Text>
                    <View className={styles.bookingInfoContent}>
                      <Text className={styles.bookingInfoLabel}>时间：</Text>
                      <Text>{booking.date} {booking.timeSlot}</Text>
                    </View>
                  </View>
                  <View className={styles.bookingInfoRow}>
                    <Text className={styles.bookingInfoIcon}>📍</Text>
                    <View className={styles.bookingInfoContent}>
                      <Text className={styles.bookingInfoLabel}>地点：</Text>
                      <Text>{booking.location}</Text>
                    </View>
                  </View>
                  {booking.notes && (
                    <View className={styles.bookingInfoRow}>
                      <Text className={styles.bookingInfoIcon}>📝</Text>
                      <View className={styles.bookingInfoContent}>
                        <Text className={styles.bookingInfoLabel}>备注：</Text>
                        <Text>{booking.notes}</Text>
                      </View>
                    </View>
                  )}
                </View>

                {showActions && (
                  <View className={styles.bookingActions}>
                    {booking.status === 'pending' && (
                      <>
                        <View
                          className={classnames(styles.actionBtn, styles.secondary)}
                          onClick={(e) => { e.stopPropagation(); handleCancel(booking); }}
                        >
                          <Text>取消</Text>
                        </View>
                        <View
                          className={classnames(styles.actionBtn, styles.primary)}
                          onClick={(e) => { e.stopPropagation(); handleConfirm(booking); }}
                        >
                          <Text>确认预约</Text>
                        </View>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <>
                        <View
                          className={classnames(styles.actionBtn, styles.error)}
                          onClick={(e) => { e.stopPropagation(); handleCancel(booking); }}
                        >
                          <Text>取消预约</Text>
                        </View>
                        <View
                          className={classnames(styles.actionBtn, styles.warning)}
                          onClick={(e) => { e.stopPropagation(); handleReschedule(booking); }}
                        >
                          <Text>申请改期</Text>
                        </View>
                        <View
                          className={classnames(styles.actionBtn, styles.primary)}
                          onClick={(e) => { e.stopPropagation(); handleContact(booking); }}
                        >
                          <Text>联系对方</Text>
                        </View>
                      </>
                    )}
                    {booking.status === 'rescheduled' && (
                      <>
                        <View
                          className={classnames(styles.actionBtn, styles.error)}
                          onClick={(e) => { e.stopPropagation(); handleCancel(booking); }}
                        >
                          <Text>取消预约</Text>
                        </View>
                        <View
                          className={classnames(styles.actionBtn, styles.warning)}
                          onClick={(e) => { e.stopPropagation(); handleReschedule(booking); }}
                        >
                          <Text>再次改期</Text>
                        </View>
                        <View
                          className={classnames(styles.actionBtn, styles.primary)}
                          onClick={(e) => { e.stopPropagation(); handleContact(booking); }}
                        >
                          <Text>联系对方</Text>
                        </View>
                      </>
                    )}
                    {booking.status === 'completed' && (
                      <View
                        className={classnames(styles.actionBtn, styles.primary)}
                        onClick={(e) => { e.stopPropagation(); handleComplete(booking); }}
                      >
                        <Text>去评价</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <EmptyState
            icon="📋"
            title={`暂无${activeTab === '全部' ? '' : activeTab}预约`}
            description="去匹配页找找合适的邻居吧~"
          />
        )}
      </ScrollView>
    </View>
  );
};

export default BookingPage;
