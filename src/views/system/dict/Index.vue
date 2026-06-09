<template>
  <div class="system-page">
    <div class="page-header">
      <h2>数据字典管理</h2>
      <el-button type="primary" @click="openAddModal">新增字典</el-button>
    </div>
    
    <div class="page-content">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="字典类型">
          <el-input v-model="searchForm.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="dictType" label="字典类型" />
        <el-table-column prop="dictCode" label="字典编码" />
        <el-table-column prop="dictLabel" label="字典标签" />
        <el-table-column prop="dictValue" label="字典值" />
        <el-table-column prop="sortOrder" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="editDict(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteDict(scope.row.id)">删除</el-button>
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
    
    <el-dialog title="字典信息" v-model="showModal" width="500px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="字典类型">
          <el-input v-model="formData.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="字典编码">
          <el-input v-model="formData.dictCode" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label="字典标签">
          <el-input v-model="formData.dictLabel" placeholder="请输入字典标签" />
        </el-form-item>
        <el-form-item label="字典值">
          <el-input v-model="formData.dictValue" placeholder="请输入字典值" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input type="number" v-model="formData.sortOrder" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formData.status">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showModal = false">取消</el-button>
        <el-button type="primary" @click="saveDict">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { sysDictApi } from '@/api/system'

const tableData = ref<any[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showModal = ref(false)
const formData = ref({
  id: '',
  dictType: '',
  dictCode: '',
  dictLabel: '',
  dictValue: '',
  sortOrder: 0,
  status: 1,
  remark: ''
})
const searchForm = ref({
  dictType: ''
})

const loadData = async () => {
  const response = await sysDictApi.page(pageNum.value, pageSize.value, searchForm.value.dictType)
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
  searchForm.value = { dictType: '' }
  loadData()
}

const openAddModal = () => {
  formData.value = {
    id: '',
    dictType: '',
    dictCode: '',
    dictLabel: '',
    dictValue: '',
    sortOrder: 0,
    status: 1,
    remark: ''
  }
  showModal.value = true
}

const editDict = (row: any) => {
  formData.value = { ...row }
  showModal.value = true
}

const saveDict = async () => {
  const response = await sysDictApi.save(formData.value)
  if (response.success) {
    alert(response.message)
    showModal.value = false
    loadData()
  } else {
    alert(response.message)
  }
}

const deleteDict = async (id: number) => {
  if (confirm('确定要删除吗？')) {
    const response = await sysDictApi.delete(id)
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