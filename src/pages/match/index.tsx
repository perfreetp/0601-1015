import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import UserAvatar from '@/components/UserAvatar';
import Tag from '@/components/Tag';
import EmptyState from '@/components/EmptyState';
import { mockUsers } from '@/data/users';
import type { Skill, User } from '@/types';
import { formatDistance, formatBudget, getCategoryEmoji, DEMAND_CATEGORIES } from '@/utils';
import { useAppStore } from '@/store';

interface MatchItem {
  skill: Skill;
  user: User;
  score: number;
}

const MatchPage: React.FC = () => {
  const storeSkills = useAppStore(state => state.skills);

  const [distanceFilter, setDistanceFilter] = useState<string>('2km内');
  const [ratingFilter, setRatingFilter] = useState<string>('4.5分以上');
  const [timeFilter, setTimeFilter] = useState<string>('全部');
  const [prefFreeOnly, setPrefFreeOnly] = useState(false);
  const [prefSameCommunity, setPrefSameCommunity] = useState(false);
  const [prefCategory, setPrefCategory] = useState<string>('');

  const distanceOptions = ['1km内', '2km内', '5km内', '全部'];
  const ratingOptions = ['4.0分以上', '4.5分以上', '4.8分以上', '全部'];
  const timeOptions = ['工作日', '周末', '空闲中', '全部'];

  const getDistanceValue = (label: string): number => {
    switch (label) {
      case '1km内': return 1;
      case '2km内': return 2;
      case '5km内': return 5;
      default: return 999;
    }
  };

  const getRatingValue = (label: string): number => {
    switch (label) {
      case '4.0分以上': return 4.0;
      case '4.5分以上': return 4.5;
      case '4.8分以上': return 4.8;
      default: return 0;
    }
  };

  const matches = useMemo((): MatchItem[] => {
    const maxDistance = getDistanceValue(distanceFilter);
    const minRating = getRatingValue(ratingFilter);

    console.log('[Match] Applying filters:', {
      distanceFilter,
      ratingFilter,
      timeFilter,
      prefFreeOnly,
      prefSameCommunity,
      prefCategory,
      totalSkills: storeSkills.length
    });

    const result: MatchItem[] = [];

    storeSkills.forEach(skill => {
      if (skill.userId === 'u0') return;

      if (prefFreeOnly && skill.priceType !== 'free') return;
      if (prefCategory && skill.category !== prefCategory) return;

      const user = mockUsers.find(u => u.id === skill.userId);
      if (!user) return;

      if (user.distance > maxDistance) return;
      if (user.rating < minRating) return;

      if (prefSameCommunity && user.neighborhood !== '阳光花园小区') return;

      if (timeFilter !== '全部') {
        if (timeFilter === '空闲中') {
          if (!skill.availableTimes.some(t => t.includes('工作日') || t.includes('周末'))) return;
        } else if (timeFilter === '工作日') {
          if (!skill.availableTimes.some(t => t.includes('工作日'))) return;
        } else if (timeFilter === '周末') {
          if (!skill.availableTimes.some(t => t.includes('周六') || t.includes('周日') || t.includes('周末'))) return;
        }
      }

      let score = Math.round(
        (user.rating / 5 * 40) +
        ((5 - Math.min(user.distance, 5)) / 5 * 30) +
        (user.completedCount > 100 ? 30 : user.completedCount / 100 * 30)
      );

      if (prefSameCommunity && user.neighborhood === '阳光花园小区') score += 10;
      if (prefFreeOnly && skill.priceType === 'free') score += 5;

      score = Math.min(99, score);

      result.push({ skill, user, score });
    });

    const sorted = result.sort((a, b) => b.score - a.score);
    console.log('[Match] Filtered results:', sorted.length);
    return sorted;
  }, [distanceFilter, ratingFilter, timeFilter, prefFreeOnly, prefSameCommunity, prefCategory, storeSkills]);

  const handleRefresh = () => {
    console.log('[Match] Refresh match');
    Taro.showToast({ title: '匹配已更新', icon: 'none' });
  };

  const handleContact = (item: MatchItem) => {
    console.log('[Match] Contact user:', item.user.id);
    Taro.navigateTo({
      url: `/pages/chat/index?sessionId=c_${item.user.id}&userId=${item.user.id}&userName=${encodeURIComponent(item.user.name)}&userAvatar=${encodeURIComponent(item.user.avatar)}`
    });
  };

  const handleBook = (item: MatchItem) => {
    console.log('[Match] Book skill:', item.skill.id);
    Taro.navigateTo({
      url: `/pages/create-booking/index?sId=${item.skill.id}&title=${encodeURIComponent(item.skill.title)}&pId=${item.user.id}&pName=${encodeURIComponent(item.user.name)}&pAvatar=${encodeURIComponent(item.user.avatar)}&loc=${encodeURIComponent('阳光花园小区')}`
    });
  };

  const handleView = (item: MatchItem) => {
    console.log('[Match] View skill:', item.skill.id);
  };

  const toggleCategory = (cat: string) => {
    setPrefCategory(prev => prev === cat ? '' : cat);
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>智能匹配推荐</Text>
        <Text className={styles.headerSubtitle}>基于距离、评分、空闲时段精准推荐</Text>

        <View className={styles.matchInfo}>
          <View className={styles.matchBadge}>
            <Text className={styles.matchBadgeValue}>{matches.length}</Text>
            <Text className={styles.matchBadgeLabel}>位匹配邻居</Text>
          </View>
          <View className={styles.matchBadge}>
            <Text className={styles.matchBadgeValue}>
              {distanceFilter === '全部' ? '∞' : getDistanceValue(distanceFilter)}km
            </Text>
            <Text className={styles.matchBadgeLabel}>搜索范围</Text>
          </View>
          <View className={styles.matchBadge}>
            <Text className={styles.matchBadgeValue}>
              {ratingFilter === '全部' ? '0' : getRatingValue(ratingFilter)}+
            </Text>
            <Text className={styles.matchBadgeLabel}>最低评分</Text>
          </View>
        </View>
      </View>

      <View className={styles.filterSection}>
        <View className={styles.filterCard}>
          <View className={styles.filterRow}>
            <Text className={styles.filterLabel}>距离范围</Text>
            <View className={styles.filterOptions}>
              {distanceOptions.map(opt => (
                <View
                  key={opt}
                  className={classnames(styles.filterOption, distanceFilter === opt && styles.active)}
                  onClick={() => setDistanceFilter(opt)}
                >
                  <Text>{opt}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className={styles.filterRow}>
            <Text className={styles.filterLabel}>最低评分</Text>
            <View className={styles.filterOptions}>
              {ratingOptions.map(opt => (
                <View
                  key={opt}
                  className={classnames(styles.filterOption, ratingFilter === opt && styles.active)}
                  onClick={() => setRatingFilter(opt)}
                >
                  <Text>{opt}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className={styles.filterRow}>
            <Text className={styles.filterLabel}>空闲时段</Text>
            <View className={styles.filterOptions}>
              {timeOptions.map(opt => (
                <View
                  key={opt}
                  className={classnames(styles.filterOption, timeFilter === opt && styles.active)}
                  onClick={() => setTimeFilter(opt)}
                >
                  <Text>{opt}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.preferenceRow}>
            <Text className={styles.preferenceLabel}>偏好设置</Text>
            <View className={styles.preferenceOptions}>
              <View className={styles.preferenceGroup}>
                <Text className={styles.preferenceGroupTitle}>快速筛选</Text>
                <View
                  className={classnames(styles.preferenceChip, prefFreeOnly && styles.active)}
                  onClick={() => setPrefFreeOnly(!prefFreeOnly)}
                >
                  <Text className={styles.preferenceCheck}>{prefFreeOnly ? '✓' : ''}</Text>
                  <Text>只看免费互助</Text>
                </View>
                <View
                  className={classnames(styles.preferenceChip, prefSameCommunity && styles.active)}
                  onClick={() => setPrefSameCommunity(!prefSameCommunity)}
                >
                  <Text className={styles.preferenceCheck}>{prefSameCommunity ? '✓' : ''}</Text>
                  <Text>同小区邻居</Text>
                </View>
              </View>
              <View className={styles.preferenceGroup}>
                <Text className={styles.preferenceGroupTitle}>技能类型</Text>
                {DEMAND_CATEGORIES.map(cat => (
                  <View
                    key={cat}
                    className={classnames(styles.preferenceChip, prefCategory === cat && styles.active)}
                    onClick={() => toggleCategory(cat)}
                  >
                    <Text>{getCategoryEmoji(cat)} {cat}</Text>
                  </View>
                ))}
              </View>
              {(prefFreeOnly || prefSameCommunity || prefCategory) && (
                <View className={styles.preferenceGroup}>
                  <Text className={styles.preferenceGroupTitle}></Text>
                  <View
                    className={styles.preferenceChip}
                    onClick={() => {
                      setPrefFreeOnly(false);
                      setPrefSameCommunity(false);
                      setPrefCategory('');
                    }}
                  >
                    <Text>清除所有偏好</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.listSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            为你推荐
            <Text style={{ fontSize: '24rpx', color: '#9CA3AF', fontWeight: '400', marginLeft: 8 }}>
              ({matches.length})
            </Text>
          </Text>
          <View className={styles.refreshBtn} onClick={handleRefresh}>
            <Text className={styles.refreshIcon}>🔄</Text>
            <Text className={styles.refreshText}>换一批</Text>
          </View>
        </View>

        <ScrollView scrollY enhanced showScrollbar={false}>
          {matches.length > 0 ? (
            matches.map(item => (
              <View
                key={`${item.user.id}-${item.skill.id}`}
                className={styles.matchCard}
                onClick={() => handleView(item)}
              >
                <View className={styles.matchScoreBadge}>
                  <Text className={styles.matchScore}>{item.score}</Text>
                  <Text className={styles.matchScoreLabel}>匹配度</Text>
                </View>

                <View className={styles.matchHeader}>
                  <UserAvatar src={item.user.avatar} size="md" />
                  <View className={styles.matchUserInfo}>
                    <Text className={styles.matchUserName}>{item.user.name}</Text>
                    <View className={styles.matchUserMeta}>
                      <View className={styles.metaItem}>
                        <Text className={styles.metaIcon}>⭐</Text>
                        <Text>{item.user.rating}分</Text>
                      </View>
                      <View className={styles.metaItem}>
                        <Text className={styles.metaIcon}>📋</Text>
                        <Text>{item.user.completedCount}单</Text>
                      </View>
                      <View className={styles.metaItem}>
                        <Text className={styles.metaIcon}>📍</Text>
                        <Text>{formatDistance(item.user.distance)}</Text>
                      </View>
                      {prefSameCommunity && item.user.neighborhood === '阳光花园小区' && (
                        <View className={styles.metaItem}>
                          <Text className={styles.metaIcon}>🏠</Text>
                          <Text>同小区</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <View className={styles.skillPreview}>
                  <Text className={styles.skillTitle}>
                    {getCategoryEmoji(item.skill.category)} {item.skill.title}
                  </Text>
                  <Text className={styles.skillDesc}>{item.skill.description}</Text>
                </View>

                <View className={styles.skillTags}>
                  <Tag text={item.skill.category} />
                  <Tag
                    text={formatBudget(item.skill.price, item.skill.priceType)}
                    color="#D97706"
                    bg="#FEF3C7"
                  />
                  <Tag
                    text={`${item.skill.serviceRange}km内`}
                    color="#2563EB"
                    bg="#DBEAFE"
                  />
                  <Tag
                    text={item.skill.availableTimes[0]}
                    color="#4B5563"
                    bg="#F3F4F6"
                  />
                  {item.skill.priceType === 'free' && prefFreeOnly && (
                    <Tag text="🎁 免费互助" color="#16A34A" bg="#DCFCE7" />
                  )}
                </View>

                <View className={styles.matchActions}>
                  <View
                    className={classnames(styles.actionBtn, styles.secondary)}
                    onClick={(e) => { e.stopPropagation(); handleContact(item); }}
                  >
                    <Text>💬 联系TA</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.primary)}
                    onClick={(e) => { e.stopPropagation(); handleBook(item); }}
                  >
                    <Text>📅 立即预约</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className={styles.emptyTip}>
              <EmptyState
                icon="🔍"
                title="暂无匹配结果"
                description="试试调整筛选条件或偏好设置吧"
              />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default MatchPage;
