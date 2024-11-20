<template>
  <div class="sidebar">
    <div class="logo">
      <el-icon class="logo-icon" :size="32">
        <Monitor />
      </el-icon>
      <span v-show="!isCollapse" class="logo-title">RBAC Admin</span>
    </div>

    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        :collapse-transition="false"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <sidebar-item
          v-for="route in route1"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/app'
import { Monitor } from '@element-plus/icons-vue'
import SidebarItem from './SidebarItem.vue'
import { constantRoutes, route1 } from '@/router'

const route = useRoute()
const appStore = useAppStore()

const isCollapse = computed(() => appStore.sidebar.isCollapse)
// const routes = computed(() => constantRoutes.filter(route => !route.meta?.hidden))
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #2b2f3a;
  overflow: hidden;
}

.logo-icon {
  color: #409EFF;
  margin-right: 12px;
}

.logo-title {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
}

:deep(.el-menu) {
  border: none;
}
</style>
