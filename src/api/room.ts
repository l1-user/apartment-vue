import axios from './axios'
import type { Room, PageResult } from '@/types'

export const roomApi = {
  /** 查询所有房间 */
  getAll: () => axios.get<Room[]>('/room/showAll'),
  /** 分页查询房间 */
  getPage: (params: { current?: number; size?: number; storeId?: number; buildingId?: number; status?: number }) =>
    axios.get<PageResult<Room>>('/room/page', { params }),
  /** 根据ID查询房间 */
  getById: (id: number) => axios.get<Room>(`/room/${id}`),
  /** 新增房间 */
  save: (data: Room) => axios.post<boolean>('/room/save', data),
  /** 更新房间 */
  update: (data: Room) => axios.put<boolean>('/room/update', data),
  /** 逻辑删除房间 */
  delete: (id: number) => axios.delete<boolean>(`/room/${id}`),
  /** 更新房间状态 */
  updateStatus: (id: number, status: number, statusRemark?: string) =>
    axios.patch<boolean>(`/room/updateStatus/${id}`, null, { params: { status, statusRemark } }),
  /** 根据楼栋ID查询房间列表 */
  listByBuilding: (buildingId: number) => axios.get<Room[]>(`/room/listByBuilding/${buildingId}`),
  /** 根据状态查询房间列表 */
  listByStatus: (status: number) => axios.get<Room[]>(`/room/listByStatus/${status}`)
}
