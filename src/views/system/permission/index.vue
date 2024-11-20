<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <el-card class="toolbar-wrapper">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">新增权限</el-button>
      </div>
    </el-card>

    <!-- 表格 -->
    <el-card class="table-wrapper">
      <el-table
        v-loading="loading"
        :data="permList"
        row-key="id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="name" label="权限名称" />
        <el-table-column prop="permissionCode" label="权限编码" />
        <el-table-column prop="path" label="路由地址" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'primary' : 'success'">
              {{ row.type === 1 ? '菜单' : '按钮' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleAdd(row)">新增</el-button>
            <el-button type="primary" link @click="handleUpdate(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 权限表单对话框 -->
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
        label-width="100px"
      >
        <el-form-item label="上级权限">
          <el-tree-select
            v-model="form.parentId"
            :data="permList"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择上级权限"
            clearable
            check-strictly
          />
        </el-form-item>
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入权限名称" />
        </el-form-item>
        <el-form-item label="权限编码" prop="permissionCode">
          <el-input v-model="form.permissionCode" placeholder="请输入权限编码" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path">
          <el-input v-model="form.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="权限类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="显示状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
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
  getPermTree,
  addPermission,
  updatePermission,
  deletePermission,
  type PermissionInfo,
  type PermissionForm
} from '@/api/system/permission'

// 表格数据
const loading = ref(false)
const permList = ref<PermissionInfo[]>([])

// 表单对话框
const dialog = reactive({
  visible: false,
  title: ''
})

// 表单数据
const formRef = ref<FormInstance>()
const form = reactive<PermissionForm>({
  name: '',
  permissionCode: '',
  type: 1,
  status: 1,
  sort: 0
})

// 表单校验规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入权限名称', trigger: 'blur' }
  ],
  permissionCode: [
    { required: true, message: '请输入权限编码', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择权限类型', trigger: 'change' }
  ]
}

// 获取权限树
const getList = async () => {
  try {
    loading.value = true
    const { data } = await getPermTree()
    permList.value = data
  } catch (error) {
    console.error('获取权限列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    name: '',
    permissionCode: '',
    path: '',
    type: 1,
    status: 1,
    sort: 0,
    parentId: undefined
  })
}

// 新增权限
const handleAdd = (row?: PermissionInfo) => {
  dialog.title = '新增权限'
  dialog.visible = true
  if (row) {
    form.parentId = row.id
  }
}

// 修改权限
const handleUpdate = (row: PermissionInfo) => {
  dialog.title = '修改权限'
  dialog.visible = true
  Object.assign(form, row)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (form.id) {
      await updatePermission(form)
      ElMessage.success('修改成功')
    } else {
      await addPermission(form)
      ElMessage.success('新增成功')
    }
    
    dialog.visible = false
    getList()
  } catch (error: any) {
    console.error('提交失败:', error)
    ElMessage.error(error.message || '提交失败')
  }
}

// 删除权限
const handleDelete = (row: PermissionInfo) => {
  ElMessageBox.confirm('确认要删除该权限吗？删除后子权限也会被删除！', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deletePermission(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error: any) {
      console.error('删除失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  })
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;

  .toolbar-wrapper {
    margin-bottom: 20px;
  }

  .table-wrapper {
    margin-bottom: 20px;
  }
}
</style> 