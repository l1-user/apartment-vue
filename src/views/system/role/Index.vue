<template>
  <div class="system-page">
    <div class="page-header">
      <h2>角色管理</h2>
      <el-button type="primary" @click="openAddModal">新增角色</el-button>
    </div>
    
    <div class="page-content">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleCode" label="角色编码" />
        <el-table-column prop="description" label="角色描述" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="editRole(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    
    <el-dialog title="角色信息" v-model="showModal" width="500px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="formData.roleCode" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" v-model="formData.description" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formData.status">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showModal = false">取消</el-button>
        <el-button type="primary" @click="saveRole">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { sysRoleApi } from '@/api/system'

const tableData = ref<any[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showModal = ref(false)
const formData = ref({
  id: '',
  roleName: '',
  roleCode: '',
  description: '',
  status: 1
})
const searchForm = ref({
  roleName: ''
})

const loadData = async () => {
  const response = await sysRoleApi.page(pageNum.value, pageSize.value, searchForm.value.roleName)
  if (response.success) {
    tableData.value = response.data
    total.value = response.total
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  pageNum.value = val
  loadData()
}

const resetSearch = () => {
  searchForm.value = { roleName: '' }
  loadData()
}

const openAddModal = () => {
  formData.value = {
    id: '',
    roleName: '',
    roleCode: '',
    description: '',
    status: 1
  }
  showModal.value = true
}

const editRole = (row: any) => {
  formData.value = { ...row }
  showModal.value = true
}

const saveRole = async () => {
  const response = await sysRoleApi.save(formData.value)
  if (response.success) {
    alert(response.message)
    showModal.value = false
    loadData()
  } else {
    alert(response.message)
  }
}

const deleteRole = async (id: number) => {
  if (confirm('确定要删除吗？')) {
    const response = await sysRoleApi.delete(id)
    if (response.success) {
      alert(response.message)
      loadData()
    } else {
      alert(response.message)
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.system-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.search-form {
  margin-bottom: 20px;
}

.page-content {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}
</style>