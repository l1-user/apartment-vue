<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElPagination, ElCard, ElRow, ElCol } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { Store } from '@/types'
import { storeApi } from '@/api/store'

const stores = ref<Store[]>([])
const dialogVisible = ref(false)
const editDialogVisible = ref(false)

const form = ref<Store>({
  storeName: '',
  address: '',
  phone: '',
  managerName: ''
})

const editForm = ref<Store>({
  storeName: '',
  address: '',
  phone: '',
  managerName: ''
})

const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})

const rules = computed(() => ({
  storeName: [{ required: true, message: '请输入门店名称', trigger: 'blur' }]
}))

const loadData = async () => {
  try {
    const response = await storeApi.getPage({
      current: pagination.value.current,
      size: pagination.value.size
    })
    stores.value = response.records || []
    pagination.value.total = response.total || 0
  } catch (error) {
    ElMessage.error('加载门店数据失败')
  }
}

const handleAdd = () => {
  form.value = {
    storeName: '',
    address: '',
    phone: '',
    managerName: ''
  }
  dialogVisible.value = true
}

const handleEdit = async (store: Store) => {
  try {
    const response = await storeApi.getById(store.id!)
    editForm.value = response
    editDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取门店信息失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    await storeApi.delete(id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleSave = async () => {
  try {
    await storeApi.save(form.value)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

const handleUpdate = async () => {
  try {
    await storeApi.update(editForm.value)
    ElMessage.success('更新成功')
    editDialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div>
    <ElCard shadow="never" class="mb-4">
      <ElRow :gutter="20" align="middle">
        <ElCol :span="20">
          <div class="flex gap-4 items-center">
            <ElButton type="primary" @click="loadData">刷新</ElButton>
          </div>
        </ElCol>
        <ElCol :span="4" class="text-right">
          <ElButton type="primary" :icon="Plus" @click="handleAdd">添加门店</ElButton>
        </ElCol>
      </ElRow>
    </ElCard>

    <ElCard shadow="never">
      <ElTable :data="stores" border style="width: 100%">
        <ElTableColumn prop="storeName" label="门店名称" width="150" />
        <ElTableColumn prop="address" label="地址" />
        <ElTableColumn prop="phone" label="联系电话" width="150" />
        <ElTableColumn prop="managerName" label="负责人" width="120" />
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

    <ElDialog title="添加门店" v-model="dialogVisible" width="600px">
      <ElForm :model="form" :rules="rules" label-width="100px">
        <ElFormItem label="门店名称" prop="storeName">
          <ElInput v-model="form.storeName" />
        </ElFormItem>
        <ElFormItem label="地址">
          <ElInput v-model="form.address" />
        </ElFormItem>
        <ElFormItem label="联系电话">
          <ElInput v-model="form.phone" />
        </ElFormItem>
        <ElFormItem label="负责人">
          <ElInput v-model="form.managerName" />
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

    <ElDialog title="编辑门店" v-model="editDialogVisible" width="600px">
      <ElForm :model="editForm" :rules="rules" label-width="100px">
        <ElFormItem label="门店名称" prop="storeName">
          <ElInput v-model="editForm.storeName" />
        </ElFormItem>
        <ElFormItem label="地址">
          <ElInput v-model="editForm.address" />
        </ElFormItem>
        <ElFormItem label="联系电话">
          <ElInput v-model="editForm.phone" />
        </ElFormItem>
        <ElFormItem label="负责人">
          <ElInput v-model="editForm.managerName" />
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
