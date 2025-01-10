import { useState } from 'react';
import { currentChat, RecentChat, UserType } from '@/types/types';

export const useChatState = () => {
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [currentChat, setCurrentChat] = useState<currentChat>({
    roomId: '',
    Message: [],
    user: {
      MobileNumber: '',
      Name: '',
      id: '',
      Password: '',
      createdAt: new Date(),
    },
  });

  const addToRecentChats = (
    user: UserType,
    message: string,
    roomId: string,
    isUnread: boolean = false,
  ) => {
    setRecentChats((prev) => {
      const filtered = prev.filter(
        (chat) => chat.user.MobileNumber !== user.MobileNumber,
      );
      return [
        {
          user,
          lastMessage: message,
          timestamp: new Date(),
          unread: isUnread,
          roomId: roomId,
        },
        ...filtered,
      ];
    });
  };

  return {
    currentChat,
    setCurrentChat,
    recentChats,
    setRecentChats,
    addToRecentChats,
  };
};