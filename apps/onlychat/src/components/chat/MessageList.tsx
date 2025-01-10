import { Message } from '@/types/types';
import { RefObject } from 'react';


interface MessageListProps {
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement>;
}

export const MessageList = ({ messages, messagesEndRef }: MessageListProps) => {
  return (
    <div className='flex-1 overflow-y-auto mb-4 border rounded p-4'>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`${msg.sender === 'self' ? 'text-right' : 'text-left'} my-1`}
        >
          <span
            className={`inline-block p-2 rounded-lg ${
              msg.sender === 'self' ? 'bg-blue-500' : 'bg-gray-500'
            } text-white max-w-[70%] break-words`}
          >
            {msg.content}
          </span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};