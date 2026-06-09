import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import UserAvatar from '@/components/UserAvatar';
import { currentUser } from '@/data/users';
import { mockPointRecords } from '@/data/bookings';

const MinePage: React.FC = () => {
  const totalPoints = mockPointRecords
    .filter(r => r.type === 'earn')
    .reduce((sum, r) => sum + r.amount, 0) -
    mockPointRecords
      .filter(r => r.type === 'spend')
      .reduce((sum, r) => sum + r.amount, 0);

  const pendingCount = 2;

  const handleNav = (path: string, name: string) => {
    console.log('[Mine] 导航到:', name, path);
    Taro.navigateTo({ url: path });
  };

  const handlePointsExchange = () => {
    console.log('[Mine] 点击积分兑换');
    Taro.showToast({ title: '积分商城开发中', icon: 'none' });
  };

  const menuGroups = [
    {
      title: '互助管理',
      items: [
        { icon: '📅', name: '我的预约', desc: '查看预约订单、取消改期', badge: pendingCount, path: '/pages/booking/index' },
        { icon: '⭐', name: '信用中心', desc: '完成次数、互评、感谢卡', path: '/pages/credit/index' },
        { icon: '🛡️', name: '平台管理', desc: '举报、黑名单、公告活动', path: '/pages/admin/index' }
      ]
    },
    {
      title: '其他服务',
      items: [
        { icon: '📋', name: '我发布的需求', desc: '管理发布的互助需求' },
        { icon: '❤️', name: '我的收藏', desc: '收藏的技能和需求' },
        { icon: '⚙️', name: '设置', desc: '账号设置、隐私偏好' },
        { icon: '💡', name: '帮助与反馈', desc: '常见问题、意见反馈' }
      ]
    }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.profileSection}>
          <UserAvatar src={currentUser.avatar} size="lg" name={currentUser.name} />
          <View className={styles.profileInfo}>
            <View className={styles.profileNameRow}>
              <Text className={styles.profileName}>{currentUser.name}</Text>
              <View className={styles.creditBadge}>
                <Text className={styles.creditIcon}>🛡️</Text>
                <Text className={styles.creditText}>信用 {currentUser.creditScore}</Text>
              </View>
            </View>
            <Text className={styles.profileLocation}>📍 {currentUser.neighborhood}</Text>
            <View className={styles.profileTags}>
              <Text className={styles.profileTag}>热心邻居</Text>
              <Text className={styles.profileTag}>技能达人</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.statsCard}>
        <View className={styles.statItem}>
          <View>
            <Text className={styles.statValue}>{currentUser.completedCount}</Text>
            <Text className={styles.statUnit}>次</Text>
          </View>
          <Text className={styles.statLabel}>完成互助</Text>
        </View>
        <View className={styles.statItem}>
          <View>
            <Text className={styles.statValue}>{currentUser.rating}</Text>
            <Text className={styles.statUnit}>分</Text>
          </View>
          <Text className={styles.statLabel}>综合评分</Text>
        </View>
        <View className={styles.statItem}>
          <View>
            <Text className={styles.statValue}>2</Text>
            <Text className={styles.statUnit}>年</Text>
          </View>
          <Text className={styles.statLabel}>入驻时长</Text>
        </View>
      </View>

      <View className={styles.pointsCard}>
        <View className={styles.pointsInfo}>
          <Text className={styles.pointsLabel}>我的互助积分</Text>
          <Text className={styles.pointsValue}>{totalPoints}</Text>
        </View>
        <View className={styles.pointsAction} onClick={handlePointsExchange}>
          <Text className={styles.pointsActionText}>去兑换</Text>
          <Text className={styles.pointsActionIcon}>→</Text>
        </View>
      </View>

      {menuGroups.map(group => (
        <View key={group.title} className={styles.menuSection}>
          <Text className={styles.menuTitle}>{group.title}</Text>
          <View className={styles.menuCard}>
            {group.items.map(item => (
              <View
                key={item.name}
                className={styles.menuItem}
                onClick={() => item.path ? handleNav(item.path, item.name) : Taro.showToast({ title: `${item.name}开发中`, icon: 'none' })}
              >
                <View className={styles.menuIcon}>
                  <Text>{item.icon}</Text>
                </View>
                <View className={styles.menuContent}>
                  <Text className={styles.menuName}>{item.name}</Text>
                  <Text className={styles.menuDesc}>{item.desc}</Text>
                </View>
                {item.badge && item.badge > 0 && (
                  <View className={styles.menuBadge}>
                    <Text className={styles.menuBadgeText}>{item.badge} 待处理</Text>
                  </View>
                )}
                <Text className={styles.menuArrow}>›</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default MinePage;
