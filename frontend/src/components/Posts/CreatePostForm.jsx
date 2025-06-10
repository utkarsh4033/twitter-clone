import { useState } from "react";
import { useCreatePost } from "../../query/usePosts";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function CreatePostForm() {
  const { user, token } = useSelector((state) => state.auth);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const mutation = useCreatePost(token);

  const handleSubmit = () => {
    if (!content.trim()) return;

    const formData = new FormData();
    formData.append("posts_content", content);
    if (image) {
      formData.append("posts_photo_url", image);
    }

    mutation.mutate(formData, {
      onSuccess: () => {
        setContent("");
        setImage(null);
        toast.success("Post created successfully!");
      },
      onError: (error) => {
        const msg = error?.response?.data?.error || "Failed to post!";
        toast.error(msg);
      },
    });
  };

  return (
    <div className="border-b border-gray-200 px-4 py-4">
      <div className="flex space-x-3">
        <div className="w-32 h-32 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
          <span className="text-3xl font-bold text-white">
            {user?.users_name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full text-xl placeholder-gray-500 resize-none border-none outline-none bg-transparent min-h-[50px]"
            rows="3"
          />

          {image && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="max-w-xs rounded"
              />
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-4 text-blue-500">
              <input
                type="file"
                accept="image/*"
                id="image-upload"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <label
                htmlFor="image-upload"
                className="hover:bg-blue-50 p-2 rounded-full transition-colors duration-200 cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              {content.length > 0 && (
                <div className="text-sm text-gray-500">
                  {280 - content.length}
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || content.length <5 || content.length > 280}
                className="bg-blue-500 text-white px-6 py-1.5 rounded-full font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {mutation.isPending ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
