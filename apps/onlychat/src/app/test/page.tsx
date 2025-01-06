'use client';

import { useSocket } from '@/lib/hooks/useSocket';

const Home: React.FC = () => {
	const socket = useSocket();

	const sendMessage = () => {
		if (socket) {
			socket.emit('customEvent', { message: 'Hello Server!' });
		}
	};

	return (
		<div>
			<h1>Socket.IO Connection Test</h1>
			{socket ?
				<>
					<p>Socket connected: {socket.id}</p>
					<button onClick={sendMessage}>Send Message to Server</button>
				</>
			:	<p>Connecting...</p>}
		</div>
	);
};

export default Home;
