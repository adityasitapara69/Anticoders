import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { SwapRequest } from '../../types';
import { Clock, Check, X, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import MessageModal from '../messaging/MessageModal';

const SwapRequests: React.FC = () => {
  const { user } = useAuth();
  const { swapRequests, updateRequestStatus } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const requestsPerPage = 5;

  const userRequests = swapRequests.filter(request => 
    request.fromUserId === user?.id || request.toUserId === user?.id
  );

  const filteredRequests = userRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
  const startIndex = (currentPage - 1) * requestsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + requestsPerPage);

  const handleAccept = (requestId: string) => {
    updateRequestStatus(requestId, 'accepted');
  };

  const handleReject = (requestId: string) => {
    updateRequestStatus(requestId, 'rejected');
  };

  const handleMessage = (request: SwapRequest) => {
    setSelectedRequest(request);
    setIsMessageModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'accepted': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'accepted': return <Check size={16} />;
      case 'rejected': return <X size={16} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">Swap Requests</h1>
        
        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-4">
          {['all', 'pending', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status as any);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            type="text"
            placeholder="Search requests..."
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {paginatedRequests.map((request) => {
          const isIncoming = request.toUserId === user?.id;
          const otherUser = isIncoming ? request.fromUser : request.toUser;
          
          return (
            <div key={request.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start space-x-4">
                <img
                  src={otherUser.profilePhoto}
                  alt={otherUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{otherUser.name}</h3>
                    <div className={`flex items-center space-x-2 ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="text-sm font-medium">
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-400">
                        {isIncoming ? 'They offer:' : 'You offered:'}
                      </span>
                      <span className="ml-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                        {request.skillOffered}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">
                        {isIncoming ? 'You want:' : 'They want:'}
                      </span>
                      <span className="ml-2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                        {request.skillWanted}
                      </span>
                    </div>
                  </div>

                  {request.message && (
                    <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                      <p className="text-gray-300 text-sm">{request.message}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleMessage(request)}
                      >
                        <MessageCircle size={16} className="mr-1" />
                        Message
                      </Button>
                      
                      {isIncoming && request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleAccept(request.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleReject(request.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center space-x-1 px-3 py-2 text-gray-400 hover:text-white disabled:opacity-50"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1 px-3 py-2 text-gray-400 hover:text-white disabled:opacity-50"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No requests found.</p>
        </div>
      )}

      {/* Message Modal */}
      {selectedRequest && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          otherUser={selectedRequest.toUserId === user?.id ? selectedRequest.fromUser : selectedRequest.toUser}
        />
      )}
    </div>
  );
};

export default SwapRequests;