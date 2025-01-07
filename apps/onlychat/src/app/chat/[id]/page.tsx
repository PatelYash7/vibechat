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

interface Message {
	text: string;
	sender: string;
	timestamp: string;
}

export default function Page({ params }: { params: { id: string } }) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState('');
	const [username, setUsername] = useState('');
	const [roomId, setRoomId] = useState('');
	const [status, setStatus] = useState('Not connected');
	const [isConnected, setIsConnected] = useState(false);
	const wsRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		if (!username || !roomId) return;

		const connectWebSocket = () => {
			const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
			const host = window.location.host;
			wsRef.current = new WebSocket(`${protocol}//${host}`);

			wsRef.current.onopen = () => {
				console.log('Connected to WebSocket');
				wsRef.current?.send(
					JSON.stringify({
						type: 'join',
						roomId,
						username,
					}),
				);
			};

			wsRef.current.onmessage = (event) => {
				const data = JSON.parse(event.data);

				if (data.type === 'message') {
					setMessages((prev) => [
						...prev,
						{
							text: data.text,
							sender: data.sender,
							timestamp: data.timestamp,
						},
					]);
				} else if (data.type === 'status') {
					setStatus(data.message);
					setIsConnected(data.usersCount === 2);
				} else if (data.type === 'error') {
					setStatus(data.message);
					setIsConnected(false);
				}
			};

			wsRef.current.onclose = () => {
				setIsConnected(false);
				setStatus('Disconnected - Attempting to reconnect...');
				setTimeout(connectWebSocket, 3000);
			};

			wsRef.current.onerror = () => {
				setStatus('Connection error - Retrying...');
			};
		};

		connectWebSocket();

		return () => {
			if (wsRef.current) {
				wsRef.current.close();
			}
		};
	}, [username, roomId]);

	const sendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputMessage.trim() || !wsRef.current || !isConnected) return;

		const message = {
			type: 'message',
			text: inputMessage,
			sender: username,
		};

		wsRef.current.send(JSON.stringify(message));

		setMessages((prev) => [
			...prev,
			{
				text: inputMessage,
				sender: username,
				timestamp: new Date().toISOString(),
			},
		]);

		setInputMessage('');
	};
	const { data } = useSession();
	const [number, setNumber] = useState('');
	const debouncedNumber = useDebounce({ value: number, delay: 400 });
	const [users, setUsers] = useState<UserType[]>();
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
												onClick={() => {}}
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
						<p
							className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}
						>
							{status}
						</p>
					</div>

					<div className='flex-1 overflow-y-auto mb-4 border rounded p-4'>
						{messages.map((message, index) => (
							<div
								key={index}
								className={`mb-2 p-2 rounded ${
									message.sender === username ?
										'bg-blue-100 ml-auto'
									:	'bg-gray-100'
								} max-w-[70%]`}
							>
								<div className='font-bold'>{message.sender}</div>
								<div>{message.text}</div>
								<div className='text-xs text-gray-500'>
									{new Date(message.timestamp).toLocaleTimeString()}
								</div>
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
							disabled={!isConnected}
						/>
						<button
							type='submit'
							className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400'
							disabled={!isConnected}
						>
							Send
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
