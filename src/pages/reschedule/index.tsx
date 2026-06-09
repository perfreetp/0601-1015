import React, { useState } from 'react';
import { View, Text, ScrollView, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';

const TIME_SLOTS = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '19:00 - 20:00',
  '20:00 - 21:00'
];

const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const ReschedulePage: React.FC = () => {
  const router = useRouter();
  const bookingId = router.params?.id as string;
  const bookingTitle = decodeURIComponent(router.params?.title || '');
  const currentDate = router.params?.date || '';
  const currentSlot = decodeURIComponent(router.params?.slot || '');

  const rescheduleBooking = useAppStore(state => state.rescheduleBooking);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      dates.push({
        dateStr,
        day: date.getDate(),
        week: i === 0 ? '今天' : i === 1 ? '明天' : WEEK_DAYS[date.getDay()],
        month: `${date.getMonth() + 1}月`
      });
    }
    return dates;
  };

  const dates = generateDates();
  const [selectedDate, setSelectedDate] = useState<string>(currentDate || dates[0].dateStr);
  const [selectedSlot, setSelectedSlot] = useState<string>(currentSlot || '');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = selectedDate && selectedSlot && !submitting;

  const handleSubmit = () => {
    if (!canSubmit || !bookingId) return;

    console.log('[Reschedule] Submitting:', { bookingId, selectedDate, selectedSlot, reason });
    setSubmitting(true);

    try {
      rescheduleBooking(bookingId, selectedDate, selectedSlot);
      Taro.showToast({ title: '改期申请已提交', icon: 'success' });

      setTimeout(() => {
        Taro.navigateBack();
      }, 800);
    } catch (e) {
      console.error('[Reschedule] Submit failed:', e);
      Taro.showToast({ title: '提交失败，请重试', icon: 'none' });
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.page}>
      {bookingTitle && (
        <View className={styles.bookingInfo}>
          <Text className={styles.bookingTitle}>{bookingTitle}</Text>
          <View className={styles.bookingRow}>
            <Text className={styles.bookingIcon}>📅</Text>
            <Text className={styles.bookingLabel}>原时间：</Text>
            <Text className={styles.bookingValue}>{currentDate} {currentSlot}</Text>
          </View>
        </View>
      )}

      <View className={styles.formCard}>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            选择日期
          </Text>
          <ScrollView className={styles.dateScroll} scrollX enhanced showScrollbar={false}>
            <View className={styles.dateList}>
              {dates.map(d => (
                <View
                  key={d.dateStr}
                  className={classnames(styles.dateItem, selectedDate === d.dateStr && styles.active)}
                  onClick={() => setSelectedDate(d.dateStr)}
                >
                  <Text className={styles.dateWeek}>{d.week}</Text>
                  <Text className={styles.dateDay}>{d.day}</Text>
                  <Text className={styles.dateMonth}>{d.month}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            选择时段
          </Text>
          <View className={styles.slotGrid}>
            {TIME_SLOTS.map(slot => (
              <View
                key={slot}
                className={classnames(styles.slotItem, selectedSlot === slot && styles.active)}
                onClick={() => setSelectedSlot(slot)}
              >
                <Text>{slot}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>改期原因（选填）</Text>
          <View className={styles.reasonBox}>
            <Textarea
              className={styles.reasonField}
              placeholder="请简要说明改期原因，方便对方协调..."
              maxlength={100}
              value={reason}
              onInput={(e) => setReason(e.detail.value)}
            />
          </View>
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.cancelBtn} onClick={handleCancel}>
          <Text className={styles.cancelBtnText}>取消</Text>
        </View>
        <View
          className={classnames(styles.submitBtn, !canSubmit && styles.disabled)}
          onClick={handleSubmit}
        >
          <Text className={styles.submitBtnText}>
            {submitting ? '提交中...' : '确认改期'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReschedulePage;
