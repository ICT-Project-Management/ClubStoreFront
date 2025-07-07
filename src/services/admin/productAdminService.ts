import axios from 'axios'
import { useAuthStore } from '../../store/auth'

const API = import.meta.env.VITE_API_BASE_URL

const getAuthHeaders = () => {
  const auth = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  }
}

export const getProducts = (name = '') => {
  const query = name ? `?name=${name}` : ''
  return axios.get(`${API}/products${query}`, getAuthHeaders())
}

export const fetchAddDetailClothes = (data: any) => {
  return axios.post(`${API}/detail-clothes`, data, getAuthHeaders())
}

export const fetchAddDetailPresent = (data: any) => {
  return axios.post(`${API}/detail-present`, data, getAuthHeaders())
}

export const getAllClothes = (name = '') => {
  const query = name ? `?name=${name}` : ''
  return axios.get(`${API}/clothes${query}`, getAuthHeaders())
}

export const fetchAddClothes = (data: any) => {
  return axios.post(`${API}/clothes`, data, getAuthHeaders())
}

export const getAllPresents = (name = '') => {
  const query = name ? `?name=${name}` : ''
  return axios.get(`${API}/presents${query}`, getAuthHeaders())
}

export const fetchAddPresent = (data: any) => {
  return axios.post(`${API}/presents`, data, getAuthHeaders())
}
