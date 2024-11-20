export interface UserState {
  token: string
  username: string
  avatar: string
  roles: string[]
  permissions: string[]
}

export interface AppState {
  sidebar: {
    isCollapse: boolean
  }
  routes: any[]
} 