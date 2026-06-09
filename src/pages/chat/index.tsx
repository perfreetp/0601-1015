import React, { useState } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import UserAvatar from '@/components/UserAvatar';
import EmptyState from '@/components/EmptyState';
import { mockChatSessions, mockMessages } from '@/data/messages';
import { currentUser } from '@/data/users';
import type { ChatSession, ChatMessage } from '@/types';
import { generateId } from '@/utils';

const ChatPage: React.FC = () => {
  const [sessions] = useState<ChatSession[]>(mockChatSessions);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inputText, setInputText] = useState('');

  const handleSessionClick = (session: ChatSession) => {
    console.log('[Chat] 打开会话:', session.id);
    setActiveSession(session);
  };

  const handleBack = () => {
    setActiveSession(null);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    console.log('[Chat] 发送消息:', inputText);
    const newMessage: ChatMessage = {
      id: generateId(),
      senderId: 'u0',
      content: inputText.trim(),
      type: 'text',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const handleVoice = () => {
    console.log('[Chat] 发送语音');
    Taro.showToast({ title: '语音功能开发中', icon: 'none' });
  };

  const handleImage = () => {
    console.log('[Chat] 发送图片');
    Taro.showToast({ title: '图片功能开发中', icon: 'none' });
  };

  const handleLocation = () => {
    console.log('[Chat] 发送位置');
    Taro.showToast({ title: '位置提醒功能开发中', icon: 'none' });
  };

  const handleMore = () => {
    console.log('[Chat] 更多操作');
  };

  if (activeSession) {
    return (
      <View className={styles.chatView}>
        <View className={styles.chatHeader}>
          <View className={styles.backBtn} onClick={handleBack}>
            <Text className={styles.backIcon}>←</Text>
          </View>
          <View className={styles.chatUserInfo}>
            <UserAvatar src={activeSession.userAvatar} size="sm" />
            <Text className={styles.chatUserName}>{activeSession.userName}</Text>
          </View>
          <View className={styles.moreBtn} onClick={handleMore}>
            <Text className={styles.moreIcon}>⋯</Text>
          </View>
        </View>

        <ScrollView className={styles.messagesContainer} scrollY enhanced showScrollbar={false} scrollWithAnimation>
          {messages.map(msg => {
            const isMine = msg.senderId === 'u0';
            return (
              <View
                key={msg.id}
                className={classnames(styles.messageItem, isMine && styles.mine)}
              >
                <View className={styles.messageAvatar}>
                  <UserAvatar
                    src={isMine ? currentUser.avatar : activeSession.userAvatar}
                    size="sm"
                  />
                </View>
                <View className={styles.messageBubble}>
                  <Text className={styles.messageText}>{msg.content}</Text>
                  <Text className={styles.messageTime}>{msg.timestamp}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View className={styles.inputBar}>
          <View className={styles.inputBtn} onClick={handleVoice}>
            <Text className={styles.inputBtnIcon}>🎤</Text>
          </View>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.inputField}
              placeholder="输入消息..."
              value={inputText}
              confirmType="send"
              onInput={(e) => setInputText(e.detail.value)}
              onConfirm={handleSend}
            />
          </View>
          <View className={styles.inputBtn} onClick={handleImage}>
            <Text className={styles.inputBtnIcon}>🖼️</Text>
          </View>
          <View className={styles.inputBtn} onClick={handleLocation}>
            <Text className={styles.inputBtnIcon}>📍</Text>
          </View>
          <View className={styles.sendBtn} onClick={handleSend}>
            <Text className={styles.sendBtnText}>发送</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <ScrollView className={styles.listView} scrollY enhanced showScrollbar={false}>
        {sessions.length > 0 ? (
          sessions.map(session => (
            <View
              key={session.id}
              className={styles.sessionItem}
              onClick={() => handleSessionClick(session)}
            >
              <View className={styles.avatarWrapper}>
                <UserAvatar src={session.userAvatar} size="md" />
                {session.unreadCount > 0 && (
                  <View className={styles.unreadBadge}>
                    <Text className={styles.unreadText}>
                      {session.unreadCount > 99 ? '99+' : session.unreadCount}
                    </Text>
                  </View>
                )}
              </View>
              <View className={styles.sessionContent}>
                <View className={styles.sessionHeader}>
                  <Text className={styles.sessionName}>{session.userName}</Text>
                  <Text className={styles.sessionTime}>{session.lastMessageTime}</Text>
                </View>
                <View className={styles.sessionPreview}>
                  <Text className={styles.previewText}>{session.lastMessage}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyTip}>
            <EmptyState
              icon="💬"
              title="暂无消息"
              description="快去寻找邻居互助吧~"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ChatPage;
