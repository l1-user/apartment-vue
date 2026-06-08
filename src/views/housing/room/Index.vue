<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">房间管理</h2>
    <ElRow :gutter="20" class="mb-4">
      <ElCol :span="6">
        <ElCard shadow="hover" class="cursor-pointer" @click="filterByStatus(undefined)">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-500">{{ rooms.length }}</div>
            <div class="text-gray-500 mt-2">房间总数</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard shadow="hover" class="cursor-pointer" @click="filterByStatus(1)">
          <div class="text-center">
            <div class="text-3xl font-bold text-green-500">{{ getStatusCount(1) }}</div>
            <div class="text-gray-500 mt-2">空闲</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard shadow="hover" class="cursor-pointer" @click="filterByStatus(2)">
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-500">{{ getStatusCount(2) }}</div>
            <div class="text-gray-500 mt-2">已租</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard shadow="hover" class="cursor-pointer" @click="filterByStatus(3)">
          <div class="text-center">
            <div class="text-3xl font-bold text-red-500">{{ getStatusCount(3) }}</div>
            <div class="text-gray-500 mt-2">维修中</div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
    <ElForm :inline="true" class="mb-4">
      <ElForm-item label="门店">
        <ElSelect v-model="filters.storeId" placeholder="全部门店" clearable style="width: 160px" @change="loadRooms">
          <ElOption v-for="s in stores" :key="s.id" :label="s.storeName" :value="s.id" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item label="楼栋">
        <ElSelect v-model="filters.buildingId" placeholder="全部楼栋" clearable style="width: 160px" @change="loadRooms">
          <ElOption v-for="b in filteredBuildings" :key="b.id" :label="b.buildingName" :value="b.id" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item label="房态">
        <ElSelect v-model="filters.status" placeholder="全部房态" clearable style="width: 140px" @change="loadRooms">
          <ElOption label="空闲" :value="1" />
          <ElOption label="已租" :value="2" />
          <ElOption label="维修中" :value="3" />
          <ElOption label="预留" :value="4" />
          <ElOption label="已预订" :value="5" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item>
        <ElButton type="primary" @click="loadRooms">查询</ElButton>
        <ElButton type="success" @click="openRoomDialog()">新增房间</ElButton>
        <ElButton @click="loadRooms">刷新</ElButton>
      </ElForm-item>
    </ElForm>
    <ElTable :data="filteredRooms" border stripe>
      <ElTable-column prop="roomCode" label="房间编号" width="120" />
      <ElTable-column prop="roomName" label="房间名称" width="140" />
      <ElTable-column prop="storeId" label="门店" width="140">
        <template #default="{ row }">{{ getStoreName(row.storeId) }}</template>
      </ElTable-column>
      <ElTable-column prop="buildingId" label="楼栋" width="120">
        <template #default="{ row }">{{ getBuildingName(row.buildingId) }}</template>
      </ElTable-column>
      <ElTable-column prop="floorNumber" label="楼层" width="80" />
      <ElTable-column prop="area" label="面积(㎡)" width="100" />
      <ElTable-column prop="orientation" label="朝向" width="80" />
      <ElTable-column prop="currentRent" label="租金(元/月)" width="120" />
      <ElTable-column prop="status" label="房态" width="100">
        <template #default="{ row }">
          <ElTag :type="getStatusTagType(row.status)" size="small">{{ getStatusLabel(row.status) }}</ElTag>
        </template>
      </ElTable-column>
      <ElTable-column prop="statusRemark" label="备注" width="140" show-overflow-tooltip />
      <ElTable-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <ElButton type="primary" link size="small" @click="openRoomDialog(row)">编辑</ElButton>
          <ElButton type="success" link size="small" @click="changeRoomStatus(row)">改房态</ElButton>
          <ElButton type="danger" link size="small" @click="deleteRoom(row)">删除</ElButton>
        </template>
      </ElTable-column>
    </ElTable>
    <ElDialog v-model="roomDialogVisible" :title="roomForm.id ? '编辑房间' : '新增房间'" width="600px">
      <ElForm :model="roomForm" label-width="100px" :rules="roomRules" ref="roomFormRef">
        <ElForm-item label="房间编号" prop="roomCode">
          <ElInput v-model="roomForm.roomCode" placeholder="如 A101" />
        </ElForm-item>
        <ElForm-item label="房间名称" prop="roomName">
          <ElInput v-model="roomForm.roomName" placeholder="如 101号房" />
        </ElForm-item>
        <ElForm-item label="门店" prop="storeId">
          <ElSelect v-model="roomForm.storeId" placeholder="选择门店" style="width: 100%">
            <ElOption v-for="s in stores" :key="s.id" :label="s.storeName" :value="s.id" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="楼栋" prop="buildingId">
          <ElSelect v-model="roomForm.buildingId" placeholder="选择楼栋" style="width: 100%">
            <ElOption v-for="b in getBuildingsByStore(roomForm.storeId)" :key="b.id" :label="b.buildingName" :value="b.id" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="房型" prop="roomTypeId">
          <ElSelect v-model="roomForm.roomTypeId" placeholder="选择房型" style="width: 100%">
            <ElOption v-for="r in roomTypes" :key="r.id" :label="r.typeName" :value="r.id" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="楼层" prop="floorNumber">
          <ElInput-number v-model="roomForm.floorNumber" :min="1" style="width: 100%" />
        </ElForm-item>
        <ElForm-item label="面积" prop="area">
          <ElInput v-model="roomForm.area" placeholder="如 25.5" />
        </ElForm-item>
        <ElForm-item label="朝向" prop="orientation">
          <ElInput v-model="roomForm.orientation" placeholder="如 南" />
        </ElForm-item>
        <ElForm-item label="租金" prop="currentRent">
          <ElInput v-model="roomForm.currentRent" placeholder="如 1500" />
        </ElForm-item>
        <ElForm-item label="房态" prop="status">
          <ElSelect v-model="roomForm.status" style="width: 100%">
            <ElOption label="空闲" :value="1" />
            <ElOption label="已租" :value="2" />
            <ElOption label="维修中" :value="3" />
            <ElOption label="预留" :value="4" />
            <ElOption label="已预订" :value="5" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="状态备注" prop="statusRemark">
          <ElInput v-model="roomForm.statusRemark" placeholder="可选" />
        </ElForm-item>
      </ElForm>
      <template #footer>
        <ElButton @click="roomDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="saveRoom">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElCard, ElRow, ElCol, ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElSelect, ElOption, ElInput, ElInputNumber, ElTag, ElDialog, ElMessageBox, ElMessage } from 'element-plus'
import type { Room, Store, Building, RoomType } from '@/types'
import { roomApi } from '@/api/room'
import { storeApi } from '@/api/store'
import { buildingApi } from '@/api/building'
import { roomTypeApi } from '@/api/roomType'

const rooms = ref<Room[]>([])
const stores = ref<Store[]>([])
const buildings = ref<Building[]>([])
const roomTypes = ref<RoomType[]>([])

const filters = reactive({
  storeId: undefined as number | undefined,
  buildingId: undefined as number | undefined,
  status: undefined as number | undefined
})

const roomDialogVisible = ref(false)
const roomFormRef = ref()
const roomForm = reactive<Partial<Room>>({ status: 1, floorNumber: 1 })
const roomRules = {
  roomCode: [{ required: true, message: '请输入房间编号', trigger: 'blur' }],
  storeId: [{ required: true, message: '请选择门店', trigger: 'change' }],
  buildingId: [{ required: true, message: '请选择楼栋', trigger: 'change' }],
  floorNumber: [{ required: true, message: '请输入楼层', trigger: 'blur' }],
  status: [{ required: true, message: '请选择房态', trigger: 'change' }]
}

const filteredRooms = computed(() => {
  let result = rooms.value
  if (filters.storeId) result = result.filter(r => r.storeId === filters.storeId)
  if (filters.buildingId) result = result.filter(r => r.buildingId === filters.buildingId)
  if (filters.status) result = result.filter(r => r.status === filters.status)
  return result
})

const filteredBuildings = computed(() => {
  if (!filters.storeId) return buildings.value
  return buildings.value.filter(b => b.storeId === filters.storeId)
})

const getStoreName = (id?: number) => stores.value.find(s => s.id === id)?.storeName || '-'
const getBuildingName = (id?: number) => buildings.value.find(b => b.id === id)?.buildingName || '-'
const getBuildingsByStore = (storeId?: number) => !storeId ? buildings.value : buildings.value.filter(b => b.storeId === storeId)

const getStatusLabel = (status?: number) => {
  const map: { [k: number]: string } = { 1: '空闲', 2: '已租', 3: '维修中', 4: '预留', 5: '已预订' }
  return map[status || 0] || '未知'
}
const getStatusTagType = (status?: number) => {
  const map: { [k: number]: string } = { 1: 'success', 2: 'warning', 3: 'danger', 4: 'info', 5: '' }
  return map[status || 0] || 'info'
}
const getStatusCount = (status: number) => rooms.value.filter(r => r.status === status).length

const loadRooms = async () => {
  try {
    const res = await roomApi.getAll()
    rooms.value = (res && Array.isArray(res) ? res : []) as Room[]
  } catch (e) { ElMessage.warning('后端接口不可用，显示空数据'); rooms.value = [] }
}
const loadStores = async () => {
  try {
    const res = await storeApi.getAll()
    stores.value = (res && Array.isArray(res) ? res : []) as Store[]
  } catch (e) { stores.value = [] }
}
const loadBuildings = async () => {
  try {
    const res = await buildingApi.getAll()
    buildings.value = (res && Array.isArray(res) ? res : []) as Building[]
  } catch (e) { buildings.value = [] }
}
const loadRoomTypes = async () => {
  try {
    const res = await roomTypeApi.getAll()
    roomTypes.value = (res && Array.isArray(res) ? res : []) as RoomType[]
  } catch (e) { roomTypes.value = [] }
}

const filterByStatus = (status: number | undefined) => { filters.status = status; loadRooms() }

const openRoomDialog = (row?: Room) => {
  if (row) Object.assign(roomForm, { ...row })
  else Object.assign(roomForm, { status: 1, floorNumber: 1, roomCode: '', roomName: '', storeId: undefined, buildingId: undefined, roomTypeId: undefined, area: '', orientation: '', currentRent: '', statusRemark: '' })
  roomDialogVisible.value = true
}

const saveRoom = async () => {
  try {
    const ok = roomForm.id
      ? await roomApi.update(roomForm as Room) as unknown as boolean
      : await roomApi.save(roomForm as Room) as unknown as boolean
    if (ok === true) { ElMessage.success(roomForm.id ? '更新成功' : '新增成功'); roomDialogVisible.value = false; loadRooms() }
    else ElMessage.error('保存失败')
  } catch (e) { ElMessage.error('保存失败，请检查后端服务') }
}

const changeRoomStatus = (row: Room) => {
  ElMessageBox.prompt('请选择新的房态（1-空闲 2-已租 3-维修中 4-预留 5-已预订）', '修改房态', { inputPlaceholder: '输入 1-5', inputValue: String(row.status || 1) }).then(async ({ value }) => {
    const newStatus = Number(value)
    if (newStatus >= 1 && newStatus <= 5) {
      try {
        const ok = await roomApi.updateStatus(row.id!, newStatus) as unknown as boolean
        if (ok === true) { ElMessage.success('房态修改成功'); loadRooms() } else ElMessage.error('修改失败')
      } catch (e) { ElMessage.error('修改失败，请检查后端服务') }
    } else ElMessage.warning('请输入 1-5 的数字')
  }).catch(() => {})
}

const deleteRoom = (row: Room) => {
  ElMessageBox.confirm(`确定删除房间 ${row.roomCode}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await roomApi.delete(row.id!) as unknown as boolean
        if (ok === true) { ElMessage.success('删除成功'); loadRooms() } else ElMessage.error('删除失败')
      } catch (e) { ElMessage.error('删除失败，请检查后端服务') }
    }).catch(() => {})
}

onMounted(() => { loadStores(); loadBuildings(); loadRooms(); loadRoomTypes() })
</script>

<style scoped>
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.font-bold { font-weight: 700; }
.mb-4 { margin-bottom: 1rem; }
.p-4 { padding: 1rem; }
.text-blue-500 { color: #3b82f6; }
.text-green-500 { color: #22c55e; }
.text-orange-500 { color: #f97316; }
.text-red-500 { color: #ef4444; }
.text-gray-500 { color: #6b7280; }
.mt-2 { margin-top: 0.5rem; }
.cursor-pointer { cursor: pointer; }
.text-center { text-align: center; }
</style>
