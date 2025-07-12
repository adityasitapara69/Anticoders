import React, { useState } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { User } from '../../types';
import { mockUsers } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import UserCard from './UserCard';
import SwapRequestModal from '../requests/SwapRequestModal';

const BrowseUsers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const filteredUsers = mockUsers.filter(user => {
    if (user.id === currentUser?.id) return false;
    
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAvailability = !availabilityFilter || user.availability === availabilityFilter;
    
    return matchesSearch && matchesAvailability;
  });

  const handleRequestSwap = (user: User) => {
    setSelectedUser(user);
    setIsRequestModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Discover Skills</h1>
              <p className="text-gray-300">Find amazing people to learn from and teach</p>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users, skills, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Filter className="text-gray-400" size={20} />
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              >
                <option value="" className="bg-gray-800">All Availability</option>
                <option value="flexible" className="bg-gray-800">Flexible</option>
                <option value="weekends" className="bg-gray-800">Weekends</option>
                <option value="evenings" className="bg-gray-800">Evenings</option>
                <option value="weekdays" className="bg-gray-800">Weekdays</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">{filteredUsers.length}</div>
              <div className="text-gray-300 text-sm">Available Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">
                {Array.from(new Set(filteredUsers.flatMap(u => u.skillsOffered))).length}
              </div>
              <div className="text-gray-300 text-sm">Skills Offered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">
                {Array.from(new Set(filteredUsers.flatMap(u => u.skillsWanted))).length}
              </div>
              <div className="text-gray-300 text-sm">Skills Wanted</div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onRequestSwap={handleRequestSwap}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-300 text-lg mb-2">No users found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        )}

        {/* Swap Request Modal */}
        {selectedUser && (
          <SwapRequestModal
            isOpen={isRequestModalOpen}
            onClose={() => setIsRequestModalOpen(false)}
            targetUser={selectedUser}
          />
        )}
      </div>
    </div>
  );
};

export default BrowseUsers;