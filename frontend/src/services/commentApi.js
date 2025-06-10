import axios from "axios";
const API = "http://localhost:4000/api/v1/comments/";
export const getCommentByPost = (postId) => axios.get(`${API}post/${postId}`);
export const createComment = (data, token) =>
  axios.post(API, data, { headers: { Authorization: `Bearer ${token}` } });


export const deleteComment = (id, token) =>
  axios.delete(`${API}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
