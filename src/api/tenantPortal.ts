import request from './axios'

export const tenantPortalApi = {
  getTenantStats(tenantId: number): Promise<any> {
    return request({
      url: `/tenant/stats/${tenantId}`,
      method: 'get'
    })
  },

  getTenantContracts(tenantId: number): Promise<any> {
    return request({
      url: `/tenant/contracts/${tenantId}`,
      method: 'get'
    })
  },

  getTenantBills(tenantId: number, current: number, size: number): Promise<any> {
    return request({
      url: `/tenant/bills/${tenantId}`,
      method: 'get',
      params: { current, size }
    })
  },

  getTenantMaintenanceOrders(tenantId: number): Promise<any> {
    return request({
      url: `/tenant/maintenance/orders/${tenantId}`,
      method: 'get'
    })
  },

  submitMaintenanceOrder(data: any): Promise<any> {
    return request({
      url: '/tenant/maintenance/submit',
      method: 'post',
      data
    })
  },

  submitCheckoutApplication(data: any): Promise<any> {
    return request({
      url: '/tenant/checkout/apply',
      method: 'post',
      data
    })
  },

  getAvailableRooms(current: number, size: number): Promise<any> {
    return request({
      url: '/tenant/available-rooms',
      method: 'get',
      params: { current, size }
    })
  },

  getProfile(userId: number): Promise<any> {
    return request({
      url: `/tenant/profile/${userId}`,
      method: 'get'
    })
  },

  getCurrentRoom(userId: number): Promise<any> {
    return request({
      url: `/tenant/current-room/${userId}`,
      method: 'get'
    })
  }
}