<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">维修工单</h2>
    <ElForm :inline="true" class="mb-4">
      <ElForm-item label="类别">
        <ElSelect v-model="filters.category" placeholder="全部" clearable style="width: 140px" @change="loadList">
          <ElOption label="水电" value="水电" />
          <ElOption label="家具" value="家具" />
          <ElOption label="门窗" value="门窗" />
          <ElOption label="其他" value="其他" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item label="状态">
        <ElSelect v-model="filters.orderStatus" placeholder="全部" clearable style="width: 140px" @change="loadList">
          <ElOption label="待处理" :value="1" />
          <ElOption label="处理中" :value="2" />
          <ElOption label="已完成" :value="3" />
          <ElOption label="已取消" :value="4" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item>
        <ElButton type="primary" @click="loadList">查询</ElButton>
        <ElButton type="success" @click="openDialog()">新增工单</ElButton>
        <ElButton @click="loadList">刷新</ElButton>
        <ElButton type="info" icon="Brain" @click="showRecommendModal = true">AI智能派单</ElButton>
      </ElForm-item>
    </ElForm>
    <ElTable :data="filteredList" border stripe>
      <ElTable-column prop="orderNo" label="工单号" width="160" />
      <ElTable-column prop="storeId" label="门店" width="140">
        <template #default="{ row }">{{ getStoreName(row.storeId) }}</template>
      </ElTable-column>
      <ElTable-column prop="roomId" label="房间ID" width="100" />
      <ElTable-column prop="tenantId" label="租户ID" width="100" />
      <ElTable-column prop="category" label="类别" width="100" />
      <ElTable-column prop="description" label="问题描述" min-width="180" show-overflow-tooltip />
      <ElTable-column prop="urgencyLevel" label="紧急度" width="80">
        <template #default="{ row }">{{ row.urgencyLevel === 1 ? '一般' : row.urgencyLevel === 2 ? '中等' : '紧急' }}</template>
      </ElTable-column>
      <ElTable-column prop="assigneeName" label="处理人" width="100" />
      <ElTable-column prop="estimatedCost" label="预估费用" width="120" />
      <ElTable-column prop="actualCost" label="实际费用" width="120" />
      <ElTable-column prop="orderStatus" label="状态" width="100">
        <template #default="{ row }">
          <ElTag :type="row.orderStatus === 3 ? 'success' : row.orderStatus === 1 ? 'warning' : row.orderStatus === 2 ? '' : 'info'" size="small">
            {{ row.orderStatus === 1 ? '待处理' : row.orderStatus === 2 ? '处理中' : row.orderStatus === 3 ? '已完成' : '已取消' }}
          </ElTag>
        </template>
      </ElTable-column>
      <ElTable-column prop="repairResult" label="处理结果" width="160" show-overflow-tooltip />
      <ElTable-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <ElButton type="primary" link size="small" @click="openDialog(row)">编辑</ElButton>
          <ElButton v-if="row.orderStatus !== 3" type="success" link size="small" @click="markDone(row)">标记完成</ElButton>
          <ElButton type="danger" link size="small" @click="deleteRow(row)">删除</ElButton>
        </template>
      </ElTable-column>
    </ElTable>
    <ElDialog v-model="dialogVisible" :title="form.id ? '编辑工单' : '新建工单'" width="720px">
      <ElForm :model="form" label-width="100px" :rules="rules" ref="formRef">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElForm-item label="工单号"><ElInput v-model="form.orderNo" placeholder="可选" /></ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="所属门店" prop="storeId">
              <ElSelect v-model="form.storeId" placeholder="请选择门店" style="width: 100%">
                <ElOption v-for="s in stores" :key="s.id" :label="s.storeName" :value="s.id" />
              </ElSelect>
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="房间ID" prop="roomId">
              <ElInput-number v-model="form.roomId" :min="1" style="width: 100%" />
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="租户ID"><ElInput-number v-model="form.tenantId" :min="1" style="width: 100%" /></ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="类别" prop="category">
              <ElSelect v-model="form.category" style="width: 100%">
                <ElOption label="水电" value="水电" />
                <ElOption label="家具" value="家具" />
                <ElOption label="门窗" value="门窗" />
                <ElOption label="其他" value="其他" />
              </ElSelect>
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="紧急度" prop="urgencyLevel">
              <ElSelect v-model="form.urgencyLevel" style="width: 100%">
                <ElOption label="一般" :value="1" />
                <ElOption label="中等" :value="2" />
                <ElOption label="紧急" :value="3" />
              </ElSelect>
            </ElForm-item>
          </ElCol>
          <ElCol :span="24">
            <ElForm-item label="问题描述" prop="description">
              <ElInput v-model="form.description" type="textarea" :rows="2" />
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="处理人"><ElInput v-model="form.assigneeName" /></ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="预估费用"><ElInput v-model="form.estimatedCost" /></ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="实际费用"><ElInput v-model="form.actualCost" /></ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="状态" prop="orderStatus">
              <ElSelect v-model="form.orderStatus" style="width: 100%">
                <ElOption label="待处理" :value="1" />
                <ElOption label="处理中" :value="2" />
                <ElOption label="已完成" :value="3" />
                <ElOption label="已取消" :value="4" />
              </ElSelect>
            </ElForm-item>
          </ElCol>
          <ElCol :span="24">
            <ElForm-item label="处理结果">
              <ElInput v-model="form.repairResult" type="textarea" :rows="2" />
            </ElForm-item>
          </ElCol>
        </ElRow>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="save">确定</ElButton>
      </template>
    </ElDialog>

    <ElDialog v-model="showRecommendModal" title="AI智能派单" width="600px">
      <ElForm :model="recommendForm" label-width="100px">
        <ElForm-item label="选择工单">
          <ElSelect v-model="recommendForm.workOrderId" placeholder="请选择工单" style="width: 100%">
            <ElOption
              v-for="order in pendingOrders"
              :key="order.id"
              :label="`${order.orderNo || '工单' + order.id} - ${order.description}`"
              :value="order.id"
            />
          </ElSelect>
        </ElForm-item>
      </ElForm>
      <div v-if="recommendResult" class="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 class="font-semibold mb-2">AI推荐结果</h4>
        <p class="text-gray-600">{{ recommendResult.reason }}</p>
        <div v-if="recommendResult.recommendedWorkerIds?.length" class="mt-2">
          <span class="text-sm text-gray-500">推荐人员ID: </span>
          <span class="text-primary">{{ recommendResult.recommendedWorkerIds.join(', ') }}</span>
        </div>
      </div>
      <template #footer>
        <ElButton @click="showRecommendModal = false">关闭</ElButton>
        <ElButton type="primary" @click="getRecommend" :disabled="!recommendForm.workOrderId || isRecommendLoading">
          {{ isRecommendLoading ? '推荐中...' : '获取推荐' }}
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElSelect, ElOption, ElInput, ElInputNumber, ElTag, ElDialog, ElMessage, ElMessageBox, ElRow, ElCol } from 'element-plus'
import type { MaintenanceOrder, Store } from '@/types'
import { maintenanceOrderApi } from '@/api/maintenanceOrder'
import { storeApi } from '@/api/store'
import { aiApi } from '@/api/ai'

const list = ref<MaintenanceOrder[]>([])
const stores = ref<Store[]>([])
const filters = reactive({ category: '' as string | undefined, orderStatus: undefined as number | undefined })

const dialogVisible = ref(false)
const formRef = ref()
const form = reactive<Partial<MaintenanceOrder>>({ orderStatus: 1, urgencyLevel: 2, category: '水电' })

const showRecommendModal = ref(false)
const isRecommendLoading = ref(false)
const recommendForm = reactive({ workOrderId: undefined as number | undefined })
const recommendResult = ref<{ recommendedWorkerIds: number[]; reason: string } | null>(null)
const rules = {
  storeId: [{ required: true, message: '请选择所属门店', trigger: 'change' }],
  roomId: [{ required: true, message: '请输入房间ID', trigger: 'blur' }],
  category: [{ required: true, message: '请选择类别', trigger: 'change' }],
  description: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
  orderStatus: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const filteredList = computed(() => {
  let result = list.value
  if (filters.category) result = result.filter(o => o.category === filters.category)
  if (filters.orderStatus) result = result.filter(o => o.orderStatus === filters.orderStatus)
  return result
})

const pendingOrders = computed(() => {
  return list.value.filter(o => o.orderStatus === 1)
})

const getStoreName = (id?: number) => stores.value.find(s => s.id === id)?.storeName || '-'

const loadList = async () => {
  try {
    const res = await maintenanceOrderApi.getAll()
    list.value = (res && Array.isArray(res) ? res : []) as MaintenanceOrder[]
  } catch (e) { ElMessage.warning('后端接口不可用，显示空数据'); list.value = [] }
}
const loadStores = async () => {
  try {
    const res = await storeApi.getAll()
    stores.value = (res && Array.isArray(res) ? res : []) as Store[]
  } catch (e) { stores.value = [] }
}

const openDialog = (row?: MaintenanceOrder) => {
  if (row) Object.assign(form, { ...row })
  else Object.assign(form, { orderStatus: 1, urgencyLevel: 2, category: '水电', orderNo: '', storeId: undefined, roomId: undefined, tenantId: undefined, description: '', assigneeName: '', estimatedCost: '', actualCost: '', repairResult: '' })
  dialogVisible.value = true
}

const save = async () => {
  try {
    const ok = form.id
      ? await maintenanceOrderApi.update(form as MaintenanceOrder) as unknown as boolean
      : await maintenanceOrderApi.save(form as MaintenanceOrder) as unknown as boolean
    if (ok === true) { ElMessage.success(form.id ? '更新成功' : '新增成功'); dialogVisible.value = false; loadList() }
    else ElMessage.error('保存失败')
  } catch (e) { ElMessage.error('保存失败，请检查后端服务') }
}

const markDone = (row: MaintenanceOrder) => {
  ElMessageBox.confirm(`确定标记工单 ${row.orderNo || row.id} 为已完成?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await maintenanceOrderApi.updateStatus(row.id!, 3, row.assigneeName || '') as unknown as boolean
        if (ok === true) { ElMessage.success('已完成'); loadList() } else ElMessage.error('操作失败')
      } catch (e) { ElMessage.error('操作失败，请检查后端服务') }
    }).catch(() => {})
}

const deleteRow = (row: MaintenanceOrder) => {
  ElMessageBox.confirm(`确定删除工单 ${row.orderNo || row.id}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await maintenanceOrderApi.delete(row.id!) as unknown as boolean
        if (ok === true) { ElMessage.success('删除成功'); loadList() } else ElMessage.error('删除失败')
      } catch (e) { ElMessage.error('删除失败，请检查后端服务') }
    }).catch(() => {})
}

const getRecommend = async () => {
  if (!recommendForm.workOrderId) return
  isRecommendLoading.value = true
  recommendResult.value = null
  try {
    const res = await aiApi.recommendWorker(recommendForm.workOrderId)
    recommendResult.value = res
  } catch (e) {
    ElMessage.error('获取推荐失败')
  } finally {
    isRecommendLoading.value = false
  }
}

onMounted(() => { loadStores(); loadList() })
</script>

<style scoped>
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.font-bold { font-weight: 700; }
.mb-4 { margin-bottom: 1rem; }
.p-4 { padding: 1rem; }
</style>
