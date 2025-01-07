'use client';

import { useSocket } from '@/lib/hooks/useSocket';
import { useEffect, useState } from 'react';

const Home: React.FC = () => {
	const socket = useSocket();
	const [socketId, setSocketId] = useState<undefined | string>(undefined);
	const sendMessage = () => {
		if (socket) {
			socket.emit('customEvent', { message: 'Hello Server!' });
		}
	};
	useEffect(() => {
		if (socket) {
			console.log("first")
			const handleConnect = () => setSocketId(socket.id);
			socket.on('connect', handleConnect);
			return () => {
				socket.off('connect', handleConnect);
			};
		}
	}, [socket]);
	return (
		<div>
			<h1>Socket.IO Connection Test</h1>
			{socketId ?
				<>
					<p>Socket connected: {socketId}</p>
					<button onClick={sendMessage}>Send Message to Server</button>
				</>
			:	<p>Connecting...</p>}
		</div>
	);
};

export default Home;
