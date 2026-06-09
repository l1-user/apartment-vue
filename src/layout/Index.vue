<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElContainer, ElAside, ElHeader, ElMain, ElMenu, ElSubMenu, ElMenuItem, ElButton, ElIcon } from 'element-plus'
import { Menu as IconMenu, Histogram, House, User, Key, Money, SwitchButton, Tools, DataAnalysis, Logout } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)

const currentPath = computed(() => route.path)
const realName = computed(() => localStorage.getItem('realName') || '管理员')

const handleMenuClick = (path: string) => {
  router.push(path)
}

const handleLogout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<template>
  <el-container class="app-container">
    <el-aside :width="isCollapse ? '64px' : '240px'" class="sidebar">
      <div class="sidebar-logo" :class="{ 'collapsed': isCollapse }">
        <div v-if="!isCollapse" class="logo-expanded">
          <div class="logo-icon">
            <ElIcon class="icon-apartment"><House /></ElIcon>
          </div>
          <div class="logo-text">
            <div class="logo-title">公寓管理系统</div>
            <div class="logo-subtitle">Apartment Management</div>
          </div>
        </div>
        <div v-else class="logo-collapsed">
          <div class="logo-icon-mini">
            <ElIcon class="icon-apartment"><House /></ElIcon>
          </div>
        </div>
      </div>
      
      <div class="sidebar-menu">
        <el-menu
          :default-active="currentPath"
          class="sidebar-menu-inner"
          :collapse="isCollapse"
          background-color="transparent"
          text-color="rgba(255,255,255,0.7)"
          active-text-color="#60a5fa"
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
      </div>
    </el-aside>
    
    <el-container class="main-container">
      <el-header class="header">
        <div class="header-left">
          <el-button :icon="IconMenu" @click="isCollapse = !isCollapse" class="menu-toggle" circle />
          <div class="header-title" v-if="!isCollapse">
            {{ route.meta.title || '公寓管理系统' }}
          </div>
        </div>
        <div class="header-right">
          <div class="admin-card">
            <span class="admin-icon">👤</span>
            <span class="admin-text">{{ realName }}</span>
          </div>
          <el-button
            icon="Logout"
            type="text"
            class="logout-btn"
            @click="handleLogout"
          >
            退出登录
          </el-button>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
}

.sidebar {
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.15);
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(99, 102, 241, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.sidebar-logo {
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(30, 58, 138, 0.3);
  transition: all 0.3s ease;
}

.sidebar-logo.collapsed {
  padding: 0;
}

.logo-expanded {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.35);
}

.icon-apartment {
  font-size: 24px;
  color: #ffffff;
}

.logo-text {
  flex: 1;
}

.logo-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2px;
  margin-bottom: 3px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.logo-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
}

.logo-collapsed {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon-mini {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.sidebar-menu {
  padding: 16px 0;
}

.sidebar-menu-inner {
  background: transparent !important;
  border-right: none !important;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 52px !important;
  line-height: 52px !important;
  font-size: 15px !important;
  color: rgba(255, 255, 255, 0.7) !important;
  padding-left: 28px !important;
  padding-right: 28px !important;
  margin: 4px 12px !important;
  border-radius: 10px !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background: rgba(59, 130, 246, 0.18) !important;
  color: #93c5fd !important;
  transform: translateX(4px);
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(30, 58, 138, 0.3) 100%) !important;
  color: #60a5fa !important;
  font-weight: 500 !important;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
}

:deep(.el-menu-item.is-active::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
  border-radius: 0 4px 4px 0;
}

:deep(.el-sub-menu .el-menu-item) {
  padding-left: 60px !important;
  font-size: 14px !important;
  height: 46px !important;
  line-height: 46px !important;
  color: rgba(255, 255, 255, 0.6) !important;
  margin-left: 24px !important;
  border-radius: 8px !important;
}

:deep(.el-sub-menu .el-menu-item.is-active) {
  color: #60a5fa !important;
  background: rgba(59, 130, 246, 0.15) !important;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background: rgba(59, 130, 246, 0.12) !important;
  color: #93c5fd !important;
}

:deep(.el-icon) {
  font-size: 17px !important;
  color: rgba(255, 255, 255, 0.7) !important;
  margin-right: 12px !important;
  transition: all 0.25s ease;
}

:deep(.el-menu-item.is-active .el-icon),
:deep(.el-sub-menu.is-active .el-icon) {
  color: #60a5fa !important;
}

:deep(.el-sub-menu__icon-arrow) {
  font-size: 13px !important;
  color: rgba(255, 255, 255, 0.4) !important;
}

:deep(.el-sub-menu.is-active .el-sub-menu__icon-arrow) {
  color: #60a5fa !important;
}

:deep(.el-sub-menu .el-menu-item.is-active::before) {
  left: 24px;
  height: 20px;
  background: #3b82f6;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
}

.header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  color: #64748b;
  transition: all 0.2s ease;
}

.menu-toggle:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  transform: scale(1.05);
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-right {
  display: flex;
  align-items: center;
}

.admin-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.04) 100%);
  border-radius: 10px;
  border: 1px solid rgba(59, 130, 246, 0.15);
  transition: all 0.25s ease;
}

.admin-card:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.admin-icon {
  font-size: 18px;
}

.admin-text {
  color: #334155;
  font-size: 14px;
  font-weight: 500;
}

.logout-btn {
  margin-left: 16px;
  color: #94a3b8;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.25s ease;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
}

.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>
