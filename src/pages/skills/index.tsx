import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import SkillCard from '@/components/SkillCard';
import EmptyState from '@/components/EmptyState';
import UserAvatar from '@/components/UserAvatar';
import { mockSkills } from '@/data/skills';
import { currentUser } from '@/data/users';
import type { Skill } from '@/types';

const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>(mockSkills.filter(s => s.userId === 'u0'));

  const handleAddSkill = () => {
    console.log('[Skills] 点击添加技能');
    Taro.showToast({ title: '添加技能开发中', icon: 'none' });
  };

  const handleEditSkill = (skill: Skill) => {
    console.log('[Skills] 编辑技能:', skill.id, skill.title);
    Taro.showToast({ title: `编辑「${skill.title}」`, icon: 'none' });
  };

  const handleSkillClick = (skill: Skill) => {
    console.log('[Skills] 查看技能详情:', skill.id);
    Taro.showToast({ title: '技能详情开发中', icon: 'none' });
  };

  const handleRefresh = () => {
    console.log('[Skills] 下拉刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 800);
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
                <Text className={styles.statValue}>{skills.length}</Text>
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
        {skills.length > 0 ? (
          skills.map(skill => (
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
