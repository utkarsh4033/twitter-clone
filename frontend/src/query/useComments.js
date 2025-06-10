import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, getCommentByPost, deleteComment } from "../services/commentApi";
import axios from "axios";
export const useComments = (postId) =>
  useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentByPost(postId),
    enabled: !!postId, 
  });

export const useCreateComment = (token) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createComment(data, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.comments_posts_id],
      });
    },
  });
};

export const useUpdateComment = (token, postId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, description }) =>
      axios.put(`http://localhost:4000/api/v1/comments/${id}`, {
        comments_description: description,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
    },
  });
};


export const useDeleteComment = (token, postId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteComment(id, token),
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', postId]);
      },
});
};

