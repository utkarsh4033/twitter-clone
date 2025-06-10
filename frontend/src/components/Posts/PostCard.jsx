import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import CommentSection from "./CommentSection";
import { useSelector } from "react-redux";
import { useComments } from "../../query/useComments";

function PostCard({ post, token, index = 0 }) {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: commentsData } = useComments(post.posts_id);
  const commentCount = Array.isArray(commentsData?.data) ? commentsData.data.length : 0;

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const toggleComments = (e) => {
    e.stopPropagation();
    setShowComments(!showComments);
  };

  const toggleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <motion.article
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] mb-4"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">

          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
            {post.users_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold text-gray-900 hover:underline cursor-pointer">
                {post.users_name}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 text-sm hover:underline cursor-pointer">
                {formatTimeAgo(post.posts_created_at)}
              </span>
            </div>

            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-4">
              {post.posts_content}
            </div>
            {post.posts_photo_url && (
              <div className="mb-4 -mx-6">
                <img
                  src={`http://localhost:4000/${post.posts_photo_url}`}
                  alt="Post"
                  className="w-full max-h-96 object-cover rounded-lg mx-6"
                  style={{ maxWidth: 'calc(100% - 3rem)' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-100/50 bg-gray-50/30">
        <div className="flex items-center justify-between max-w-md">
          <button
            onClick={toggleComments}
            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200 group"
          >
            <MessageCircle 
              size={18} 
              className="group-hover:scale-110 transition-transform" 
            />
            <span className="text-sm font-medium">{commentCount}</span>
          </button>
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 group ${
              liked 
                ? "text-red-500 bg-red-50" 
                : "text-gray-600 hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <Heart 
              size={18} 
              className={`group-hover:scale-110 transition-transform ${
                liked ? "fill-current" : ""
              }`} 
            />
            <span className="text-sm font-medium">12</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-green-50 text-gray-600 hover:text-green-600 transition-all duration-200 group">
            <Share2 
              size={18} 
              className="group-hover:scale-110 transition-transform" 
            />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {showComments && (
          <motion.div
            className="border-t border-gray-100/50 bg-gray-50/20"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <CommentSection postId={post.posts_id} token={token} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </motion.article>
  );
}

export default PostCard;