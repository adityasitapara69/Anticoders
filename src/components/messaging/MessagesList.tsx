import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { mockUsers } from '../../context/AuthContext';
import { Search, MessageCircle } from 'lucide-react';
import MessageModal from './MessageModal';
import { User } from '../../types';

const MessagesList: React.FC = () => {
  const { user } = useAuth();
  const { messages } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Get unique conversations
  const conversations = React.useMemo(() => {
    const userConversations = new Map<string, {
      user: User;
      lastMessage: any;
      unreadCount: number;
    }>();

    messages.forEach(message => {
      const otherUserId = message.fromUserId === user?.id ? message.toUserId : message.fromUserId;
      const otherUser = mockUsers.find(u => u.id === otherUserId);
      
      if (otherUser && (message.fromUserId === user?.id || message.toUserId === user?.id)) {
        const existing = userConversations.get(otherUserId);
        const unreadCount = messages.filter(
          m => m.fromUserId === otherUserId && m.toUserId === user?.id && !m.read
        ).length;

        if (!existing || new Date(message.timestamp) > new Date(existing.lastMessage.timestamp)) {
          userConversations.set(otherUserId, {
            user: otherUser,
            lastMessage: message,
            unreadCount
          });
        }
      }
    });

    return Array.from(userConversations.values())
      .sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
  }, [messages, user?.id]);

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartConversation = (targetUser: User) => {
    setSelectedUser(targetUser);
    setIsMessageModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">Messages</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="space-y-2">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-400 text-lg mb-4">No conversations yet</p>
            <p className="text-gray-500 text-sm">Start chatting by requesting skill swaps!</p>
          </div>
        ) : (
          filteredConversations.map(({ user: otherUser, lastMessage, unreadCount }) => (
            <div
              key={otherUser.id}
              onClick={() => handleStartConversation(otherUser)}
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 cursor-pointer transition-colors border border-gray-700 hover:border-gray-600"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={otherUser.profilePhoto}
                    alt={otherUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-medium">{otherUser.name}</h3>
                    <span className="text-gray-400 text-sm">
                      {new Date(lastMessage.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm truncate">
                    {lastMessage.fromUserId === user?.id ? 'You: ' : ''}
                    {lastMessage.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Available Users to Message */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Start New Conversation</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockUsers
            .filter(u => u.id !== user?.id && !conversations.some(conv => conv.user.id === u.id))
            .map(otherUser => (
              <div
                key={otherUser.id}
                onClick={() => handleStartConversation(otherUser)}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 cursor-pointer transition-colors border border-gray-700 hover:border-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={otherUser.profilePhoto}
                    alt={otherUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-white font-medium">{otherUser.name}</h4>
                    <p className="text-gray-400 text-sm">{otherUser.location}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Message Modal */}
      {selectedUser && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          otherUser={selectedUser}
        />
      )}
    </div>
  );
};

export default MessagesList;