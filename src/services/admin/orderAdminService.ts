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

const buildQuery = (filters: Record<string, any>) => {
  const query: Record<string, any> = {}
  for (const key in filters) {
    if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
      query[key] = filters[key]
    }
  }
  return query
}

export const getOrders = (filters: {
  date_from?: string
  date_to?: string
  price_min?: string | number
  price_max?: string | number
} = {}) => {
  const queryParams = buildQuery(filters)
  return axios.get(`${API}/order/list`, {
    ...getAuthHeaders(),
    params: queryParams,
  })
}

export const updateStatus = (id: number, status: string) => {
  return axios.put(`${API}/order/list/${id}`, { status }, getAuthHeaders())
}
