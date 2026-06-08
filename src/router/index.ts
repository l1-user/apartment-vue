import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/Index.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/dashboard/Index.vue'), meta: { title: '仪表盘' } },
      { path: 'housing/room', name: 'HousingRoom', component: () => import('@/views/housing/room/Index.vue'), meta: { title: '房间管理' } },
      { path: 'housing/store', name: 'HousingStore', component: () => import('@/views/housing/store/Index.vue'), meta: { title: '门店管理' } },
      { path: 'housing/building', name: 'HousingBuilding', component: () => import('@/views/housing/building/Index.vue'), meta: { title: '楼栋管理' } },
      { path: 'housing/roomType', name: 'HousingRoomType', component: () => import('@/views/housing/roomType/Index.vue'), meta: { title: '房型模板' } },
      { path: 'tenant', name: 'Tenant', component: () => import('@/views/tenant/Index.vue'), meta: { title: '租户管理' } },
      { path: 'checkin', name: 'CheckIn', component: () => import('@/views/checkin/Index.vue'), meta: { title: '入住管理' } },
      { path: 'bill', name: 'Bill', component: () => import('@/views/bill/Index.vue'), meta: { title: '租金账单' } },
      { path: 'checkout', name: 'CheckOut', component: () => import('@/views/checkout/Index.vue'), meta: { title: '退租管理' } },
      { path: 'maintenance/order', name: 'MaintenanceOrder', component: () => import('@/views/maintenance/order/Index.vue'), meta: { title: '维修工单' } },
      { path: 'maintenance/cleaning', name: 'MaintenanceCleaning', component: () => import('@/views/maintenance/cleaning/Index.vue'), meta: { title: '保洁计划' } },
      { path: 'finance', name: 'Finance', component: () => import('@/views/finance/Index.vue'), meta: { title: '财务报表' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
