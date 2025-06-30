export interface User {
  id: string | number;
  username: string;
  profileImage?: string;
  isOnline: boolean;
  role?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string | number;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface ChatRoom {
  id: string;
  name: string;
  participantIds: (string | number)[]; 
  messages: ChatMessage[];
}
