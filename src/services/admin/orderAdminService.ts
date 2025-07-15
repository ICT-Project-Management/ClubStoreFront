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

export const downloadOrderDoc = async (orderId: number) => {
  const auth = useAuthStore()
  const response = await axios.get(`${API}/orders/${orderId}/export-doc`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    responseType: 'blob',
  })
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `order_${orderId}.docx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const downloadMonthlyOrderExcel = async (month: string) => {
  const auth = useAuthStore()
  const response = await axios.get(`${API}/orders/export-excel`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    params: { month },
    responseType: 'blob',
  })

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `orders_${month}.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
