import axios from 'axios';

const API = axios.create({
    baseURL: 'http://34.237.55.18:4000/api/v1/auth',
})

export const registerUser = (data) => API.post('/register',data);
export const loginUser = (data) => API.post('/login', data);
export const getUserProfileById = (id, token) => API.get(`/${id}`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const getAllUsers = (token) =>
  API.get("/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });