import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;
export const login = (data: { email: string; password: string }) =>
  axios.post(`${API}/auth/login`, data)

export const register = (data: any) =>
  axios.post(`${API}/auth/register`, data)

export const getUser = () =>
  axios.get(`${API}/user/profile`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })