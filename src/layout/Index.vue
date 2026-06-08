<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElContainer, ElAside, ElHeader, ElMain, ElMenu, ElSubMenu, ElMenuItem, ElButton, ElIcon } from 'element-plus'
import { Menu as IconMenu, Histogram, House, User, Key, Money, SwitchButton, Tools, DataAnalysis } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)

const currentPath = computed(() => route.path)

const handleMenuClick = (path: string) => {
  router.push(path)
}
</script>

<template>
  <el-container class="h-screen">
    <el-aside :width="isCollapse ? '64px' : '220px'" style="background-color: #1f2937">
      <div class="sidebar-logo">
        <div v-if="!isCollapse" class="logo-expanded">
          <div class="logo-title">公寓管理系统</div>
          <div class="logo-subtitle">Apartment Management</div>
        </div>
        <div v-else class="logo-collapsed">
          <span>公</span>
        </div>
      </div>
      <el-menu
        :default-active="currentPath"
        class="border-0"
        :collapse="isCollapse"
        background-color="#1f2937"
        text-color="rgba(255,255,255,0.7)"
        active-text-color="#409eff"
      >
        <el-menu-item index="/dashboard" @click="handleMenuClick('/dashboard')">
          <el-icon><Histogram /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>

        <el-sub-menu index="housing">
          <template #title>
            <el-icon><House /></el-icon>
            <span>房源管理</span>
          </template>
          <el-menu-item index="/housing/room" @click="handleMenuClick('/housing/room')">房间管理</el-menu-item>
          <el-menu-item index="/housing/store" @click="handleMenuClick('/housing/store')">门店管理</el-menu-item>
          <el-menu-item index="/housing/building" @click="handleMenuClick('/housing/building')">楼栋管理</el-menu-item>
          <el-menu-item index="/housing/roomType" @click="handleMenuClick('/housing/roomType')">房型模板</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/tenant" @click="handleMenuClick('/tenant')">
          <el-icon><User /></el-icon>
          <template #title>租户管理</template>
        </el-menu-item>

        <el-menu-item index="/checkin" @click="handleMenuClick('/checkin')">
          <el-icon><Key /></el-icon>
          <template #title>入住管理</template>
        </el-menu-item>

        <el-menu-item index="/bill" @click="handleMenuClick('/bill')">
          <el-icon><Money /></el-icon>
          <template #title>租金账单</template>
        </el-menu-item>

        <el-menu-item index="/checkout" @click="handleMenuClick('/checkout')">
          <el-icon><SwitchButton /></el-icon>
          <template #title>退租管理</template>
        </el-menu-item>

        <el-sub-menu index="maintenance">
          <template #title>
            <el-icon><Tools /></el-icon>
            <span>维修保洁</span>
          </template>
          <el-menu-item index="/maintenance/order" @click="handleMenuClick('/maintenance/order')">维修工单</el-menu-item>
          <el-menu-item index="/maintenance/cleaning" @click="handleMenuClick('/maintenance/cleaning')">保洁计划</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/finance" @click="handleMenuClick('/finance')">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>财务报表</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="bg-white border-b flex items-center justify-between h-16 px-6">
        <el-button :icon="IconMenu" @click="isCollapse = !isCollapse" circle />
        <div class="header-right">
          <span class="admin-text">管理员</span>
        </div>
      </el-header>
      <el-main class="bg-gray-100">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.h-screen {
  height: 100vh;
}

.sidebar-logo {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a8a 0%, #1f2937 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 16px;
}

.logo-expanded {
  text-align: center;
  width: 100%;
}

.logo-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2px;
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.logo-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 1px;
  font-weight: 400;
}

.logo-collapsed {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

:deep(.el-menu) {
  background-color: #1f2937 !important;
  border-right: none !important;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 50px !important;
  line-height: 50px !important;
  font-size: 15px !important;
  color: rgba(255, 255, 255, 0.75) !important;
  padding-left: 24px !important;
  padding-right: 24px !important;
  transition: all 0.2s ease !important;
  margin: 2px 8px !important;
  border-radius: 6px !important;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: rgba(59, 130, 246, 0.15) !important;
  color: #60a5fa !important;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.1) 100%) !important;
  color: #60a5fa !important;
  font-weight: 500 !important;
  position: relative !important;
}

:deep(.el-menu-item.is-active::before) {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: linear-gradient(180deg, #3b82f6 0%, #1e3a8a 100%);
  border-radius: 2px;
}

:deep(.el-sub-menu .el-menu-item) {
  padding-left: 56px !important;
  font-size: 14px !important;
  height: 44px !important;
  line-height: 44px !important;
  color: rgba(255, 255, 255, 0.6) !important;
}

:deep(.el-sub-menu .el-menu-item.is-active) {
  color: #60a5fa !important;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background-color: rgba(59, 130, 246, 0.12) !important;
  color: #93c5fd !important;
}

:deep(.el-icon) {
  font-size: 16px !important;
  color: rgba(255, 255, 255, 0.7) !important;
  margin-right: 10px !important;
}

:deep(.el-menu-item.is-active .el-icon),
:deep(.el-sub-menu.is-active .el-icon) {
  color: #60a5fa !important;
}

:deep(.el-sub-menu__icon-arrow) {
  font-size: 12px !important;
  color: rgba(255, 255, 255, 0.4) !important;
}

:deep(.el-sub-menu.is-active .el-sub-menu__icon-arrow) {
  color: #60a5fa !important;
}

:deep(.el-sub-menu .el-menu-item.is-active::before) {
  left: -8px;
  height: 16px;
  background: #3b82f6;
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.admin-text {
  color: #6b7280;
  font-size: 14px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.04) 100%);
  border-radius: 6px;
  border: 1px solid rgba(59, 130, 246, 0.15);
}
</style>
