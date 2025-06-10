import { useState, useEffect } from "react";
import { useUpdatePost } from "../query/usePosts"; 
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function EditPostModal({ post, onClose, token, onSuccess }) {
  const [content, setContent] = useState(post.posts_content || "");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(post.posts_photo_url ? `http://localhost:4000/${post.posts_photo_url}` : null);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(image);
    } else if (post.posts_photo_url) {
      setPreviewUrl(`http://localhost:4000/${post.posts_photo_url}`);
    } else {
      setPreviewUrl(null);
    }
  }, [image, post.posts_photo_url]);

  const updatePostMutation = useUpdatePost(token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }
    if (content.length < 5 || content.length > 280) {
      toast.error("Content must be 5-280 characters");
      return;
    }
    if (/<[^>]*>?/gm.test(content)) {
      toast.error("No HTML tags allowed");
      return;
    }
    if (content.trim().length === 0) {
      toast.error("Content cannot be whitespace only");
      return;
    }

    const formData = new FormData();
    formData.append("posts_content", content);
    if (image) {
      formData.append("posts_photo_url", image);
    }

    try {
      await updatePostMutation.mutateAsync({ postId: post.posts_id, formData });
      onClose();
      onSuccess(); 
    } catch (error) {
      const msg = error?.response?.data?.error || "Failed to update post.";
      toast.error(msg);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
      >
        <h2 className="text-lg font-semibold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          {previewUrl && (
            <div className="mb-2">
              <img src={previewUrl} alt="Preview" className="max-h-60 rounded" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm"
          />
          <div className="flex justify-end gap-3">
          {content.length > 0 && (
                <div className="text-sm text-gray-500">
                  {280 - content.length}
                </div>
              )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() || content.length <5 || content.length > 280}
              className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
