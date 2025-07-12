import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Marc Demo',
    email: 'marc@example.com',
    location: 'San Francisco, CA',
    profilePhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    skillsOffered: ['JavaScript', 'React', 'Node.js'],
    skillsWanted: ['Python', 'Data Science'],
    availability: 'weekends',
    profile: 'Public',
    rating: 4.8,
    bio: 'Full-stack developer passionate about learning new technologies'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    location: 'New York, NY',
    profilePhoto: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    skillsOffered: ['Python', 'Machine Learning'],
    skillsWanted: ['React', 'UI/UX'],
    availability: 'evenings',
    profile: 'Public',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@example.com',
    location: 'Seattle, WA',
    profilePhoto: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    skillsOffered: ['UI/UX', 'Figma'],
    skillsWanted: ['Backend', 'DevOps'],
    availability: 'flexible',
    profile: 'Public',
    rating: 4.7
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Allow any email/password combination for demo purposes
    // In production, this would validate against a real backend
    
    // Check if user exists in mock data first
    let user = mockUsers.find(u => u.email === email);
    
    // If not found, create a new user with the provided email
    if (!user) {
      user = {
        id: Date.now().toString(),
        name: email.split('@')[0], // Use email prefix as name
        email: email,
        location: 'Unknown Location',
        profilePhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
        skillsOffered: [],
        skillsWanted: [],
        availability: 'flexible',
        profile: 'Public',
        rating: 0,
        bio: ''
      };
      mockUsers.push(user);
    }
    
    setAuthState({ user, isAuthenticated: true });
    return true;
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      location: userData.location || '',
      profilePhoto: userData.profilePhoto || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
      skillsOffered: userData.skillsOffered || [],
      skillsWanted: userData.skillsWanted || [],
      availability: userData.availability || 'flexible',
      profile: 'Public',
      rating: 0,
      bio: userData.bio || ''
    };
    
    mockUsers.push(newUser);
    setAuthState({ user: newUser, isAuthenticated: true });
    return true;
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      setAuthState({ ...authState, user: updatedUser });
      
      // Update in mock data
      const userIndex = mockUsers.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { mockUsers };