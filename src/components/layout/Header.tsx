import React from 'react';
import { User, Home, MessageSquare, Settings, LogOut, Plus, Bell, Users, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();
  const { swapRequests, messages } = useApp();

  // Count unread notifications
  const unreadRequestsCount = swapRequests.filter(
    req => req.toUserId === user?.id && req.status === 'pending'
  ).length;

  const unreadMessagesCount = messages.filter(
    msg => msg.toUserId === user?.id && !msg.read
  ).length;

  const totalUnread = unreadRequestsCount + unreadMessagesCount;

  const navItems = [
    { id: 'home', label: 'Browse', icon: Users },
    { id: 'posts', label: 'Posts', icon: Plus },
    { id: 'requests', label: 'Requests', icon: Send, badge: unreadRequestsCount },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <header className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 border-b border-white/10 sticky top-0 z-40 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Skill Swap</h1>
            </div>
            
            <nav className="hidden md:flex space-x-2">
              {navItems.map(({ id, label, icon: Icon, badge }) => (
                <button
                  key={id}
                  onClick={() => onViewChange(id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    currentView === id
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  {badge && badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
              <Bell size={20} />
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-sm">
              <img
                src={user?.profilePhoto}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
              />
              <span className="text-white text-sm font-medium hidden sm:block">{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex space-x-1 pb-3 overflow-x-auto">
            {navItems.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`relative flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  currentView === id
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
                {badge && badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;