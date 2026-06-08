import axios from './axios'
import type { Contract, PageResult } from '@/types'

export const contractApi = {
  /** 查询所有合同 */
  getAll: () => axios.get<Contract[]>('/contract/showAll'),
  /** 分页查询合同 */
  getPage: (params: { current?: number; size?: number; storeId?: number; contractStatus?: number }) =>
    axios.get<PageResult<Contract>>('/contract/page', { params }),
  /** 根据租户ID查询合同 */
  listByTenant: (tenantId: number) => axios.get<Contract[]>(`/contract/listByTenant/${tenantId}`),
  /** 根据房间ID查询合同 */
  listByRoom: (roomId: number) => axios.get<Contract[]>(`/contract/listByRoom/${roomId}`),
  /** 查询生效中的合同 */
  getActive: () => axios.get<Contract[]>('/contract/active'),
  /** 根据ID查询合同 */
  getById: (id: number) => axios.get<Contract>(`/contract/${id}`),
  /** 根据合同编号查询 */
  getByContractNo: (contractNo: string) =>
    axios.get<Contract>('/contract/getByContractNo', { params: { contractNo } }),
  /** 新增合同 */
  save: (data: Contract) => axios.post<boolean>('/contract/save', data),
  /** 更新合同 */
  update: (data: Contract) => axios.put<boolean>('/contract/update', data),
  /** 逻辑删除合同 */
  delete: (id: number) => axios.delete<boolean>(`/contract/${id}`),
  /** 更新合同状态 */
  updateStatus: (id: number, contractStatus: number) =>
    axios.patch<boolean>(`/contract/updateStatus/${id}`, null, { params: { contractStatus } })
}
