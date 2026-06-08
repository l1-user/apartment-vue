<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">退租管理</h2>

    <!-- 筛选 -->
    <ElForm :inline="true" class="mb-4">
      <ElForm-item label="申请状态">
        <ElSelect v-model="filters.status" placeholder="全部" clearable style="width: 160px" @change="loadList">
          <ElOption label="待审核" :value="1" />
          <ElOption label="审核通过" :value="2" />
          <ElOption label="已拒绝" :value="3" />
          <ElOption label="已完成" :value="4" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item>
        <ElButton type="primary" @click="loadList">查询</ElButton>
        <ElButton type="success" @click="openDialog">发起退租申请</ElButton>
        <ElButton @click="loadList">刷新</ElButton>
      </ElForm-item>
    </ElForm>

    <!-- 表格 -->
    <ElTable :data="applications" border stripe>
      <ElTable-column prop="applicationNo" label="申请编号" width="160" />
      <ElTable-column prop="storeId" label="门店ID" width="100" />
      <ElTable-column prop="contractId" label="合同ID" width="100" />
      <ElTable-column prop="tenantId" label="租户ID" width="100" />
      <ElTable-column prop="roomId" label="房间ID" width="100" />
      <ElTable-column prop="applicationDate" label="申请日期" width="120" />
      <ElTable-column prop="expectedCheckOutDate" label="预计退房" width="120" />
      <ElTable-column prop="actualCheckOutDate" label="实际退房" width="120" />
      <ElTable-column prop="checkOutReason" label="退房原因" min-width="180" show-overflow-tooltip />
      <ElTable-column prop="applicationStatus" label="状态" width="100">
        <template #default="{ row }">
          <ElTag :type="statusTag(row.applicationStatus)" size="small">{{ statusText(row.applicationStatus) }}</ElTag>
        </template>
      </ElTable-column>
      <ElTable-column prop="approver" label="审核人" width="100" />
      <ElTable-column prop="approveRemark" label="审核意见" min-width="150" show-overflow-tooltip />
      <ElTable-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <ElButton type="primary" link size="small" @click="openDialog(row)">编辑</ElButton>
          <ElButton v-if="row.applicationStatus === 1" type="success" link size="small" @click="approve(row)">通过</ElButton>
          <ElButton v-if="row.applicationStatus === 1" type="warning" link size="small" @click="reject(row)">拒绝</ElButton>
          <ElButton v-if="row.applicationStatus === 2" type="info" link size="small" @click="complete(row)">完成退房</ElButton>
          <ElButton type="danger" link size="small" @click="deleteRow(row)">删除</ElButton>
        </template>
      </ElTable-column>
    </ElTable>
  </div>

  <!-- 弹窗 -->
  <ElDialog v-model="dialogVisible" :title="form.id ? '编辑申请' : '发起退租申请'" width="720px">
    <ElForm :model="form" label-width="130px" :rules="rules" ref="formRef">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElForm-item label="申请编号">
            <ElInput v-model="form.applicationNo" placeholder="可选" />
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
          <ElForm-item label="申请日期" prop="applicationDate">
            <ElDatePicker v-model="form.applicationDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="预计退房" prop="expectedCheckOutDate">
            <ElDatePicker v-model="form.expectedCheckOutDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="实际退房">
            <ElDatePicker v-model="form.actualCheckOutDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
          </ElForm-item>
        </ElCol>
        <ElCol :span="12">
          <ElForm-item label="申请状态" prop="applicationStatus">
            <ElSelect v-model="form.applicationStatus" style="width: 100%">
              <ElOption label="待审核" :value="1" />
              <ElOption label="审核通过" :value="2" />
              <ElOption label="已拒绝" :value="3" />
              <ElOption label="已完成" :value="4" />
            </ElSelect>
          </ElForm-item>
        </ElCol>
        <ElCol :span="24">
          <ElForm-item label="退房原因">
            <ElInput v-model="form.checkOutReason" type="textarea" :rows="2" />
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
      <ElButton type="primary" @click="save">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElSelect, ElOption, ElInput,
  ElTag, ElDialog, ElMessage, ElMessageBox, ElInputNumber, ElDatePicker, ElRow, ElCol
} from 'element-plus'
import type { CheckOutApplication } from '@/types'
import { checkOutApplicationApi } from '@/api/checkOutApplication'
import { storeApi } from '@/api/store'

const applications = ref<CheckOutApplication[]>([])
const filters = reactive({ status: undefined as number | undefined })
const stores = ref<any[]>([])

const dialogVisible = ref(false)
const formRef = ref()
const form = reactive<Partial<CheckOutApplication>>({ applicationStatus: 1 })
const rules = {
  storeId: [{ required: true, message: '请选择所属门店', trigger: 'change' }],
  contractId: [{ required: true, message: '请输入合同ID', trigger: 'blur' }],
  tenantId: [{ required: true, message: '请输入租户ID', trigger: 'blur' }],
  roomId: [{ required: true, message: '请输入房间ID', trigger: 'blur' }],
  expectedCheckOutDate: [{ required: true, message: '请选择预计退房日期', trigger: 'change' }],
  applicationStatus: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const statusText = (s?: number) => {
  const m: { [k: number]: string } = { 1: '待审核', 2: '审核通过', 3: '已拒绝', 4: '已完成' }
  return m[s || 0] || '未知'
}
const statusTag = (s?: number) => {
  const m: { [k: number]: string } = { 1: 'warning', 2: 'success', 3: 'danger', 4: 'info' }
  return m[s || 0] || 'info'
}

const loadList = async () => {
  try {
    const res = await checkOutApplicationApi.getAll()
    let list: CheckOutApplication[] = (res && Array.isArray(res) ? res : []) as CheckOutApplication[]
    if (filters.status) list = list.filter(a => a.applicationStatus === filters.status)
    applications.value = list
  } catch (e) {
    ElMessage.warning('后端接口不可用，显示空数据')
    applications.value = []
  }
  // 加载门店
  try {
    const s = await storeApi.getAll()
    stores.value = (s && Array.isArray(s) ? s : []) as any[]
  } catch (e) {
    stores.value = []
  }
}

const openDialog = (row?: CheckOutApplication) => {
  if (row) Object.assign(form, { ...row })
  else Object.assign(form, { applicationStatus: 1, storeId: undefined, applicationNo: '', contractId: undefined, tenantId: undefined, roomId: undefined, applicationDate: '', expectedCheckOutDate: '', actualCheckOutDate: '', checkOutReason: '', remark: '' })
  dialogVisible.value = true
}

const save = async () => {
  try {
    const ok = form.id
      ? await checkOutApplicationApi.update(form as CheckOutApplication) as unknown as boolean
      : await checkOutApplicationApi.save(form as CheckOutApplication) as unknown as boolean
    if (ok === true) { ElMessage.success(form.id ? '更新成功' : '新增成功'); dialogVisible.value = false; loadList() }
    else ElMessage.error('保存失败')
  } catch (e) { ElMessage.error('保存失败，请检查后端服务') }
}

const approve = (row: CheckOutApplication) => {
  ElMessageBox.prompt('请输入审核人（可选）', '审核通过', { inputValue: row.approver || '管理员' })
    .then(async ({ value }) => {
      try {
        const ok = await checkOutApplicationApi.approve(row.id!, value) as unknown as boolean
        if (ok === true) { ElMessage.success('审核通过'); loadList() } else ElMessage.error('操作失败')
      } catch (e) { ElMessage.error('操作失败，请检查后端服务') }
    }).catch(() => {})
}

const reject = (row: CheckOutApplication) => {
  ElMessageBox.prompt('请输入拒绝原因', '拒绝申请', { inputValue: '' })
    .then(async ({ value }) => {
      try {
        const ok = await checkOutApplicationApi.reject(row.id!, row.approver || '管理员', value) as unknown as boolean
        if (ok === true) { ElMessage.success('已拒绝'); loadList() } else ElMessage.error('操作失败')
      } catch (e) { ElMessage.error('操作失败，请检查后端服务') }
    }).catch(() => {})
}

const complete = (row: CheckOutApplication) => {
  ElMessageBox.confirm(`确定完成退租?将标记房间为空闲状态`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await checkOutApplicationApi.complete(row.id!, row.expectedCheckOutDate) as unknown as boolean
        if (ok === true) { ElMessage.success('退房完成'); loadList() } else ElMessage.error('操作失败')
      } catch (e) { ElMessage.error('操作失败，请检查后端服务') }
    }).catch(() => {})
}

const deleteRow = (row: CheckOutApplication) => {
  ElMessageBox.confirm(`确定删除申请 ${row.applicationNo || row.id}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await checkOutApplicationApi.delete(row.id!) as unknown as boolean
        if (ok === true) { ElMessage.success('删除成功'); loadList() } else ElMessage.error('删除失败')
      } catch (e) { ElMessage.error('删除失败，请检查后端服务') }
    }).catch(() => {})
}

onMounted(() => loadList())
</script>

<style scoped>
.p-4 { padding: 1rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.font-bold { font-weight: 700; }
.mb-4 { margin-bottom: 1rem; }
</style>
