<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="search-wrapper">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-wrapper">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">新增用户</el-button>
      </div>

      <el-table v-loading="loading" :data="userList">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleUpdate(row)">编辑</el-button>
            <el-button type="primary" link @click="handleAssignRoles(row)">分配角色</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.current"
          v-model:page-size="queryParams.size"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!form.id">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      v-model="roleDialog.visible"
      width="500px"
    >
      <el-form label-width="80px">
        <el-form-item label="角色">
          <el-checkbox-group v-model="roleDialog.selectedRoles">
            <el-checkbox
              v-for="role in roleDialog.roleList"
              :key="role.id"
              :label="role.id"
            >
              {{ role.roleName }}
              <el-tag size="small" type="info" class="role-tag">
                {{ role.roleCode }}
              </el-tag>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="roleDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="handleAssignRolesSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getUserPage,
  addUser,
  updateUser,
  deleteUser,
  assignUserRoles,
  type UserQueryParams,
  type UserInfo,
  type UserForm
} from '@/api/system/user'
import { getRolePage } from '@/api/system/role'

// 查询参数
const queryParams = reactive<UserQueryParams>({
  username: '',
  status: undefined,
  current: 1,
  size: 10
})

// 表格数据
const loading = ref(false)
const userList = ref<UserInfo[]>([])
const total = ref(0)

// 表单对话框
const dialog = reactive({
  visible: false,
  title: ''
})

// 表单数据
const formRef = ref<FormInstance>()
const form = reactive<UserForm>({
  username: '',
  nickname: '',
  password: '',
  email: '',
  phone: '',
  status: 1
})

// 表单校验规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 角色对话框数据
const roleDialog = reactive({
  visible: false,
  userId: 0,
  roleList: [] as RoleInfo[],
  selectedRoles: [] as number[]
})

// 获取用户列表
const getList = async () => {
  try {
    loading.value = true
    const { data } = await getUserPage(queryParams)
    userList.value = data.records
    total.value = data.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  queryParams.current = 1
  getList()
}

// 重置查询
const resetQuery = () => {
  queryParams.username = ''
  queryParams.status = undefined
  handleQuery()
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    username: '',
    nickname: '',
    password: '',
    email: '',
    phone: '',
    status: 1
  })
}

// 新增用户
const handleAdd = () => {
  dialog.title = '新增用户'
  dialog.visible = true
}

// 修改用户
const handleUpdate = (row: UserInfo) => {
  dialog.title = '修改用户'
  dialog.visible = true
  Object.assign(form, row)
  form.password = undefined
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (form.id) {
      await updateUser(form)
      ElMessage.success('修改成功')
    } else {
      await addUser(form)
      ElMessage.success('新增成功')
    }
    
    dialog.visible = false
    getList()
  } catch (error: any) {
    console.error('提交失败:', error)
    ElMessage.error(error.message || '提交失败')
  }
}

// 删除用户
const handleDelete = (row: UserInfo) => {
  ElMessageBox.confirm('确认要删除该用户吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteUser(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error: any) {
      console.error('删除失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  })
}

// 分配角色
const handleAssignRoles = async (row: UserInfo) => {
  try {
    roleDialog.userId = row.id
    // 获取所有角色列表
    const { data } = await getRolePage({
      current: 1,
      size: 100
    })
    roleDialog.roleList = data.records
    // 设置当前用户的角色（如果后端返回了用户的角色信息）
    roleDialog.selectedRoles = row.roles || []
    roleDialog.visible = true
  } catch (error: any) {
    console.error('获取角色数据失败:', error)
    ElMessage.error(error.message || '获取角色数据失败')
  }
}

// 提交分配角色
const handleAssignRolesSubmit = async () => {
  try {
    await assignUserRoles(roleDialog.userId, roleDialog.selectedRoles)
    ElMessage.success('分配角色成功')
    roleDialog.visible = false
    // 刷新用户列表，获取最新的角色信息
    getList()
  } catch (error: any) {
    console.error('分配角色失败:', error)
    ElMessage.error(error.message || '分配角色失败')
  }
}

// 分页方法
const handleSizeChange = (val: number) => {
  queryParams.size = val
  getList()
}

const handleCurrentChange = (val: number) => {
  queryParams.current = val
  getList()
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;

  .search-wrapper {
    margin-bottom: 20px;
  }

  .table-wrapper {
    .toolbar {
      margin-bottom: 20px;
    }

    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}

.role-tag {
  margin-left: 8px;
}
</style> 