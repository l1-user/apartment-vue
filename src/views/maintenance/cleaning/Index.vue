<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">保洁计划</h2>
    <ElForm :inline="true" class="mb-4">
      <ElForm-item label="状态">
        <ElSelect v-model="filters.status" placeholder="全部" clearable style="width: 140px" @change="loadList">
          <ElOption label="启用" :value="1" />
          <ElOption label="停用" :value="0" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item>
        <ElButton type="primary" @click="loadList">查询</ElButton>
        <ElButton type="success" @click="openDialog()">新建计划</ElButton>
        <ElButton @click="loadList">刷新</ElButton>
      </ElForm-item>
    </ElForm>
    <ElTable :data="filteredList" border stripe>
      <ElTable-column prop="planNo" label="计划编号" width="160" />
      <ElTable-column prop="planName" label="计划名称" width="160" />
      <ElTable-column prop="storeId" label="门店" width="140">
        <template #default="{ row }">{{ getStoreName(row.storeId) }}</template>
      </ElTable-column>
      <ElTable-column prop="buildingId" label="楼栋ID" width="100" />
      <ElTable-column label="保洁类型" width="120">
        <template #default="{ row }">{{ planTypeText(row.planType) }}</template>
      </ElTable-column>
      <ElTable-column label="频率" width="180">
        <template #default="{ row }">{{ frequencyText(row.frequency) }}{{ row.frequencyValue ? '（值' + row.frequencyValue + '）' : '' }}</template>
      </ElTable-column>
      <ElTable-column prop="assignedTo" label="保洁员" width="120" />
      <ElTable-column prop="estimatedDuration" label="耗时(分钟)" width="120" />
      <ElTable-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <ElTag :type="row.status === 1 ? 'success' : 'info'" size="small">{{ row.status === 1 ? '启用' : '停用' }}</ElTag>
        </template>
      </ElTable-column>
      <ElTable-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
      <ElTable-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <ElButton type="primary" link size="small" @click="openDialog(row)">编辑</ElButton>
          <ElButton type="danger" link size="small" @click="deleteRow(row)">删除</ElButton>
        </template>
      </ElTable-column>
    </ElTable>
    <ElDialog v-model="dialogVisible" :title="form.id ? '编辑计划' : '新建计划'" width="600px">
      <ElForm :model="form" label-width="100px" :rules="rules" ref="formRef">
        <ElForm-item label="计划编号">
          <ElInput v-model="form.planNo" placeholder="如 CLEAN-001（可选）" />
        </ElForm-item>
        <ElForm-item label="计划名称" prop="planName">
          <ElInput v-model="form.planName" placeholder="如 5号楼每周保洁" />
        </ElForm-item>
        <ElForm-item label="所属门店" prop="storeId">
          <ElSelect v-model="form.storeId" placeholder="请选择门店" style="width: 100%">
            <ElOption v-for="s in stores" :key="s.id" :label="s.storeName" :value="s.id" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="楼栋"><ElInput-number v-model="form.buildingId" :min="1" style="width: 100%" /></ElForm-item>
        <ElForm-item label="保洁类型" prop="planType">
          <ElSelect v-model="form.planType" style="width: 100%">
            <ElOption label="日常保洁" :value="1" />
            <ElOption label="深度保洁" :value="2" />
            <ElOption label="退租保洁" :value="3" />
            <ElOption label="定期大扫除" :value="4" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="执行频率" prop="frequency">
          <ElSelect v-model="form.frequency" style="width: 100%" placeholder="选择频率">
            <ElOption label="每日" value="daily" />
            <ElOption label="每周" value="weekly" />
            <ElOption label="每月" value="monthly" />
            <ElOption label="每季度" value="quarterly" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="频率值" prop="frequencyValue">
          <ElInput-number v-model="form.frequencyValue" :min="1" :max="31" style="width: 100%" placeholder="如每周3=周三，每月15=15号" />
        </ElForm-item>
        <ElForm-item label="指派保洁员" prop="assignedTo">
          <ElInput v-model="form.assignedTo" placeholder="如 张三" />
        </ElForm-item>
        <ElForm-item label="预计耗时(分钟)" prop="estimatedDuration">
          <ElInput-number v-model="form.estimatedDuration" :min="1" style="width: 100%" />
        </ElForm-item>
        <ElForm-item label="状态" prop="status">
          <ElRadio-group v-model="form.status">
            <ElRadio :value="1">启用</ElRadio>
            <ElRadio :value="0">停用</ElRadio>
          </ElRadio-group>
        </ElForm-item>
        <ElForm-item label="备注">
          <ElInput v-model="form.remark" type="textarea" :rows="2" />
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
import type { CleaningPlan, Store } from '@/types'
import { cleaningPlanApi } from '@/api/cleaningPlan'
import { storeApi } from '@/api/store'

const list = ref<CleaningPlan[]>([])
const stores = ref<Store[]>([])
const filters = reactive({ status: undefined as number | undefined })

const dialogVisible = ref(false)
const formRef = ref()
const form = reactive<Partial<CleaningPlan>>({ status: 1, planType: 1 })
const rules = {
  planName: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  storeId: [{ required: true, message: '请选择所属门店', trigger: 'change' }],
  planType: [{ required: true, message: '请选择保洁类型', trigger: 'change' }],
  frequency: [{ required: true, message: '请选择执行频率', trigger: 'change' }],
  frequencyValue: [{ required: true, message: '请输入频率值', trigger: 'blur' }],
  assignedTo: [{ required: true, message: '请输入指派保洁员', trigger: 'blur' }],
  estimatedDuration: [{ required: true, message: '请输入预计耗时', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const filteredList = computed(() => {
  if (filters.status === undefined) return list.value
  return list.value.filter(p => p.status === filters.status)
})

const getStoreName = (id?: number) => stores.value.find(s => s.id === id)?.storeName || '-'
const planTypeText = (t?: number) => {
  const m: { [k: number]: string } = { 1: '日常保洁', 2: '深度保洁', 3: '退租保洁', 4: '定期大扫除' }
  return m[t || 0] || '未知'
}
const frequencyText = (f?: string) => {
  const m: { [k: string]: string } = { daily: '每日', weekly: '每周', monthly: '每月', quarterly: '每季度' }
  return m[f || ''] || f || ''
}

const loadList = async () => {
  try {
    const res = await cleaningPlanApi.getAll()
    list.value = (res && Array.isArray(res) ? res : []) as CleaningPlan[]
  } catch (e) { ElMessage.warning('后端接口不可用，显示空数据'); list.value = [] }
}
const loadStores = async () => {
  try {
    const res = await storeApi.getAll()
    stores.value = (res && Array.isArray(res) ? res : []) as Store[]
  } catch (e) { stores.value = [] }
}

const openDialog = (row?: CleaningPlan) => {
  if (row) Object.assign(form, { ...row })
  else Object.assign(form, { status: 1, planType: 1, planNo: '', planName: '', storeId: undefined, buildingId: undefined, frequency: '', frequencyValue: undefined, assignedTo: '', estimatedDuration: undefined, remark: '' })
  dialogVisible.value = true
}

const save = async () => {
  try {
    const ok = form.id
      ? await cleaningPlanApi.update(form as CleaningPlan) as unknown as boolean
      : await cleaningPlanApi.save(form as CleaningPlan) as unknown as boolean
    if (ok === true) { ElMessage.success(form.id ? '更新成功' : '新增成功'); dialogVisible.value = false; loadList() }
    else ElMessage.error('保存失败')
  } catch (e) { ElMessage.error('保存失败，请检查后端服务') }
}

const deleteRow = (row: CleaningPlan) => {
  ElMessageBox.confirm(`确定删除计划 ${row.planNo || row.id}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await cleaningPlanApi.delete(row.id!) as unknown as boolean
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
