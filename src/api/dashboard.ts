import axios from './axios'
import type { Room } from '@/types'

export const dashboardApi = {
  /** 获取房态统计 */
  getRoomStatusStats: (params?: { storeId?: number }) =>
    axios.get<Record<number, number>>('/dashboard/roomStatusStats', { params }),
  /** 根据状态获取房间列表 */
  getRoomListByStatus: (params: { status: number; storeId?: number }) =>
    axios.get<Room[]>('/dashboard/roomListByStatus', { params }),
  /** 获取各门店房态统计 */
  getStoreRoomStats: () =>
    axios.get<Array<Record<string, unknown>>>('/dashboard/storeRoomStats')
}
