import { Message } from '@/types/types';
import { RefObject } from 'react';


interface MessageListProps {
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement>;
  userNumber:string
}

export const MessageList = ({ messages,userNumber, messagesEndRef }: MessageListProps) => {
  console.log(messages)
  return (
    <div className='flex-1 overflow-y-auto mb-4 border rounded p-4'>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`${msg.sender === userNumber ? 'text-right' : 'text-left'} my-1`}
        >
          <span
            className={`inline-block p-2 rounded-lg ${
              msg.sender === userNumber ? 'bg-blue-500' : 'bg-gray-500'
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