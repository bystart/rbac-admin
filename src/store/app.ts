import { defineStore } from 'pinia'

interface AppState {
  sidebar: {
    isCollapse: boolean
  }
  routes: any[]
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebar: {
      isCollapse: false
    },
    routes: []
  }),

  actions: {
    toggleSidebar() {
      this.sidebar.isCollapse = !this.sidebar.isCollapse
    },

    setRoutes(routes: any[]) {
      this.routes = routes
    }
  }
}) 