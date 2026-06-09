<template>
  <div class="tenant-portal">
    <div class="portal-header">
      <div class="header-content">
        <h1>租户门户</h1>
        <p>欢迎回来，{{ userInfo?.realName }}</p>
      </div>
      <div class="header-actions">
        <el-button @click="handleLogout" type="danger">退出登录</el-button>
      </div>
    </div>

    <div class="portal-stats">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">
              <User />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.contractCount || 0 }}</div>
              <div class="stat-label">合同数量</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">
              <CircleCheck />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.activeContractCount || 0 }}</div>
              <div class="stat-label">生效合同</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">
              <Key />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.pendingBillCount || 0 }}</div>
              <div class="stat-label">待缴账单</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">
              <Tools />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.pendingOrderCount || 0 }}</div>
              <div class="stat-label">待处理工单</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="portal-content">
      <div class="content-left">
        <div class="section">
          <h2 class="section-title">我的合同</h2>
          <el-table :data="contracts" border>
            <el-table-column prop="contractNo" label="合同编号" />
            <el-table-column prop="startDate" label="开始日期" />
            <el-table-column prop="endDate" label="结束日期" />
            <el-table-column prop="contractStatus" label="状态">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.contractStatus)">
                  {{ getStatusText(scope.row.contractStatus) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" @click="showContractDetail(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="section">
          <h2 class="section-title">待缴账单</h2>
          <el-table :data="pendingBills" border>
            <el-table-column prop="billNo" label="账单编号" />
            <el-table-column prop="billType" label="账单类型">
              <template #default="scope">
                {{ getBillTypeText(scope.row.billType) }}
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" />
            <el-table-column prop="dueDate" label="到期日期" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" @click="showBillDetail(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="content-right">
        <div class="section">
          <h2 class="section-title">快捷操作</h2>
          <div class="quick-actions">
            <el-button @click="openMaintenanceModal" class="action-btn">
              <Tools />
              <span>报修申请</span>
            </el-button>
            <el-button @click="handleCheckoutClick" class="action-btn">
              <ArrowRight />
              <span>退租申请</span>
            </el-button>
            <el-button @click="showRoomsModal = true" class="action-btn">
              <HomeFilled />
              <span>浏览房源</span>
            </el-button>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">维修工单</h2>
          <el-table :data="maintenanceOrders" border>
            <el-table-column prop="orderNo" label="工单编号" />
            <el-table-column prop="category" label="分类" />
            <el-table-column prop="orderStatus" label="状态">
              <template #default="scope">
                <el-tag :type="getOrderStatusType(scope.row.orderStatus)">
                  {{ getOrderStatusText(scope.row.orderStatus) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 报修申请弹窗 -->
    <el-dialog title="新建工单" v-model="showMaintenanceModal" width="650px">
      <el-form :model="maintenanceForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工单号">
              <el-input v-model="maintenanceForm.orderNo" disabled placeholder="自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属门店">
              <el-select v-model="maintenanceForm.storeId" disabled>
                <el-option label="滨江旗舰公寓" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房间ID">
              <el-input v-model="maintenanceForm.roomId" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租户ID">
              <el-input v-model="maintenanceForm.tenantId" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="*类别" prop="category" :rules="[{ required: true, message: '请选择类别', trigger: 'change' }]">
              <el-select v-model="maintenanceForm.category" placeholder="请选择类别">
                <el-option label="水电" value="水电" />
                <el-option label="家电" value="家电" />
                <el-option label="家具" value="家具" />
                <el-option label="门窗" value="门窗" />
                <el-option label="卫浴" value="卫浴" />
                <el-option label="网络" value="网络" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急度">
              <el-select v-model="maintenanceForm.urgencyLevel" placeholder="请选择紧急度">
                <el-option label="紧急" :value="1" />
                <el-option label="中等" :value="2" />
                <el-option label="一般" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="*问题描述" prop="description" :rules="[{ required: true, message: '请填写问题描述', trigger: 'blur' }]">
          <el-input type="textarea" v-model="maintenanceForm.description" :rows="4" placeholder="请详细描述需要维修的问题" style="width: 100%; min-height: 100px;" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="处理人">
              <el-input v-model="maintenanceForm.assigneeName" disabled placeholder="管理员分配" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预估费用">
              <el-input v-model="maintenanceForm.estimatedCost" disabled placeholder="管理员填写" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态">
          <el-select v-model="maintenanceForm.orderStatus" disabled>
            <el-option label="待处理" :value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showMaintenanceModal = false">取消</el-button>
        <el-button type="primary" @click="submitMaintenance">确定</el-button>
      </template>
    </el-dialog>

    <!-- 退租申请弹窗 -->
    <el-dialog title="提交退租申请" v-model="showCheckoutModal">
      <el-form :model="checkoutForm">
        <el-form-item label="预计退租日期">
          <el-date-picker v-model="checkoutForm.expectedCheckoutDate" type="date" />
        </el-form-item>
        <el-form-item label="退租原因">
          <el-textarea v-model="checkoutForm.reason" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCheckoutModal = false">取消</el-button>
        <el-button type="primary" @click="submitCheckout">提交申请</el-button>
      </template>
    </el-dialog>

    <!-- 房源浏览弹窗 -->
    <el-dialog title="可用房源" v-model="showRoomsModal" width="800px">
      <el-table :data="availableRooms" border>
        <el-table-column prop="roomCode" label="房间号" />
        <el-table-column prop="roomName" label="房间名称" />
        <el-table-column prop="buildingName" label="楼栋" />
        <el-table-column prop="floorNumber" label="楼层" />
        <el-table-column prop="area" label="面积" />
        <el-table-column prop="currentRent" label="租金" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="showRoomDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 房间详情弹窗 -->
    <el-dialog title="房间详情" v-model="showRoomDetailModal" width="600px">
      <div v-if="selectedRoom" class="room-detail">
        <div class="detail-row">
          <span class="detail-label">房间号：</span>
          <span class="detail-value">{{ selectedRoom.roomCode }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">房间名称：</span>
          <span class="detail-value">{{ selectedRoom.roomName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">楼栋：</span>
          <span class="detail-value">{{ selectedRoom.buildingName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">楼层：</span>
          <span class="detail-value">{{ selectedRoom.floorNumber }}层</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">面积：</span>
          <span class="detail-value">{{ selectedRoom.area }}㎡</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">房型：</span>
          <span class="detail-value">{{ selectedRoom.typeName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">租金：</span>
          <span class="detail-value">{{ selectedRoom.currentRent }}元/月</span>
        </div>
      </div>
    </el-dialog>

    <!-- 合同详情弹窗 -->
    <el-dialog title="合同详情" v-model="showContractDetailModal" width="600px">
      <div v-if="selectedContract" class="room-detail">
        <div class="detail-row">
          <span class="detail-label">合同编号：</span>
          <span class="detail-value">{{ selectedContract.contractNo }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">开始日期：</span>
          <span class="detail-value">{{ selectedContract.startDate }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">结束日期：</span>
          <span class="detail-value">{{ selectedContract.endDate }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">状态：</span>
          <span class="detail-value"><el-tag :type="getStatusType(selectedContract.contractStatus)">{{ getStatusText(selectedContract.contractStatus) }}</el-tag></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">租金：</span>
          <span class="detail-value">{{ selectedContract.rentAmount }}元/{{ selectedContract.paymentCycle === 1 ? '月' : selectedContract.paymentCycle === 3 ? '季' : '年' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">押金：</span>
          <span class="detail-value">{{ selectedContract.depositAmount }}元</span>
        </div>
      </div>
    </el-dialog>

    <!-- 账单详情弹窗 -->
    <el-dialog title="账单详情" v-model="showBillDetailModal" width="600px">
      <div v-if="selectedBill" class="room-detail">
        <div class="detail-row">
          <span class="detail-label">账单编号：</span>
          <span class="detail-value">{{ selectedBill.billNo }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">账单类型：</span>
          <span class="detail-value">{{ getBillTypeText(selectedBill.billType) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">金额：</span>
          <span class="detail-value">{{ selectedBill.amount }}元</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">到期日期：</span>
          <span class="detail-value">{{ selectedBill.dueDate }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">状态：</span>
          <span class="detail-value">{{ selectedBill.paymentStatus === 0 ? '未支付' : selectedBill.paymentStatus === 1 ? '已支付' : '已逾期' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">关联合同：</span>
          <span class="detail-value">{{ selectedBill.contractNo }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, CircleCheck, Key, Tools, ArrowRight, HomeFilled } from '@element-plus/icons-vue'
import { tenantPortalApi } from '@/api/tenantPortal'
import { maintenanceOrderApi } from '@/api/maintenanceOrder'
import type { LoginResponse } from '@/api/auth'

const userInfo = ref<LoginResponse['data'] | null>(null)
const stats = ref({
  contractCount: 0,
  activeContractCount: 0,
  pendingBillCount: 0,
  pendingOrderCount: 0,
  pendingCheckoutCount: 0
})
const contracts = ref<any[]>([])
const pendingBills = ref<any[]>([])
const maintenanceOrders = ref<any[]>([])
const availableRooms = ref<any[]>([])
const currentRoom = ref<any>(null)

const showMaintenanceModal = ref(false)
const showCheckoutModal = ref(false)
const showRoomsModal = ref(false)
const showRoomDetailModal = ref(false)
const showContractDetailModal = ref(false)
const showBillDetailModal = ref(false)
const selectedRoom = ref<any>(null)
const selectedContract = ref<any>(null)
const selectedBill = ref<any>(null)

const maintenanceForm = ref({
  orderNo: '',
  storeId: 1,
  roomId: '',
  tenantId: '',
  category: '',
  urgencyLevel: 2,
  description: '',
  assigneeName: '',
  estimatedCost: '',
  orderStatus: 1
})

const checkoutForm = ref({
  expectedCheckoutDate: '',
  reason: ''
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  window.location.href = '/login'
}

const handleCheckoutClick = () => {
  alert('请到线下办理退租手续')
}

const openMaintenanceModal = () => {
  maintenanceForm.value = {
    orderNo: '',
    storeId: 1,
    roomId: currentRoom.value?.id || '',
    tenantId: userInfo.value?.userId || '',
    category: '',
    urgencyLevel: 2,
    description: '',
    assigneeName: '',
    estimatedCost: '',
    orderStatus: 1
  }
  showMaintenanceModal.value = true
}

const showRoomDetail = (room: any) => {
  selectedRoom.value = room
  showRoomDetailModal.value = true
}

const showContractDetail = (contract: any) => {
  selectedContract.value = contract
  showContractDetailModal.value = true
}

const showBillDetail = (bill: any) => {
  selectedBill.value = bill
  showBillDetailModal.value = true
}

const getStatusType = (status: number) => {
  const types: Record<number, string> = {
    1: 'warning',
    2: 'success',
    3: 'info',
    4: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status: number) => {
  const texts: Record<number, string> = {
    1: '待审核',
    2: '生效中',
    3: '已到期',
    4: '已终止'
  }
  return texts[status] || '未知'
}

const getBillTypeText = (type: number) => {
  const texts: Record<number, string> = {
    1: '租金',
    2: '押金',
    3: '水电费',
    4: '物业费',
    5: '网络费',
    6: '维修费',
    7: '违约金',
    8: '其他'
  }
  return texts[type] || '未知'
}

const getOrderStatusType = (status: number) => {
  const types: Record<number, string> = {
    1: 'warning',
    2: 'info',
    3: 'primary',
    4: 'warning',
    5: 'success',
    6: 'danger'
  }
  return types[status] || 'info'
}

const getOrderStatusText = (status: number) => {
  const texts: Record<number, string> = {
    1: '待派单',
    2: '已派单',
    3: '维修中',
    4: '待验收',
    5: '已完成',
    6: '已取消'
  }
  return texts[status] || '未知'
}

const submitMaintenance = async () => {
  if (!maintenanceForm.value.category) {
    alert('请选择类别')
    return
  }
  
  if (!maintenanceForm.value.description) {
    alert('请填写问题描述')
    return
  }
  
  try {
    const response = await tenantPortalApi.submitMaintenanceOrder({
      tenantId: maintenanceForm.value.tenantId,
      category: maintenanceForm.value.category,
      urgencyLevel: maintenanceForm.value.urgencyLevel,
      description: maintenanceForm.value.description
    })
    
    if (response.success) {
      showMaintenanceModal.value = false
      maintenanceForm.value = {
        orderNo: '',
        storeId: 1,
        roomId: '',
        tenantId: '',
        category: '',
        urgencyLevel: 2,
        description: '',
        assigneeName: '',
        estimatedCost: '',
        orderStatus: 1
      }
      loadData()
      alert('报修申请提交成功')
    } else {
      alert('提交失败: ' + response.message)
    }
  } catch (error) {
    console.error('提交失败:', error)
    alert('提交失败，请检查网络连接')
  }
}

const submitCheckout = async () => {
  try {
    await tenantPortalApi.submitCheckoutApplication({
      tenantId: userInfo.value?.userId,
      expectedCheckoutDate: checkoutForm.value.expectedCheckoutDate,
      reason: checkoutForm.value.reason
    })
    showCheckoutModal.value = false
    checkoutForm.value = { expectedCheckoutDate: '', reason: '' }
    loadData()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const loadData = async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  const userStr = localStorage.getItem('userInfo')
  if (userStr) {
    userInfo.value = JSON.parse(userStr)
  }

  if (userInfo.value?.userId) {
    try {
      const statsRes = await tenantPortalApi.getTenantStats(userInfo.value.userId)
      if (statsRes.success) {
        stats.value = statsRes.data
      }

      const contractsRes = await tenantPortalApi.getTenantContracts(userInfo.value.userId)
      if (contractsRes.success) {
        contracts.value = contractsRes.data.slice(0, 5)
      }

      const billsRes = await tenantPortalApi.getTenantBills(userInfo.value.userId, 1, 5)
      if (billsRes.success) {
        pendingBills.value = billsRes.data.records || []
      }

      const ordersRes = await tenantPortalApi.getTenantMaintenanceOrders(userInfo.value.userId)
      if (ordersRes.success) {
        maintenanceOrders.value = ordersRes.data.slice(0, 5)
      }

      const roomRes = await tenantPortalApi.getCurrentRoom(userInfo.value.userId)
      if (roomRes.success && roomRes.data) {
        currentRoom.value = roomRes.data
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  }

  try {
    const roomsRes = await tenantPortalApi.getAvailableRooms(1, 10)
    if (roomsRes.success) {
      availableRooms.value = roomsRes.data.records || []
    }
  } catch (error) {
    console.error('加载房源失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.tenant-portal {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.portal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px 32px;
  border-radius: 12px;
  margin-bottom: 20px;
  color: #fff;
}

.header-content h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.header-content p {
  margin: 8px 0 0;
  opacity: 0.9;
}

.portal-stats {
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: #fff;
}

.stat-icon :deep(svg) {
  width: 24px;
  height: 24px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.portal-content {
  display: flex;
  gap: 20px;
}

.content-left {
  flex: 2;
}

.content-right {
  flex: 1;
}

.section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 12px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  border: none;
  transition: all 0.3s;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

.action-btn :deep(svg) {
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
  color: #667eea;
}

.action-btn span {
  font-size: 14px;
  color: #303133;
}

:deep(.el-table) {
  font-size: 13px;
}

:deep(.el-table th) {
  background: #fafafa;
  font-weight: 600;
}

.room-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.room-info-card p {
  margin: 6px 0;
  font-size: 14px;
}

.room-detail {
  padding: 16px;
}

.detail-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  width: 100px;
  font-weight: 600;
  color: #666;
}

.detail-value {
  flex: 1;
  color: #333;
}

.room-info-card.no-room {
  background: #909399;
  text-align: center;
}
</style>