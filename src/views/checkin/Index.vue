<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">合同管理（入住签约）</h2>

    <!-- 筛选 -->
    <ElForm :inline="true" class="mb-4">
      <ElForm-item label="合同状态">
        <ElSelect v-model="filters.status" placeholder="全部" clearable style="width: 160px" @change="loadContracts">
          <ElOption label="草稿" :value="1" />
          <ElOption label="生效中" :value="2" />
          <ElOption label="已到期" :value="3" />
          <ElOption label="已终止" :value="4" />
          <ElOption label="已续签" :value="5" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item>
        <ElButton type="primary" @click="loadContracts">查询</ElButton>
        <ElButton type="success" @click="openDialog">新建合同</ElButton>
        <ElButton @click="loadContracts">刷新</ElButton>
      </ElForm-item>
    </ElForm>

    <!-- 合同表格 -->
    <ElTable :data="contracts" border stripe>
      <ElTable-column prop="id" label="合同ID" width="100" />
      <ElTable-column prop="contractNo" label="合同编号" width="160" />
      <ElTable-column prop="tenantId" label="租户ID" width="100" />
      <ElTable-column prop="roomId" label="房间ID" width="100" />
      <ElTable-column prop="startDate" label="起租日期" width="120" />
      <ElTable-column prop="endDate" label="到期日期" width="120" />
      <ElTable-column prop="rentAmount" label="月租金(元)" width="120" />
      <ElTable-column prop="depositAmount" label="押金(元)" width="120" />
      <ElTable-column prop="paymentCycle" label="付款周期" width="100">
        <template #default="{ row }">{{ paymentCycleText(row.paymentCycle) }}</template>
      </ElTable-column>
      <ElTable-column prop="contractStatus" label="状态" width="100">
        <template #default="{ row }">
          <ElTag :type="statusTagType(row.contractStatus)" size="small">{{ statusText(row.contractStatus) }}</ElTag>
        </template>
      </ElTable-column>
      <ElTable-column prop="signDate" label="签约日期" width="120" />
      <ElTable-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <ElButton type="primary" link size="small" @click="openDialog(row)">编辑</ElButton>
          <ElButton type="success" link size="small" @click="updateStatus(row, 2)">生效</ElButton>
          <ElButton type="warning" link size="small" @click="terminate(row)">终止</ElButton>
          <ElButton type="danger" link size="small" @click="deleteContract(row)">删除</ElButton>
        </template>
      </ElTable-column>
    </ElTable>
  </div>

  <!-- 新建/编辑合同弹窗 -->
  <ElDialog v-model="dialogVisible" :title="form.id ? '编辑合同' : '新建合同'" width="720px">
    <ElForm :model="form" label-width="120px" :rules="rules" ref="formRef">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElForm-item label="合同编号" prop="contractNo">
            <ElInput v-model="form.contractNo" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="所属门店" prop="storeId">
            <ElSelect v-model="form.storeId" placeholder="请选择门店" style="width: 100%" filterable>
              <ElOption v-for="s in stores" :key="s.id" :label="s.name || s.storeName || s.id" :value="s.id" />
            </ElSelect>
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="签约日期" prop="signDate">
            <ElDatePicker v-model="form.signDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="租户ID" prop="tenantId">
            <ElInput-number v-model="form.tenantId" :min="1" style="width: 100%" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="房间ID" prop="roomId">
            <ElInput-number v-model="form.roomId" :min="1" style="width: 100%" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="起租日期" prop="startDate">
            <ElDatePicker v-model="form.startDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="到期日期" prop="endDate">
            <ElDatePicker v-model="form.endDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="月租金" prop="rentAmount">
            <ElInput v-model="form.rentAmount" placeholder="元" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="押金" prop="depositAmount">
            <ElInput v-model="form.depositAmount" placeholder="元" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="付款周期" prop="paymentCycle">
            <ElSelect v-model="form.paymentCycle" style="width: 100%">
              <ElOption label="月付" :value="1" />
              <ElOption label="季付" :value="2" />
              <ElOption label="半年付" :value="3" />
              <ElOption label="年付" :value="4" />
            </ElSelect>
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="租期(月)" prop="leaseTerm">
            <ElInput-number v-model="form.leaseTerm" :min="1" :max="120" style="width: 100%" placeholder="如 12 表示12个月" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="合同状态" prop="contractStatus">
            <ElSelect v-model="form.contractStatus" style="width: 100%">
              <ElOption label="草稿" :value="1" />
              <ElOption label="生效中" :value="2" />
              <ElOption label="已到期" :value="3" />
              <ElOption label="已终止" :value="4" />
              <ElOption label="已续签" :value="5" />
            </ElSelect>
          </ElForm-item>
        </ElCol>
        <ElCol :span="24">
          <ElForm-item label="违约条款">
            <ElInput v-model="form.terminationReason" type="textarea" :rows="2" placeholder="可选" />
          </ElForm-item>
        </ElCol>
      </ElRow>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取消</ElButton>
      <ElButton type="primary" @click="saveContract">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElSelect, ElOption, ElInput,
  ElTag, ElDialog, ElMessage, ElMessageBox, ElInputNumber, ElDatePicker, ElRow, ElCol
} from 'element-plus'
import type { Contract } from '@/types'
import { contractApi } from '@/api/contract'
import { storeApi } from '@/api/store'

const contracts = ref<Contract[]>([])
const stores = ref<any[]>([])
const filters = reactive({ status: undefined as number | undefined })

const dialogVisible = ref(false)
const formRef = ref()
const form = reactive<Partial<Contract>>({ contractStatus: 1, paymentCycle: 1 })
const rules = {
  contractNo: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
  storeId: [{ required: true, message: '请选择所属门店', trigger: 'change' }],
  tenantId: [{ required: true, message: '请输入租户ID', trigger: 'blur' }],
  roomId: [{ required: true, message: '请输入房间ID', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择起租日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择到期日期', trigger: 'change' }],
  rentAmount: [{ required: true, message: '请输入月租金', trigger: 'blur' }],
  leaseTerm: [{ required: true, message: '请输入租期', trigger: 'blur' }],
  contractStatus: [{ required: true, message: '请选择合同状态', trigger: 'change' }]
}

const statusText = (s?: number) => {
  const m: { [k: number]: string } = { 1: '草稿', 2: '生效中', 3: '已到期', 4: '已终止', 5: '已续签' }
  return m[s || 0] || '未知'
}
const statusTagType = (s?: number) => {
  const m: { [k: number]: string } = { 1: 'info', 2: 'success', 3: 'warning', 4: 'danger', 5: '' }
  return m[s || 0] || 'info'
}
const paymentCycleText = (c?: number) => {
  const m: { [k: number]: string } = { 1: '月付', 2: '季付', 3: '半年付', 4: '年付' }
  return m[c || 0] || '-'
}

const loadContracts = async () => {
  try {
    const res = await contractApi.getAll()
    let list: Contract[] = (res && Array.isArray(res) ? res : []) as Contract[]
    if (filters.status) list = list.filter(c => c.contractStatus === filters.status)
    contracts.value = list
  } catch (e) {
    ElMessage.warning('后端接口不可用，显示空数据')
    contracts.value = []
  }
  // 加载门店下拉数据
  try {
    const s = await storeApi.getAll()
    stores.value = (s && Array.isArray(s) ? s : []) as any[]
  } catch (e) {
    stores.value = []
  }
}

const openDialog = (row?: Contract) => {
  if (row) Object.assign(form, { ...row })
  else Object.assign(form, { contractStatus: 1, paymentCycle: 1, contractNo: '', storeId: undefined, tenantId: undefined, roomId: undefined, startDate: '', endDate: '', rentAmount: '', depositAmount: '', leaseTerm: undefined, terminationReason: '' })
  dialogVisible.value = true
}

const saveContract = async () => {
  try {
    const ok = form.id
      ? await contractApi.update(form as Contract) as unknown as boolean
      : await contractApi.save(form as Contract) as unknown as boolean
    if (ok === true) { ElMessage.success(form.id ? '更新成功' : '新增成功'); dialogVisible.value = false; loadContracts() }
    else ElMessage.error('保存失败')
  } catch (e) { ElMessage.error('保存失败，请检查后端服务') }
}

const updateStatus = (row: Contract, status: number) => {
  ElMessageBox.confirm(`确定将合同 ${row.contractNo} 设为"${statusText(status)}"?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await contractApi.updateStatus(row.id!, status) as unknown as boolean
        if (ok === true) { ElMessage.success('修改成功'); loadContracts() } else ElMessage.error('修改失败')
      } catch (e) { ElMessage.error('修改失败，请检查后端服务') }
    }).catch(() => {})
}

const terminate = (row: Contract) => {
  ElMessageBox.prompt('请输入终止原因', '终止合同', { inputValue: row.terminationReason || '' })
    .then(async ({ value }) => {
      form.id = row.id
      form.terminationReason = value
      form.contractStatus = 4
      try {
        const ok = await contractApi.update(form as Contract) as unknown as boolean
        if (ok === true) { ElMessage.success('合同已终止'); dialogVisible.value = false; loadContracts() } else ElMessage.error('操作失败')
      } catch (e) { ElMessage.error('操作失败，请检查后端服务') }
    }).catch(() => {})
}

const deleteContract = (row: Contract) => {
  ElMessageBox.confirm(`确定删除合同 ${row.contractNo}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await contractApi.delete(row.id!) as unknown as boolean
        if (ok === true) { ElMessage.success('删除成功'); loadContracts() } else ElMessage.error('删除失败')
      } catch (e) { ElMessage.error('删除失败，请检查后端服务') }
    }).catch(() => {})
}

onMounted(() => loadContracts())
</script>

<style scoped>
.p-4 { padding: 1rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.font-bold { font-weight: 700; }
.mb-4 { margin-bottom: 1rem; }
</style>
