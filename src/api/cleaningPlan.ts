import axios from './axios'
import type { CleaningPlan, PageResult } from '@/types'

export const cleaningPlanApi = {
  /** 查询所有保洁计划 */
  getAll: () => axios.get<CleaningPlan[]>('/cleaningPlan/showAll'),
  /** 分页查询 */
  getPage: (params: { current?: number; size?: number; roomId?: number; storeId?: number; buildingId?: number; planStatus?: number }) =>
    axios.get<PageResult<CleaningPlan>>('/cleaningPlan/page', { params }),
  /** 根据ID查询 */
  getById: (id: number) => axios.get<CleaningPlan>(`/cleaningPlan/${id}`),
  /** 新增保洁计划 */
  save: (data: CleaningPlan) => axios.post<boolean>('/cleaningPlan/save', data),
  /** 更新 */
  update: (data: CleaningPlan) => axios.put<boolean>('/cleaningPlan/update', data),
  /** 删除 */
  delete: (id: number) => axios.delete<boolean>(`/cleaningPlan/${id}`),
  /** 更新状态 (后端参数: status, assignedTo) */
  updateStatus: (id: number, status: number, assignedTo?: string) =>
    axios.patch<boolean>(`/cleaningPlan/updateStatus/${id}`, null, { params: { status, assignedTo } })
}
