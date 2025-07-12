import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SwapRequest, Message } from '../types';
import { mockUsers } from './AuthContext';

interface AppContextType {
  swapRequests: SwapRequest[];
  messages: Message[];
  sendSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt' | 'fromUser' | 'toUser'>) => void;
  updateRequestStatus: (requestId: string, status: 'accepted' | 'rejected') => void;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  markMessageAsRead: (messageId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const sendSwapRequest = (request: Omit<SwapRequest, 'id' | 'createdAt' | 'fromUser' | 'toUser'>) => {
    const fromUser = mockUsers.find(u => u.id === request.fromUserId);
    const toUser = mockUsers.find(u => u.id === request.toUserId);
    
    if (fromUser && toUser) {
      const newRequest: SwapRequest = {
        ...request,
        id: Date.now().toString(),
        createdAt: new Date(),
        fromUser,
        toUser,
        status: 'pending'
      };
      
      setSwapRequests(prev => [...prev, newRequest]);
    }
  };

  const updateRequestStatus = (requestId: string, status: 'accepted' | 'rejected') => {
    setSwapRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status } : req)
    );
  };

  const sendMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => msg.id === messageId ? { ...msg, read: true } : msg)
    );
  };

  return (
    <AppContext.Provider value={{
      swapRequests,
      messages,
      sendSwapRequest,
      updateRequestStatus,
      sendMessage,
      markMessageAsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};