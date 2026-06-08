import axios from './axios'
import type { Tenant, PageResult } from '@/types'

export const tenantApi = {
  /** 查询所有租户 */
  getAll: () => axios.get<Tenant[]>('/tenant/showAll'),
  /** 分页查询租户 */
  getPage: (params: { current?: number; size?: number; realName?: string; phone?: string; status?: number }) =>
    axios.get<PageResult<Tenant>>('/tenant/page', { params }),
  /** 根据ID查询租户 */
  getById: (id: number) => axios.get<Tenant>(`/tenant/${id}`),
  /** 根据身份证号查询 */
  searchByIdCard: (idCardNo: string) =>
    axios.get<Tenant>('/tenant/searchByIdCard', { params: { idCardNo } }),
  /** 根据手机号查询 */
  searchByPhone: (phone: string) => axios.get<Tenant>('/tenant/searchByPhone', { params: { phone } }),
  /** 新增租户 */
  save: (data: Tenant) => axios.post<boolean>('/tenant/save', data),
  /** 更新租户 */
  update: (data: Tenant) => axios.put<boolean>('/tenant/update', data),
  /** 逻辑删除租户 */
  delete: (id: number) => axios.delete<boolean>(`/tenant/${id}`),
  /** 更新租户状态 */
  updateStatus: (id: number, status: number) =>
    axios.patch<boolean>(`/tenant/updateStatus/${id}`, null, { params: { status } })
}
