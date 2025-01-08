'use client';

import { handleSearch } from '@/action/handleSearch';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { UserType } from '@/types/types';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSocket } from '@/lib/hooks/useSocket';
import { useRouter } from 'next/navigation';

interface Message {
	sender: 'self' | 'other';
	content: string;
}

export default function Page({ params }: { params: { id: string } }) {
	const { data } = useSession();
	const router = useRouter();
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState('');
	const [username, setUsername] = useState('');
	const socket = useSocket(data?.user.number);
	const [number, setNumber] = useState('');
	const [selectedUser, setSelectedUser] = useState<UserType>();
	const debouncedNumber = useDebounce({ value: number, delay: 400 });
	const [users, setUsers] = useState<UserType[]>();
	const sendMessage = () => {
		if (socket && inputMessage.trim() && selectedUser?.MobileNumber.trim()) {
			setMessages((prevMessages) => [
				...prevMessages,
				{ sender: 'self', content: inputMessage },
			]);
			socket.emit('sendMessageToUser', {
				receiverUserNumber: selectedUser?.MobileNumber,
				message: inputMessage,
			});
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
		if (socket) {
			// Listen for incoming private messages
			socket.on('privateMessage', (data: { message: string }) => {
				setMessages((prevMessages) => [
					...prevMessages,
					{ sender: 'other', content: data.message },
				]);
			});
		}
	}, [debouncedNumber, socket]);
	return (
		<div className='pt-10 px-4'>
			<div className='flex justify-between border rounded-xl'>
				<div className='p-4 border-r w-1/2'>
					<h1 className='text-2xl font-bold'>Chats</h1>
					<div className='space-y-4'>
						<div className='py-4'>
							<Input
								type='text'
								placeholder='Search users...'
								value={number}
								onChange={(e) => {
									setNumber(e.target.value);
								}}
							/>
						</div>
						<div className='space-y-2'>
							{users ?
								users.length > 0 ?
									<>
										{users.map((user: UserType, index: any) => (
											<motion.div
												onClick={() => {
													setSelectedUser(user);
													setUsers(undefined);
													setNumber('');
												}}
												key={index}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.3, delay: index * 0.1 }}
												className='flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
											>
												<div className='relative'>
													<Avatar>
														<AvatarFallback>
															{user.Name.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<Badge
														variant='outline'
														className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2`}
													/>
												</div>
												<div>
													<h3 className='font-medium'>{user.Name}</h3>
													<p className='text-sm text-gray-500'>
														{user.MobileNumber}
													</p>
												</div>
											</motion.div>
										))}
									</>
								:	<div></div>
							:	<></>}
						</div>
					</div>
				</div>
				<div className='flex flex-col h-[90vh] w-1/2 p-4'>
					<div className='mb-4'>
						<h1 className='text-2xl font-bold'>Chat Room</h1>
						{selectedUser && (
							<div className='flex justify-between'>
								<div>To: {selectedUser.Name}</div>
								<div>{selectedUser.MobileNumber}</div>
							</div>
						)}
					</div>

					<div className='flex-1 overflow-y-auto mb-4 border rounded p-4'>
						{messages.map((msg, index) => (
							<div
								key={index}
								style={{
									textAlign: msg.sender === 'self' ? 'right' : 'left',
									margin: '5px 0',
								}}
							>
								<span
									style={{
										display: 'inline-block',
										padding: '10px',
										borderRadius: '10px',
										backgroundColor:
											msg.sender === 'self' ? '#d1f7d6' : '#f0f0f0',
									}}
								>
									{msg.content}
								</span>
							</div>
						))}
					</div>

					<form onSubmit={sendMessage} className='flex gap-2'>
						<input
							type='text'
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
							className='flex-1 p-2 border rounded'
							placeholder='Type your message...'
							disabled={!selectedUser?.id}
						/>
						<button
							type='submit'
							className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400'
							disabled={!selectedUser?.id}
						>
							Send
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
