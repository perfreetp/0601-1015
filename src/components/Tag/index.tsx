import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface TagProps {
  text: string;
  color?: string;
  bg?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const Tag: React.FC<TagProps> = ({ text, color, bg, size = 'sm', className }) => {
  return (
    <View
      className={classnames(styles.tag, styles[size], className)}
      style={{
        color: color || '#16A34A',
        backgroundColor: bg || '#DCFCE7'
      }}
    >
      <Text className={styles.text}>{text}</Text>
    </View>
  );
};

export default Tag;
