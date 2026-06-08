<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElMessage, ElPagination, ElTag, ElCard, ElRow, ElCol, ElIcon } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { Room } from '@/types'
import { roomApi } from '@/api/room'
import { storeApi } from '@/api/store'
import { buildingApi } from '@/api/building'
import { roomTypeApi } from '@/api/roomType'

const rooms = ref<Room[]>([])
const stores = ref<any[]>([])
const buildings = ref<any[]>([])
const roomTypes = ref<any[]>([])
const dialogVisible = ref(false)
const editDialogVisible = ref(false)
const formRef = ref()
const editFormRef = ref()

const form = ref<Room>({
  roomCode: '',
  roomName: '',
  storeId: 0,
  buildingId: 0,
  floorNumber: 0,
  roomTypeId: 0,
  area: '',
  orientation: '',
  status: 1,
  currentRent: '',
  rentUnit: '月'
})

const editForm = ref<Room>({
  roomCode: '',
  roomName: '',
  storeId: 0,
  buildingId: 0,
  floorNumber: 0,
  roomTypeId: 0,
  area: '',
  orientation: '',
  status: 1,
  currentRent: '',
  rentUnit: '月'
})

const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})

const filters = ref({
  storeId: undefined as number | undefined,
  buildingId: undefined as number | undefined,
  status: undefined as number | undefined
})

const statusOptions = [
  { label: '空闲', value: 1, type: 'success' },
  { label: '已租', value: 2, type: 'primary' },
  { label: '维修中', value: 3, type: 'warning' },
  { label: '预留', value: 4, type: 'info' },
  { label: '已预订', value: 5, type: 'danger' }
]

const orientationOptions = ['东', '南', '西', '北', '东南', '东北', '西南', '西北']

const rules = computed(() => ({
  roomCode: [{ required: true, message: '请输入房间编码', trigger: 'blur' }],
  roomName: [{ required: true, message: '请输入房间名称', trigger: 'blur' }],
  storeId: [{ required: true, message: '请选择门店', trigger: 'change' }],
  buildingId: [{ required: true, message: '请选择楼栋', trigger: 'change' }],
  floorNumber: [{ required: true, message: '请输入楼层', trigger: 'blur' }],
  roomTypeId: [{ required: true, message: '请选择房型', trigger: 'change' }],
  currentRent: [{ required: true, message: '请输入租金', trigger: 'blur' }]
}))

const loadData = async () => {
  try {
    const response = await roomApi.getPage({
      current: pagination.value.current,
      size: pagination.value.size,
      storeId: filters.value.storeId,
      buildingId: filters.value.buildingId,
      status: filters.value.status
    })
    rooms.value = response.records || []
    pagination.value.total = response.total || 0
  } catch (error) {
    ElMessage.error('加载房间数据失败')
  }
}

const loadStores = async () => {
  try {
    stores.value = await storeApi.getAll()
  } catch (error) {
    ElMessage.error('加载门店数据失败')
  }
}

const loadBuildings = async () => {
  try {
    buildings.value = await buildingApi.getAll()
  } catch (error) {
    ElMessage.error('加载楼栋数据失败')
  }
}

const loadRoomTypes = async () => {
  try {
    roomTypes.value = await roomTypeApi.getAll()
  } catch (error) {
    ElMessage.error('加载房型数据失败')
  }
}

const handleStoreChange = () => {
  filters.value.buildingId = undefined
  loadData()
}

const handleSearch = () => {
  pagination.value.current = 1
  loadData()
}

const handleAdd = () => {
  form.value = {
    roomCode: '',
    roomName: '',
    storeId: 0,
    buildingId: 0,
    floorNumber: 0,
    roomTypeId: 0,
    area: '',
    orientation: '',
    status: 1,
    currentRent: '',
    rentUnit: '月'
  }
  dialogVisible.value = true
}

const handleEdit = async (room: Room) => {
  try {
    const response = await roomApi.getById(room.id!)
    editForm.value = response
    editDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取房间信息失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    await roomApi.delete(id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleSave = async () => {
  try {
    await roomApi.save(form.value)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

const handleUpdate = async () => {
  try {
    await roomApi.update(editForm.value)
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

const getStoreName = (storeId: number) => {
  const store = stores.value.find((s) => s.id === storeId)
  return store ? store.storeName : '-'
}

const getBuildingName = (buildingId: number) => {
  const building = buildings.value.find((b) => b.id === buildingId)
  return building ? building.buildingName : '-'
}

const getRoomTypeName = (roomTypeId: number) => {
  const roomType = roomTypes.value.find((rt) => rt.id === roomTypeId)
  return roomType ? roomType.typeName : '-'
}

onMounted(() => {
  loadData()
  loadStores()
  loadBuildings()
  loadRoomTypes()
})
</script>

<template>
  <div>
    <ElCard shadow="never" class="mb-4">
      <ElRow :gutter="20" align="middle">
        <ElCol :span="20">
          <div class="flex gap-4 items-center">
            <ElSelect v-model="filters.storeId" placeholder="选择门店" class="w-40" clearable @change="handleStoreChange">
              <ElOption v-for="store in stores" :key="store.id" :label="store.storeName" :value="store.id" />
            </ElSelect>
            <ElSelect v-model="filters.buildingId" placeholder="选择楼栋" class="w-40" clearable>
              <ElOption v-for="building in buildings" :key="building.id" :label="building.buildingName" :value="building.id" />
            </ElSelect>
            <ElSelect v-model="filters.status" placeholder="选择状态" class="w-32" clearable>
              <ElOption v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value" />
            </ElSelect>
            <ElButton type="primary" @click="handleSearch">查询</ElButton>
          </div>
        </ElCol>
        <ElCol :span="4" class="text-right">
          <ElButton type="primary" :icon="Plus" @click="handleAdd">添加房间</ElButton>
        </ElCol>
      </ElRow>
    </ElCard>

    <ElCard shadow="never">
      <ElTable :data="rooms" border style="width: 100%">
        <ElTableColumn prop="roomCode" label="房间编码" width="120" />
        <ElTableColumn prop="roomName" label="房间名称" width="120" />
        <ElTableColumn label="门店" width="120">
          <template #default="scope">
            {{ getStoreName(scope.row.storeId) }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="楼栋" width="120">
          <template #default="scope">
            {{ getBuildingName(scope.row.buildingId) }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="floorNumber" label="楼层" width="80" />
        <ElTableColumn label="房型" width="100">
          <template #default="scope">
            {{ getRoomTypeName(scope.row.roomTypeId) }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="area" label="面积(㎡)" width="100" />
        <ElTableColumn prop="orientation" label="朝向" width="80" />
        <ElTableColumn label="状态" width="100">
          <template #default="scope">
            <ElTag :type="getStatusType(scope.row.status)">{{ getStatusLabel(scope.row.status) }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="currentRent" label="租金" width="100" />
        <ElTableColumn prop="rentUnit" label="单位" width="80" />
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

    <ElDialog title="添加房间" v-model="dialogVisible" width="600px">
      <ElForm :model="form" :rules="rules" ref="formRef" label-width="100px">
        <ElFormItem label="房间编码" prop="roomCode">
          <ElInput v-model="form.roomCode" />
        </ElFormItem>
        <ElFormItem label="房间名称" prop="roomName">
          <ElInput v-model="form.roomName" />
        </ElFormItem>
        <ElFormItem label="门店" prop="storeId">
          <ElSelect v-model="form.storeId" class="w-full">
            <ElOption v-for="store in stores" :key="store.id" :label="store.storeName" :value="store.id" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="楼栋" prop="buildingId">
          <ElSelect v-model="form.buildingId" class="w-full">
            <ElOption v-for="building in buildings" :key="building.id" :label="building.buildingName" :value="building.id" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="楼层" prop="floorNumber">
          <ElInput type="number" v-model.number="form.floorNumber" />
        </ElFormItem>
        <ElFormItem label="房型" prop="roomTypeId">
          <ElSelect v-model="form.roomTypeId" class="w-full">
            <ElOption v-for="roomType in roomTypes" :key="roomType.id" :label="roomType.typeName" :value="roomType.id" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="面积">
          <ElInput v-model="form.area" />
        </ElFormItem>
        <ElFormItem label="朝向">
          <ElSelect v-model="form.orientation" class="w-full">
            <ElOption v-for="o in orientationOptions" :key="o" :label="o" :value="o" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="form.status" class="w-full">
            <ElOption v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="租金" prop="currentRent">
          <ElInput v-model="form.currentRent" />
        </ElFormItem>
        <ElFormItem label="租金单位">
          <ElSelect v-model="form.rentUnit" class="w-full">
            <ElOption label="月" value="月" />
            <ElOption label="季" value="季" />
            <ElOption label="年" value="年" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSave">确定</ElButton>
      </template>
    </ElDialog>

    <ElDialog title="编辑房间" v-model="editDialogVisible" width="600px">
      <ElForm :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
        <ElFormItem label="房间编码" prop="roomCode">
          <ElInput v-model="editForm.roomCode" />
        </ElFormItem>
        <ElFormItem label="房间名称" prop="roomName">
          <ElInput v-model="editForm.roomName" />
        </ElFormItem>
        <ElFormItem label="门店" prop="storeId">
          <ElSelect v-model="editForm.storeId" class="w-full">
            <ElOption v-for="store in stores" :key="store.id" :label="store.storeName" :value="store.id" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="楼栋" prop="buildingId">
          <ElSelect v-model="editForm.buildingId" class="w-full">
            <ElOption v-for="building in buildings" :key="building.id" :label="building.buildingName" :value="building.id" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="楼层" prop="floorNumber">
          <ElInput type="number" v-model.number="editForm.floorNumber" />
        </ElFormItem>
        <ElFormItem label="房型" prop="roomTypeId">
          <ElSelect v-model="editForm.roomTypeId" class="w-full">
            <ElOption v-for="roomType in roomTypes" :key="roomType.id" :label="roomType.typeName" :value="roomType.id" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="面积">
          <ElInput v-model="editForm.area" />
        </ElFormItem>
        <ElFormItem label="朝向">
          <ElSelect v-model="editForm.orientation" class="w-full">
            <ElOption v-for="o in orientationOptions" :key="o" :label="o" :value="o" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="editForm.status" class="w-full">
            <ElOption v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="租金" prop="currentRent">
          <ElInput v-model="editForm.currentRent" />
        </ElFormItem>
        <ElFormItem label="租金单位">
          <ElSelect v-model="editForm.rentUnit" class="w-full">
            <ElOption label="月" value="月" />
            <ElOption label="季" value="季" />
            <ElOption label="年" value="年" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="editDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleUpdate">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>
