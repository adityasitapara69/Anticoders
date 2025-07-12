import React, { useState } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User;
}

const SwapRequestModal: React.FC<SwapRequestModalProps> = ({
  isOpen,
  onClose,
  targetUser
}) => {
  const { user } = useAuth();
  const { sendSwapRequest } = useApp();
  const [selectedSkillOffered, setSelectedSkillOffered] = useState('');
  const [selectedSkillWanted, setSelectedSkillWanted] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedSkillOffered || !selectedSkillWanted) return;

    setLoading(true);
    
    sendSwapRequest({
      fromUserId: user.id,
      toUserId: targetUser.id,
      skillOffered: selectedSkillOffered,
      skillWanted: selectedSkillWanted,
      message,
      status: 'pending'
    });

    setLoading(false);
    onClose();
    alert('Swap request sent successfully!');
  };

  const handleClose = () => {
    setSelectedSkillOffered('');
    setSelectedSkillWanted('');
    setMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Request Skill Swap">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-4">
          <img
            src={targetUser.profilePhoto}
            alt={targetUser.name}
            className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
          />
          <h3 className="text-lg font-semibold text-white">{targetUser.name}</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Choose one of your offered skills
          </label>
          <select
            value={selectedSkillOffered}
            onChange={(e) => setSelectedSkillOffered(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a skill you can offer</option>
            {user?.skillsOffered.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Choose one of their wanted skills
          </label>
          <select
            value={selectedSkillWanted}
            onChange={(e) => setSelectedSkillWanted(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a skill you want to learn</option>
            {targetUser.skillsWanted.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Introduce yourself and explain why you'd like to swap skills..."
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-3">
          <Button type="submit" disabled={loading || !selectedSkillOffered || !selectedSkillWanted}>
            {loading ? 'Sending...' : 'Submit'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SwapRequestModal;