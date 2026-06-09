import request from './axios'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    token: string
    userId: number
    username: string
    realName: string
    userType: number
    userTypeName: string
  }
}

export const authApi = {
  login(data: LoginRequest): Promise<LoginResponse> {
    return request({
      url: '/auth/login',
      method: 'post',
      data
    })
  },
  
  changePassword(data: { userId: number; oldPassword: string; newPassword: string }): Promise<any> {
    return request({
      url: '/auth/changePassword',
      method: 'post',
      data
    })
  }
}
