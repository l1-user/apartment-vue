<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">楼栋管理</h2>
    <ElForm :inline="true" class="mb-4">
      <ElForm-item label="门店">
        <ElSelect v-model="filters.storeId" placeholder="全部门店" clearable style="width: 160px" @change="loadList">
          <ElOption v-for="s in stores" :key="s.id" :label="s.storeName" :value="s.id" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item>
        <ElButton type="success" @click="openDialog()">新增楼栋</ElButton>
        <ElButton @click="loadList">刷新</ElButton>
      </ElForm-item>
    </ElForm>
    <ElTable :data="filteredList" border stripe>
      <ElTable-column prop="buildingCode" label="楼栋编号" width="120" />
      <ElTable-column prop="buildingName" label="楼栋名称" width="160" />
      <ElTable-column prop="storeId" label="所属门店" width="160">
        <template #default="{ row }">{{ getStoreName(row.storeId) }}</template>
      </ElTable-column>
      <ElTable-column prop="totalFloors" label="楼层数" width="80" />
      <ElTable-column prop="hasElevator" label="电梯" width="80">
        <template #default="{ row }">{{ row.hasElevator === 1 ? '有' : '无' }}</template>
      </ElTable-column>
      <ElTable-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <ElTag :type="row.status === 1 ? 'success' : 'info'" size="small">{{ row.status === 1 ? '正常' : '停用' }}</ElTag>
        </template>
      </ElTable-column>
      <ElTable-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <ElButton type="primary" link size="small" @click="openDialog(row)">编辑</ElButton>
          <ElButton type="danger" link size="small" @click="deleteRow(row)">删除</ElButton>
        </template>
      </ElTable-column>
    </ElTable>
    <ElDialog v-model="dialogVisible" :title="form.id ? '编辑楼栋' : '新增楼栋'" width="600px">
      <ElForm :model="form" label-width="100px" :rules="rules" ref="formRef">
        <ElForm-item label="楼栋编码" prop="buildingCode">
          <ElInput v-model="form.buildingCode" placeholder="如 BLD001" />
        </ElForm-item>
        <ElForm-item label="楼栋名称" prop="buildingName">
          <ElInput v-model="form.buildingName" placeholder="如 A栋" />
        </ElForm-item>
        <ElForm-item label="所属门店" prop="storeId">
          <ElSelect v-model="form.storeId" placeholder="选择门店" style="width: 100%">
            <ElOption v-for="s in stores" :key="s.id" :label="s.storeName" :value="s.id" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="楼层数" prop="totalFloors">
          <ElInput-number v-model="form.totalFloors" :min="1" style="width: 100%" />
        </ElForm-item>
        <ElForm-item label="是否有电梯" prop="hasElevator">
          <ElRadio-group v-model="form.hasElevator">
            <ElRadio :value="1">有</ElRadio>
            <ElRadio :value="0">无</ElRadio>
          </ElRadio-group>
        </ElForm-item>
        <ElForm-item label="状态" prop="status">
          <ElRadio-group v-model="form.status">
            <ElRadio :value="1">正常</ElRadio>
            <ElRadio :value="0">停用</ElRadio>
          </ElRadio-group>
        </ElForm-item>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="save">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElSelect, ElOption, ElInput, ElInputNumber, ElTag, ElDialog, ElRadioGroup, ElRadio, ElMessage, ElMessageBox } from 'element-plus'
import type { Building, Store } from '@/types'
import { buildingApi } from '@/api/building'
import { storeApi } from '@/api/store'

const list = ref<Building[]>([])
const stores = ref<Store[]>([])
const filters = reactive({ storeId: undefined as number | undefined })

const dialogVisible = ref(false)
const formRef = ref()
const form = reactive<Partial<Building>>({ status: 1, hasElevator: 1, totalFloors: 1 })
const rules = {
  buildingCode: [{ required: true, message: '请输入楼栋编码', trigger: 'blur' }],
  buildingName: [{ required: true, message: '请输入楼栋名称', trigger: 'blur' }],
  storeId: [{ required: true, message: '请选择门店', trigger: 'change' }],
  totalFloors: [{ required: true, message: '请输入楼层数', trigger: 'blur' }]
}

const filteredList = computed(() => {
  if (!filters.storeId) return list.value
  return list.value.filter(b => b.storeId === filters.storeId)
})

const getStoreName = (id?: number) => stores.value.find(s => s.id === id)?.storeName || '-'

const loadList = async () => {
  try {
    const res = await buildingApi.getAll()
    list.value = (res && Array.isArray(res) ? res : []) as Building[]
  } catch (e) { ElMessage.warning('后端接口不可用，显示空数据'); list.value = [] }
}
const loadStores = async () => {
  try {
    const res = await storeApi.getAll()
    stores.value = (res && Array.isArray(res) ? res : []) as Store[]
  } catch (e) { stores.value = [] }
}

const openDialog = (row?: Building) => {
  if (row) Object.assign(form, { ...row })
  else Object.assign(form, { status: 1, hasElevator: 1, totalFloors: 1, buildingCode: '', buildingName: '', storeId: undefined })
  dialogVisible.value = true
}

const save = async () => {
  try {
    const ok = form.id
      ? await buildingApi.update(form as Building) as unknown as boolean
      : await buildingApi.save(form as Building) as unknown as boolean
    if (ok === true) { ElMessage.success(form.id ? '更新成功' : '新增成功'); dialogVisible.value = false; loadList() }
    else ElMessage.error('保存失败')
  } catch (e) { ElMessage.error('保存失败，请检查后端服务') }
}

const deleteRow = (row: Building) => {
  ElMessageBox.confirm(`确定删除楼栋 ${row.buildingName}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await buildingApi.delete(row.id!) as unknown as boolean
        if (ok === true) { ElMessage.success('删除成功'); loadList() } else ElMessage.error('删除失败')
      } catch (e) { ElMessage.error('删除失败，请检查后端服务') }
    }).catch(() => {})
}

onMounted(() => { loadStores(); loadList() })
</script>

<style scoped>
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.font-bold { font-weight: 700; }
.mb-4 { margin-bottom: 1rem; }
.p-4 { padding: 1rem; }
</style>
