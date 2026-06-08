<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">租金账单</h2>

    <!-- 筛选 -->
    <ElForm :inline="true" class="mb-4">
      <ElForm-item label="账单类型">
        <ElSelect v-model="filters.billType" placeholder="全部" clearable style="width: 160px" @change="loadBills">
          <ElOption label="租金" :value="1" />
          <ElOption label="押金" :value="2" />
          <ElOption label="水电费" :value="3" />
          <ElOption label="物业费" :value="4" />
          <ElOption label="维修费" :value="6" />
          <ElOption label="违约金" :value="7" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item label="账单状态">
        <ElSelect v-model="filters.billStatus" placeholder="全部" clearable style="width: 140px" @change="loadBills">
          <ElOption label="待支付" :value="1" />
          <ElOption label="部分支付" :value="2" />
          <ElOption label="已支付" :value="3" />
          <ElOption label="逾期" :value="4" />
          <ElOption label="已作废" :value="5" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item>
        <ElButton type="primary" @click="loadBills">查询</ElButton>
        <ElButton type="success" @click="openDialog">新建账单</ElButton>
        <ElButton @click="loadBills">刷新</ElButton>
      </ElForm-item>
    </ElForm>

    <!-- 账单表格 -->
    <ElTable :data="bills" border stripe>
      <ElTable-column prop="billNo" label="账单编号" width="160" />
      <ElTable-column prop="contractId" label="合同ID" width="100" />
      <ElTable-column prop="tenantId" label="租户ID" width="100" />
      <ElTable-column prop="roomId" label="房间ID" width="100" />
      <ElTable-column prop="billType" label="类型" width="100">
        <template #default="{ row }">{{ billTypeText(row.billType) }}</template>
      </ElTable-column>
      <ElTable-column prop="billPeriodStart" label="账期开始" width="120" />
      <ElTable-column prop="billPeriodEnd" label="账期结束" width="120" />
      <ElTable-column prop="dueDate" label="到期日" width="120" />
      <ElTable-column prop="amount" label="金额(元)" width="110" />
      <ElTable-column prop="paidAmount" label="已付(元)" width="110" />
      <ElTable-column prop="billStatus" label="状态" width="100">
        <template #default="{ row }">
          <ElTag :type="billStatusTag(row.billStatus)" size="small">{{ billStatusText(row.billStatus) }}</ElTag>
        </template>
      </ElTable-column>
      <ElTable-column prop="paymentTime" label="支付时间" width="160" />
      <ElTable-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <ElButton type="primary" link size="small" @click="openDialog(row)">编辑</ElButton>
          <ElButton v-if="row.billStatus !== 3" type="success" link size="small" @click="payBill(row)">收款</ElButton>
          <ElButton type="danger" link size="small" @click="deleteBill(row)">删除</ElButton>
        </template>
      </ElTable-column>
    </ElTable>
  </div>

  <!-- 新建/编辑弹窗 -->
  <ElDialog v-model="dialogVisible" :title="form.id ? '编辑账单' : '新建账单'" width="720px">
    <ElForm :model="form" label-width="120px" :rules="rules" ref="formRef">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElForm-item label="账单编号">
            <ElInput v-model="form.billNo" placeholder="自动生成可手动填" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="所属门店" prop="storeId">
            <ElSelect v-model="form.storeId" placeholder="请选择门店" style="width: 100%">
              <ElOption v-for="s in stores" :key="s.id" :label="s.storeName" :value="s.id" />
            </ElSelect>
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="账单类型" prop="billType">
            <ElSelect v-model="form.billType" style="width: 100%">
              <ElOption label="租金" :value="1" />
              <ElOption label="押金" :value="2" />
              <ElOption label="水电费" :value="3" />
              <ElOption label="物业费" :value="4" />
              <ElOption label="维修费" :value="6" />
              <ElOption label="违约金" :value="7" />
            </ElSelect>
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="合同ID" prop="contractId">
            <ElInput-number v-model="form.contractId" :min="1" style="width: 100%" />
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
          <ElForm-item label="账期开始">
            <ElDatePicker v-model="form.billPeriodStart" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="账期结束">
            <ElDatePicker v-model="form.billPeriodEnd" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="到期日" prop="dueDate">
            <ElDatePicker v-model="form.dueDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="金额" prop="amount">
            <ElInput v-model="form.amount" placeholder="元" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="账单状态" prop="billStatus">
            <ElSelect v-model="form.billStatus" style="width: 100%">
              <ElOption label="待支付" :value="1" />
              <ElOption label="部分支付" :value="2" />
              <ElOption label="已支付" :value="3" />
              <ElOption label="逾期" :value="4" />
              <ElOption label="已作废" :value="5" />
            </ElSelect>
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="支付方式">
            <ElInput v-model="form.paymentMethod" placeholder="如 微信/支付宝/现金/转账" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="24">
          <ElForm-item label="备注">
            <ElInput v-model="form.remark" type="textarea" :rows="2" />
          </ElForm-item>
        </ElCol>
      </ElRow>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取消</ElButton>
      <ElButton type="primary" @click="saveBill">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElSelect, ElOption, ElInput,
  ElTag, ElDialog, ElMessage, ElMessageBox, ElInputNumber, ElDatePicker, ElRow, ElCol
} from 'element-plus'
import type { Bill } from '@/types'
import { billApi } from '@/api/bill'
import { storeApi } from '@/api/store'

const bills = ref<Bill[]>([])
const stores = ref<any[]>([])
const filters = reactive({ billType: undefined as number | undefined, billStatus: undefined as number | undefined })

const dialogVisible = ref(false)
const formRef = ref()
const form = reactive<Partial<Bill>>({ billStatus: 1, billType: 1 })
const rules = {
  storeId: [{ required: true, message: '请选择所属门店', trigger: 'change' }],
  billType: [{ required: true, message: '请选择账单类型', trigger: 'change' }],
  roomId: [{ required: true, message: '请输入房间ID', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  billStatus: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const billTypeText = (t?: number) => {
  const m: { [k: number]: string } = { 1: '租金', 2: '押金', 3: '水电费', 4: '物业费', 5: '网络费', 6: '维修费', 7: '违约金', 8: '其他' }
  return m[t || 0] || '-'
}
const billStatusText = (s?: number) => {
  const m: { [k: number]: string } = { 1: '待支付', 2: '部分支付', 3: '已支付', 4: '逾期', 5: '已作废' }
  return m[s || 0] || '未知'
}
const billStatusTag = (s?: number) => {
  const m: { [k: number]: string } = { 1: 'warning', 2: '', 3: 'success', 4: 'danger', 5: 'info' }
  return m[s || 0] || 'info'
}

const loadBills = async () => {
  try {
    const res = await billApi.getAll()
    let list: Bill[] = (res && Array.isArray(res) ? res : []) as Bill[]
    if (filters.billType) list = list.filter(b => b.billType === filters.billType)
    if (filters.billStatus) list = list.filter(b => b.billStatus === filters.billStatus)
    bills.value = list
  } catch (e) {
    ElMessage.warning('后端接口不可用，显示空数据')
    bills.value = []
  }
  // 加载门店下拉数据
  try {
    const s = await storeApi.getAll()
    stores.value = (s && Array.isArray(s) ? s : []) as any[]
  } catch (e) {
    stores.value = []
  }
}

const openDialog = (row?: Bill) => {
  if (row) Object.assign(form, { ...row })
  else Object.assign(form, { billStatus: 1, billType: 1, billNo: '', storeId: undefined, contractId: undefined, tenantId: undefined, roomId: undefined, amount: '', paidAmount: '', remark: '', paymentMethod: '' })
  dialogVisible.value = true
}

const saveBill = async () => {
  try {
    const ok = form.id
      ? await billApi.update(form as Bill) as unknown as boolean
      : await billApi.save(form as Bill) as unknown as boolean
    if (ok === true) { ElMessage.success(form.id ? '更新成功' : '新增成功'); dialogVisible.value = false; loadBills() }
    else ElMessage.error('保存失败')
  } catch (e) { ElMessage.error('保存失败，请检查后端服务') }
}

const payBill = (row: Bill) => {
  ElMessageBox.prompt('请输入支付方式（如 微信/支付宝/现金）', '收款', { inputValue: row.paymentMethod || '微信' })
    .then(async ({ value }) => {
      try {
        const ok = await billApi.pay(row.id!, value || '微信') as unknown as boolean
        if (ok === true) { ElMessage.success('收款成功'); loadBills() } else ElMessage.error('收款失败')
      } catch (e) { ElMessage.error('收款失败，请检查后端服务') }
    }).catch(() => {})
}

const deleteBill = (row: Bill) => {
  ElMessageBox.confirm(`确定删除账单 ${row.billNo}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await billApi.delete(row.id!) as unknown as boolean
        if (ok === true) { ElMessage.success('删除成功'); loadBills() } else ElMessage.error('删除失败')
      } catch (e) { ElMessage.error('删除失败，请检查后端服务') }
    }).catch(() => {})
}

onMounted(() => loadBills())
</script>

<style scoped>
.p-4 { padding: 1rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.font-bold { font-weight: 700; }
.mb-4 { margin-bottom: 1rem; }
</style>
