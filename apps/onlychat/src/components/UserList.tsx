import { UserType } from '@/types/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserListProps {
    users: UserType[];
    onUserSelect: (user: UserType) => void;
    onClose: () => void;
}

export function UserList({ users, onUserSelect, onClose }: UserListProps) {
    return (
        <AnimatePresence>
            {users.map((user: UserType, index: number) => (
                <motion.div
                    onClick={() => {
                        onClose();
                        onUserSelect(user);
                    }}
                    key={user.MobileNumber}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className='flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                >
                    <div className='relative'>
                        <Avatar>
                            <AvatarFallback>
                                {user.Name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h3 className='font-medium'>{user.Name}</h3>
                        <p className='text-sm text-gray-500'>
                            {user.MobileNumber}
                        </p>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
    );
}
