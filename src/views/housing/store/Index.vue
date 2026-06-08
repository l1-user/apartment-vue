<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">门店管理</h2>
    <ElForm :inline="true" class="mb-4">
      <ElForm-item>
        <ElButton type="success" @click="openDialog()">新增门店</ElButton>
        <ElButton @click="loadList">刷新</ElButton>
      </ElForm-item>
    </ElForm>
    <ElTable :data="list" border stripe>
      <ElTable-column prop="storeCode" label="门店编号" width="120" />
      <ElTable-column prop="storeName" label="门店名称" width="160" />
      <ElTable-column prop="city" label="城市" width="100" />
      <ElTable-column prop="address" label="地址" show-overflow-tooltip />
      <ElTable-column prop="contactPerson" label="联系人" width="100" />
      <ElTable-column prop="contactPhone" label="联系电话" width="140" />
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
    <ElDialog v-model="dialogVisible" :title="form.id ? '编辑门店' : '新增门店'" width="600px">
      <ElForm :model="form" label-width="100px" :rules="rules" ref="formRef">
        <ElForm-item label="门店编码" prop="storeCode">
          <ElInput v-model="form.storeCode" placeholder="如 STORE001" />
        </ElForm-item>
        <ElForm-item label="门店名称" prop="storeName">
          <ElInput v-model="form.storeName" />
        </ElForm-item>
        <ElForm-item label="门店类型" prop="storeType">
          <ElSelect v-model="form.storeType" style="width: 100%">
            <ElOption label="直营店" :value="1" />
            <ElOption label="加盟店" :value="2" />
            <ElOption label="托管店" :value="3" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="省份" prop="province">
          <ElInput v-model="form.province" placeholder="如 北京市" />
        </ElForm-item>
        <ElForm-item label="城市" prop="city">
          <ElInput v-model="form.city" />
        </ElForm-item>
        <ElForm-item label="详细地址" prop="address">
          <ElInput v-model="form.address" />
        </ElForm-item>
        <ElForm-item label="联系人" prop="contactPerson">
          <ElInput v-model="form.contactPerson" />
        </ElForm-item>
        <ElForm-item label="联系电话" prop="contactPhone">
          <ElInput v-model="form.contactPhone" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElSelect, ElOption, ElInput, ElTag, ElDialog, ElRadioGroup, ElRadio, ElMessage, ElMessageBox } from 'element-plus'
import type { Store } from '@/types'
import { storeApi } from '@/api/store'

const list = ref<Store[]>([])
const dialogVisible = ref(false)
const formRef = ref()
const form = reactive<Partial<Store>>({ status: 1, storeType: 1 })
const rules = {
  storeCode: [{ required: true, message: '请输入门店编码', trigger: 'blur' }],
  storeName: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
  contactPerson: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
}

const loadList = async () => {
  try {
    const res = await storeApi.getAll()
    list.value = (res && Array.isArray(res) ? res : []) as Store[]
  } catch (e) { ElMessage.warning('后端接口不可用，显示空数据'); list.value = [] }
}

const openDialog = (row?: Store) => {
  if (row) Object.assign(form, { ...row })
  else Object.assign(form, { status: 1, storeType: 1, storeCode: '', storeName: '', province: '', city: '', address: '', contactPerson: '', contactPhone: '' })
  dialogVisible.value = true
}

const save = async () => {
  try {
    const ok = form.id
      ? await storeApi.update(form as Store) as unknown as boolean
      : await storeApi.save(form as Store) as unknown as boolean
    if (ok === true) { ElMessage.success(form.id ? '更新成功' : '新增成功'); dialogVisible.value = false; loadList() }
    else ElMessage.error('保存失败')
  } catch (e) { ElMessage.error('保存失败，请检查后端服务') }
}

const deleteRow = (row: Store) => {
  ElMessageBox.confirm(`确定删除门店 ${row.storeName}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await storeApi.delete(row.id!) as unknown as boolean
        if (ok === true) { ElMessage.success('删除成功'); loadList() } else ElMessage.error('删除失败')
      } catch (e) { ElMessage.error('删除失败，请检查后端服务') }
    }).catch(() => {})
}

onMounted(() => loadList())
</script>

<style scoped>
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.font-bold { font-weight: 700; }
.mb-4 { margin-bottom: 1rem; }
.p-4 { padding: 1rem; }
</style>
