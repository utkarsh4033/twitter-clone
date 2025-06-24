import axios from "axios";
const API = "http://34.237.55.18:4000/api/v1/posts/";
export const getAllPosts = () => axios.get(API);
export const createPost = (data, token) =>
  axios.post(API, data, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },
});

export const deletePost = (id, token) => 
  axios.delete(`${API}${id}`,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })

