import React, { useState } from 'react';
import { View, Text, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import UserAvatar from '@/components/UserAvatar';
import { useAppStore } from '@/store';
import type { Booking } from '@/types';

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

const CreateBookingPage: React.FC = () => {
  const router = useRouter();
  const skillId = (router.params?.skillId || router.params?.sId) as string;
  const skillTitle = decodeURIComponent((router.params?.skillTitle || router.params?.title) as string || '');
  const partnerId = (router.params?.partnerId || router.params?.pId) as string;
  const partnerName = decodeURIComponent((router.params?.partnerName || router.params?.pName) as string || '');
  const partnerAvatar = decodeURIComponent((router.params?.partnerAvatar || router.params?.pAvatar) as string || '');
  const initialLocation = decodeURIComponent((router.params?.location || router.params?.loc) as string || '');

  const bookings = useAppStore(state => state.bookings);
  const addBooking = useAppStore(state => state.addBooking);

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
  const [selectedDate, setSelectedDate] = useState<string>(dates[0].dateStr);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [location, setLocation] = useState<string>(initialLocation);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = selectedDate && selectedSlot && location && !submitting;

  const hasUnfinishedBooking = () => {
    return bookings.some(b =>
      b.partnerId === partnerId &&
      (b.skillId === skillId || b.demandId === skillId) &&
      (b.status === 'pending' || b.status === 'confirmed' || b.status === 'rescheduled')
    );
  };

  const doSubmit = () => {
    setSubmitting(true);

    try {
      addBooking({
        skillId,
        skillTitle,
        partnerId,
        partnerName,
        partnerAvatar,
        date: selectedDate,
        timeSlot: selectedSlot,
        location,
        notes
      });
      Taro.showToast({ title: '预约创建成功', icon: 'success' });

      setTimeout(() => {
        Taro.navigateBack();
      }, 800);
    } catch (e) {
      console.error('[CreateBooking] Submit failed:', e);
      Taro.showToast({ title: '提交失败，请重试', icon: 'none' });
      setSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    if (hasUnfinishedBooking()) {
      Taro.showModal({
        title: '提示',
        content: '该服务已有未完成预约，是否继续？',
        success: (res) => {
          if (res.confirm) {
            doSubmit();
          }
        }
      });
    } else {
      doSubmit();
    }
  };

  const handleCancel = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.page}>
      <View className={styles.bookingInfo}>
        <View className={styles.bookingHeader}>
          <View className={styles.bookingAvatar}>
            <UserAvatar src={partnerAvatar} size="sm" name={partnerName} />
          </View>
          <Text className={styles.bookingPartnerName}>{partnerName}</Text>
        </View>
        <Text className={styles.bookingTitle}>{skillTitle}</Text>
      </View>

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
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            服务地点
          </Text>
          <View className={styles.locationBox}>
            <Input
              className={styles.locationInput}
              placeholder="请输入服务地点"
              value={location}
              onInput={(e) => setLocation(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>备注（选填）</Text>
          <View className={styles.notesBox}>
            <Textarea
              className={styles.notesField}
              placeholder="请输入备注信息，如特殊需求等..."
              maxlength={100}
              value={notes}
              onInput={(e) => setNotes(e.detail.value)}
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
            {submitting ? '提交中...' : '确认预约'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CreateBookingPage;
