import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RecentChat, UserType } from '@/types/types';

interface RecentChatsProps {
  recentChats: RecentChat[];
  handleCurrentChat: (params: { user: UserType; roomId: string }) => void;
}

export const RecentChats = ({ recentChats, handleCurrentChat }: RecentChatsProps) => {
  if (recentChats.length === 0) return null;

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>Recent Messages</h2>
      <div className='space-y-2'>
        <AnimatePresence>
          {recentChats.map((chat, index) => (
            <motion.div
              key={chat.user.MobileNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => {
                handleCurrentChat({
                  user: chat.user,
                  roomId: chat.roomId,
                });
              }}
              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                chat.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className='relative'>
                <Avatar>
                  <AvatarFallback>{chat.user.Name.charAt(0)}</AvatarFallback>
                </Avatar>
                {chat.unread && (
                  <Badge
                    variant='default'
                    className='absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center'
                  />
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex justify-between items-baseline'>
                  <h3 className='font-medium truncate'>{chat.user.Name}</h3>
                  <span className='text-xs text-gray-500 ml-2'>
                    {new Date(chat.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className='text-sm text-gray-500 truncate'>{chat.lastMessage}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};