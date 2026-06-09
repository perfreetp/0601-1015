import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, Input, ScrollView, Image } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import UserAvatar from '@/components/UserAvatar';
import EmptyState from '@/components/EmptyState';
import { currentUser } from '@/data/users';
import { useAppStore } from '@/store';
import type { ChatSession, ChatMessage } from '@/types';

const ChatPage: React.FC = () => {
  const router = useRouter();
  const urlSessionId = router.params?.sessionId as string | undefined;
  const urlUserId = router.params?.userId as string | undefined;
  const urlUserName = decodeURIComponent((router.params?.userName) as string || '');
  const urlUserAvatar = decodeURIComponent((router.params?.userAvatar) as string || '');

  const sessions = useAppStore(state => state.sessions);
  const clearSessionUnread = useAppStore(state => state.clearSessionUnread);
  const getSortedSessions = useAppStore(state => state.getSortedSessions);
  const addMessage = useAppStore(state => state.addMessage);
  const getSessionMessages = useAppStore(state => state.getSessionMessages);
  const getOrCreateSession = useAppStore(state => state.getOrCreateSession);

  const sortedSessions = useMemo(() => getSortedSessions(), [sessions, getSortedSessions]);

  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (urlSessionId && urlUserId && urlUserName) {
      const session = getOrCreateSession(urlSessionId, urlUserId, urlUserName, urlUserAvatar || '');
      setActiveSession(session);
      clearSessionUnread(session.id);
    } else {
      setActiveSession(null);
    }
  }, [urlSessionId, urlUserId, urlUserName, urlUserAvatar, getOrCreateSession, clearSessionUnread]);

  useDidShow(() => {
    if (urlSessionId && urlUserId && urlUserName) {
      const session = getOrCreateSession(urlSessionId, urlUserId, urlUserName, urlUserAvatar || '');
      setActiveSession(session);
      clearSessionUnread(session.id);
      const msgs = getSessionMessages(session.id);
      setMessages(msgs.length > 0 ? msgs : []);
    } else {
      setActiveSession(null);
      setMessages([]);
    }
  });

  useEffect(() => {
    if (activeSession) {
      const msgs = getSessionMessages(activeSession.id);
      setMessages(msgs.length > 0 ? msgs : []);
    }
  }, [activeSession, getSessionMessages]);

  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollToBottom?.();
        }
      }, 100);
    }
  }, [messages]);

  const handleSessionClick = (session: ChatSession) => {
    console.log('[Chat] 打开会话:', session.id);
    setActiveSession(session);
    clearSessionUnread(session.id);
    const msgs = getSessionMessages(session.id);
    setMessages(msgs.length > 0 ? msgs : []);
  };

  const handleBack = () => {
    if (urlSessionId) {
      Taro.navigateBack({ delta: 1 }).catch(() => {
        setActiveSession(null);
        setMessages([]);
      });
    } else {
      setActiveSession(null);
      setMessages([]);
    }
  };

  const sessionId = activeSession?.id || '';

  const handleSend = () => {
    if (!inputText.trim() || !activeSession) return;

    addMessage(sessionId, {
      senderId: 'u0',
      content: inputText.trim(),
      type: 'text',
      isRead: true
    });

    setMessages(getSessionMessages(sessionId));
    setInputText('');
  };

  const handleVoice = () => {
    if (!activeSession) return;
    console.log('[Chat] 发送语音');

    const mockVoiceContent = '[语音] 00:06 点击播放';
    addMessage(sessionId, {
      senderId: 'u0',
      content: mockVoiceContent,
      type: 'voice',
      isRead: true
    });

    setMessages(getSessionMessages(sessionId));
    Taro.showToast({ title: '语音已发送', icon: 'success' });
  };

  const handleImage = () => {
    if (!activeSession) return;
    console.log('[Chat] 发送图片');

    const mockImages = [
      'https://picsum.photos/id/1025/400/300',
      'https://picsum.photos/id/1062/400/300',
      'https://picsum.photos/id/1074/400/300'
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];

    addMessage(sessionId, {
      senderId: 'u0',
      content: randomImage,
      type: 'image',
      isRead: true
    });

    setMessages(getSessionMessages(sessionId));
    Taro.showToast({ title: '图片已发送', icon: 'success' });
  };

  const handleLocation = () => {
    if (!activeSession) return;
    console.log('[Chat] 发送位置');

    const mockLocations = [
      '[位置] 阳光花园小区3栋楼下',
      '[位置] 阳光花园小区东门快递驿站',
      '[位置] 阳光花园会所一楼'
    ];
    const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];

    addMessage(sessionId, {
      senderId: 'u0',
      content: randomLocation,
      type: 'location',
      isRead: true
    });

    setMessages(getSessionMessages(sessionId));
    Taro.showToast({ title: '位置已发送', icon: 'success' });
  };

  const handleMore = () => {
    console.log('[Chat] 更多操作');
  };

  const renderMessageContent = (msg: ChatMessage, isMine: boolean) => {
    const textColorClass = isMine ? styles.imageMineText : '';

    switch (msg.type) {
      case 'image':
        return (
          <View className={styles.imageWrapper}>
            <Image
              className={styles.messageImage}
              src={msg.content}
              mode="widthFix"
              onClick={() => {
                Taro.previewImage({
                  urls: [msg.content],
                  current: msg.content
                });
              }}
            />
            <Text className={classnames(styles.messageTime, textColorClass)}>{msg.timestamp}</Text>
          </View>
        );
      case 'voice':
        return (
          <View>
            <View className={styles.voiceBubble}>
              <Text className={styles.voiceIcon}>🎤</Text>
              <Text className={classnames(styles.voiceText, textColorClass)}>{msg.content}</Text>
            </View>
            <Text className={classnames(styles.messageTime, textColorClass)}>{msg.timestamp}</Text>
          </View>
        );
      case 'location':
        return (
          <View>
            <View className={styles.locationBubble}>
              <Text className={styles.locationIcon}>📍</Text>
              <Text className={classnames(styles.locationText, textColorClass)}>{msg.content}</Text>
            </View>
            <Text className={classnames(styles.messageTime, textColorClass)}>{msg.timestamp}</Text>
          </View>
        );
      case 'text':
      default:
        return (
          <View>
            <Text className={classnames(styles.messageText, textColorClass)}>{msg.content}</Text>
            <Text className={classnames(styles.messageTime, textColorClass)}>{msg.timestamp}</Text>
          </View>
        );
    }
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

        <ScrollView
          className={styles.messagesContainer}
          scrollY
          enhanced
          showScrollbar={false}
          scrollWithAnimation
          ref={scrollRef}
        >
          {messages.length > 0 ? (
            messages.map(msg => {
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
                  <View className={classnames(styles.messageBubble, msg.type === 'image' && styles.imageBubble)}>
                    {renderMessageContent(msg, isMine)}
                  </View>
                </View>
              );
            })
          ) : (
            <View className={styles.emptyTip}>
              <EmptyState
                icon="💬"
                title="暂无消息"
                description="和邻居打个招呼吧~"
              />
            </View>
          )}
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
        {sortedSessions.length > 0 ? (
          sortedSessions.map(session => (
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
