import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, deletePost, getAllPosts } from "../services/postApi";
import axios from "axios";

export const usePosts = () =>
  useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

export const useCreatePost = (token) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createPost(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};


export const useUpdatePost = (token) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, formData }) =>
      axios.put(`http://localhost:4000/api/v1/posts/${postId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });
};

// export const useDeletePost = (token) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id) =>
//       axios.delete(`http://localhost:4000/api/v1/posts/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['posts']);
//     },
//   });
// };

export const useDeletePost = (token) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:(id) => deletePost(id, token),
     onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  })
}


export const useMyPosts = (token) => {
  return useQuery({
    queryKey: ['myPosts'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:4000/api/v1/posts/my-posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });
};