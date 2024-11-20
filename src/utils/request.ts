import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API as string,
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    // 如果是二进制数据，直接返回
    if (response.config.responseType === 'blob') {
      return res
    }

    // 正常响应
    if (res.code === 200) {
      return res
    }

    // token过期
    if (res.code === 401) {
      const userStore = useUserStore()
      ElMessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userStore.resetState()
        window.location.reload()
      })
      return Promise.reject(new Error(res.message || '登录状态已过期'))
    }

    // 其他错误
    ElMessage.error(res.message || '系统错误')
    return Promise.reject(new Error(res.message || '系统错误'))
  },
  (error) => {
    ElMessage.error(error.message || '系统错误')
    return Promise.reject(error)
  }
)

export default service 