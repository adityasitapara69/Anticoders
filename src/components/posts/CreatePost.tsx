import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, X } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: any) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ isOpen, onClose, onCreatePost }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || skillsOffered.length === 0 || skillsWanted.length === 0) return;

    setLoading(true);
    
    const newPost = {
      id: Date.now().toString(),
      userId: user?.id,
      user,
      title: title.trim(),
      description: description.trim(),
      skillsOffered,
      skillsWanted,
      createdAt: new Date(),
      likes: 0,
      comments: []
    };

    onCreatePost(newPost);
    setLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setSkillsOffered([]);
    setSkillsWanted([]);
    setNewSkillOffered('');
    setNewSkillWanted('');
    onClose();
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !skillsOffered.includes(newSkillOffered.trim())) {
      setSkillsOffered([...skillsOffered, newSkillOffered.trim()]);
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !skillsWanted.includes(newSkillWanted.trim())) {
      setSkillsWanted([...skillsWanted, newSkillWanted.trim()]);
      setNewSkillWanted('');
    }
  };

  const removeSkillOffered = (skill: string) => {
    setSkillsOffered(skillsOffered.filter(s => s !== skill));
  };

  const removeSkillWanted = (skill: string) => {
    setSkillsWanted(skillsWanted.filter(s => s !== skill));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Skill Swap Post">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What skill swap are you looking for?"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you're offering and what you're looking for..."
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Skills Offered */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Skills You Can Offer
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {skillsOffered.map((skill) => (
              <span
                key={skill}
                className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkillOffered(skill)}
                  className="hover:bg-blue-700 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkillOffered}
              onChange={(e) => setNewSkillOffered(e.target.value)}
              placeholder="Add a skill you can offer..."
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillOffered())}
            />
            <Button type="button" onClick={addSkillOffered} variant="secondary">
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Skills Wanted */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Skills You Want to Learn
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {skillsWanted.map((skill) => (
              <span
                key={skill}
                className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkillWanted(skill)}
                  className="hover:bg-green-700 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkillWanted}
              onChange={(e) => setNewSkillWanted(e.target.value)}
              placeholder="Add a skill you want to learn..."
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillWanted())}
            />
            <Button type="button" onClick={addSkillWanted} variant="secondary">
              <Plus size={16} />
            </Button>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button 
            type="submit" 
            disabled={loading || !title.trim() || skillsOffered.length === 0 || skillsWanted.length === 0}
          >
            {loading ? 'Creating...' : 'Create Post'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePost;