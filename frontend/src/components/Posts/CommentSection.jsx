import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from "../../query/useComments";
import { MoreHorizontal } from "lucide-react";
import { toast } from "react-toastify";

function CommentSection({ postId }) {
  const { user, token } = useSelector((state) => state.auth);
  const { data, isLoading, refetch } = useComments(postId);
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  const mutationCreate = useCreateComment(token);
  const mutationDelete = useDeleteComment(token, postId);
  const mutationUpdate = useUpdateComment(token, postId);

  useEffect(() => {
    if (mutationUpdate.isError) {
      alert("Failed to update comment: " + mutationUpdate.error?.message);
    }
  }, [mutationUpdate.isError]);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    mutationCreate.mutate(
      {
        comments_description: comment,
        comments_posts_id: postId,
      },
      {
        onError: (error) => {
          const msg = error?.response?.data?.error || "Failed to post comment!";
          toast.error(msg);
        },
        onSuccess: () => {
          setComment("");
        },
      }
    );
  };

  const handleDeleteComment = (commentId) => {
    toast.info(
      <div>
        <div>Are you sure you want to delete this comment?</div>
        <div style={{marginTop:8, display:'flex', gap:8}}>
          <button onClick={() => {
            mutationDelete.mutate(commentId);
            toast.dismiss();
            toast.success("Comment deleted successfully");
          }} style={{background:'#ef4444',color:'#fff',border:'none',padding:'4px 12px',borderRadius:4}}>Delete</button>
          <button onClick={() => toast.dismiss()} style={{background:'#e5e7eb',color:'#111',border:'none',padding:'4px 12px',borderRadius:4}}>Cancel</button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, draggable: false, position: "top-center" }
    );
  };

  const handleUpdateComment = () => {
    if (!editingComment?.comments_description.trim()) return;
    mutationUpdate.mutate(
      {
        id: editingComment.comments_id,
        description: editingComment.comments_description,
      },
      {
        onSuccess: () => {
          setEditingComment(null);
        },
        onError: (error) => {
          const msg = error?.response?.data?.error || "Failed to update comment!";
          toast.error(msg);
        },
      }
    );
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now - past) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500">
        <span className="text-3xl font-bold text-white">
            {user?.users_name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200">
      {editingComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-blur bg-opacity-50 backdrop-blur-sm"
            onClick={() => setEditingComment(null)}
          ></div>
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Comment</h2>
            <textarea
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={editingComment.comments_description}
              onChange={(e) =>
                setEditingComment((prev) => ({
                  ...prev,
                  comments_description: e.target.value,
                }))
              }
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setEditingComment(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateComment}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {data?.data.map((c) => (
        <div
          key={c.comments_id}
          className="flex px-4 py-3 hover:bg-gray-50 group"
        >
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {c?.users_name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 ml-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-bold text-gray-900">{c.users_name}</span>
                <span className="text-gray-500">· {formatTimeAgo(c.comments_created_at)}</span>
              </div>
              {c.comments_users_id === user?.users_id && (
                <div className="relative">
                  <button
                    onClick={() =>
                      setDropdownOpenId(dropdownOpenId === c.comments_id ? null : c.comments_id)
                    }
                    className="text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {dropdownOpenId === c.comments_id && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpenId(null)}
                      ></div>
                      <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-20 w-28">
                        <button
                          onClick={() => {
                            setEditingComment(c);
                            setDropdownOpenId(null);
                          }}
                          className="block px-3 py-2 text-sm hover:bg-gray-100 w-full text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteComment(c.comments_id);
                            setDropdownOpenId(null);
                          }}
                          className="block px-3 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="text-gray-900 mt-1">{c.comments_description}</div>
          </div>
        </div>
      ))}
      <div className="flex px-4 py-3 border-t border-gray-200">
        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3" />
        <div className="flex-1">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Post your reply"
            className="w-full text-xl placeholder-gray-500 resize-none border-none outline-none bg-transparent"
            rows="2"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSubmit}
              disabled={!comment.trim() || comment.length < 2 || comment.length > 200}
              className="bg-blue-500 text-white px-6 py-1.5 rounded-full font-bold hover:bg-blue-600 disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentSection;