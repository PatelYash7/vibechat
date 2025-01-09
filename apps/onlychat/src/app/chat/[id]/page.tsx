'use client';

import { getUser, handleSearch } from '@/action/handleSearch';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { UserType } from '@/types/types';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSocket } from '@/lib/hooks/useSocket';
import { toast, Toaster } from 'sonner';

interface Message {
	sender: 'self' | 'other';
	content: string;
}

interface RecentChat {
	user: UserType;
	lastMessage: string;
	timestamp: Date;
	unread: boolean;
	roomId: string;
}
interface currentChat {
	user: UserType;
	roomId: string;
	Message: Message[];
}
export default function Page({ params }: { params: { id: string } }) {
	const { data } = useSession();
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState('');
	const [number, setNumber] = useState('');
	const debouncedNumber = useDebounce({ value: number, delay: 400 });
	const [users, setUsers] = useState<UserType[]>();
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
	const socket = useSocket(data?.user.number);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const addToRecentChats = (
		user: UserType,
		message: string,
		roomId: string,
		isUnread: boolean = false,
	) => {
		setRecentChats((prev) => {
			// Remove existing chat with this user if exists
			const filtered = prev.filter(
				(chat) => chat.user.MobileNumber !== user.MobileNumber,
			);
			// Add new chat at the beginning
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
	const handleCurrentChat = ({
		user,
		roomId,
	}: {
		user: UserType;
		roomId?: string;
	}) => {
		if (socket && data?.user.number)
			socket.emit('joinChat', {
				sender: data.user.number,
				reciever: user.MobileNumber,
			});
		if (roomId) {
			setCurrentChat((prev: any) => {
				return {
					Message: [],
					roomId: roomId,
					user: prev?.user ? prev.user : user,
				};
			});
		}
		setCurrentChat((prev: any) => {
			return {
				Message: [],
				roomId: '',
				user: user,
			};
		});
	};
	console.log(currentChat);
	const sendMessage = () => {
		if (socket && inputMessage.trim() && currentChat.roomId && currentChat.user) {
			const message = inputMessage.trim();
			socket.emit('sendMessage', {
				roomId: currentChat.roomId,
				message,
				senderNumber: data?.user.number,
				senderName: data?.user.name,
			});
			setCurrentChat((prev)=>{
                return {
                    ...prev,
                    Message:[
                        ...prev.Message,
                        {
                            content:message,
                            sender:'self'
                        }
                    ]
                }
            })
			addToRecentChats(currentChat.user, message, currentChat.roomId);
			setInputMessage('');
		}
	};
	useEffect(() => {
		const handleCall = async () => {
			const result = await handleSearch({ number: debouncedNumber });
			setUsers(result);
		};
		if (debouncedNumber) {
			handleCall();
		} else {
			setUsers(undefined);
		}
	}, [debouncedNumber]);
	useEffect(() => {
		if (socket) {
			const setupSocketListeners = () => {
				socket.on('chatReady', ({ roomId }) => {
					// @ts-ignore
					setCurrentChat((prev) => {
						return {
							Message: [],
							roomId: roomId,
							user: prev?.user,
						};
					});
				});

				socket.on(
					'newMessage',
					async ({ message, senderNumber, senderName, timestamp, roomId }) => {
						if (currentChat?.user.MobileNumber === senderNumber) {
							console.log('first');
							setCurrentChat((prev) => {
								return {
									...prev,
									Message: [
										...prev.Message,
										{
											sender: 'other',
											content: message,
										},
									],
								};
							});
							setMessages((prev) => [
								...prev,
								{ sender: 'other', content: message },
							]);
						}
					},
				);

				socket.on(
					'messageNotification',
					async ({ senderName, senderNumber, message, timestamp, roomId }) => {
						if (currentChat?.user.MobileNumber != senderNumber) {
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

				socket.on(
					'updateRecentChat',
					async ({ userNumber, message, timestamp, roomId }) => {
						const chatUser = await getUser({ number: userNumber });
						if (chatUser) {
							const isCurrentChat = currentChat.user?.MobileNumber === userNumber;
							addToRecentChats(chatUser, message, roomId, !isCurrentChat);
						}
					},
				);
			};

			setupSocketListeners();

			return () => {
				if (currentChat.roomId) {
					socket.emit('leaveChat', { roomId: currentChat.roomId });
				}
				socket.off('chatReady');
				socket.off('newMessage');
				socket.off('messageNotification');
				socket.off('updateRecentChat');
			};
		}
	}, [socket,currentChat, data?.user.number]);
	return (
		<div className='pt-10 px-4'>
			<div className='flex justify-between border rounded-xl'>
				<div className='p-4 border-r w-1/2'>
					<h1 className='text-2xl font-bold mb-6'>Chats</h1>

					{/* Search Users Section */}
					<div className='space-y-4 mb-6'>
						<Input
							type='text'
							placeholder='Search users...'
							value={number}
							onChange={(e) => setNumber(e.target.value)}
						/>
						<div className='space-y-2'>
							{users && users.length > 0 && (
								<AnimatePresence>
									{users.map((user: UserType, index: number) => (
										<motion.div
											onClick={() => {
												setUsers(undefined);
												setNumber('');
												handleCurrentChat({ user: user });
												// handleUserSelect(user);
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
													<AvatarFallback>{user.Name.charAt(0)}</AvatarFallback>
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
							)}
						</div>
					</div>

					{/* Recent Messages Section */}
					{recentChats.length > 0 && (
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
												// @ts-ignore
												setCurrentChat((prev) => {
													return {
														user: chat.user,
														Message: prev?.Message,
														roomId: chat.roomId,
													};
												});
												handleCurrentChat({
													user: chat.user,
													roomId: chat.roomId,
												});
												// handleUserSelect(chat.user, messages, chat.roomId);
											}}
											className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
												chat.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
											}`}
										>
											<div className='relative'>
												<Avatar>
													<AvatarFallback>
														{chat.user.Name.charAt(0)}
													</AvatarFallback>
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
													<h3 className='font-medium truncate'>
														{chat.user.Name}
													</h3>
													<span className='text-xs text-gray-500 ml-2'>
														{new Date(chat.timestamp).toLocaleTimeString([], {
															hour: '2-digit',
															minute: '2-digit',
														})}
													</span>
												</div>
												<p className='text-sm text-gray-500 truncate'>
													{chat.lastMessage}
												</p>
											</div>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						</div>
					)}
				</div>

				{/* Chat Section */}
				<div className='flex flex-col h-[90vh] w-1/2 p-4'>
					<div className='mb-4'>
						{currentChat.user && (
							<div className='flex justify-between items-center'>
								<h1 className='text-2xl font-bold'>{currentChat.user.Name}</h1>
								<div>{currentChat.user.MobileNumber}</div>
							</div>
						)}
					</div>

					<div className='flex-1 overflow-y-auto mb-4 border rounded p-4'>
						{currentChat?.roomId &&
							currentChat.Message.map((msg, index) => (
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
							disabled={!currentChat.user.id|| !currentChat.roomId}
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
			</div>
			{currentChat?.roomId && <Toaster position='top-right' />}
		</div>
	);
}
