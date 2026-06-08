import axios from './axios'
import type { CheckOutApplication, PageResult } from '@/types'

export const checkOutApplicationApi = {
  /** 查询所有退租申请 */
  getAll: () => axios.get<CheckOutApplication[]>('/checkOutApplication/showAll'),
  /** 分页查询 */
  getPage: (params: { current?: number; size?: number; tenantId?: number; roomId?: number; applicationStatus?: number }) =>
    axios.get<PageResult<CheckOutApplication>>('/checkOutApplication/page', { params }),
  /** 根据ID查询 */
  getById: (id: number) => axios.get<CheckOutApplication>(`/checkOutApplication/${id}`),
  /** 新增申请 */
  save: (data: CheckOutApplication) => axios.post<CheckOutApplication | boolean>('/checkOutApplication/save', data),
  /** 更新申请 */
  update: (data: CheckOutApplication) => axios.put<boolean>('/checkOutApplication/update', data),
  /** 删除 */
  delete: (id: number) => axios.delete<boolean>(`/checkOutApplication/${id}`),
  /** 审核通过 */
  approve: (id: number, approver?: string, approveRemark?: string) =>
    axios.patch<boolean>(`/checkOutApplication/approve/${id}`, null, { params: { approver, approveRemark } }),
  /** 审核拒绝 */
  reject: (id: number, approver?: string, approveRemark?: string) =>
    axios.patch<boolean>(`/checkOutApplication/reject/${id}`, null, { params: { approver, approveRemark } }),
  /** 完成退房 */
  complete: (id: number, actualCheckOutDate?: string) =>
    axios.patch<boolean>(`/checkOutApplication/complete/${id}`, null, { params: { actualCheckOutDate } })
}
