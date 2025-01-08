import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client';

// URL for the Socket.IO server
const SOCKET_URL = 'http://localhost:8080'; // Adjust this for your deployment

export function useSocket(userNumber?:string): Socket | null {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const newSocket = io(SOCKET_URL, { autoConnect: true });
		setSocket(newSocket);

		newSocket.on('connect', () => {
			console.log('Connected to server:', newSocket.id);
			newSocket.emit("identify",userNumber);

		});

		newSocket.on('privateMessage', (data: any) => {
			console.log(data.message);
		});

		newSocket.on('disconnect', () => {
			console.log('Disconnected from server');
		});

		// Cleanup on component unmount
		return () => {
			newSocket.close();
		};
	}, [userNumber]);

	return socket;
}
