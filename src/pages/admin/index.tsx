import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import UserAvatar from '@/components/UserAvatar';
import {
  mockAnnouncements,
  mockActivities,
  mockPointRecords,
  mockBlacklist,
  mockReports
} from '@/data/bookings';
import type {
  Announcement,
  Activity,
  PointRecord,
  BlacklistItem,
  Report
} from '@/types';

type TabType = 'home' | 'announcements' | 'activities' | 'points' | 'blacklist' | 'reports';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const quickActions = [
    { icon: '📢', name: '公告通知', color: '#DBEAFE', tab: 'announcements' as TabType, count: mockAnnouncements.length },
    { icon: '🎉', name: '社区活动', color: '#DCFCE7', tab: 'activities' as TabType, count: mockActivities.length },
    { icon: '💰', name: '积分记录', color: '#FEF3C7', tab: 'points' as TabType, count: mockPointRecords.length },
    { icon: '🚫', name: '黑名单', color: '#FEE2E2', tab: 'blacklist' as TabType, count: mockBlacklist.length },
    { icon: '⚠️', name: '举报处理', color: '#FEF3C7', tab: 'reports' as TabType, count: mockReports.filter(r => r.status === 'pending').length },
    { icon: '⚙️', name: '系统设置', color: '#F3F4F6', tab: 'settings' as TabType, count: 0 }
  ];

  const handleAction = (action: typeof quickActions[0]) => {
    console.log('[Admin] 点击:', action.name);
    if (action.tab === 'settings') {
      Taro.showToast({ title: '设置功能开发中', icon: 'none' });
    } else {
      setActiveTab(action.tab);
    }
  };

  const handleBack = () => {
    setActiveTab('home');
  };

  const handleJoinActivity = (activity: Activity) => {
    console.log('[Admin] 报名活动:', activity.id);
    Taro.showToast({ title: `报名「${activity.title}」成功！`, icon: 'success' });
  };

  const handleRemoveBlacklist = (item: BlacklistItem) => {
    console.log('[Admin] 移出黑名单:', item.id);
    Taro.showModal({
      title: '确认移出',
      content: `确定要将「${item.userName}」移出黑名单吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已移出黑名单', icon: 'success' });
        }
      }
    });
  };

  const getReportStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: '待处理', color: '#D97706', bg: '#FEF3C7' };
      case 'resolved':
        return { label: '已处理', color: '#16A34A', bg: '#DCFCE7' };
      case 'rejected':
        return { label: '已驳回', color: '#6B7280', bg: '#F3F4F6' };
      default:
        return { label: status, color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  if (activeTab !== 'home') {
    const pageTitles: Record<TabType, string> = {
      home: '平台管理',
      announcements: '公告通知',
      activities: '社区活动',
      points: '积分记录',
      blacklist: '黑名单',
      reports: '举报处理'
    };

    return (
      <View className={styles.page}>
        <View style={{ marginVertical: 24, display: 'flex', alignItems: 'center' }}>
          <Text
            style={{ fontSize: 32, color: '#6B7280', marginRight: 16 }}
            onClick={handleBack}
          >
            ←
          </Text>
          <Text style={{ fontSize: 36, fontWeight: 600, color: '#1F2937' }}>
            {pageTitles[activeTab]}
          </Text>
        </View>

        <ScrollView scrollY enhanced showScrollbar={false}>
          {activeTab === 'announcements' && mockAnnouncements.map((a: Announcement) => (
            <View
              key={a.id}
              className={classnames(
                styles.announcementCard,
                a.isImportant ? styles.announcementImportant : styles.announcementNormal
              )}
            >
              <View className={styles.announcementHeader}>
                {a.isImportant && (
                  <View className={styles.announcementBadge}>
                    <Text className={styles.announcementBadgeText}>重要</Text>
                  </View>
                )}
                <Text className={styles.announcementTitle}>{a.title}</Text>
                <Text className={styles.announcementDate}>{a.createdAt}</Text>
              </View>
              <Text className={styles.announcementContent}>{a.content}</Text>
            </View>
          ))}

          {activeTab === 'activities' && mockActivities.map((activity: Activity) => (
            <View key={activity.id} className={styles.activityCard}>
              <Image
                className={styles.activityImage}
                src={activity.image}
                mode="aspectFill"
              />
              <View className={styles.activityContent}>
                <View className={styles.activityHeader}>
                  <Text className={styles.activityTitle}>{activity.title}</Text>
                  <View className={styles.activityPoints}>
                    <Text className={styles.activityPointsText}>+{activity.points}积分</Text>
                  </View>
                </View>
                <View className={styles.activityMeta}>
                  <View className={styles.activityMetaItem}>
                    <Text className={styles.activityMetaIcon}>📅</Text>
                    <Text>{activity.date}</Text>
                  </View>
                  <View className={styles.activityMetaItem}>
                    <Text className={styles.activityMetaIcon}>📍</Text>
                    <Text>{activity.location}</Text>
                  </View>
                </View>
                <View className={styles.activityFooter}>
                  <View className={styles.activityProgress}>
                    <View className={styles.activityProgressBar}>
                      <View
                        className={styles.activityProgressFill}
                        style={{ width: `${Math.min(100, (activity.currentParticipants / activity.maxParticipants) * 100)}%` }}
                      />
                    </View>
                    <Text className={styles.activityProgressText}>
                      {activity.currentParticipants}/{activity.maxParticipants}
                    </Text>
                  </View>
                  <View
                    className={styles.joinBtn}
                    onClick={() => handleJoinActivity(activity)}
                  >
                    <Text className={styles.joinBtnText}>
                      {activity.currentParticipants >= activity.maxParticipants ? '已满' : '报名'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

          {activeTab === 'points' && mockPointRecords.map((record: PointRecord) => (
            <View key={record.id} className={styles.pointsRecordCard}>
              <View className={styles.pointsRecordInfo}>
                <Text className={styles.pointsRecordDesc}>{record.description}</Text>
                <Text className={styles.pointsRecordDate}>{record.createdAt}</Text>
              </View>
              <Text
                className={classnames(
                  styles.pointsRecordAmount,
                  record.type === 'earn' ? styles.amountEarn : styles.amountSpend
                )}
              >
                {record.type === 'earn' ? '+' : '-'}{record.amount}
              </Text>
            </View>
          ))}

          {activeTab === 'blacklist' && mockBlacklist.map((item: BlacklistItem) => (
            <View key={item.id} className={styles.blacklistCard}>
              <UserAvatar src={item.userAvatar} size="md" />
              <View className={styles.blacklistInfo}>
                <Text className={styles.blacklistName}>{item.userName}</Text>
                <Text className={styles.blacklistReason}>
                  原因：{item.reason} · {item.createdAt}
                </Text>
              </View>
              <View
                className={styles.removeBtn}
                onClick={() => handleRemoveBlacklist(item)}
              >
                <Text className={styles.removeBtnText}>移出</Text>
              </View>
            </View>
          ))}

          {activeTab === 'reports' && mockReports.map((report: Report) => {
            const statusInfo = getReportStatus(report.status);
            return (
              <View key={report.id} className={styles.reportCard}>
                <View className={styles.reportHeader}>
                  <Text className={styles.reportReason}>举报：{report.reason}</Text>
                  <View
                    className={styles.reportStatus}
                    style={{ background: statusInfo.bg }}
                  >
                    <Text
                      className={styles.reportStatusText}
                      style={{ color: statusInfo.color }}
                    >
                      {statusInfo.label}
                    </Text>
                  </View>
                </View>
                <Text className={styles.reportDesc}>{report.description}</Text>
                <Text className={styles.reportDate}>{report.createdAt}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.quickActions}>
        {quickActions.map(action => (
          <View
            key={action.name}
            className={styles.quickActionItem}
            onClick={() => handleAction(action)}
          >
            <View
              className={styles.quickActionIcon}
              style={{ background: action.color }}
            >
              <Text>{action.icon}</Text>
            </View>
            <Text className={styles.quickActionName}>{action.name}</Text>
            {action.count > 0 && (
              <Text className={styles.quickActionCount}>{action.count}条</Text>
            )}
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>📢 最新公告</Text>
          <Text
            className={styles.sectionMore}
            onClick={() => setActiveTab('announcements')}
          >
            全部 ›
          </Text>
        </View>
        {mockAnnouncements.slice(0, 2).map((a: Announcement) => (
          <View
            key={a.id}
            className={classnames(
              styles.announcementCard,
              a.isImportant ? styles.announcementImportant : styles.announcementNormal
            )}
          >
            <View className={styles.announcementHeader}>
              {a.isImportant && (
                <View className={styles.announcementBadge}>
                  <Text className={styles.announcementBadgeText}>重要</Text>
                </View>
              )}
              <Text className={styles.announcementTitle}>{a.title}</Text>
              <Text className={styles.announcementDate}>{a.createdAt}</Text>
            </View>
            <Text className={styles.announcementContent}>{a.content}</Text>
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>🎉 热门活动</Text>
          <Text
            className={styles.sectionMore}
            onClick={() => setActiveTab('activities')}
          >
            全部 ›
          </Text>
        </View>
        <ScrollView scrollX enhanced showScrollbar={false}>
          <View style={{ display: 'flex', gap: 24, paddingVertical: 8 }}>
            {mockActivities.map((activity: Activity) => (
              <View
                key={activity.id}
                className={styles.activityCard}
                style={{ width: 520, flexShrink: 0, marginBottom: 0 }}
                onClick={() => handleJoinActivity(activity)}
              >
                <Image
                  className={styles.activityImage}
                  src={activity.image}
                  mode="aspectFill"
                />
                <View className={styles.activityContent}>
                  <View className={styles.activityHeader}>
                    <Text className={styles.activityTitle}>{activity.title}</Text>
                    <View className={styles.activityPoints}>
                      <Text className={styles.activityPointsText}>+{activity.points}</Text>
                    </View>
                  </View>
                  <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 22, color: '#9CA3AF' }}>
                      📍 {activity.location.split('').slice(0, 8).join('')}
                    </Text>
                    <View className={styles.joinBtn}>
                      <Text className={styles.joinBtnText}>报名</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AdminPage;
