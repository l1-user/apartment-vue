<template>
  <div class="system-page">
    <div class="page-header">
      <h2>操作日志审计</h2>
    </div>
    
    <div class="page-content">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="操作人">
          <el-input v-model="searchForm.operName" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="searchForm.startTime" type="datetime" placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="searchForm.endTime" type="datetime" placeholder="选择结束时间" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="操作人" />
        <el-table-column prop="operTime" label="操作时间" />
        <el-table-column prop="operation" label="操作描述" />
        <el-table-column prop="requestUrl" label="请求URL" />
        <el-table-column prop="method" label="请求方法" width="100" />
        <el-table-column label="操作结果" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ipAddress" label="IP地址" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/api/axios'

const tableData = ref<any[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchForm = ref({
  operName: '',
  startTime: null as Date | null,
  endTime: null as Date | null
})

const formatDate = (date: Date | null): string => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const loadData = async () => {
  try {
    const params: any = {
      pageNum: pageNum.value,
      pageSize: pageSize.value
    }
    
    if (searchForm.value.operName) {
      params.operName = searchForm.value.operName
    }
    
    if (searchForm.value.startTime) {
      params.startTime = formatDate(searchForm.value.startTime)
    }
    
    if (searchForm.value.endTime) {
      params.endTime = formatDate(searchForm.value.endTime)
    }
    
    const response = await request.get('/sysOperLog/page', { params })
    
    if (response && response.success !== undefined) {
      tableData.value = response.data || []
      total.value = response.total || 0
    }
  } catch (error: any) {
    console.error('加载操作日志失败:', error)
    tableData.value = []
    total.value = 0
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
  searchForm.value = {
    operName: '',
    startTime: null,
    endTime: null
  }
  pageNum.value = 1
  loadData()
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
