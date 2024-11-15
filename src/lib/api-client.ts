export type Comment = {
  id: string;
  content: string;
  userId: string;
  blogSlug: string;
  parentId: string | null;
  likes: number;
  likedBy: string[];
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    image: string | null;
    email: string | null;
  };
  replies?: Comment[];
  _count?: {
    replies: number;
  };
};

export const commentApi = {
  async getComments(blogSlug: string, sortBy: 'newest' | 'oldest' | 'mostLiked' = 'newest'): Promise<Comment[]> {
    try {
      const response = await fetch(`/api/comments?blogSlug=${encodeURIComponent(blogSlug)}&sort=${sortBy}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      return data.map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      return [];
    }
  },

  async createComment(data: {
    blogSlug: string;
    content: string;
    parentId?: string | null;
  }): Promise<Comment> {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create comment');
    }
    
    return response.json();
  },

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete comment');
    }
  },

  async toggleLike(commentId: string, userId: string): Promise<{ likes: number }> {
    const response = await fetch(`/api/comments/${commentId}/like`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to toggle like');
    }
    
    return response.json();
  },

  async getCommentCount(blogSlug: string): Promise<number> {
    try {
      const response = await fetch(`/api/comments/count?blogSlug=${encodeURIComponent(blogSlug)}`);
      if (!response.ok) throw new Error('Failed to get comment count');
      const { count } = await response.json();
      return count;
    } catch (error) {
      console.error('Failed to get comment count:', error);
      return 0;
    }
  },
}; 