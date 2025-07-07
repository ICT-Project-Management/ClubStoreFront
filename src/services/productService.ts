import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

export const fetchClothes = (name = '') => {
  const query = name ? `?name=${name}` : ''
  return axios.get(`${API}/detail-clothes${query}`)
}

export const fetchPresents = (name = '') => {
    const query = name ? `?name=${name}` : ''
    return axios.get(`${API}/detail-present${query}`)
}
