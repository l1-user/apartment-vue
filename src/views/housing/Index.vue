<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">房源管理</h2>

    <!-- 统计卡片 -->
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

    <!-- Tab切换 -->
    <ElTabs v-model="activeTab" class="mt-4">
      <!-- 房间管理 -->
      <ElTab-pane label="房间管理" name="room">
        <!-- 筛选条件 -->
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

        <!-- 房间表格 -->
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
      </ElTab-pane>

      <!-- 门店管理 -->
      <ElTab-pane label="门店管理" name="store">
        <ElForm :inline="true" class="mb-4">
          <ElForm-item>
            <ElButton type="success" @click="openStoreDialog()">新增门店</ElButton>
            <ElButton @click="loadStores">刷新</ElButton>
          </ElForm-item>
        </ElForm>

        <ElTable :data="stores" border stripe>
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
              <ElButton type="primary" link size="small" @click="openStoreDialog(row)">编辑</ElButton>
              <ElButton type="danger" link size="small" @click="deleteStore(row)">删除</ElButton>
            </template>
          </ElTable-column>
        </ElTable>
      </ElTab-pane>

      <!-- 楼栋管理 -->
      <ElTab-pane label="楼栋管理" name="building">
        <ElForm :inline="true" class="mb-4">
          <ElForm-item label="门店">
            <ElSelect v-model="filters.storeId" placeholder="全部门店" clearable style="width: 160px" @change="loadBuildings">
              <ElOption v-for="s in stores" :key="s.id" :label="s.storeName" :value="s.id" />
            </ElSelect>
          </ElForm-item>
          <ElForm-item>
            <ElButton type="success" @click="openBuildingDialog()">新增楼栋</ElButton>
            <ElButton @click="loadBuildings">刷新</ElButton>
          </ElForm-item>
        </ElForm>

        <ElTable :data="buildings" border stripe>
          <ElTable-column prop="buildingCode" label="楼栋编号" width="120" />
          <ElTable-column prop="buildingName" label="楼栋名称" width="160" />
          <ElTable-column prop="storeId" label="所属门店" width="160">
            <template #default="{ row }">{{ getStoreName(row.storeId) }}</template>
          </ElTable-column>
          <ElTable-column prop="totalFloors" label="楼层数" width="80" />
          <ElTable-column prop="hasElevator" label="电梯" width="80">
            <template #default="{ row }">{{ row.hasElevator === 1 ? '有' : '无' }}</template>
          </ElTable-column>
          <ElTable-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <ElTag :type="row.status === 1 ? 'success' : 'info'" size="small">{{ row.status === 1 ? '正常' : '停用' }}</ElTag>
            </template>
            </ElTable-column>
          <ElTable-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <ElButton type="primary" link size="small" @click="openBuildingDialog(row)">编辑</ElButton>
              <ElButton type="danger" link size="small" @click="deleteBuilding(row)">删除</ElButton>
            </template>
          </ElTable-column>
        </ElTable>
      </ElTab-pane>

      <!-- 房型模板 -->
      <ElTab-pane label="房型模板" name="roomType">
        <ElForm :inline="true" class="mb-4">
          <ElForm-item>
            <ElButton type="success" @click="openRoomTypeDialog()">新增房型</ElButton>
            <ElButton @click="loadRoomTypes">刷新</ElButton>
          </ElForm-item>
        </ElForm>

        <ElTable :data="roomTypes" border stripe>
          <ElTable-column prop="typeCode" label="房型编号" width="120" />
          <ElTable-column prop="typeName" label="房型名称" width="160" />
          <ElTable-column prop="area" label="面积(㎡)" width="100" />
          <ElTable-column prop="bedType" label="床型" width="120" />
          <ElTable-column prop="maxOccupancy" label="最大入住人数" width="140" />
          <ElTable-column prop="windowType" label="窗户" width="100">
            <template #default="{ row }">
              {{ row.windowType === 1 ? '无窗' : row.windowType === 2 ? '内窗' : '外窗' }}
            </template>
          </ElTable-column>
          <ElTable-column prop="standardRent" label="标准租金(元)" width="140" />
          <ElTable-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <ElTag :type="row.status === 1 ? 'success' : 'info'" size="small">{{ row.status === 1 ? '启用' : '停用' }}</ElTag>
            </template>
          </ElTable-column>
          <ElTable-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <ElButton type="primary" link size="small" @click="openRoomTypeDialog(row)">编辑</ElButton>
              <ElButton type="danger" link size="small" @click="deleteRoomType(row)">删除</ElButton>
            </template>
          </ElTable-column>
        </ElTable>
      </ElTab-pane>
    </ElTabs>

    <!-- 房间弹窗 -->
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

    <!-- 门店弹窗 -->
    <ElDialog v-model="storeDialogVisible" :title="storeForm.id ? '编辑门店' : '新增门店'" width="600px">
      <ElForm :model="storeForm" label-width="100px" :rules="storeRules" ref="storeFormRef">
        <ElForm-item label="门店编码" prop="storeCode">
          <ElInput v-model="storeForm.storeCode" placeholder="如 STORE001" />
        </ElForm-item>
        <ElForm-item label="门店名称" prop="storeName">
          <ElInput v-model="storeForm.storeName" />
        </ElForm-item>
        <ElForm-item label="门店类型" prop="storeType">
          <ElSelect v-model="storeForm.storeType" style="width: 100%">
            <ElOption label="直营店" :value="1" />
            <ElOption label="加盟店" :value="2" />
            <ElOption label="托管店" :value="3" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="省份" prop="province">
          <ElInput v-model="storeForm.province" placeholder="如 北京市" />
        </ElForm-item>
        <ElForm-item label="城市" prop="city">
          <ElInput v-model="storeForm.city" />
        </ElForm-item>
        <ElForm-item label="详细地址" prop="address">
          <ElInput v-model="storeForm.address" />
        </ElForm-item>
        <ElForm-item label="联系人" prop="contactPerson">
          <ElInput v-model="storeForm.contactPerson" />
        </ElForm-item>
        <ElForm-item label="联系电话" prop="contactPhone">
          <ElInput v-model="storeForm.contactPhone" />
        </ElForm-item>
        <ElForm-item label="状态" prop="status">
          <ElRadio-group v-model="storeForm.status">
            <ElRadio :value="1">正常</ElRadio>
            <ElRadio :value="0">停用</ElRadio>
          </ElRadio-group>
        </ElForm-item>
      </ElForm>
      <template #footer>
        <ElButton @click="storeDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="saveStore">确定</ElButton>
      </template>
    </ElDialog>

    <!-- 楼栋弹窗 -->
    <ElDialog v-model="buildingDialogVisible" :title="buildingForm.id ? '编辑楼栋' : '新增楼栋'" width="600px">
      <ElForm :model="buildingForm" label-width="100px" :rules="buildingRules" ref="buildingFormRef">
        <ElForm-item label="楼栋编码" prop="buildingCode">
          <ElInput v-model="buildingForm.buildingCode" placeholder="如 BLD001" />
        </ElForm-item>
        <ElForm-item label="楼栋名称" prop="buildingName">
          <ElInput v-model="buildingForm.buildingName" placeholder="如 A栋" />
        </ElForm-item>
        <ElForm-item label="所属门店" prop="storeId">
          <ElSelect v-model="buildingForm.storeId" placeholder="选择门店" style="width: 100%">
            <ElOption v-for="s in stores" :key="s.id" :label="s.storeName" :value="s.id" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="楼层数" prop="totalFloors">
          <ElInput-number v-model="buildingForm.totalFloors" :min="1" style="width: 100%" />
        </ElForm-item>
        <ElForm-item label="是否有电梯" prop="hasElevator">
          <ElRadio-group v-model="buildingForm.hasElevator">
            <ElRadio :value="1">有</ElRadio>
            <ElRadio :value="0">无</ElRadio>
          </ElRadio-group>
        </ElForm-item>
        <ElForm-item label="状态" prop="status">
          <ElRadio-group v-model="buildingForm.status">
            <ElRadio :value="1">正常</ElRadio>
            <ElRadio :value="0">停用</ElRadio>
          </ElRadio-group>
        </ElForm-item>
      </ElForm>
      <template #footer>
        <ElButton @click="buildingDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="saveBuilding">确定</ElButton>
      </template>
    </ElDialog>

    <!-- 房型弹窗 -->
    <ElDialog v-model="roomTypeDialogVisible" :title="roomTypeForm.id ? '编辑房型' : '新增房型'" width="600px">
      <ElForm :model="roomTypeForm" label-width="100px" :rules="roomTypeRules" ref="roomTypeFormRef">
        <ElForm-item label="房型编码" prop="typeCode">
          <ElInput v-model="roomTypeForm.typeCode" placeholder="如 DBR001 (必填)" />
        </ElForm-item>
        <ElForm-item label="房型名称" prop="typeName">
          <ElInput v-model="roomTypeForm.typeName" placeholder="如 标准单人间" />
        </ElForm-item>
        <ElForm-item label="所属门店" prop="storeId">
          <ElSelect v-model="roomTypeForm.storeId" placeholder="选择门店(可选)" clearable style="width: 100%">
            <ElOption v-for="s in stores" :key="s.id" :label="s.storeName" :value="s.id" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="面积(㎡)" prop="area">
          <ElInput v-model="roomTypeForm.area" />
        </ElForm-item>
        <ElForm-item label="床型" prop="bedType">
          <ElInput v-model="roomTypeForm.bedType" placeholder="如 1.5米双人床" />
        </ElForm-item>
        <ElForm-item label="最大入住人数" prop="maxOccupancy">
          <ElInput-number v-model="roomTypeForm.maxOccupancy" :min="1" style="width: 100%" />
        </ElForm-item>
        <ElForm-item label="窗户类型" prop="windowType">
          <ElSelect v-model="roomTypeForm.windowType" style="width: 100%">
            <ElOption label="无窗" :value="1" />
            <ElOption label="内窗" :value="2" />
            <ElOption label="外窗" :value="3" />
          </ElSelect>
        </ElForm-item>
        <ElForm-item label="标准租金" prop="standardRent">
          <ElInput v-model="roomTypeForm.standardRent" />
        </ElForm-item>
        <ElForm-item label="状态" prop="status">
          <ElRadio-group v-model="roomTypeForm.status">
            <ElRadio :value="1">启用</ElRadio>
            <ElRadio :value="0">停用</ElRadio>
          </ElRadio-group>
        </ElForm-item>
      </ElForm>
      <template #footer>
        <ElButton @click="roomTypeDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="saveRoomType">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import {
  ElCard, ElRow, ElCol, ElTabs, ElTabPane, ElTable, ElTableColumn, ElButton, ElForm, ElFormItem,
  ElSelect, ElOption, ElInput, ElInputNumber, ElTag, ElDialog, ElRadioGroup, ElRadio, ElMessage, ElMessageBox
} from 'element-plus'
import type { Room, Store, Building, RoomType } from '@/types'
import { roomApi } from '@/api/room'
import { storeApi } from '@/api/store'
import { buildingApi } from '@/api/building'
import { roomTypeApi } from '@/api/roomType'

const activeTab = ref('room')
const rooms = ref<Room[]>([])
const stores = ref<Store[]>([])
const buildings = ref<Building[]>([])
const roomTypes = ref<RoomType[]>([])

const filters = reactive({
  storeId: undefined as number | undefined,
  buildingId: undefined as number | undefined,
  status: undefined as number | undefined
})

// 房间弹窗
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

// 门店弹窗
const storeDialogVisible = ref(false)
const storeFormRef = ref()
const storeForm = reactive<Partial<Store>>({ status: 1, storeType: 1 })
const storeRules = {
  storeCode: [{ required: true, message: '请输入门店编码', trigger: 'blur' }],
  storeName: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
  contactPerson: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
}

// 楼栋弹窗
const buildingDialogVisible = ref(false)
const buildingFormRef = ref()
const buildingForm = reactive<Partial<Building>>({ status: 1, hasElevator: 1, totalFloors: 1 })
const buildingRules = {
  buildingCode: [{ required: true, message: '请输入楼栋编码', trigger: 'blur' }],
  buildingName: [{ required: true, message: '请输入楼栋名称', trigger: 'blur' }],
  storeId: [{ required: true, message: '请选择门店', trigger: 'change' }],
  totalFloors: [{ required: true, message: '请输入楼层数', trigger: 'blur' }]
}

// 房型弹窗
const roomTypeDialogVisible = ref(false)
const roomTypeFormRef = ref()
const roomTypeForm = reactive<Partial<RoomType>>({ status: 1, windowType: 3, maxOccupancy: 1 })
const roomTypeRules = {
  typeCode: [{ required: true, message: '请输入房型编码', trigger: 'blur' }],
  typeName: [{ required: true, message: '请输入房型名称', trigger: 'blur' }]
}

// 计算属性
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

// 工具函数
const getStoreName = (id?: number) => stores.value.find(s => s.id === id)?.storeName || '-'
const getBuildingName = (id?: number) => buildings.value.find(b => b.id === id)?.buildingName || '-'
const getBuildingsByStore = (storeId?: number) =>
  !storeId ? buildings.value : buildings.value.filter(b => b.storeId === storeId)

const getStatusLabel = (status?: number) => {
  const map: { [k: number]: string } = { 1: '空闲', 2: '已租', 3: '维修中', 4: '预留', 5: '已预订' }
  return map[status || 0] || '未知'
}

const getStatusTagType = (status?: number) => {
  const map: { [k: number]: string } = { 1: 'success', 2: 'warning', 3: 'danger', 4: 'info', 5: '' }
  return map[status || 0] || 'info'
}

const getStatusCount = (status: number) => rooms.value.filter(r => r.status === status).length

// 数据加载
const loadRooms = async () => {
  try {
    const res = await roomApi.getAll()
    rooms.value = (res && Array.isArray(res) ? res : []) as Room[]
    ElMessage.success(`加载成功`)
  } catch (e) {
    ElMessage.warning('后端接口不可用，显示空数据。请启动后端服务后刷新')
    rooms.value = []
  }
}

const loadStores = async () => {
  try {
    const res = await storeApi.getAll()
    stores.value = (res && Array.isArray(res) ? res : []) as Store[]
  } catch (e) {
    stores.value = []
  }
}

const loadBuildings = async () => {
  try {
    const res = await buildingApi.getAll()
    buildings.value = (res && Array.isArray(res) ? res : []) as Building[]
  } catch (e) {
    buildings.value = []
  }
}

const loadRoomTypes = async () => {
  try {
    const res = await roomTypeApi.getAll()
    roomTypes.value = (res && Array.isArray(res) ? res : []) as RoomType[]
  } catch (e) {
    roomTypes.value = []
  }
}

const filterByStatus = (status: number | undefined) => {
  filters.status = status
  activeTab.value = 'room'
  loadRooms()
}

// 房间 CRUD
const openRoomDialog = (row?: Room) => {
  if (row) {
    Object.assign(roomForm, { ...row })
  } else {
    Object.assign(roomForm, { status: 1, floorNumber: 1, roomCode: '', roomName: '', storeId: undefined, buildingId: undefined, roomTypeId: undefined, area: '', orientation: '', currentRent: '', statusRemark: '' })
  }
  roomDialogVisible.value = true
}

const saveRoom = async () => {
  try {
    let ok: boolean
    if (roomForm.id) {
      ok = await roomApi.update(roomForm as Room) as unknown as boolean
    } else {
      ok = await roomApi.save(roomForm as Room) as unknown as boolean
    }
    // 后端可能返回 boolean 或对象；只要没抛异常就算成功
    if (ok === true) {
      ElMessage.success(roomForm.id ? '更新成功' : '新增成功')
      roomDialogVisible.value = false
      loadRooms()
    } else {
      ElMessage.error('保存失败')
    }
  } catch (e) {
    ElMessage.error('保存失败，请检查后端服务')
  }
}

const changeRoomStatus = (row: Room) => {
  ElMessageBox.prompt('请选择新的房态（1-空闲 2-已租 3-维修中 4-预留 5-已预订）', '修改房态', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '输入 1-5',
    inputValue: String(row.status || 1)
  }).then(async ({ value }) => {
    const newStatus = Number(value)
    if (newStatus >= 1 && newStatus <= 5) {
      try {
        const ok = await roomApi.updateStatus(row.id!, newStatus) as unknown as boolean
        if (ok === true) {
          ElMessage.success('房态修改成功')
          loadRooms()
        } else {
          ElMessage.error('修改失败')
        }
      } catch (e) {
        ElMessage.error('修改失败，请检查后端服务')
      }
    } else {
      ElMessage.warning('请输入 1-5 的数字')
    }
  }).catch(() => {})
}

const deleteRoom = (row: Room) => {
  ElMessageBox.confirm(`确定删除房间 ${row.roomCode}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await roomApi.delete(row.id!) as unknown as boolean
        if (ok === true) {
          ElMessage.success('删除成功')
          loadRooms()
        } else {
          ElMessage.error('删除失败')
        }
      } catch (e) {
        ElMessage.error('删除失败，请检查后端服务')
      }
    }).catch(() => {})
}

// 门店 CRUD
const openStoreDialog = (row?: Store) => {
  if (row) {
    Object.assign(storeForm, { ...row })
  } else {
    Object.assign(storeForm, { status: 1, storeType: 1, storeCode: '', storeName: '', province: '', city: '', address: '', contactPerson: '', contactPhone: '' })
  }
  storeDialogVisible.value = true
}

const saveStore = async () => {
  try {
    const ok = storeForm.id
      ? await storeApi.update(storeForm as Store) as unknown as boolean
      : await storeApi.save(storeForm as Store) as unknown as boolean
    if (ok === true) {
      ElMessage.success(storeForm.id ? '更新成功' : '新增成功')
      storeDialogVisible.value = false
      loadStores()
    } else {
      ElMessage.error('保存失败')
    }
  } catch (e) {
    ElMessage.error('保存失败，请检查后端服务')
  }
}

const deleteStore = (row: Store) => {
  ElMessageBox.confirm(`确定删除门店 ${row.storeName}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await storeApi.delete(row.id!) as unknown as boolean
        if (ok === true) { ElMessage.success('删除成功'); loadStores() } else { ElMessage.error('删除失败') }
      } catch (e) { ElMessage.error('删除失败，请检查后端服务') }
    }).catch(() => {})
}

// 楼栋 CRUD
const openBuildingDialog = (row?: Building) => {
  if (row) {
    Object.assign(buildingForm, { ...row })
  } else {
    Object.assign(buildingForm, { status: 1, hasElevator: 1, totalFloors: 1, buildingCode: '', buildingName: '', storeId: undefined })
  }
  buildingDialogVisible.value = true
}

const saveBuilding = async () => {
  try {
    const ok = buildingForm.id
      ? await buildingApi.update(buildingForm as Building) as unknown as boolean
      : await buildingApi.save(buildingForm as Building) as unknown as boolean
    if (ok === true) {
      ElMessage.success(buildingForm.id ? '更新成功' : '新增成功')
      buildingDialogVisible.value = false
      loadBuildings()
    } else {
      ElMessage.error('保存失败')
    }
  } catch (e) {
    ElMessage.error('保存失败，请检查后端服务')
  }
}

const deleteBuilding = (row: Building) => {
  ElMessageBox.confirm(`确定删除楼栋 ${row.buildingName}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await buildingApi.delete(row.id!) as unknown as boolean
        if (ok === true) { ElMessage.success('删除成功'); loadBuildings() } else { ElMessage.error('删除失败') }
      } catch (e) { ElMessage.error('删除失败，请检查后端服务') }
    }).catch(() => {})
}

// 房型 CRUD
const openRoomTypeDialog = (row?: RoomType) => {
  if (row) {
    Object.assign(roomTypeForm, { ...row })
  } else {
    Object.assign(roomTypeForm, { status: 1, windowType: 3, maxOccupancy: 1, typeCode: '', typeName: '', storeId: undefined, area: '', bedType: '', standardRent: '' })
  }
  roomTypeDialogVisible.value = true
}

const saveRoomType = async () => {
  try {
    const ok = roomTypeForm.id
      ? await roomTypeApi.update(roomTypeForm as RoomType) as unknown as boolean
      : await roomTypeApi.save(roomTypeForm as RoomType) as unknown as boolean
    if (ok === true) {
      ElMessage.success(roomTypeForm.id ? '更新成功' : '新增成功')
      roomTypeDialogVisible.value = false
      loadRoomTypes()
    } else {
      ElMessage.error('保存失败')
    }
  } catch (e) {
    ElMessage.error('保存失败，请检查后端服务')
  }
}

const deleteRoomType = (row: RoomType) => {
  ElMessageBox.confirm(`确定删除房型 ${row.typeName}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await roomTypeApi.delete(row.id!) as unknown as boolean
        if (ok === true) { ElMessage.success('删除成功'); loadRoomTypes() } else { ElMessage.error('删除失败') }
      } catch (e) { ElMessage.error('删除失败，请检查后端服务') }
    }).catch(() => {})
}

onMounted(() => {
  loadStores()
  loadBuildings()
  loadRooms()
  loadRoomTypes()
})
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
.mt-4 { margin-top: 1rem; }
.cursor-pointer { cursor: pointer; }
.text-center { text-align: center; }
</style>
