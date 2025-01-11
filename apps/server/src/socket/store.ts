export class SocketStore {
    private userSockets: Map<string, string>;
    private chatRooms: Map<string, { sender: string; reciever: string }>;
    constructor() {
      this.userSockets = new Map();
      this.chatRooms = new Map();
    }
  
    setUserSocket(userNumber: string, socketId: string) {
      this.userSockets.set(userNumber, socketId);
    }
    getUserSockets(): Map<string, string> {
        return this.userSockets;
      }
    getUserSocket(userNumber: string) {
      return this.userSockets.get(userNumber);
    }
  
    removeUserSocket(userNumber: string) {
      this.userSockets.delete(userNumber);
    }
  
    setChatRoom(roomId: string, users: { sender: string; reciever: string }) {
      this.chatRooms.set(roomId, users);
    }
  
    getChatRoom(roomId: string) {
      return this.chatRooms.get(roomId);
    }
  
    removeChatRoom(roomId: string) {
      this.chatRooms.delete(roomId);
    }
  
    hasRoom(roomId: string) {
      return this.chatRooms.has(roomId);
    }
  
    getUserRooms(userNumber: string) {
      const rooms: string[] = [];
      this.chatRooms.forEach((users, roomId) => {
        if (users.sender === userNumber || users.reciever === userNumber) {
          rooms.push(roomId);
        }
      });
      return rooms;
    }
  }

  export function generateRoomId(sender: string, receiver: string): string {
    return [sender, receiver].sort().join('_');
  }