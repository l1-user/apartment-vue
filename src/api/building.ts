import axios from './axios'
import type { Building, PageResult } from '@/types'

export const buildingApi = {
  /** 查询所有楼栋 */
  getAll: () => axios.get<Building[]>('/building/showAll'),
  /** 分页查询楼栋 */
  getPage: (params: { current?: number; size?: number; storeId?: number }) =>
    axios.get<PageResult<Building>>('/building/page', { params }),
  /** 根据ID查询楼栋 */
  getById: (id: number) => axios.get<Building>(`/building/${id}`),
  /** 根据门店ID查询楼栋列表 */
  listByStore: (storeId: number) => axios.get<Building[]>(`/building/listByStore/${storeId}`),
  /** 新增楼栋 */
  save: (data: Building) => axios.post<boolean>('/building/save', data),
  /** 更新楼栋 */
  update: (data: Building) => axios.put<boolean>('/building/update', data),
  /** 逻辑删除楼栋 */
  delete: (id: number) => axios.delete<boolean>(`/building/${id}`)
}
