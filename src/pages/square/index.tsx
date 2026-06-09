import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import DemandCard from '@/components/DemandCard';
import { DEMAND_CATEGORIES, getCategoryEmoji } from '@/utils';
import type { Demand } from '@/types';
import { useAppStore } from '@/store';

const SquarePage: React.FC = () => {
  const storeDemands = useAppStore(state => state.demands);
  
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [sortType, setSortType] = useState<'time' | 'distance'>('time');
  const [demands, setDemands] = useState<Demand[]>(storeDemands);

  useDidShow(() => {
    setDemands([...storeDemands]);
    console.log('[Square] Page showed, loaded demands:', storeDemands.length);
  });

  const categories = ['全部', ...DEMAND_CATEGORIES];

  const filteredDemands = useMemo(() => {
    let result = [...demands];

    if (activeCategory !== '全部') {
      result = result.filter(d => d.category === activeCategory);
    }

    if (searchText.trim()) {
      const keyword = searchText.toLowerCase();
      result = result.filter(d =>
        d.title.toLowerCase().includes(keyword) ||
        d.description.toLowerCase().includes(keyword) ||
        d.category.toLowerCase().includes(keyword)
      );
    }

    if (sortType === 'distance') {
      result.sort((a, b) => a.distance - b.distance);
    } else {
      result.sort((a, b) => {
        const timeA = new Date(a.createdAt.replace(' ', 'T')).getTime();
        const timeB = new Date(b.createdAt.replace(' ', 'T')).getTime();
        return timeB - timeA;
      });
    }

    return result;
  }, [demands, activeCategory, searchText, sortType]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    console.log('[Square] Category changed:', category);
  };

  const handleSortToggle = () => {
    setSortType(prev => prev === 'time' ? 'distance' : 'time');
  };

  const handlePublish = () => {
    console.log('[Square] Navigate to publish demand');
    Taro.navigateTo({ url: '/pages/publish-demand/index' });
  };

  const handleDemandClick = (demand: Demand) => {
    console.log('[Square] Click demand:', demand.id, demand.title);
    Taro.showToast({ title: '需求详情开发中', icon: 'none' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>邻里互助广场</Text>
        <Text className={styles.headerSubtitle}>远亲不如近邻，互助共建美好社区</Text>

        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索需求或技能..."
            placeholderClass={styles.searchPlaceholder}
            value={searchText}
            confirmType="search"
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.categorySection}>
        <View className={styles.categoryCard}>
          <ScrollView scrollX enhanced showScrollbar={false}>
            <View className={styles.categoryList}>
              {categories.map((category, index) => (
                <View
                  key={category}
                  className={classnames(
                    styles.categoryItem,
                    activeCategory === category && styles.active,
                    index === categories.length - 1 && styles.allCategory
                  )}
                  onClick={() => handleCategoryClick(category)}
                >
                  <Text className={styles.categoryEmoji}>
                    {category === '全部' ? '🌟' : getCategoryEmoji(category)}
                  </Text>
                  <Text className={styles.categoryText}>{category}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <View className={styles.listSection}>
        <View className={styles.listHeader}>
          <Text className={styles.listTitle}>
            {activeCategory === '全部' ? '全部需求' : activeCategory}
            <Text style={{ fontSize: '24rpx', color: '#9CA3AF', fontWeight: '400' }}>
              {' '}({filteredDemands.length})
            </Text>
          </Text>
          <View className={styles.sortBtn} onClick={handleSortToggle}>
            <Text className={styles.sortIcon}>{sortType === 'time' ? '🕐' : '📍'}</Text>
            <Text>{sortType === 'time' ? '最新发布' : '距离最近'}</Text>
          </View>
        </View>

        <ScrollView scrollY enhanced showScrollbar={false}>
          {filteredDemands.map(demand => (
            <DemandCard
              key={demand.id}
              data={demand}
              onClick={() => handleDemandClick(demand)}
            />
          ))}
        </ScrollView>
      </View>

      <View className={styles.fabButton} onClick={handlePublish}>
        <Text className={styles.fabIcon}>+</Text>
        <Text className={styles.fabText}>发布</Text>
      </View>
    </View>
  );
};

export default SquarePage;
