import { useSelector } from "react-redux";
import { useMyPosts, useDeletePost, useUpdatePost } from "../query/usePosts";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MoreHorizontal, Edit3, Trash2, MapPin, ExternalLink, X, Heart, MessageCircle, Share2 } from "lucide-react";
import Navbar from "../components/Navbar";
import EditPostModal from "../components/EditPostModel";
import CommentSection from "../components/Posts/CommentSection";
import { toast } from "react-toastify";

export default function Profile() {
  const [showComments, setShowComments] = useState({});
  const { user, token } = useSelector((state) => state.auth);
  const { data: posts, isLoading, refetch } = useMyPosts(token);
  const deletePostMutation = useDeletePost(token);
  const updatePostMutation = useUpdatePost(token);
  const [showDropdown, setShowDropdown] = useState(false);
  const [liked, setLiked] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editPhoto, setEditPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.users_photo_url ? `http://localhost:4000/${user.users_photo_url}` : '');
  const [photo, setPhoto] = useState(user?.users_photo_url || null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (photo && typeof photo !== 'string') {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(photo);
    } else if (typeof photo === 'string') {
      setPreviewUrl(`http://localhost:4000/${photo}`);
    }
  }, [photo]);
  const handleDropdownToggle = (postId) => {
    setOpenDropdown(openDropdown === postId ? null : postId);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setEditContent(post.posts_content);
    setEditPhoto(post.posts_photo_url || null);
    setOpenDropdown(null);
  };

  const handleDelete = async (postId) => {
    toast.info(
      <div>
        <div>Are you sure you want to delete this post?</div>
        <div style={{marginTop:8, display:'flex', gap:8}}>
          <button onClick={async () => {
            try {
              await deletePostMutation.mutateAsync(postId);
              setOpenDropdown(null);
              refetch();
              toast.dismiss();
              toast.success("Post deleted successfully");
            } catch (error) {
              toast.dismiss();
              toast.error("Failed to delete post");
            }
          }} style={{background:'#ef4444',color:'#fff',border:'none',padding:'4px 12px',borderRadius:4}}>Delete</button>
          <button onClick={() => toast.dismiss()} style={{background:'#e5e7eb',color:'#111',border:'none',padding:'4px 12px',borderRadius:4}}>Cancel</button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, draggable: false, position: "top-center" }
    );
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleLike = (postId) => {
    setLiked(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900" initial="hidden" animate="visible">
      <AnimatePresence>
        {editingPost && (
          <motion.div
            className="fixed inset-0 bg-blur bg-opacity-30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto flex">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Navbar />
        </motion.div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-4 z-10 shadow-sm">
          <h1 className="text-xl font-bold">Profile</h1>
        </div>

        <motion.div 
          className="relative mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl mx-4 -mt-16 relative z-10 p-6 shadow-xl border border-white/20">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg -mt-8">
                <span className="text-2xl font-bold text-white">
                  {user?.users_name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 pt-2">
                <h2 className="text-2xl font-bold text-gray-900">{user?.users_name}</h2>
                <p className="text-gray-600">@{user?.users_name?.toLowerCase().replace(/\s+/g, "")}</p>
                <div className="flex items-center gap-4 mt-3 text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>some where on earth</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ExternalLink size={14} />
                    <span>{user?.users_email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">Posts:</span>
                    <span>{Array.isArray(posts) ? posts.length : 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Section */}
        <div className="px-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Posts</h3>
            <p className="text-gray-600 text-sm">Share your thoughts with the world</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full"></div>
            </div>
          ) : posts?.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <motion.div
                  key={post.posts_id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="p-6 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {user?.users_name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{user?.users_name}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 text-sm">
                            {new Date(post.posts_created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-800 leading-relaxed">{post.posts_content}</p>
                      </div>
                    
                      <div className="relative">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          onClick={() => handleDropdownToggle(post.posts_id)}
                        >
                          <MoreHorizontal size={16} className="text-gray-500" />
                        </button>
                        <AnimatePresence>
                          {openDropdown === post.posts_id && (
                            <motion.div
                              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden"
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            >
                              <button
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                onClick={() => handleEdit(post)}
                              >
                                <Edit3 size={16} className="text-blue-500" />
                                <span className="text-gray-700">Edit Post</span>
                              </button>
                              <button
                                className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 flex items-center gap-3 transition-colors"
                                onClick={() => handleDelete(post.posts_id)}
                              >
                                <Trash2 size={16} />
                                <span>Delete Post</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    {post.posts_photo_url && (
                      <div className="mt-4 -mx-6">
                        <img
                          src={`http://localhost:4000/${post.posts_photo_url}`}
                          alt="Post"
                          className="w-full max-h-96 object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="px-6 py-4 border-t border-gray-100/50 bg-gray-50/30">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleComments(post.posts_id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200 group"
                      >
                        <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">2</span>
                      </button>

                      <button
                        onClick={() => toggleLike(post.posts_id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 group ${
                          liked[post.posts_id] 
                            ? "text-red-500 bg-red-50" 
                            : "text-gray-600 hover:text-red-500 hover:bg-red-50"
                        }`}
                      >
                        <Heart 
                          size={18} 
                          className={`group-hover:scale-110 transition-transform ${
                            liked[post.posts_id] ? "fill-current" : ""
                          }`} 
                        />
                        <span className="text-sm font-medium">12</span>
                      </button>

                      <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-green-50 text-gray-600 hover:text-green-600 transition-all duration-200 group">
                        <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {showComments[post.posts_id] && (
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
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">No posts yet</h3>
              <p className="text-gray-600">Share your first thought with the world!</p>
            </motion.div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {editingPost && (
          <EditPostModal 
            post={editingPost} 
            onClose={() => setEditingPost(null)} 
            token={token} 
            onSuccess={() => { refetch(); }} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}