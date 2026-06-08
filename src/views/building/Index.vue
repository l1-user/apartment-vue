<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElMessage, ElPagination, ElCard, ElRow, ElCol } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { Building } from '@/types'
import { buildingApi } from '@/api/building'
import { storeApi } from '@/api/store'

const buildings = ref<Building[]>([])
const stores = ref<any[]>([])
const dialogVisible = ref(false)
const editDialogVisible = ref(false)

const form = ref<Building>({
  buildingName: '',
  storeId: 0,
  address: '',
  totalFloors: 1
})

const editForm = ref<Building>({
  buildingName: '',
  storeId: 0,
  address: '',
  totalFloors: 1
})

const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})

const filters = ref({
  storeId: undefined as number | undefined
})

const rules = computed(() => ({
  buildingName: [{ required: true, message: '请输入楼栋名称', trigger: 'blur' }],
  storeId: [{ required: true, message: '请选择门店', trigger: 'change' }],
  totalFloors: [{ required: true, message: '请输入楼层数', trigger: 'blur' }]
}))

const loadData = async () => {
  try {
    const response = await buildingApi.getPage({
      current: pagination.value.current,
      size: pagination.value.size,
      storeId: filters.value.storeId
    })
    buildings.value = response.records || []
    pagination.value.total = response.total || 0
  } catch (error) {
    ElMessage.error('加载楼栋数据失败')
  }
}

const loadStores = async () => {
  try {
    stores.value = await storeApi.getAll()
  } catch (error) {
    ElMessage.error('加载门店数据失败')
  }
}

const handleSearch = () => {
  pagination.value.current = 1
  loadData()
}

const handleAdd = () => {
  form.value = {
    buildingName: '',
    storeId: 0,
    address: '',
    totalFloors: 1
  }
  dialogVisible.value = true
}

const handleEdit = async (building: Building) => {
  try {
    const response = await buildingApi.getById(building.id!)
    editForm.value = response
    editDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取楼栋信息失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    await buildingApi.delete(id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleSave = async () => {
  try {
    await buildingApi.save(form.value)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

const handleUpdate = async () => {
  try {
    await buildingApi.update(editForm.value)
    ElMessage.success('更新成功')
    editDialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const getStoreName = (storeId: number) => {
  const store = stores.value.find((s) => s.id === storeId)
  return store ? store.storeName : '-'
}

onMounted(() => {
  loadData()
  loadStores()
})
</script>

<template>
  <div>
    <ElCard shadow="never" class="mb-4">
      <ElRow :gutter="20" align="middle">
        <ElCol :span="20">
          <div class="flex gap-4 items-center">
            <ElSelect v-model="filters.storeId" placeholder="选择门店" class="w-40" clearable @change="handleSearch">
              <ElOption v-for="store in stores" :key="store.id" :label="store.storeName" :value="store.id" />
            </ElSelect>
            <ElButton type="primary" @click="handleSearch">查询</ElButton>
          </div>
        </ElCol>
        <ElCol :span="4" class="text-right">
          <ElButton type="primary" :icon="Plus" @click="handleAdd">添加楼栋</ElButton>
        </ElCol>
      </ElRow>
    </ElCard>

    <ElCard shadow="never">
      <ElTable :data="buildings" border style="width: 100%">
        <ElTableColumn prop="buildingName" label="楼栋名称" width="150" />
        <ElTableColumn label="所属门店" width="150">
          <template #default="scope">
            {{ getStoreName(scope.row.storeId) }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="address" label="地址" />
        <ElTableColumn prop="totalFloors" label="楼层数" width="100" />
        <ElTableColumn prop="remark" label="备注" />
        <ElTableColumn label="操作" fixed="right" width="150">
          <template #default="scope">
            <ElButton type="text" size="small" :icon="Edit" @click="handleEdit(scope.row)">编辑</ElButton>
            <ElButton type="text" size="small" :icon="Delete" @click="handleDelete(scope.row.id!)">删除</ElButton>
          </template>
        </ElTableColumn>
      </ElTable>

      <div class="mt-4 flex justify-end">
        <ElPagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </ElCard>

    <ElDialog title="添加楼栋" v-model="dialogVisible" width="600px">
      <ElForm :model="form" :rules="rules" label-width="100px">
        <ElFormItem label="楼栋名称" prop="buildingName">
          <ElInput v-model="form.buildingName" />
        </ElFormItem>
        <ElFormItem label="所属门店" prop="storeId">
          <ElSelect v-model="form.storeId" class="w-full">
            <ElOption v-for="store in stores" :key="store.id" :label="store.storeName" :value="store.id" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="地址">
          <ElInput v-model="form.address" />
        </ElFormItem>
        <ElFormItem label="楼层数" prop="totalFloors">
          <ElInput type="number" v-model.number="form.totalFloors" />
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput type="textarea" v-model="form.remark" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSave">确定</ElButton>
      </template>
    </ElDialog>

    <ElDialog title="编辑楼栋" v-model="editDialogVisible" width="600px">
      <ElForm :model="editForm" :rules="rules" label-width="100px">
        <ElFormItem label="楼栋名称" prop="buildingName">
          <ElInput v-model="editForm.buildingName" />
        </ElFormItem>
        <ElFormItem label="所属门店" prop="storeId">
          <ElSelect v-model="editForm.storeId" class="w-full">
            <ElOption v-for="store in stores" :key="store.id" :label="store.storeName" :value="store.id" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="地址">
          <ElInput v-model="editForm.address" />
        </ElFormItem>
        <ElFormItem label="楼层数" prop="totalFloors">
          <ElInput type="number" v-model.number="editForm.totalFloors" />
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput type="textarea" v-model="editForm.remark" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="editDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleUpdate">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>
