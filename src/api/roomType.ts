import axios from './axios'
import type { RoomType, PageResult } from '@/types'

export const roomTypeApi = {
  /** 查询所有房型 */
  getAll: () => axios.get<RoomType[]>('/roomType/showAll'),
  /** 分页查询房型 */
  getPage: (params: { current?: number; size?: number; storeId?: number }) =>
    axios.get<PageResult<RoomType>>('/roomType/page', { params }),
  /** 查询全局房型（门店ID为空的） */
  getGlobal: () => axios.get<RoomType[]>('/roomType/global'),
  /** 根据ID查询房型 */
  getById: (id: number) => axios.get<RoomType>(`/roomType/${id}`),
  /** 新增房型 */
  save: (data: RoomType) => axios.post<boolean>('/roomType/save', data),
  /** 更新房型 */
  update: (data: RoomType) => axios.put<boolean>('/roomType/update', data),
  /** 逻辑删除房型 */
  delete: (id: number) => axios.delete<boolean>(`/roomType/${id}`)
}
