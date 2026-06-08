<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElDatePicker, ElMessage, ElPagination, ElTag, ElCard, ElRow, ElCol } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { Contract } from '@/types'
import { contractApi } from '@/api/contract'
import { tenantApi } from '@/api/tenant'
import { roomApi } from '@/api/room'

const contracts = ref<Contract[]>([])
const tenants = ref<any[]>([])
const rooms = ref<any[]>([])
const dialogVisible = ref(false)
const editDialogVisible = ref(false)

const form = ref<Contract>({
  contractNo: '',
  tenantId: 0,
  roomId: 0,
  startDate: '',
  endDate: '',
  rentAmount: '',
  rentUnit: '月',
  depositAmount: '',
  paymentMethod: '月付',
  status: 1
})

const editForm = ref<Contract>({
  contractNo: '',
  tenantId: 0,
  roomId: 0,
  startDate: '',
  endDate: '',
  rentAmount: '',
  rentUnit: '月',
  depositAmount: '',
  paymentMethod: '月付',
  status: 1
})

const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})

const filters = ref({
  tenantId: undefined as number | undefined,
  roomId: undefined as number | undefined,
  status: undefined as number | undefined
})

const statusOptions = [
  { label: '有效', value: 1, type: 'success' },
  { label: '已到期', value: 2, type: 'info' },
  { label: '已终止', value: 3, type: 'danger' }
]

const paymentMethods = [
  { label: '月付', value: '月付' },
  { label: '季付', value: '季付' },
  { label: '半年付', value: '半年付' },
  { label: '年付', value: '年付' }
]

const rules = computed(() => ({
  contractNo: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
  tenantId: [{ required: true, message: '请选择租客', trigger: 'change' }],
  roomId: [{ required: true, message: '请选择房间', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  rentAmount: [{ required: true, message: '请输入租金', trigger: 'blur' }],
  depositAmount: [{ required: true, message: '请输入押金', trigger: 'blur' }],
  paymentMethod: [{ required: true, message: '请选择付款方式', trigger: 'change' }]
}))

const loadData = async () => {
  try {
    const response = await contractApi.getPage({
      current: pagination.value.current,
      size: pagination.value.size,
      tenantId: filters.value.tenantId,
      roomId: filters.value.roomId,
      status: filters.value.status
    })
    contracts.value = response.records || []
    pagination.value.total = response.total || 0
  } catch (error) {
    ElMessage.error('加载合同数据失败')
  }
}

const loadTenants = async () => {
  try {
    tenants.value = await tenantApi.getAll()
  } catch (error) {
    ElMessage.error('加载租客数据失败')
  }
}

const loadRooms = async () => {
  try {
    rooms.value = await roomApi.getAll()
  } catch (error) {
    ElMessage.error('加载房间数据失败')
  }
}

const handleSearch = () => {
  pagination.value.current = 1
  loadData()
}

const handleAdd = () => {
  form.value = {
    contractNo: '',
    tenantId: 0,
    roomId: 0,
    startDate: '',
    endDate: '',
    rentAmount: '',
    rentUnit: '月',
    depositAmount: '',
    paymentMethod: '月付',
    status: 1
  }
  dialogVisible.value = true
}

const handleEdit = async (contract: Contract) => {
  try {
    const response = await contractApi.getById(contract.id!)
    editForm.value = response
    editDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取合同信息失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    await contractApi.delete(id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleSave = async () => {
  try {
    await contractApi.save(form.value)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

const handleUpdate = async () => {
  try {
    await contractApi.update(editForm.value)
    ElMessage.success('更新成功')
    editDialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const getStatusLabel = (status: number) => {
  const option = statusOptions.find((opt) => opt.value === status)
  return option ? option.label : '未知'
}

const getStatusType = (status: number) => {
  const option = statusOptions.find((opt) => opt.value === status)
  return option ? option.type : 'info'
}

const getTenantName = (tenantId: number) => {
  const tenant = tenants.value.find((t) => t.id === tenantId)
  return tenant ? tenant.tenantName : '-'
}

const getRoomCode = (roomId: number) => {
  const room = rooms.value.find((r) => r.id === roomId)
  return room ? room.roomCode : '-'
}

onMounted(() => {
  loadData()
  loadTenants()
  loadRooms()
})
</script>

<template>
  <div>
    <ElCard shadow="never" class="mb-4">
      <ElRow :gutter="20" align="middle">
        <ElCol :span="20">
          <div class="flex gap-4 items-center">
            <ElSelect v-model="filters.tenantId" placeholder="选择租客" class="w-40" clearable>
              <ElOption v-for="tenant in tenants" :key="tenant.id" :label="tenant.tenantName" :value="tenant.id" />
            </ElSelect>
            <ElSelect v-model="filters.roomId" placeholder="选择房间" class="w-40" clearable>
              <ElOption v-for="room in rooms" :key="room.id" :label="room.roomCode" :value="room.id" />
            </ElSelect>
            <ElSelect v-model="filters.status" placeholder="选择状态" class="w-32" clearable>
              <ElOption v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value" />
            </ElSelect>
            <ElButton type="primary" @click="handleSearch">查询</ElButton>
          </div>
        </ElCol>
        <ElCol :span="4" class="text-right">
          <ElButton type="primary" :icon="Plus" @click="handleAdd">添加合同</ElButton>
        </ElCol>
      </ElRow>
    </ElCard>

    <ElCard shadow="never">
      <ElTable :data="contracts" border style="width: 100%">
        <ElTableColumn prop="contractNo" label="合同编号" width="150" />
        <ElTableColumn label="租客" width="120">
          <template #default="scope">
            {{ getTenantName(scope.row.tenantId) }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="房间" width="120">
          <template #default="scope">
            {{ getRoomCode(scope.row.roomId) }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="startDate" label="开始日期" width="120" />
        <ElTableColumn prop="endDate" label="结束日期" width="120" />
        <ElTableColumn prop="rentAmount" label="租金" width="100" />
        <ElTableColumn prop="rentUnit" label="单位" width="80" />
        <ElTableColumn prop="depositAmount" label="押金" width="100" />
        <ElTableColumn prop="paymentMethod" label="付款方式" width="100" />
        <ElTableColumn label="状态" width="100">
          <template #default="scope">
            <ElTag :type="getStatusType(scope.row.status)">{{ getStatusLabel(scope.row.status) }}</ElTag>
          </template>
        </ElTableColumn>
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

    <ElDialog title="添加合同" v-model="dialogVisible" width="600px">
      <ElForm :model="form" :rules="rules" label-width="100px">
        <ElFormItem label="合同编号" prop="contractNo">
          <ElInput v-model="form.contractNo" />
        </ElFormItem>
        <ElFormItem label="租客" prop="tenantId">
          <ElSelect v-model="form.tenantId" class="w-full">
            <ElOption v-for="tenant in tenants" :key="tenant.id" :label="tenant.tenantName" :value="tenant.id" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="房间" prop="roomId">
          <ElSelect v-model="form.roomId" class="w-full">
            <ElOption v-for="room in rooms" :key="room.id" :label="room.roomCode" :value="room.id" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="开始日期" prop="startDate">
          <ElDatePicker v-model="form.startDate" type="date" class="w-full" value-format="YYYY-MM-DD" />
        </ElFormItem>
        <ElFormItem label="结束日期" prop="endDate">
          <ElDatePicker v-model="form.endDate" type="date" class="w-full" value-format="YYYY-MM-DD" />
        </ElFormItem>
        <ElFormItem label="租金" prop="rentAmount">
          <ElInput v-model="form.rentAmount" />
        </ElFormItem>
        <ElFormItem label="租金单位">
          <ElSelect v-model="form.rentUnit" class="w-full">
            <ElOption label="月" value="月" />
            <ElOption label="季" value="季" />
            <ElOption label="年" value="年" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="押金" prop="depositAmount">
          <ElInput v-model="form.depositAmount" />
        </ElFormItem>
        <ElFormItem label="付款方式" prop="paymentMethod">
          <ElSelect v-model="form.paymentMethod" class="w-full">
            <ElOption v-for="method in paymentMethods" :key="method.value" :label="method.label" :value="method.value" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="form.status" class="w-full">
            <ElOption v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value" />
          </ElSelect>
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

    <ElDialog title="编辑合同" v-model="editDialogVisible" width="600px">
      <ElForm :model="editForm" :rules="rules" label-width="100px">
        <ElFormItem label="合同编号" prop="contractNo">
          <ElInput v-model="editForm.contractNo" />
        </ElFormItem>
        <ElFormItem label="租客" prop="tenantId">
          <ElSelect v-model="editForm.tenantId" class="w-full">
            <ElOption v-for="tenant in tenants" :key="tenant.id" :label="tenant.tenantName" :value="tenant.id" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="房间" prop="roomId">
          <ElSelect v-model="editForm.roomId" class="w-full">
            <ElOption v-for="room in rooms" :key="room.id" :label="room.roomCode" :value="room.id" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="开始日期" prop="startDate">
          <ElDatePicker v-model="editForm.startDate" type="date" class="w-full" value-format="YYYY-MM-DD" />
        </ElFormItem>
        <ElFormItem label="结束日期" prop="endDate">
          <ElDatePicker v-model="editForm.endDate" type="date" class="w-full" value-format="YYYY-MM-DD" />
        </ElFormItem>
        <ElFormItem label="租金" prop="rentAmount">
          <ElInput v-model="editForm.rentAmount" />
        </ElFormItem>
        <ElFormItem label="租金单位">
          <ElSelect v-model="editForm.rentUnit" class="w-full">
            <ElOption label="月" value="月" />
            <ElOption label="季" value="季" />
            <ElOption label="年" value="年" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="押金" prop="depositAmount">
          <ElInput v-model="editForm.depositAmount" />
        </ElFormItem>
        <ElFormItem label="付款方式" prop="paymentMethod">
          <ElSelect v-model="editForm.paymentMethod" class="w-full">
            <ElOption v-for="method in paymentMethods" :key="method.value" :label="method.label" :value="method.value" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="editForm.status" class="w-full">
            <ElOption v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value" />
          </ElSelect>
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
