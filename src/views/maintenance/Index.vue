<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">维修工单与保洁计划</h2>

    <ElTabs v-model="activeTab">
      <!-- 维修工单 -->
      <ElTab-pane label="维修工单" name="repair">
        <ElForm :inline="true" class="mb-4">
          <ElForm-item label="类别">
            <ElSelect v-model="repairFilters.category" placeholder="全部" clearable style="width: 140px" @change="loadRepairs">
              <ElOption label="水电" value="水电" />
              <ElOption label="家电" value="家电" />
              <ElOption label="家具" value="家具" />
              <ElOption label="门窗" value="门窗" />
              <ElOption label="卫浴" value="卫浴" />
              <ElOption label="网络" value="网络" />
              <ElOption label="其他" value="其他" />
            </ElSelect>
          </ElForm-item>
          <ElForm-item label="状态">
            <ElSelect v-model="repairFilters.orderStatus" placeholder="全部" clearable style="width: 140px" @change="loadRepairs">
              <ElOption label="待派单" :value="1" />
              <ElOption label="已派单" :value="2" />
              <ElOption label="维修中" :value="3" />
              <ElOption label="待验收" :value="4" />
              <ElOption label="已完成" :value="5" />
              <ElOption label="已取消" :value="6" />
            </ElSelect>
          </ElForm-item>
          <ElForm-item>
            <ElButton type="primary" @click="loadRepairs">查询</ElButton>
            <ElButton type="success" @click="openRepairDialog">新建工单</ElButton>
            <ElButton @click="loadRepairs">刷新</ElButton>
          </ElForm-item>
        </ElForm>

        <ElTable :data="repairs" border stripe>
          <ElTable-column prop="orderNo" label="工单号" width="160" />
          <ElTable-column prop="roomId" label="房间ID" width="100" />
          <ElTable-column prop="tenantId" label="租户ID" width="100" />
          <ElTable-column prop="category" label="类别" width="100" />
          <ElTable-column prop="urgencyLevel" label="紧急度" width="100">
            <template #default="{ row }">
              <ElTag :type="row.urgencyLevel === 1 ? 'danger' : row.urgencyLevel === 2 ? 'warning' : 'info'" size="small">
                {{ row.urgencyLevel === 1 ? '紧急' : row.urgencyLevel === 2 ? '普通' : '一般' }}
              </ElTag>
            </template>
          </ElTable-column>
          <ElTable-column prop="description" label="描述" min-width="180" show-overflow-tooltip />
          <ElTable-column prop="reportTime" label="报修时间" width="160" />
          <ElTable-column prop="assigneeName" label="处理人" width="100" />
          <ElTable-column prop="estimatedCost" label="预估费用" width="100" />
          <ElTable-column prop="actualCost" label="实际费用" width="100" />
          <ElTable-column prop="orderStatus" label="状态" width="100">
            <template #default="{ row }">
              <ElTag :type="repairStatusTag(row.orderStatus)" size="small">{{ repairStatusText(row.orderStatus) }}</ElTag>
            </template>
          </ElTable-column>
          <ElTable-column prop="repairResult" label="维修结果" min-width="150" show-overflow-tooltip />
          <ElTable-column label="操作" width="260" fixed="right">
            <template #default="{ row }">
              <ElButton type="primary" link size="small" @click="openRepairDialog(row)">编辑</ElButton>
              <ElButton v-if="row.orderStatus === 1" type="success" link size="small" @click="assign(row)">派单</ElButton>
              <ElButton v-if="row.orderStatus === 2 || row.orderStatus === 3" type="warning" link size="small" @click="completeRepair(row)">完成</ElButton>
              <ElButton type="danger" link size="small" @click="deleteRepair(row)">删除</ElButton>
            </template>
          </ElTable-column>
        </ElTable>
      </ElTab-pane>

      <!-- 保洁计划 -->
      <ElTab-pane label="保洁计划" name="cleaning">
        <ElForm :inline="true" class="mb-4">
          <ElForm-item label="状态">
            <ElSelect v-model="cleanFilters.planStatus" placeholder="全部" clearable style="width: 140px" @change="loadCleanings">
              <ElOption label="启用" :value="1" />
              <ElOption label="停用" :value="0" />
            </ElSelect>
          </ElForm-item>
          <ElForm-item>
            <ElButton type="primary" @click="loadCleanings">查询</ElButton>
            <ElButton type="success" @click="openCleaningDialog">新建保洁计划</ElButton>
            <ElButton @click="loadCleanings">刷新</ElButton>
          </ElForm-item>
        </ElForm>

        <ElTable :data="cleanings" border stripe>
          <ElTable-column prop="planNo" label="计划编号" width="160" />
          <ElTable-column prop="planName" label="计划名称" width="160" />
          <ElTable-column prop="storeId" label="门店ID" width="100" />
          <ElTable-column label="保洁类型" width="120">
            <template #default="{ row }">{{ cleaningPlanTypeText(row.planType) }}</template>
          </ElTable-column>
          <ElTable-column label="频率" width="180">
            <template #default="{ row }">
              {{ frequencyText(row.frequency) }}{{ row.frequencyValue ? '（值' + row.frequencyValue + '）' : '' }}
            </template>
          </ElTable-column>
          <ElTable-column prop="assignedTo" label="保洁员" width="120" />
          <ElTable-column prop="estimatedDuration" label="耗时(分钟)" width="120" />
          <ElTable-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <ElTag :type="cleaningStatusTag(row.status)" size="small">{{ cleaningStatusText(row.status) }}</ElTag>
            </template>
          </ElTable-column>
          <ElTable-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
          <ElTable-column label="操作" width="220" fixed="right">
            <template #default="{ row }">
              <ElButton type="primary" link size="small" @click="openCleaningDialog(row)">编辑</ElButton>
              <ElButton type="danger" link size="small" @click="deleteCleaning(row)">删除</ElButton>
            </template>
          </ElTable-column>
        </ElTable>
      </ElTab-pane>
    </ElTabs>
  </div>

  <!-- 维修工单弹窗 -->
  <ElDialog v-model="repairDialogVisible" :title="repairForm.id ? '编辑工单' : '新建工单'" width="720px">
    <ElForm :model="repairForm" label-width="120px" :rules="repairRules" ref="repairFormRef">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElForm-item label="工单号">
            <ElInput v-model="repairForm.orderNo" placeholder="可选" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="所属门店" prop="storeId">
            <ElSelect v-model="repairForm.storeId" placeholder="请选择门店" style="width: 100%">
              <ElOption v-for="s in stores" :key="s.id" :label="s.storeName" :value="s.id" />
            </ElSelect>
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="房间ID" prop="roomId">
            <ElInput-number v-model="repairForm.roomId" :min="1" style="width: 100%" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="租户ID">
            <ElInput-number v-model="repairForm.tenantId" :min="1" style="width: 100%" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="类别" prop="category">
            <ElSelect v-model="repairForm.category" style="width: 100%">
              <ElOption label="水电" value="水电" />
              <ElOption label="家电" value="家电" />
              <ElOption label="家具" value="家具" />
              <ElOption label="门窗" value="门窗" />
              <ElOption label="卫浴" value="卫浴" />
              <ElOption label="网络" value="网络" />
              <ElOption label="其他" value="其他" />
            </ElSelect>
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="紧急度" prop="urgencyLevel">
            <ElSelect v-model="repairForm.urgencyLevel" style="width: 100%">
              <ElOption label="紧急" :value="1" />
              <ElOption label="普通" :value="2" />
              <ElOption label="一般" :value="3" />
            </ElSelect>
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="状态" prop="orderStatus">
            <ElSelect v-model="repairForm.orderStatus" style="width: 100%">
              <ElOption label="待派单" :value="1" />
              <ElOption label="已派单" :value="2" />
              <ElOption label="维修中" :value="3" />
              <ElOption label="待验收" :value="4" />
              <ElOption label="已完成" :value="5" />
              <ElOption label="已取消" :value="6" />
            </ElSelect>
          </ElForm-item>
        </ElCol>
        <ElCol :span="24">
          <ElForm-item label="问题描述" prop="description">
            <ElInput v-model="repairForm.description" type="textarea" :rows="3" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="处理人">
            <ElInput v-model="repairForm.assigneeName" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="预估费用">
            <ElInput v-model="repairForm.estimatedCost" placeholder="元" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="实际费用">
            <ElInput v-model="repairForm.actualCost" placeholder="元" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="24">
          <ElForm-item label="维修结果">
            <ElInput v-model="repairForm.repairResult" type="textarea" :rows="2" />
          </ElForm-item>
        </ElCol>
      </ElRow>
    </ElForm>
    <template #footer>
      <ElButton @click="repairDialogVisible = false">取消</ElButton>
      <ElButton type="primary" @click="saveRepair">确定</ElButton>
    </template>
  </ElDialog>

  <!-- 保洁计划弹窗 -->
  <ElDialog v-model="cleaningDialogVisible" :title="cleaningForm.id ? '编辑保洁计划' : '新建保洁计划'" width="600px">
    <ElForm :model="cleaningForm" label-width="120px" :rules="cleaningRules" ref="cleaningFormRef">
      <ElForm-item label="计划编号">
        <ElInput v-model="cleaningForm.planNo" placeholder="如 CLEAN-001（可选）" />
      </ElForm-item>
      <ElForm-item label="计划名称" prop="planName">
        <ElInput v-model="cleaningForm.planName" placeholder="如 5号楼每周保洁" />
      </ElForm-item>
      <ElForm-item label="所属门店" prop="storeId">
        <ElSelect v-model="cleaningForm.storeId" placeholder="请选择门店" style="width: 100%">
          <ElOption v-for="s in stores" :key="s.id" :label="s.storeName" :value="s.id" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item label="保洁类型" prop="planType">
        <ElSelect v-model="cleaningForm.planType" style="width: 100%">
          <ElOption label="日常保洁" :value="1" />
          <ElOption label="深度保洁" :value="2" />
          <ElOption label="退租保洁" :value="3" />
          <ElOption label="定期大扫除" :value="4" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item label="执行频率" prop="frequency">
        <ElSelect v-model="cleaningForm.frequency" style="width: 100%" placeholder="选择频率">
          <ElOption label="每日" value="daily" />
          <ElOption label="每周" value="weekly" />
          <ElOption label="每月" value="monthly" />
          <ElOption label="每季度" value="quarterly" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item label="频率值" prop="frequencyValue">
        <ElInput-number v-model="cleaningForm.frequencyValue" :min="1" :max="31" style="width: 100%" placeholder="如每周3=周三，每月15=15号" />
      </ElForm-item>
      <ElForm-item label="指派保洁员" prop="assignedTo">
        <ElInput v-model="cleaningForm.assignedTo" placeholder="如 张三" />
      </ElForm-item>
      <ElForm-item label="预计耗时(分钟)" prop="estimatedDuration">
        <ElInput-number v-model="cleaningForm.estimatedDuration" :min="1" style="width: 100%" />
      </ElForm-item>
      <ElForm-item label="状态" prop="status">
        <ElRadio-group v-model="cleaningForm.status">
          <ElRadio :value="1">启用</ElRadio>
          <ElRadio :value="0">停用</ElRadio>
        </ElRadio-group>
      </ElForm-item>
      <ElForm-item label="备注">
        <ElInput v-model="cleaningForm.remark" type="textarea" :rows="2" />
      </ElForm-item>
    </ElForm>
    <template #footer>
      <ElButton @click="cleaningDialogVisible = false">取消</ElButton>
      <ElButton type="primary" @click="saveCleaning">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElSelect, ElOption, ElInput,
  ElTag, ElDialog, ElMessage, ElMessageBox, ElInputNumber, ElDatePicker, ElTabs, ElTabPane, ElRow, ElCol
} from 'element-plus'
import type { MaintenanceOrder, CleaningPlan } from '@/types'
import { maintenanceOrderApi } from '@/api/maintenanceOrder'
import { cleaningPlanApi } from '@/api/cleaningPlan'
import { storeApi } from '@/api/store'

const activeTab = ref('repair')
const stores = ref<any[]>([])

// 维修工单
const repairs = ref<MaintenanceOrder[]>([])
const repairFilters = reactive({ category: '' as string | undefined, orderStatus: undefined as number | undefined })
const repairDialogVisible = ref(false)
const repairFormRef = ref()
const repairForm = reactive<Partial<MaintenanceOrder>>({ orderStatus: 1, urgencyLevel: 2, category: '水电' })
const repairRules = {
  storeId: [{ required: true, message: '请选择所属门店', trigger: 'change' }],
  roomId: [{ required: true, message: '请输入房间ID', trigger: 'blur' }],
  category: [{ required: true, message: '请选择类别', trigger: 'change' }],
  description: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
  orderStatus: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 保洁计划
const cleanings = ref<CleaningPlan[]>([])
const cleanFilters = reactive({ planStatus: undefined as number | undefined })
const cleaningDialogVisible = ref(false)
const cleaningFormRef = ref()
const cleaningForm = reactive<Partial<CleaningPlan>>({ status: 1, planType: 1 })
const cleaningRules = {
  planName: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  storeId: [{ required: true, message: '请选择所属门店', trigger: 'change' }],
  planType: [{ required: true, message: '请选择保洁类型', trigger: 'change' }],
  frequency: [{ required: true, message: '请选择执行频率', trigger: 'change' }],
  frequencyValue: [{ required: true, message: '请输入频率值', trigger: 'blur' }],
  assignedTo: [{ required: true, message: '请输入指派保洁员', trigger: 'blur' }],
  estimatedDuration: [{ required: true, message: '请输入预计耗时', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const repairStatusText = (s?: number) => {
  const m: { [k: number]: string } = { 1: '待派单', 2: '已派单', 3: '维修中', 4: '待验收', 5: '已完成', 6: '已取消' }
  return m[s || 0] || '未知'
}
const repairStatusTag = (s?: number) => {
  const m: { [k: number]: string } = { 1: 'warning', 2: '', 3: 'info', 4: '', 5: 'success', 6: 'danger' }
  return m[s || 0] || 'info'
}

// 加载维修工单
const loadRepairs = async () => {
  try {
    const res = await maintenanceOrderApi.getAll()
    let list: MaintenanceOrder[] = (res && Array.isArray(res) ? res : []) as MaintenanceOrder[]
    if (repairFilters.category) list = list.filter(o => o.category === repairFilters.category)
    if (repairFilters.orderStatus) list = list.filter(o => o.orderStatus === repairFilters.orderStatus)
    repairs.value = list
  } catch (e) {
    ElMessage.warning('后端接口不可用，显示空数据')
    repairs.value = []
  }
  // 加载门店
  try {
    const s = await storeApi.getAll()
    stores.value = (s && Array.isArray(s) ? s : []) as any[]
  } catch (e) {
    stores.value = []
  }
}

const openRepairDialog = (row?: MaintenanceOrder) => {
  if (row) Object.assign(repairForm, { ...row })
  else Object.assign(repairForm, {
    orderStatus: 1, urgencyLevel: 2, category: '水电',
    orderNo: '', storeId: undefined, roomId: undefined, tenantId: undefined,
    description: '', assigneeName: '', estimatedCost: '',
    actualCost: '', repairResult: ''
  })
  repairDialogVisible.value = true
}

const saveRepair = async () => {
  try {
    const ok = repairForm.id
      ? await maintenanceOrderApi.update(repairForm as MaintenanceOrder) as unknown as boolean
      : await maintenanceOrderApi.save(repairForm as MaintenanceOrder) as unknown as boolean
    if (ok === true) { ElMessage.success(repairForm.id ? '更新成功' : '新增成功'); repairDialogVisible.value = false; loadRepairs() }
    else ElMessage.error('保存失败')
  } catch (e) { ElMessage.error('保存失败，请检查后端服务') }
}

const assign = (row: MaintenanceOrder) => {
  ElMessageBox.prompt('请输入处理人姓名', '派单', { inputValue: row.assigneeName || '' })
    .then(async ({ value }) => {
      try {
        const ok = await maintenanceOrderApi.assign(row.id!, 0, value || '未指定') as unknown as boolean
        if (ok === true) { ElMessage.success('派单成功'); loadRepairs() } else ElMessage.error('操作失败')
      } catch (e) { ElMessage.error('操作失败，请检查后端服务') }
    }).catch(() => {})
}

const completeRepair = (row: MaintenanceOrder) => {
  ElMessageBox.prompt('请输入维修结果', '完成工单', { inputValue: row.repairResult || '' })
    .then(async ({ value }) => {
      try {
        const ok = await maintenanceOrderApi.complete(row.id!, value || '已修复', row.actualCost) as unknown as boolean
        if (ok === true) { ElMessage.success('工单已完成'); loadRepairs() } else ElMessage.error('操作失败')
      } catch (e) { ElMessage.error('操作失败，请检查后端服务') }
    }).catch(() => {})
}

const deleteRepair = (row: MaintenanceOrder) => {
  ElMessageBox.confirm(`确定删除工单 ${row.orderNo || row.id}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await maintenanceOrderApi.delete(row.id!) as unknown as boolean
        if (ok === true) { ElMessage.success('删除成功'); loadRepairs() } else ElMessage.error('删除失败')
      } catch (e) { ElMessage.error('删除失败，请检查后端服务') }
    }).catch(() => {})
}

// 保洁计划
const cleaningStatusText = (s?: number) => {
  const m: { [k: number]: string } = { 0: '停用', 1: '启用' }
  return m[s || 0] || '未知'
}
const cleaningStatusTag = (s?: number) => {
  const m: { [k: number]: string } = { 0: 'info', 1: 'success' }
  return m[s || 0] || 'info'
}
const cleaningPlanTypeText = (t?: number) => {
  const m: { [k: number]: string } = { 1: '日常保洁', 2: '深度保洁', 3: '退租保洁', 4: '定期大扫除' }
  return m[t || 0] || '未知'
}
const frequencyText = (f?: string) => {
  const m: { [k: string]: string } = { daily: '每日', weekly: '每周', monthly: '每月', quarterly: '每季度' }
  return m[f || ''] || f || ''
}

const loadCleanings = async () => {
  try {
    const res = await cleaningPlanApi.getAll()
    let list: CleaningPlan[] = (res && Array.isArray(res) ? res : []) as CleaningPlan[]
    if (cleanFilters.planStatus !== undefined) list = list.filter(p => p.status === cleanFilters.planStatus)
    cleanings.value = list
  } catch (e) {
    ElMessage.warning('后端接口不可用，显示空数据')
    cleanings.value = []
  }
  // 加载门店
  try {
    const s = await storeApi.getAll()
    stores.value = (s && Array.isArray(s) ? s : []) as any[]
  } catch (e) {
    stores.value = []
  }
}

const openCleaningDialog = (row?: CleaningPlan) => {
  if (row) Object.assign(cleaningForm, { ...row })
  else Object.assign(cleaningForm, {
    status: 1, planType: 1, planNo: '', planName: '',
    storeId: undefined, frequency: '', frequencyValue: undefined,
    assignedTo: '', estimatedDuration: undefined, remark: ''
  })
  cleaningDialogVisible.value = true
}

const saveCleaning = async () => {
  try {
    const ok = cleaningForm.id
      ? await cleaningPlanApi.update(cleaningForm as CleaningPlan) as unknown as boolean
      : await cleaningPlanApi.save(cleaningForm as CleaningPlan) as unknown as boolean
    if (ok === true) { ElMessage.success(cleaningForm.id ? '更新成功' : '新增成功'); cleaningDialogVisible.value = false; loadCleanings() }
    else ElMessage.error('保存失败')
  } catch (e) { ElMessage.error('保存失败，请检查后端服务') }
}

const deleteCleaning = (row: CleaningPlan) => {
  ElMessageBox.confirm(`确定删除保洁计划 ${row.planNo || row.id}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await cleaningPlanApi.delete(row.id!) as unknown as boolean
        if (ok === true) { ElMessage.success('删除成功'); loadCleanings() } else ElMessage.error('删除失败')
      } catch (e) { ElMessage.error('删除失败，请检查后端服务') }
    }).catch(() => {})
}

onMounted(() => { loadRepairs(); loadCleanings() })
</script>

<style scoped>
.p-4 { padding: 1rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.font-bold { font-weight: 700; }
.mb-4 { margin-bottom: 1rem; }
</style>
