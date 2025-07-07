import { defineStore } from 'pinia'
import { login as loginApi, register as registerApi , getUser} from '../services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: localStorage.getItem('token') as string | null
  }),
  actions: {
    async init() {
      if (this.token && !this.user) {
        try {
          const res = await getUser()
          this.user = res.data.user
        } catch (error) {
          console.error('Token không hợp lệ hoặc hết hạn:', error)
          this.logout()
        }
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
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})
