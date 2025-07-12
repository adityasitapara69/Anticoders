import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Header from './components/layout/Header';
import BrowseUsers from './components/browse/BrowseUsers';
import SwapRequests from './components/requests/SwapRequests';
import ProfileEdit from './components/profile/ProfileEdit';
import MessagesList from './components/messaging/MessagesList';
import PostsList from './components/posts/PostsList';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        {authMode === 'login' ? (
          <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <BrowseUsers />;
      case 'posts':
        return <PostsList />;
      case 'requests':
        return <SwapRequests />;
      case 'messages':
        return <MessagesList />;
      case 'profile':
        return <ProfileEdit />;
      default:
        return <BrowseUsers />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="pb-8">
        {renderCurrentView()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;