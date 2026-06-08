import axios from './axios'
import type { CheckIn, PageResult } from '@/types'

export const checkInApi = {
  /** 查询所有入住记录 */
  getAll: () => axios.get<CheckIn[]>('/checkIn/showAll'),
  /** 分页查询入住记录 */
  getPage: (params: {
    current?: number
    size?: number
    roomId?: number
    tenantId?: number
    contractId?: number
    status?: number
  }) => axios.get<PageResult<CheckIn>>('/checkIn/page', { params }),
  /** 根据ID查询入住记录 */
  getById: (id: number) => axios.get<CheckIn>(`/checkIn/${id}`),
  /** 新增入住记录 */
  save: (data: CheckIn) => axios.post<boolean>('/checkIn/save', data),
  /** 更新入住记录 */
  update: (data: CheckIn) => axios.put<boolean>('/checkIn/update', data),
  /** 逻辑删除入住记录 */
  delete: (id: number) => axios.delete<boolean>(`/checkIn/${id}`),
  /** 更新入住状态 */
  updateStatus: (id: number, status: number) =>
    axios.patch<boolean>(`/checkIn/updateStatus/${id}`, null, { params: { status } })
}
