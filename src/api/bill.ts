import axios from './axios'
import type { Bill, PageResult } from '@/types'

export const billApi = {
  /** 查询所有账单 */
  getAll: () => axios.get<Bill[]>('/bill/showAll'),
  /** 分页查询账单 */
  getPage: (params: {
    current?: number
    size?: number
    tenantId?: number
    billStatus?: number
    billType?: number
  }) => axios.get<PageResult<Bill>>('/bill/page', { params }),
  /** 根据租户ID查询账单 */
  listByTenant: (tenantId: number) => axios.get<Bill[]>(`/bill/listByTenant/${tenantId}`),
  /** 查询逾期账单 */
  listOverdue: () => axios.get<Bill[]>('/bill/overdue'),
  /** 查询未支付账单 */
  listUnpaid: () => axios.get<Bill[]>('/bill/unpaid'),
  /** 根据ID查询账单 */
  getById: (id: number) => axios.get<Bill>(`/bill/${id}`),
  /** 新增账单 */
  save: (data: Bill) => axios.post<boolean>('/bill/save', data),
  /** 更新账单 */
  update: (data: Bill) => axios.put<boolean>('/bill/update', data),
  /** 逻辑删除账单 */
  delete: (id: number) => axios.delete<boolean>(`/bill/${id}`),
  /** 支付账单 */
  pay: (id: number, params: { paidAmount: number; paymentMethod: string }) =>
    axios.post<boolean>(`/bill/pay/${id}`, null, { params })
}
