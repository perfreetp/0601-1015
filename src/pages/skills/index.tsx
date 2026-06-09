import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import SkillCard from '@/components/SkillCard';
import EmptyState from '@/components/EmptyState';
import UserAvatar from '@/components/UserAvatar';
import { currentUser } from '@/data/users';
import type { Skill } from '@/types';
import { useAppStore } from '@/store';

const SkillsPage: React.FC = () => {
  const storeSkills = useAppStore(state => state.skills);
  const [mySkills, setMySkills] = useState<Skill[]>([]);

  useDidShow(() => {
    const filtered = storeSkills.filter(s => s.userId === 'u0');
    setMySkills([...filtered]);
    console.log('[Skills] Page showed, loaded skills:', filtered.length);
  });

  const handleAddSkill = () => {
    console.log('[Skills] Navigate to add skill');
    Taro.navigateTo({ url: '/pages/edit-skill/index' });
  };

  const handleEditSkill = (skill: Skill) => {
    console.log('[Skills] Navigate to edit skill:', skill.id);
    Taro.navigateTo({ url: `/pages/edit-skill/index?id=${skill.id}` });
  };

  const handleSkillClick = (skill: Skill) => {
    console.log('[Skills] View skill:', skill.id);
    handleEditSkill(skill);
  };

  return (
    <View className={styles.page}>
      <View className={styles.profileCard}>
        <View className={styles.profileHeader}>
          <UserAvatar src={currentUser.avatar} size="lg" name={currentUser.name} />
          <View className={styles.profileInfo}>
            <Text className={styles.profileName}>{currentUser.name}</Text>
            <View className={styles.profileStats}>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>{mySkills.length}</Text>
                <Text className={styles.statLabel}>我的技能</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>{currentUser.completedCount}</Text>
                <Text className={styles.statLabel}>完成次数</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>{currentUser.rating}</Text>
                <Text className={styles.statLabel}>综合评分</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.tipsCard}>
        <Text className={styles.tipsIcon}>💡</Text>
        <View className={styles.tipsContent}>
          <Text className={styles.tipsTitle}>完善技能信息获得更多订单</Text>
          <Text className={styles.tipsText}>
            添加详细的技能描述、服务时间和服务范围，可以让邻居更好地了解你，提高被匹配几率！
          </Text>
        </View>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>我的技能服务</Text>
        <View className={styles.addBtn} onClick={handleAddSkill}>
          <Text className={styles.addBtnIcon}>+</Text>
          <Text className={styles.addBtnText}>新增</Text>
        </View>
      </View>

      <ScrollView scrollY enhanced showScrollbar={false}>
        {mySkills.length > 0 ? (
          mySkills.map(skill => (
            <SkillCard
              key={skill.id}
              data={skill}
              showEdit
              onEdit={() => handleEditSkill(skill)}
              onClick={() => handleSkillClick(skill)}
            />
          ))
        ) : (
          <View className={styles.emptyTip}>
            <EmptyState
              icon="💼"
              title="还没有添加技能"
              description="点击下方按钮添加你的第一个技能吧"
            />
          </View>
        )}
      </ScrollView>

      <View className={styles.fabButton} onClick={handleAddSkill}>
        <Text className={styles.fabIcon}>+</Text>
        <Text className={styles.fabText}>添加新技能</Text>
      </View>
    </View>
  );
};

export default SkillsPage;
