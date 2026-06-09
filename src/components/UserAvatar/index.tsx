import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface UserAvatarProps {
  src: string;
  size?: 'sm' | 'md' | 'lg';
  name?: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, size = 'md', name, className }) => {
  const sizeMap = {
    sm: 64,
    md: 88,
    lg: 128
  };

  return (
    <View className={classnames(styles.avatarContainer, styles[size], className)}>
      <Image
        className={styles.avatar}
        src={src}
        mode="aspectFill"
      />
      {name && <Text className={styles.nameText}>{name.slice(0, 1)}</Text>}
    </View>
  );
};

export default UserAvatar;
