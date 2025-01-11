import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { MessageList } from './MessageList';
import { currentChat, UserType } from '@/types/types';
import { Socket } from 'socket.io-client';

export const ChatWindow = ({ 
  currentChat, 
  userNumber, 
  userName, 
  addToRecentChats ,
  setCurrentChat,
  socket
}:{
    currentChat:currentChat,
    userNumber:string,
    userName:string,
    setCurrentChat: Dispatch<SetStateAction<currentChat>>
    addToRecentChats:(user: UserType, message: string, roomId: string, isUnread?: boolean) => void,
    socket:Socket|null
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat.Message]);

  const sendMessage = () => {
    if (!socket || !inputMessage.trim() || !currentChat.roomId) return;

    const message = inputMessage.trim();
    socket.emit('sendMessage', {
      roomId: currentChat.roomId,
      message,
      senderNumber: userNumber,
      senderName: userName,
    });
         
    setCurrentChat((prev:any) => ({
      ...prev,
      Message: [
        ...prev.Message,
        { content: message, sender: userNumber },
      ],
    }));

    addToRecentChats(currentChat.user, message, currentChat.roomId);
    setInputMessage('');
  };
  console.log(currentChat)
  return (
    <div className='flex flex-col h-[90vh] w-1/2 p-4'>
      {/* Chat Header */}
      <div className='mb-4'>
        {currentChat.user && (
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-bold'>{currentChat.user.Name}</h1>
            <div>{currentChat.user.MobileNumber}</div>
          </div>
        )}
      </div>

      <MessageList
        userNumber={userNumber}
        messages={currentChat.Message}
        messagesEndRef={messagesEndRef}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className='flex gap-2'
      >
        <Input
          type='text'
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className='flex-1'
          placeholder='Type your message...'
          disabled={!currentChat.user.id || !currentChat.roomId}
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400'
          disabled={!currentChat.user.id || !currentChat.roomId}
        >
          Send
        </button>
      </form>
    </div>
  );
};