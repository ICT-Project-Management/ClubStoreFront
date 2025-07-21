import { defineStore } from 'pinia'
import { login as loginApi, register as registerApi , getUser} from '../services/authService'
import axios from 'axios'
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: localStorage.getItem('token') as string | null
  }),
  actions: {
    async fetchUser() {
      if (!this.token || this.user) return

      try {
        const res = await axios.get('http://127.0.0.1:8000/api/user/profile', {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        this.user = res.data
      } catch (err) {
        console.error('Lỗi khi lấy user:', err)
        this.logout()
      }
    },
    async login(credentials: { email: string; password: string }) {
      const res = await loginApi(credentials)
      this.user = res.data.user
      this.token = res.data.token
      localStorage.setItem('token', res.data.token)
    },
    async register(data: any) {
      const res = await registerApi(data)
      this.user = res.data.user
      this.token = res.data.token
      localStorage.setItem('token', res.data.token)
    },
    async setTokenAndFetchUser(token: string) {
      this.token = token
      localStorage.setItem('token', token)

      try {
        const res = await getUser()
        this.user = res.data.user || res.data 
      } catch (error) {
        console.error('Token không hợp lệ hoặc hết hạn:', error)
        this.logout()
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})
