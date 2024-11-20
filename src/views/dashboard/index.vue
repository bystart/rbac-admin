<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>用户总数</span>
              <el-icon><User /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.userCount || 0 }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>角色总数</span>
              <el-icon><UserFilled /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.roleCount || 0 }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>权限总数</span>
              <el-icon><Lock /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.permissionCount || 0 }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>在线用户</span>
              <el-icon><Monitor /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.onlineCount || 0 }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, UserFilled, Lock, Monitor } from '@element-plus/icons-vue'

interface Statistics {
  userCount: number
  roleCount: number
  permissionCount: number
  onlineCount: number
}

const statistics = ref<Statistics>({
  userCount: 0,
  roleCount: 0,
  permissionCount: 0,
  onlineCount: 0
})

// TODO: 获取统计数据
const getStatistics = async () => {
  // 模拟数据
  statistics.value = {
    userCount: 100,
    roleCount: 10,
    permissionCount: 50,
    onlineCount: 5
  }
}

onMounted(() => {
  getStatistics()
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;

  .dashboard-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      color: #333;
    }

    .card-content {
      text-align: center;
      padding: 20px 0;

      .number {
        font-size: 36px;
        font-weight: bold;
        color: #409EFF;
      }
    }
  }
}
</style> 