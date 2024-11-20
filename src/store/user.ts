import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '@/api/auth'
import type { UserInfo } from '@/api/auth'

interface UserState {
  token: string
  userInfo: Partial<UserInfo>
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    userInfo: {}
  }),

  getters: {
    username: (state) => state.userInfo.username,
    roles: (state) => state.userInfo.roles || [],
    permissions: (state) => state.userInfo.permissions || []
  },

  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },

    setUserInfo(userInfo: Partial<UserInfo>) {
      this.userInfo = userInfo
    },

    async login(username: string, password: string) {
      try {
        const res = await login({ username, password })
        if (res.code === 200 && res.data) {
          this.setToken(res.data)
          return res.data
        } else {
          throw new Error(res.message || '登录失败')
        }
      } catch (error) {
        throw error
      }
    },

    async getUserInfo() {
      try {
        const { data } = await getUserInfo()
        this.setUserInfo(data)
        return data
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        await logout()
        this.resetState()
      } catch (error) {
        throw error
      }
    },

    resetState() {
      this.token = ''
      this.userInfo = {}
      localStorage.removeItem('token')
    }
  }
})
