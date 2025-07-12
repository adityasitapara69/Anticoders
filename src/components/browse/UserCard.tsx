import React from 'react';
import { User } from '../../types';
import { Star, MapPin, Clock, Send } from 'lucide-react';
import Button from '../ui/Button';

interface UserCardProps {
  user: User;
  onRequestSwap: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onRequestSwap }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 shadow-xl">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={user.profilePhoto}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-white">{user.name}</h3>
            <div className="flex items-center space-x-1 text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded-lg">
              <Star size={16} fill="currentColor" />
              <span className="text-sm font-medium">{user.rating}/5</span>
            </div>
          </div>
          
          <div className="flex items-center text-gray-300 text-sm mb-2">
            <MapPin size={14} className="mr-1" />
            <span>{user.location}</span>
          </div>

          <div className="flex items-center text-gray-300 text-sm mb-4">
            <Clock size={14} className="mr-1" />
            <span className="capitalize">{user.availability}</span>
          </div>

          <div className="mb-4">
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-300 block mb-2">Skills Offered:</span>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
                  >
                    {skill}
                  </span>
                ))}
                {user.skillsOffered.length > 3 && (
                  <span className="text-gray-400 text-xs bg-gray-700/50 px-2 py-1 rounded-full">
                    +{user.skillsOffered.length - 3} more
                  </span>
                )}
              </div>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-300 block mb-2">Skills Wanted:</span>
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
                  >
                    {skill}
                  </span>
                ))}
                {user.skillsWanted.length > 3 && (
                  <span className="text-gray-400 text-xs bg-gray-700/50 px-2 py-1 rounded-full">
                    +{user.skillsWanted.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={() => onRequestSwap(user)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            size="sm"
          >
            <Send size={16} className="mr-2" />
            Request Skill Swap
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;