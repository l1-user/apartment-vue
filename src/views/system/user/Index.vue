<template>
  <div class="system-page">
    <div class="page-header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="openAddModal">新增用户</el-button>
    </div>
    
    <div class="page-content">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="realName" label="真实姓名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="userType" label="用户类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.userType === 8 ? 'info' : 'success'">
              {{ scope.row.userType === 8 ? '租户' : '管理员' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
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
    
    <el-dialog title="用户信息" v-model="showModal" width="500px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" v-if="!formData.id">
          <el-input type="password" v-model="formData.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="formData.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="formData.userType">
            <el-option label="管理员" :value="1" />
            <el-option label="租户" :value="8" />
          </el-select>
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
        <el-button type="primary" @click="saveUser">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/api/axios'

const tableData = ref<any[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showModal = ref(false)
const formData = ref({
  id: '',
  username: '',
  password: '',
  realName: '',
  phone: '',
  email: '',
  userType: 1,
  status: 1
})
const searchForm = ref({
  username: ''
})

const loadData = async () => {
  try {
    const response = await request({
      url: '/api/sysUser/page',
      method: 'get',
      params: { pageNum: pageNum.value, pageSize: pageSize.value, username: searchForm.value.username }
    })
    if (response.success) {
      tableData.value = response.data
      total.value = response.total
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    tableData.value = []
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
  searchForm.value = { username: '' }
  loadData()
}

const openAddModal = () => {
  formData.value = {
    id: '',
    username: '',
    password: '',
    realName: '',
    phone: '',
    email: '',
    userType: 1,
    status: 1
  }
  showModal.value = true
}

const editUser = (row: any) => {
  formData.value = { ...row }
  showModal.value = true
}

const saveUser = async () => {
  try {
    const response = await request({
      url: '/api/sysUser/save',
      method: 'post',
      data: formData.value
    })
    if (response.success) {
      alert(response.message)
      showModal.value = false
      loadData()
    } else {
      alert(response.message)
    }
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败')
  }
}

const deleteUser = async (id: number) => {
  if (confirm('确定要删除吗？')) {
    try {
      const response = await request({
        url: `/api/sysUser/${id}`,
        method: 'delete'
      })
      if (response.success) {
        alert(response.message)
        loadData()
      } else {
        alert(response.message)
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
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