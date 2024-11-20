import request from '@/utils/request'

// 用户列表查询参数类型
export interface UserQueryParams {
  username?: string
  current?: number
  size?: number
  status?: number
}

// 用户信息类型
export interface UserInfo {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  status: number
  createTime: string
  updateTime: string
}

// 用户表单类型
export interface UserForm {
  id?: number
  username: string
  nickname: string
  password?: string
  email: string
  phone: string
  status: number
}

// 获取用户分页列表
export function getUserPage(params: UserQueryParams) {
  return request({
    url: '/user/page',
    method: 'get',
    params
  })
}

// 新增用户
export function addUser(data: UserForm) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

// 修改用户
export function updateUser(data: UserForm) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

// 删除用户
export function deleteUser(id: number) {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}

// 分配角色
export function assignUserRoles(userId: number, roleIds: number[]) {
  return request({
    url: `/user/${userId}/roles`,
    method: 'post',
    data: roleIds
  })
} 