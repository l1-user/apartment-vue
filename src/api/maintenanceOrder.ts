import axios from './axios'
import type { MaintenanceOrder, PageResult } from '@/types'

export const maintenanceOrderApi = {
  /** 查询所有工单 */
  getAll: () => axios.get<MaintenanceOrder[]>('/maintenanceOrder/showAll'),
  /** 分页查询工单 */
  getPage: (params: {
    current?: number
    size?: number
    storeId?: number
    orderStatus?: number
    urgencyLevel?: number
  }) => axios.get<PageResult<MaintenanceOrder>>('/maintenanceOrder/page', { params }),
  /** 根据房间ID查询工单 */
  listByRoom: (roomId: number) => axios.get<MaintenanceOrder[]>(`/maintenanceOrder/listByRoom/${roomId}`),
  /** 查询待派单工单 */
  getPending: () => axios.get<MaintenanceOrder[]>('/maintenanceOrder/pending'),
  /** 根据ID查询工单 */
  getById: (id: number) => axios.get<MaintenanceOrder>(`/maintenanceOrder/${id}`),
  /** 新增工单 */
  save: (data: MaintenanceOrder) => axios.post<boolean>('/maintenanceOrder/save', data),
  /** 更新工单 */
  update: (data: MaintenanceOrder) => axios.put<boolean>('/maintenanceOrder/update', data),
  /** 逻辑删除工单 */
  delete: (id: number) => axios.delete<boolean>(`/maintenanceOrder/${id}`),
  /** 派单 */
  assign: (id: number, assigneeId: number, assigneeName: string) =>
    axios.patch<boolean>(`/maintenanceOrder/assign/${id}`, null, { params: { assigneeId, assigneeName } }),
  /** 完成工单 */
  complete: (id: number, repairResult: string, actualCost?: number) =>
    axios.patch<boolean>(`/maintenanceOrder/complete/${id}`, null, { params: { repairResult, actualCost } })
}
