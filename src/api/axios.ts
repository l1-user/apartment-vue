import axios from 'axios'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  baseURL: '/api',
  timeout: 30000
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    ElMessage.error('请求配置错误：' + (error.message || '未知错误'))
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    const data = response.data

    // 情况 1：后端返回 { success, message, data } 格式的对象
    if (data !== null && typeof data === 'object' && 'success' in data) {
      if (data.success === false) {
        const msg = data.message || '操作失败'
        ElMessage.error(msg)
        return Promise.reject(new Error(msg))
      }
      // 成功时返回完整数据，让业务层能够获取登录信息
      return data
    }

    // 情况 2：后端 Controller 直接返回 boolean (true/false)
    if (typeof data === 'boolean') {
      if (data === false) {
        ElMessage.error('操作失败')
        return Promise.reject(new Error('操作失败'))
      }
      return true
    }

    // 情况 3：返回普通数据（列表、分页、对象实体等）——直接透传
    return data
  },
  (error) => {
    console.error('API Error:', error)
    let msg = '接口请求失败'
    if (error.response) {
      const status = error.response.status
      if (status === 404) {
        msg = `后端接口不存在 (404)：请检查后端服务是否启动，或接口路径是否正确`
      } else if (status === 500) {
        msg = `服务器内部错误 (500)：请查看后端控制台日志`
      } else if (status === 400) {
        msg = `请求参数错误 (400)：请检查提交的数据格式`
      } else {
        msg = `服务器响应错误 (${status})`
      }
    } else if (error.code === 'ECONNABORTED') {
      msg = '请求超时：请检查网络或后端服务是否启动'
    } else if (error.request) {
      msg = '后端服务未响应：请确认后端 Spring Boot 应用已启动并运行在 http://localhost:8080'
    } else {
      msg = '请求错误：' + (error.message || '未知错误')
    }
    ElMessage.error(msg)
    return Promise.reject(error)
  }
)

export default instance
