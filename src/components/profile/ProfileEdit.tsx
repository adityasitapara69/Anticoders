import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, Plus, X, Upload, User, MapPin, Clock, Eye, Save } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ProfileEdit: React.FC = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    availability: user?.availability || '',
    profile: user?.profile || 'Public',
    bio: user?.bio || ''
  });
  const [skillsOffered, setSkillsOffered] = useState<string[]>(user?.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState<string[]>(user?.skillsWanted || []);
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      ...formData,
      skillsOffered,
      skillsWanted,
      profilePhoto
    });
    
    // Show success message with animation
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    successDiv.textContent = 'Profile updated successfully!';
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      successDiv.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(successDiv), 300);
    }, 3000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Simulate upload delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setProfilePhoto(event.target.result as string);
          }
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Edit Profile</h2>
              <p className="text-gray-300">Update your information and skills</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Photo Section */}
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                  {isUploading ? (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-3 rounded-full text-white transition-all duration-200 transform hover:scale-110 shadow-lg"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Camera size={16} />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold text-white mb-2">Profile Photo</h3>
                <p className="text-gray-300 text-sm mb-4">Upload a clear photo of yourself. This helps others recognize you.</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
                  disabled={isUploading}
                >
                  <Upload size={16} />
                  <span>{isUploading ? 'Uploading...' : 'Change Photo'}</span>
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="inline w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Location
                </label>
                <input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Skills Offered */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-white">
                Skills You Can Offer
              </label>
              <div className="flex flex-wrap gap-3 mb-4">
                {skillsOffered.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkillOffered(skill)}
                      className="hover:bg-blue-700 rounded-full p-1 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newSkillOffered}
                  onChange={(e) => setNewSkillOffered(e.target.value)}
                  placeholder="Add a skill you can teach..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillOffered())}
                />
                <Button 
                  type="button" 
                  onClick={addSkillOffered} 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            {/* Skills Wanted */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-white">
                Skills You Want to Learn
              </label>
              <div className="flex flex-wrap gap-3 mb-4">
                {skillsWanted.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkillWanted(skill)}
                      className="hover:bg-green-700 rounded-full p-1 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newSkillWanted}
                  onChange={(e) => setNewSkillWanted(e.target.value)}
                  placeholder="Add a skill you want to learn..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillWanted())}
                />
                <Button 
                  type="button" 
                  onClick={addSkillWanted} 
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="inline w-4 h-4 mr-2" />
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                >
                  <option value="flexible" className="bg-gray-800">Flexible</option>
                  <option value="weekends" className="bg-gray-800">Weekends</option>
                  <option value="evenings" className="bg-gray-800">Evenings</option>
                  <option value="weekdays" className="bg-gray-800">Weekdays</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Eye className="inline w-4 h-4 mr-2" />
                  Profile Visibility
                </label>
                <select
                  value={formData.profile}
                  onChange={(e) => setFormData({ ...formData, profile: e.target.value as 'Public' | 'Private' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                >
                  <option value="Public" className="bg-gray-800">Public</option>
                  <option value="Private" className="bg-gray-800">Private</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-white mb-2">
                About You
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell others about yourself, your experience, and what you're passionate about learning..."
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none"
              />
            </div>

            <div className="flex space-x-4 pt-6">
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </Button>
              <Button 
                type="button" 
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;