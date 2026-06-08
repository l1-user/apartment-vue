<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">房型模板</h2>
    <ElForm :inline="true" class="mb-4">
      <ElForm-item>
        <ElButton type="success" @click="openDialog()">新增房型</ElButton>
        <ElButton @click="loadList">刷新</ElButton>
      </ElForm-item>
    </ElForm>
    <ElTable :data="list" border stripe>
      <ElTable-column prop="typeCode" label="房型编号" width="120" />
      <ElTable-column prop="typeName" label="房型名称" width="160" />
      <ElTable-column prop="area" label="面积(㎡)" width="100" />
      <ElTable-column prop="bedType" label="床型" width="140" />
      <ElTable-column prop="maxOccupancy" label="最大入住人数" width="140" />
      <ElTable-column prop="windowType" label="窗户" width="100">
        <template #default="{ row }">{{ row.windowType === 1 ? '无窗' : row.windowType === 2 ? '内窗' : '外窗' }}</template>
      </ElTable-column>
      <ElTable-column prop="standardRent" label="标准租金(元)" width="140" />
      <ElTable-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <ElTag :type="row.status === 1 ? 'success' : 'info'" size="small">{{ row.status === 1 ? '启用' : '停用' }}</ElTag>
        </template>
      </ElTable-column>
      <ElTable-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <ElButton type="primary" link size="small" @click="openDialog(row)">编辑</ElButton>
          <ElButton type="danger" link size="small" @click="deleteRow(row)">删除</ElButton>
        </template>
      </ElTable-column>
    </ElTable>
    <ElDialog v-model="dialogVisible" :title="form.id ? '编辑房型' : '新增房型'" width="600px">
      <ElForm :model="form" label-width="100px" :rules="rules" ref="formRef">
        <ElForm-item label="房型编码" prop="typeCode">
          <ElInput v-model="form.typeCode" placeholder="如 DBR001 (必填)" />
        </ElForm-item>
        <ElForm-item label="房型名称" prop="typeName">
          <ElInput v-model="form.typeName" placeholder="如 标准单人间" />
        </ElForm-item>
        <ElForm-item label="所属门店" prop="storeId">
          <ElSelect v-model="form.storeId" placeholder="选择门店(可选)" clearable style="width: 100%">
            <ElOption v-for="s in stores" :key="s.id" :label="s.storeName" :value="s.id" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="面积(㎡)" prop="area">
          <ElInput v-model="form.area" />
        </ElForm-item>
        <ElForm-item label="床型" prop="bedType">
          <ElInput v-model="form.bedType" placeholder="如 1.5米双人床" />
        </ElForm-item>
        <ElForm-item label="最大入住人数" prop="maxOccupancy">
          <ElInput-number v-model="form.maxOccupancy" :min="1" style="width: 100%" />
        </ElForm-item>
        <ElForm-item label="窗户类型" prop="windowType">
          <ElSelect v-model="form.windowType" style="width: 100%">
            <ElOption label="无窗" :value="1" />
            <ElOption label="内窗" :value="2" />
            <ElOption label="外窗" :value="3" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="标准租金" prop="standardRent">
          <ElInput v-model="form.standardRent" />
        </ElForm-item>
        <ElForm-item label="状态" prop="status">
          <ElRadio-group v-model="form.status">
            <ElRadio :value="1">启用</ElRadio>
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
import { ref, reactive, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElSelect, ElOption, ElInput, ElInputNumber, ElTag, ElDialog, ElRadioGroup, ElRadio, ElMessage, ElMessageBox } from 'element-plus'
import type { RoomType, Store } from '@/types'
import { roomTypeApi } from '@/api/roomType'
import { storeApi } from '@/api/store'

const list = ref<RoomType[]>([])
const stores = ref<Store[]>([])

const dialogVisible = ref(false)
const formRef = ref()
const form = reactive<Partial<RoomType>>({ status: 1, windowType: 3, maxOccupancy: 1 })
const rules = {
  typeCode: [{ required: true, message: '请输入房型编码', trigger: 'blur' }],
  typeName: [{ required: true, message: '请输入房型名称', trigger: 'blur' }]
}

const loadList = async () => {
  try {
    const res = await roomTypeApi.getAll()
    list.value = (res && Array.isArray(res) ? res : []) as RoomType[]
  } catch (e) { ElMessage.warning('后端接口不可用，显示空数据'); list.value = [] }
}
const loadStores = async () => {
  try {
    const res = await storeApi.getAll()
    stores.value = (res && Array.isArray(res) ? res : []) as Store[]
  } catch (e) { stores.value = [] }
}

const openDialog = (row?: RoomType) => {
  if (row) Object.assign(form, { ...row })
  else Object.assign(form, { status: 1, windowType: 3, maxOccupancy: 1, typeCode: '', typeName: '', storeId: undefined, area: '', bedType: '', standardRent: '' })
  dialogVisible.value = true
}

const save = async () => {
  try {
    const ok = form.id
      ? await roomTypeApi.update(form as RoomType) as unknown as boolean
      : await roomTypeApi.save(form as RoomType) as unknown as boolean
    if (ok === true) { ElMessage.success(form.id ? '更新成功' : '新增成功'); dialogVisible.value = false; loadList() }
    else ElMessage.error('保存失败')
  } catch (e) { ElMessage.error('保存失败，请检查后端服务') }
}

const deleteRow = (row: RoomType) => {
  ElMessageBox.confirm(`确定删除房型 ${row.typeName}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await roomTypeApi.delete(row.id!) as unknown as boolean
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
