import request from '@/utils/request'

// 权限信息类型
export interface PermissionInfo {
  id: number
  name: string
  parentId: number
  path: string
  permissionCode: string
  type: number
  status: number
  sort: number
  createTime: string
  updateTime: string
  children?: PermissionInfo[]
}

// 权限表单类型
export interface PermissionForm {
  id?: number
  name: string
  parentId?: number
  path?: string
  permissionCode: string
  type: number
  status?: number
  sort?: number
}

// 获取权限树
export function getPermTree() {
  return request({
    url: '/permission/tree',
    method: 'get'
  })
}

// 新增权限
export function addPermission(data: PermissionForm) {
  return request({
    url: '/permission',
    method: 'post',
    data
  })
}

// 修改权限
export function updatePermission(data: PermissionForm) {
  return request({
    url: '/permission',
    method: 'put',
    data
  })
}

// 删除权限
export function deletePermission(id: number) {
  return request({
    url: `/permission/${id}`,
    method: 'delete'
  })
} 