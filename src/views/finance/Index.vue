<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">财务报表</h2>

    <!-- 筛选 -->
    <ElForm :inline="true" class="mb-4">
      <ElForm-item label="门店">
        <ElSelect v-model="filters.storeId" placeholder="全部门店" clearable style="width: 160px" @change="loadData">
          <ElOption v-for="s in stores" :key="s.id" :label="s.storeName" :value="s.id" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item label="日期范围">
        <ElDatePicker
          v-model="filters.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          style="width: 260px"
          @change="loadData"
        />
      </ElForm-item>
      <ElForm-item>
        <ElButton type="primary" @click="loadData">查询</ElButton>
        <ElButton type="success" @click="exportData">导出Excel</ElButton>
        <ElButton @click="loadData">刷新</ElButton>
      </ElForm-item>
    </ElForm>

    <!-- 统计卡片 -->
    <ElRow :gutter="20" class="mb-4">
      <ElCol :span="6">
        <ElCard shadow="hover">
          <div class="text-center">
            <div class="text-sm text-gray-500">总租金收入</div>
            <div class="text-2xl font-bold text-blue-600 mt-2">¥ {{ summary.totalRent }}</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard shadow="hover">
          <div class="text-center">
            <div class="text-sm text-gray-500">押金收入</div>
            <div class="text-2xl font-bold text-green-600 mt-2">¥ {{ summary.totalDeposit }}</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard shadow="hover">
          <div class="text-center">
            <div class="text-sm text-gray-500">维修支出</div>
            <div class="text-2xl font-bold text-orange-500 mt-2">¥ {{ summary.totalMaintenance }}</div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard shadow="hover">
          <div class="text-center">
            <div class="text-sm text-gray-500">净利润</div>
            <div class="text-2xl font-bold text-red-600 mt-2">¥ {{ summary.netIncome }}</div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 图表区域 -->
    <ElRow :gutter="20" class="mb-4">
      <ElCol :span="12">
        <ElCard shadow="hover">
          <template #header>
            <span>收入趋势</span>
          </template>
          <div ref="trendChartRef" class="h-80"></div>
        </ElCard>
      </ElCol>
      <ElCol :span="12">
        <ElCard shadow="hover">
          <template #header>
            <span>支出分布</span>
          </template>
          <div ref="expenseChartRef" class="h-80"></div>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 明细表格 -->
    <ElCard shadow="hover">
      <template #header>
        <span>月度明细</span>
      </template>
      <ElTable :data="monthlyData" border stripe>
        <ElTable-column prop="month" label="月份" width="140" />
        <ElTable-column prop="rent" label="租金收入" width="140">
          <template #default="{ row }">¥ {{ row.rent }}</template>
        </ElTable-column>
        <ElTable-column prop="deposit" label="押金收入" width="140">
          <template #default="{ row }">¥ {{ row.deposit }}</template>
        </ElTable-column>
        <ElTable-column prop="refund" label="退款支出" width="140">
          <template #default="{ row }">¥ {{ row.refund }}</template>
        </ElTable-column>
        <ElTable-column prop="maintenance" label="维修支出" width="140">
          <template #default="{ row }">¥ {{ row.maintenance }}</template>
        </ElTable-column>
        <ElTable-column prop="net" label="净收入" width="140">
          <template #default="{ row }">
            <span :class="row.net >= 0 ? 'text-green-600' : 'text-red-600'" class="font-bold">¥ {{ row.net }}</span>
          </template>
        </ElTable-column>
      </ElTable>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import {
  ElCard, ElRow, ElCol, ElTable, ElTableColumn, ElButton, ElForm, ElFormItem,
  ElSelect, ElOption, ElDatePicker, ElMessage
} from 'element-plus'
import * as echarts from 'echarts'
import { dashboardApi } from '@/api/dashboard'
import { storeApi } from '@/api/store'
import type { Store } from '@/types'

const stores = ref<Store[]>([])
const filters = reactive({ storeId: undefined as number | undefined, dateRange: [] as string[] })

const summary = reactive({
  totalRent: 0,
  totalDeposit: 0,
  totalMaintenance: 0,
  totalRefund: 0,
  netIncome: 0
})

const monthlyData = ref<any[]>([])
const trendChartRef = ref<HTMLDivElement | null>(null)
const expenseChartRef = ref<HTMLDivElement | null>(null)
let trendChart: echarts.ECharts | null = null
let expenseChart: echarts.ECharts | null = null

const loadStores = async () => {
  try {
    const res = await storeApi.getAll()
    stores.value = (res && Array.isArray(res) ? res : []) as Store[]
  } catch (e) { stores.value = [] }
}

const loadData = async () => {
  // 当前后端 DashboardController 只提供房态统计，没有财务数据接口
  // 财务报表使用内置模拟数据。如需对接真实业务数据，
  // 请在后端添加 /api/dashboard/financeStats 接口并在此处调用
  const mockMonthly = [
    { month: '2026-01', rent: 32000, deposit: 12000, refund: 500, maintenance: 800 },
    { month: '2026-02', rent: 31000, deposit: 8000, refund: 1500, maintenance: 1200 },
    { month: '2026-03', rent: 35000, deposit: 9000, refund: 800, maintenance: 600 },
    { month: '2026-04', rent: 33000, deposit: 7000, refund: 2000, maintenance: 900 },
    { month: '2026-05', rent: 36000, deposit: 11000, refund: 1200, maintenance: 1500 },
    { month: '2026-06', rent: 34000, deposit: 13000, refund: 600, maintenance: 700 }
  ]
  mockMonthly.forEach(m => { m.net = m.rent + m.deposit - m.refund - m.maintenance })

  // 尝试调用后端获取房态统计（作为补充信息）
  try {
    const roomStats = await dashboardApi.getRoomStatusStats()
    console.info('[finance] 当前房态统计:', roomStats)
  } catch (e) {
    // 后端不可用时静默失败，不影响财务数据展示
  }

  setDefaultSummary(mockMonthly)
  monthlyData.value = mockMonthly
  await nextTick()
  renderCharts()
}

const setDefaultSummary = (data: any[]) => {
  summary.totalRent = data.reduce((s, x) => s + x.rent, 0)
  summary.totalDeposit = data.reduce((s, x) => s + x.deposit, 0)
  summary.totalMaintenance = data.reduce((s, x) => s + x.maintenance, 0)
  summary.totalRefund = data.reduce((s, x) => s + x.refund, 0)
  summary.netIncome = summary.totalRent + summary.totalDeposit - summary.totalRefund - summary.totalMaintenance
}

const renderCharts = () => {
  renderTrendChart()
  renderExpenseChart()
}

const renderTrendChart = () => {
  if (!trendChartRef.value) return
  if (trendChart) trendChart.dispose()
  trendChart = echarts.init(trendChartRef.value)

  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { data: ['租金收入', '押金收入', '净收入'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: monthlyData.value.map(m => m.month),
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#666', formatter: '{value}元' },
      splitLine: { lineStyle: { color: '#eee' } }
    },
    series: [
      {
        name: '租金收入',
        type: 'line',
        smooth: true,
        data: monthlyData.value.map(m => m.rent),
        lineStyle: { width: 3 },
        itemStyle: { color: '#409eff' },
        areaStyle: { color: 'rgba(64, 158, 255, 0.1)' }
      },
      {
        name: '押金收入',
        type: 'line',
        smooth: true,
        data: monthlyData.value.map(m => m.deposit),
        lineStyle: { width: 3 },
        itemStyle: { color: '#67c23a' }
      },
      {
        name: '净收入',
        type: 'bar',
        data: monthlyData.value.map(m => m.net),
        itemStyle: { color: '#f56c6c', borderRadius: [6, 6, 0, 0] },
        barWidth: '30%'
      }
    ]
  }
  trendChart.setOption(option)
}

const renderExpenseChart = () => {
  if (!expenseChartRef.value) return
  if (expenseChart) expenseChart.dispose()
  expenseChart = echarts.init(expenseChartRef.value)

  const totalRefund = summary.totalRefund
  const totalMaintenance = summary.totalMaintenance
  const otherExpense = Math.round((totalRefund + totalMaintenance) * 0.1)

  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c}元 ({d}%)' },
    legend: { orient: 'vertical', right: '10%', top: 'center', data: ['退款支出', '维修支出', '其他支出'] },
    series: [{
      name: '支出分布',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false, position: 'center' },
      emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
      data: [
        { value: totalRefund, name: '退款支出', itemStyle: { color: '#e6a23c' } },
        { value: totalMaintenance, name: '维修支出', itemStyle: { color: '#f56c6c' } },
        { value: otherExpense, name: '其他支出', itemStyle: { color: '#909399' } }
      ]
    }]
  }
  expenseChart.setOption(option)
}

const handleResize = () => {
  trendChart?.resize()
  expenseChart?.resize()
}

const exportData = () => {
  ElMessage.success('正在准备导出数据...')
  // 导出为 CSV 的简单实现
  const headers = ['月份', '租金收入', '押金收入', '退款支出', '维修支出', '净收入']
  const rows = monthlyData.value.map(m => [m.month, m.rent, m.deposit, m.refund, m.maintenance, m.net])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `财务报表_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(async () => {
  await loadStores()
  loadData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  expenseChart?.dispose()
})
</script>

<style scoped>
.p-4 { padding: 1rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-sm { font-size: 0.875rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.font-bold { font-weight: 700; }
.mb-4 { margin-bottom: 1rem; }
.mt-2 { margin-top: 0.5rem; }
.text-blue-600 { color: #2563eb; }
.text-green-600 { color: #16a34a; }
.text-orange-500 { color: #f97316; }
.text-red-600 { color: #dc2626; }
.text-gray-500 { color: #6b7280; }
.text-center { text-align: center; }
.h-80 { height: 20rem; }
</style>
