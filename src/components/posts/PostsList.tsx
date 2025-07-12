import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Heart, MessageCircle, Share, Plus } from 'lucide-react';
import Button from '../ui/Button';
import CreatePost from './CreatePost';
import SwapRequestModal from '../requests/SwapRequestModal';
import { User } from '../../types';

interface Post {
  id: string;
  userId: string;
  user: User;
  title: string;
  description: string;
  skillsOffered: string[];
  skillsWanted: string[];
  createdAt: Date;
  likes: number;
  comments: any[];
}

const PostsList: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const handleCreatePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleRequestSwap = (postUser: User) => {
    setSelectedUser(postUser);
    setIsRequestModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Skill Swap Posts</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Create Post
        </Button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-gray-400 mb-4">Be the first to share a skill swap opportunity!</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Your First Post
            </Button>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              {/* Post Header */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={post.user.profilePhoto}
                  alt={post.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{post.user.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {post.userId !== user?.id && (
                  <Button
                    size="sm"
                    onClick={() => handleRequestSwap(post.user)}
                  >
                    Request Swap
                  </Button>
                )}
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
                {post.description && (
                  <p className="text-gray-300 mb-4">{post.description}</p>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Skills Offered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {post.skillsOffered.map((skill) => (
                        <span
                          key={skill}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Skills Wanted:</h4>
                    <div className="flex flex-wrap gap-2">
                      {post.skillsWanted.map((skill) => (
                        <span
                          key={skill}
                          className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex items-center space-x-6 pt-4 border-t border-gray-700">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Heart size={18} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                  <MessageCircle size={18} />
                  <span>{post.comments.length}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                  <Share size={18} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <CreatePost
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreatePost={handleCreatePost}
      />

      {selectedUser && (
        <SwapRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          targetUser={selectedUser}
        />
      )}
    </div>
  );
};

export default PostsList;