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

export const getAddress = () => {
  return axios.get(`${API}/user/address`, getAuthHeaders())
}

export const updateAddress = (data: any) => {
  return axios.post(`${API}/user/address`, data, getAuthHeaders())
}

export const addOrders = (data: any) => {
  return axios.post(`${API}/user/order`, data, getAuthHeaders())
}

export const getOrders = () => {
  return axios.get(`${API}/user/order`, getAuthHeaders())
}

export const cancelOrder = (orderId: number) => {
  return axios.put(`${API}/user/order/${orderId}`, {}, getAuthHeaders())
}

export const getPendingOrders = () => {
  return axios.get(`${API}/user/order/pending`, getAuthHeaders())
}