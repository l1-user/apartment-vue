import axios from './axios'
import type { Store, PageResult } from '@/types'

export const storeApi = {
  /** 查询所有门店 */
  getAll: () => axios.get<Store[]>('/store/showAll'),
  /** 分页查询门店 */
  getPage: (params: { current?: number; size?: number; storeName?: string; city?: string }) =>
    axios.get<PageResult<Store>>('/store/page', { params }),
  /** 根据ID查询门店 */
  getById: (id: number) => axios.get<Store>(`/store/${id}`),
  /** 新增门店 */
  save: (data: Store) => axios.post<boolean>('/store/save', data),
  /** 更新门店 */
  update: (data: Store) => axios.put<boolean>('/store/update', data),
  /** 逻辑删除门店 */
  delete: (id: number) => axios.delete<boolean>(`/store/${id}`),
  /** 统计门店数量 */
  count: () => axios.get<number>('/store/count')
}
