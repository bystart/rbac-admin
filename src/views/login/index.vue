<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">RBAC Admin</h3>
      </div>

      <el-form-item prop="username">
        <el-input
          ref="usernameRef"
          v-model="loginForm.username"
          placeholder="用户名"
          type="text"
          tabindex="1"
          :prefix-icon="User"
          size="large"
          autocomplete="on"
          @keyup.enter="handleUsernameEnter"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          ref="passwordRef"
          v-model="loginForm.password"
          placeholder="密码"
          :type="passwordVisible ? 'text' : 'password'"
          tabindex="2"
          :prefix-icon="Lock"
          size="large"
          autocomplete="on"
          @keyup.enter="handleLogin"
        >
          <template #suffix>
            <el-icon 
              class="cursor-pointer" 
              @click="passwordVisible = !passwordVisible"
            >
              <component :is="passwordVisible ? View : Hide" />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        size="large"
        class="login-button"
        @click="handleLogin"
      >
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock, View, Hide } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const usernameRef = ref<HTMLInputElement>()
const passwordRef = ref<HTMLInputElement>()
const loading = ref(false)
const passwordVisible = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleUsernameEnter = () => {
  passwordRef.value?.focus()
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    loading.value = true
    await loginFormRef.value.validate()
    
    // 登录
    await userStore.login(loginForm.username, loginForm.password)
    
    // 获取用户信息
    await userStore.getUserInfo()
    
    ElMessage.success('登录成功')
    
    // 获取重定向地址，如果没有则跳转到首页
    const redirect = route.query.redirect?.toString()
    router.push(redirect || '/')
  } catch (error: any) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #8e9eab, #eef2f3);

  .login-form {
    position: relative;
    width: 420px;
    max-width: 100%;
    padding: 40px 35px;
    margin: 0 auto;
    overflow: hidden;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .title-container {
      position: relative;
      text-align: center;
      margin-bottom: 40px;

      .title {
        font-size: 26px;
        color: #333;
        margin: 0;
        font-weight: bold;
      }
    }

    :deep(.el-input) {
      height: 48px;
      
      input {
        height: 48px;
      }
    }

    .login-button {
      width: 100%;
      margin-top: 10px;
    }
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style> 