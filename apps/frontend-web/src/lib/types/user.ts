export interface User {
  id: number;               
  username: string;
  email: string;
  phone?: string;           
  role: string;
  isOnline: boolean;
  profileImage?: string;
  name: string;
  avatar: string;
}