'use client';

import { useState } from 'react';
import { Comment } from '@/lib/api-client';
import { useUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, TrashIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { ReplyIcon } from 'lucide-react';

interface CommentSectionProps {
  comments: Comment[];
  commentCount: number;
  onCommentSubmit: (content: string, parentId?: string) => Promise<void>;
  onCommentDelete: (commentId: string) => Promise<void>;
  onCommentLike: (commentId: string) => Promise<void>;
  currentUser: User | null | undefined;
}

export function CommentSection({
  comments,
  commentCount,
  onCommentSubmit,
  onCommentDelete,
  onCommentLike,
  currentUser
}: CommentSectionProps): JSX.Element {
  const { user } = useUser();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onCommentSubmit(newComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onCommentSubmit(replyContent, parentId);
      setReplyContent('');
      setReplyTo(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CommentCard = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const isLiked = comment.likedBy?.includes(currentUser?.id || '');
    const isAuthor = currentUser?.id === comment.userId;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative ${depth > 0 ? 'ml-16' : ''}`}
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.04)] transition-all duration-500 ease-out">
          {/* Comment Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <img
                  src={comment.user?.image || '/default-avatar.png'}
                  alt={comment.user?.name || 'Anonymous'}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-violet-100/30 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 tracking-tight">
                  {comment.user?.name || 'Anonymous'}
                </h4>
                <p className="text-sm text-gray-400 font-medium">
                  {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
            </div>
            
            {isAuthor && (
              <button
                onClick={() => onCommentDelete(comment.id)}
                className="text-gray-300 hover:text-red-400 transition-colors duration-300"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Comment Content */}
          <p className="text-gray-600 mb-8 leading-relaxed font-medium">{comment.content}</p>

          {/* Comment Actions */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onCommentLike(comment.id)}
              className={`flex items-center gap-2 ${
                isLiked ? 'text-violet-500' : 'text-gray-300 hover:text-violet-500'
              } transition-all duration-300`}
              disabled={!currentUser}
            >
              {isLiked ? (
                <HeartSolidIcon className="w-5 h-5" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
              <span className="text-sm font-semibold">{comment.likes}</span>
            </button>

            {currentUser && (
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="flex items-center gap-2 text-gray-300 hover:text-violet-500 transition-all duration-300"
              >
                <ReplyIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">Reply</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          <AnimatePresence>
            {replyTo === comment.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8"
              >
                <div className="flex gap-5">
                  <img
                    src={currentUser?.imageUrl || '/default-avatar.png'}
                    alt="Your avatar"
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-violet-100/30"
                  />
                  <div className="flex-1">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/20 text-gray-600 resize-none transition-all duration-300"
                      rows={3}
                    />
                    <div className="flex justify-end mt-4 gap-4">
                      <button
                        onClick={() => setReplyTo(null)}
                        className="px-6 py-2.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReply(comment.id)}
                        disabled={isSubmitting}
                        className="px-8 py-2.5 text-sm font-semibold bg-violet-500 text-white rounded-xl hover:bg-violet-600 disabled:opacity-50 transition-all duration-300 shadow-lg shadow-violet-500/20"
                      >
                        {isSubmitting ? 'Sending...' : 'Reply'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-8 space-y-8">
              {comment.replies.map((reply) => (
                <CommentCard key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
          Comments ({commentCount})
        </h2>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="mb-16">
        <div className="flex gap-6">
          <div className="relative group">
            <img
              src={currentUser?.imageUrl || '/default-avatar.png'}
              alt="Your avatar"
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-violet-100/30 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-8 py-6 rounded-3xl border border-gray-100 bg-gray-50/30 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/20 text-gray-600 resize-none transition-all duration-300"
              rows={4}
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-2xl hover:from-violet-700 hover:to-fuchsia-600 disabled:opacity-50 transition-all duration-300 shadow-xl shadow-violet-500/20 transform hover:-translate-y-0.5"
              >
                <span className="font-semibold">{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-10">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}