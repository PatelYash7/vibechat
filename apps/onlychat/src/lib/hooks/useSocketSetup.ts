import { Dispatch, SetStateAction, useEffect } from 'react';
import { useSocket } from '@/lib/hooks/useSocket';
import { toast } from 'sonner';
import { getUser } from '@/action/handleSearch';
import { currentChat, UserType } from '@/types/types';

export const useSocketSetup = ({
	userNumber,
	currentChat,
	setCurrentChat,
	addToRecentChats,
}: {
	userNumber: string | undefined;
	currentChat: currentChat;
	setCurrentChat: Dispatch<SetStateAction<currentChat>>;
	addToRecentChats: (
		user: UserType,
		message: string,
		roomId: string,
		isUnread?: boolean,
	) => void;
}) => {
	const socket = useSocket(userNumber);
	useEffect(() => {
		if (socket && userNumber) {
			socket.on('chatReady', ({ roomId }) => {
				setCurrentChat((prev: any) => ({
					Message: [],
					roomId: roomId,
					user: prev?.user,
				}));
				
			});
			socket.on('newMessage', ({ message, senderNumber }) => {
				if (currentChat?.user.MobileNumber === senderNumber) {
					setCurrentChat((prev) => ({
						...prev,
						Message: [...prev.Message, { sender: 'other', content: message }],
					}));
				}
			});
			if (currentChat.roomId) {
				socket.emit('sendOldMessage', {
					roomId: currentChat.roomId,
					sender: userNumber,
				});
			}
			
			socket.on('oldMessage', (oldMessage) => {
				console.log(oldMessage)
				setCurrentChat((prev)=>({
					...prev,
					Message:[...oldMessage]
				}))
			});

			socket.on(
				'messageNotification',
				async ({ senderName, senderNumber, message, roomId }) => {
					if (currentChat?.user.MobileNumber !== senderNumber) {
						const senderUser = await getUser({ number: senderNumber });
						if (senderUser) {
							addToRecentChats(senderUser, message, roomId, true);
							toast(`New message from ${senderName}`, {
								description: message,
							});
						}
					}
				},
			);
			return () => {
				if (currentChat.roomId) {
					socket.emit('leaveChat', {
						roomId: currentChat.roomId,
						user: userNumber,
					});
				}
				socket.off('oldMessage')
				socket.off('chatReady');
				socket.off('newMessage');
				socket.off('messageNotification');
			};
		}
	}, [socket, currentChat.roomId, userNumber]);

	return socket;
};
