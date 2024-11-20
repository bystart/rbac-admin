import request from '@/utils/request'

// 角色查询参数类型
export interface RoleQueryParams {
  roleName?: string
  current?: number
  size?: number
}

// 角色信息类型
export interface RoleInfo {
  id: number
  roleName: string
  roleCode: string
  description: string
  status: number
  createTime: string
  updateTime: string
}

// 角色表单类型
export interface RoleForm {
  id?: number
  roleName: string
  roleCode: string
  description?: string
  status: number
}

// 获取角色分页列表
export function getRolePage(params: RoleQueryParams) {
  return request({
    url: '/role/page',
    method: 'get',
    params
  })
}

// 获取角色的权限ID列表
export function getRolePermIds(roleId: number) {
  return request({
    url: `/permission/role/${roleId}`,
    method: 'get'
  })
}

// 新增角色
export function addRole(data: RoleForm) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

// 修改角色
export function updateRole(data: RoleForm) {
  return request({
    url: '/role',
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole(id: number) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}

// 分配权限
export function assignRolePerms(roleId: number, permIds: number[]) {
  return request({
    url: `/role/${roleId}/permissions`,
    method: 'post',
    data: permIds
  })
}

// 获取所有角色列表（不分页）
export function getRoleList() {
  return request({
    url: '/role/list',
    method: 'get'
  })
} 