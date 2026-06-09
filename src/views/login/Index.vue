<template>
  <div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; padding: 20px;">
    <div style="width: 100%; max-width: 420px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #fff; font-size: 28px; font-weight: 700; margin: 0;">公寓管理系统</h1>
        <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 4px 0 0;">Apartment Management System</p>
      </div>
      
      <el-card style="background: rgba(255,255,255,0.95); border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); border: none;">
        <div style="text-align: center; font-size: 20px; font-weight: 600; color: #303133; margin-bottom: 30px;">欢迎登录</div>
        
        <el-form :model="form" class="login-form">
          <el-form-item>
            <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="User" size="large" />
          </el-form-item>
          
          <el-form-item>
            <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock" size="large" show-password />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" size="large" style="width: 100%; height: 44px; font-size: 16px;" :loading="loading" @click="handleLogin">
              登录
            </el-button>
          </el-form-item>
          
          <div style="margin-top: 20px; padding: 15px; background: #f5f7fa; border-radius: 8px; text-align: center;">
            <span style="display: block; font-size: 12px; color: #909399; margin-bottom: 5px;">管理员：admin / 123456</span>
            <span style="display: block; font-size: 12px; color: #909399;">租户：tenant_zhangsan / 123456</span>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api/auth'

const form = reactive({
  username: '',
  password: ''
})

const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  
  try {
    const response = await authApi.login(form)
    
    if (response.success) {
      const { token, userId, username, realName, userType } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('userId', String(userId))
      localStorage.setItem('username', username)
      localStorage.setItem('realName', realName)
      localStorage.setItem('userType', String(userType))
      
      const userInfo = {
        token,
        userId,
        username,
        realName,
        userType
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      
      ElMessage.success('登录成功')
      
      setTimeout(() => {
        if (userType === 8) {
          window.location.href = '/tenant-portal'
        } else {
          window.location.href = '/'
        }
      }, 1000)
    } else {
      ElMessage.error(response.message || '登录失败')
    }
  } catch (error) {
    ElMessage.error('登录失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-form {
  padding: 0 20px;
}
</style>
