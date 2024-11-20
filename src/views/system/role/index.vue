<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="search-wrapper">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
            @keyup.enter="handleQuery"
          />
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
        <el-button type="primary" @click="handleAdd">新增角色</el-button>
      </div>

      <el-table v-loading="loading" :data="roleList">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleCode" label="角色编码" />
        <el-table-column prop="description" label="角色描述" show-overflow-tooltip />
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
            <el-button type="primary" link @click="handleAssignPerms(row)">分配权限</el-button>
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

    <!-- 角色表单对话框 -->
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
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

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      v-model="permDialog.visible"
      width="500px"
    >
      <el-tree
        ref="permTreeRef"
        :data="permDialog.permList"
        :props="{ label: 'name', children: 'children' }"
        show-checkbox
        node-key="id"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="permDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="handleAssignPermsSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { ElTree } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getRolePage,
  getRolePermIds,
  addRole,
  updateRole,
  deleteRole,
  assignRolePerms,
  type RoleQueryParams,
  type RoleInfo,
  type RoleForm
} from '@/api/system/role'
import { getPermTree } from '@/api/system/permission'

// 查询参数
const queryParams = reactive<RoleQueryParams>({
  roleName: '',
  current: 1,
  size: 10
})

// 表格数据
const loading = ref(false)
const roleList = ref<RoleInfo[]>([])
const total = ref(0)

// 表单对话框
const dialog = reactive({
  visible: false,
  title: ''
})

// 表单数据
const formRef = ref<FormInstance>()
const form = reactive<RoleForm>({
  roleName: '',
  roleCode: '',
  description: '',
  status: 1
})

// 表单校验规则
const rules: FormRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  roleCode: [
    { required: true, message: '请输入角色编码', trigger: 'blur' }
  ]
}

// 权限对话框数据
const permDialog = reactive({
  visible: false,
  roleId: 0,
  permList: [] as any[],
})
const permTreeRef = ref<InstanceType<typeof ElTree>>()

// 获取角色列表
const getList = async () => {
  try {
    loading.value = true
    const { data } = await getRolePage(queryParams)
    roleList.value = data.records
    total.value = data.total
  } catch (error) {
    console.error('获取角色列表失败:', error)
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
  queryParams.roleName = ''
  handleQuery()
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    roleName: '',
    roleCode: '',
    description: '',
    status: 1
  })
}

// 新增角色
const handleAdd = () => {
  dialog.title = '新增角色'
  dialog.visible = true
}

// 修改角色
const handleUpdate = (row: RoleInfo) => {
  dialog.title = '修改角色'
  dialog.visible = true
  Object.assign(form, row)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (form.id) {
      await updateRole(form)
      ElMessage.success('修改成功')
    } else {
      await addRole(form)
      ElMessage.success('新增成功')
    }
    
    dialog.visible = false
    getList()
  } catch (error: any) {
    console.error('提交失败:', error)
    ElMessage.error(error.message || '提交失败')
  }
}

// 删除角色
const handleDelete = (row: RoleInfo) => {
  ElMessageBox.confirm('确认要删除该角色吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteRole(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error: any) {
      console.error('删除失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  })
}

// 分配权限
const handleAssignPerms = async (row: RoleInfo) => {
  try {
    permDialog.roleId = row.id
    // 获取权限树
    const { data: permTree } = await getPermTree()
    permDialog.permList = permTree
    // 获取角色已有权限
    const { data: permIds } = await getRolePermIds(row.id)
    // 设置选中节点
    permTreeRef.value?.setCheckedKeys(permIds)
    
    permDialog.visible = true
  } catch (error: any) {
    console.error('获取权限数据失败:', error)
    ElMessage.error(error.message || '获取权限数据失败')
  }
}

// 提交分配权限
const handleAssignPermsSubmit = async () => {
  try {
    const checkedKeys = permTreeRef.value?.getCheckedKeys() || []
    const halfCheckedKeys = permTreeRef.value?.getHalfCheckedKeys() || []
    const permIds = [...checkedKeys, ...halfCheckedKeys] as number[]
    
    await assignRolePerms(permDialog.roleId, permIds)
    ElMessage.success('分配权限成功')
    permDialog.visible = false
  } catch (error: any) {
    console.error('分配权限失败:', error)
    ElMessage.error(error.message || '分配权限失败')
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
</style> 