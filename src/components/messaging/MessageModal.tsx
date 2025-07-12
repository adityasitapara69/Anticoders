import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Send, X } from 'lucide-react';
import Button from '../ui/Button';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  otherUser: User;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, otherUser }) => {
  const { user } = useAuth();
  const { messages, sendMessage, markMessageAsRead } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = messages.filter(
    msg => 
      (msg.fromUserId === user?.id && msg.toUserId === otherUser.id) ||
      (msg.fromUserId === otherUser.id && msg.toUserId === user?.id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    if (isOpen) {
      // Mark messages as read
      conversation
        .filter(msg => msg.toUserId === user?.id && !msg.read)
        .forEach(msg => markMessageAsRead(msg.id));
    }
  }, [isOpen, conversation, user?.id, markMessageAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    sendMessage({
      fromUserId: user.id,
      toUserId: otherUser.id,
      content: newMessage.trim(),
      read: false
    });

    setNewMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src={otherUser.profilePhoto}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-white">{otherUser.name}</h2>
              <p className="text-sm text-gray-400">Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            conversation.map((message) => {
              const isOwn = message.fromUserId === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwn
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      isOwn ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send size={16} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;