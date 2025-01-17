'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { UserType } from '@/types/types';
import { UserSearch } from './UserSearch';
import { useChatState } from '@/lib/hooks/useChatState';
import { useSocketSetup } from '@/lib/hooks/useSocketSetup';
import { ChatWindow } from './ChatWindow';
import { RecentChats } from './RecentChats';

export default function ChatPage() {
	const { data } = useSession();
	const [number, setNumber] = useState('');
	const { currentChat, setCurrentChat, recentChats, addToRecentChats,setRecentChats } =
		useChatState();

	const socket = useSocketSetup({
		userNumber: data?.user.number,
		currentChat,
		setCurrentChat,
		addToRecentChats,
	});

	const handleCurrentChat = ({
		user,
		roomId,
	}: {
		user: UserType;
		roomId: string;
	}) => {
		if (
			socket &&
			data?.user.number &&
			user.MobileNumber != currentChat.user.MobileNumber
		) {
			console.log("first")
			socket.emit('joinChat', {
				sender: data.user.number,
				reciever: user.MobileNumber,
			});
			socket.emit('sendOldMessage',{
				roomId:currentChat.roomId,
				sender:currentChat.user.MobileNumber
			});
		}
		if (
			socket &&
			currentChat.user.MobileNumber == user.MobileNumber &&
			roomId == currentChat.roomId
		) {
			console.log("Second")
			socket.emit('sendOldMessage',{
				roomId:currentChat.roomId,
				sender:currentChat.user.MobileNumber
			});
		} else {
			console.log("asdfifuaspodifu")
			setCurrentChat((prev) => {
				return {
					Message: [...prev.Message],
					roomId: roomId,
					user: user,
				};
			});
		}
	};
	return (
		<div className='pt-10 px-4'>
			<div className='flex justify-between border rounded-xl'>
				<div className='p-4 border-r w-1/2'>
					<h1 className='text-2xl font-bold mb-6'>Chats</h1>
					<UserSearch
						number={number}
						setNumber={setNumber}
						handleCurrentChat={handleCurrentChat}
					/>
					<RecentChats
						setRecentChat={setRecentChats}
						recentChats={recentChats}
						handleCurrentChat={handleCurrentChat}
					/>
				</div>
				{data?.user && (
					<ChatWindow
						socket={socket}
						setCurrentChat={setCurrentChat}
						currentChat={currentChat}
						userNumber={data?.user.number}
						userName={data?.user.name}
						addToRecentChats={addToRecentChats}
					/>
				)}
			</div>
			{!currentChat?.roomId && <Toaster position='top-right' />}
		</div>
	);
}
