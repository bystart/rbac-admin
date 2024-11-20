import request from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  code: number
  message: string
  data: string
}

export interface UserInfo {
  user: {
    id: number
    username: string
    nickname: string
    avatar: string
    roles: string[]
    permissions: string[]
  },
  roles: []
}

export const login = (data: LoginParams) => {
  return request.post<LoginResult>('/auth/login', data)
}

export const getUserInfo = () => {
  return request.get<UserInfo>('/auth/info')
}

export const logout = () => {
  return request.post('/auth/logout')
}
