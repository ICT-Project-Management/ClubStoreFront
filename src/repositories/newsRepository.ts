// src/repositories/newsRepository.ts
import axios from 'axios'
import { useAuthStore } from '../store/auth'

const API = import.meta.env.VITE_API_BASE_URL

const getAuthHeaders = () => {
  const auth = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  }
}

export const newsRepository = {
  getAll: (params?: { title?: string; page?: number }) => {
    const queryParams = new URLSearchParams()

    if (params?.title) queryParams.append('title', params.title)
    if (params?.page) queryParams.append('page', String(params.page))

    return axios.get(`${API}/index/news?${queryParams.toString()}`)
  },

  getById: (id: number) => axios.get(`${API}/index/news/${id}`),
  getNewNews: () => axios.get(`${API}/index/new-news`),
  getNewsOnWeek: () => axios.get(`${API}/index/news-onweek`),
  store: (data: any) => axios.post(`${API}/index/news`, data, getAuthHeaders()),
  delete: (id: number) => axios.delete(`${API}/index/news/${id}`, getAuthHeaders())
}
