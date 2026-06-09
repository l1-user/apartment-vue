import request from './axios'

export const bookingApi = {
  submitBooking(data: { userId: number; roomId: number; leaseTerm: number; remark?: string }): Promise<any> {
    return request({
      url: '/booking/apply',
      method: 'post',
      data
    })
  },
  
  getBookingList(userId: number): Promise<any> {
    return request({
      url: `/booking/list/${userId}`,
      method: 'get'
    })
  }
}

export const paymentApi = {
  pay(data: { userId: number; billNo: string; paymentMethod: string; amount: number }): Promise<any> {
    return request({
      url: '/payment/pay',
      method: 'post',
      data
    })
  },
  
  getPaymentRecords(userId: number): Promise<any> {
    return request({
      url: `/payment/records/${userId}`,
      method: 'get'
    })
  }
}

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