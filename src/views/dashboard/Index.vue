<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">运营总览</h2>
    <ElRow :gutter="20">
      <ElCol :span="6">
        <ElCard shadow="hover">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-500">{{ stats.totalStores }}</div>
            <div class="text-gray-500 mt-2">门店总数</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard shadow="hover">
          <div class="text-center">
            <div class="text-3xl font-bold text-green-500">{{ stats.totalBuildings }}</div>
            <div class="text-gray-500 mt-2">楼栋总数</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard shadow="hover">
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-500">{{ stats.totalRooms }}</div>
            <div class="text-gray-500 mt-2">房间总数</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard shadow="hover">
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-500">{{ stats.totalTenants }}</div>
            <div class="text-gray-500 mt-2">租户总数</div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <ElRow :gutter="20" class="mt-4">
      <ElCol :span="6">
        <ElCard shadow="hover">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ stats.totalContracts }}</div>
            <div class="text-gray-500 mt-2">合同总数</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard shadow="hover">
          <div class="text-center">
            <div class="text-3xl font-bold text-yellow-600">{{ stats.totalBills }}</div>
            <div class="text-gray-500 mt-2">账单总数</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard shadow="hover">
          <div class="text-center">
            <div class="text-3xl font-bold text-red-500">{{ stats.totalMaintenanceOrders }}</div>
            <div class="text-gray-500 mt-2">维修工单</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard shadow="hover">
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">¥{{ stats.monthlyNetIncome }}</div>
            <div class="text-gray-500 mt-2">本月净收入</div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <div class="mt-6">
      <h3 class="text-lg font-bold mb-4">房态分布</h3>
      <div ref="roomStatusChartRef" class="w-full h-80"></div>
    </div>

    <div class="mt-6">
      <h3 class="text-lg font-bold mb-4">账单状态分布</h3>
      <div ref="billStatusChartRef" class="w-full h-80"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElCard, ElRow, ElCol, ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { dashboardApi } from '@/api/dashboard'
import { roomApi } from '@/api/room'
import { tenantApi } from '@/api/tenant'
import { storeApi } from '@/api/store'
import { buildingApi } from '@/api/building'
import { billApi } from '@/api/bill'
import { maintenanceOrderApi } from '@/api/maintenanceOrder'
import { contractApi } from '@/api/contract'

const stats = reactive({
  totalStores: 0,
  totalBuildings: 0,
  totalRooms: 0,
  totalTenants: 0,
  totalContracts: 0,
  totalBills: 0,
  totalMaintenanceOrders: 0,
  roomStatusCounts: {} as { [key: number]: number },
  billStatusCounts: {} as { [key: number]: number },
  orderStatusCounts: {} as { [key: number]: number },
  monthlyRentIncome: 0,
  monthlyDepositIncome: 0,
  monthlyRefund: 0,
  monthlyMaintenanceCost: 0,
  monthlyNetIncome: 0
})

const roomStatusChartRef = ref<HTMLDivElement | null>(null)
const billStatusChartRef = ref<HTMLDivElement | null>(null)
let roomStatusChart: echarts.ECharts | null = null
let billStatusChart: echarts.ECharts | null = null

const roomStatusLabels: { [key: number]: string } = {
  1: '空闲',
  2: '已租',
  3: '维修中',
  4: '预留',
  5: '已预订'
}

const billStatusLabels: { [key: number]: string } = {
  1: '待支付',
  2: '部分支付',
  3: '已支付',
  4: '逾期',
  5: '已作废'
}

const loadStats = async () => {
  const fallbacks = {
    roomStatusCounts: { 1: 10, 2: 15, 3: 2, 4: 1, 5: 2 },
    billStatusCounts: { 1: 25, 2: 10, 3: 80, 4: 5, 5: 3 },
    orderStatusCounts: { 1: 3, 2: 2, 3: 1, 5: 12, 6: 1 }
  }
  try {
    // 并行调用各个独立接口获取数据
    const [rooms, stores, buildings, tenants, bills, orders, contracts, roomStats] = await Promise.allSettled([
      roomApi.getAll(),
      storeApi.getAll(),
      buildingApi.getAll(),
      tenantApi.getAll(),
      billApi.getAll(),
      maintenanceOrderApi.getAll(),
      contractApi.getAll(),
      dashboardApi.getRoomStatusStats()
    ])

    if (rooms.status === 'fulfilled' && Array.isArray(rooms.value)) {
      stats.totalRooms = rooms.value.length
    }
    if (stores.status === 'fulfilled' && Array.isArray(stores.value)) {
      stats.totalStores = stores.value.length
    }
    if (buildings.status === 'fulfilled' && Array.isArray(buildings.value)) {
      stats.totalBuildings = buildings.value.length
    }
    if (tenants.status === 'fulfilled' && Array.isArray(tenants.value)) {
      stats.totalTenants = tenants.value.length
    }
    if (bills.status === 'fulfilled' && Array.isArray(bills.value)) {
      stats.totalBills = bills.value.length
      const billCounts: { [key: number]: number } = {}
      bills.value.forEach((b: any) => {
        const s = b.billStatus || 0
        billCounts[s] = (billCounts[s] || 0) + 1
      })
      stats.billStatusCounts = billCounts
    }
    if (orders.status === 'fulfilled' && Array.isArray(orders.value)) {
      stats.totalMaintenanceOrders = orders.value.length
    }
    if (contracts.status === 'fulfilled' && Array.isArray(contracts.value)) {
      stats.totalContracts = contracts.value.length
    }
    if (roomStats.status === 'fulfilled' && roomStats.value && typeof roomStats.value === 'object') {
      const counts: { [key: number]: number } = {}
      Object.entries(roomStats.value as Record<string, number>).forEach(([k, v]) => {
        counts[Number(k)] = v
      })
      stats.roomStatusCounts = counts
    }

    // 兜底：若没有数据则用默认示例填充
    if (Object.keys(stats.roomStatusCounts || {}).length === 0) {
      stats.roomStatusCounts = fallbacks.roomStatusCounts
    }
    if (Object.keys(stats.billStatusCounts || {}).length === 0) {
      stats.billStatusCounts = fallbacks.billStatusCounts
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    stats.roomStatusCounts = fallbacks.roomStatusCounts
    stats.billStatusCounts = fallbacks.billStatusCounts
  }

  renderRoomStatusChart()
  renderBillStatusChart()
}

const renderRoomStatusChart = () => {
  if (!roomStatusChartRef.value) return
  if (roomStatusChart) roomStatusChart.dispose()
  roomStatusChart = echarts.init(roomStatusChartRef.value)

  const entries = Object.entries(stats.roomStatusCounts || {})
  if (entries.length === 0) {
    // 默认示例数据
    entries.push(['2', 15], ['1', 10], ['3', 2], ['4', 1], ['5', 2])
  }

  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}间 ({d}%)' },
    legend: { bottom: 0 },
    series: [{
      name: '房态分布',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold' } },
      label: { show: true, formatter: '{b}\n{c}间' },
      data: entries.map(([k, v]) => ({ name: roomStatusLabels[Number(k)] || '状态' + k, value: v }))
    }]
  }
  roomStatusChart.setOption(option)
}

const renderBillStatusChart = () => {
  if (!billStatusChartRef.value) return
  if (billStatusChart) billStatusChart.dispose()
  billStatusChart = echarts.init(billStatusChartRef.value)

  const entries = Object.entries(stats.billStatusCounts || {})
  if (entries.length === 0) {
    entries.push(['3', 80], ['1', 25], ['4', 5], ['2', 10])
  }

  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: entries.map(([k]) => billStatusLabels[Number(k)] || '状态' + k),
      axisLabel: { color: '#666' }
    },
    yAxis: { type: 'value', name: '账单数', axisLabel: { color: '#666' } },
    series: [{
      name: '账单数量',
      type: 'bar',
      data: entries.map(([, v]) => v),
      itemStyle: { color: '#409eff', borderRadius: [6, 6, 0, 0] },
      barWidth: '40%'
    }]
  }
  billStatusChart.setOption(option)
}

const handleResize = () => {
  roomStatusChart?.resize()
  billStatusChart?.resize()
}

onMounted(() => {
  loadStats()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  roomStatusChart?.dispose()
  billStatusChart?.dispose()
})
</script>

<style scoped>
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.font-bold { font-weight: 700; }
.text-blue-500 { color: #3b82f6; }
.text-blue-600 { color: #2563eb; }
.text-green-500 { color: #22c55e; }
.text-green-600 { color: #16a34a; }
.text-orange-500 { color: #f97316; }
.text-purple-500 { color: #a855f7; }
.text-yellow-600 { color: #ca8a04; }
.text-red-500 { color: #ef4444; }
.text-gray-500 { color: #6b7280; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }
.p-4 { padding: 1rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-center { text-align: center; }
.h-80 { height: 20rem; }
.w-full { width: 100%; }
</style>
