export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  profilePhoto: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string;
  profile: 'Public' | 'Private';
  rating: number;
  bio?: string;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: User;
  toUser: User;
  skillOffered: string;
  skillWanted: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}