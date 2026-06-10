import request from './axios'

export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  response: string
}

export interface RecommendWorkerResponse {
  recommendedWorkerIds: number[]
  reason: string
}

export interface TenantQuestionRequest {
  tenantId: number
  question: string
}

export interface TenantQuestionResponse {
  answer: string
}

export const aiApi = {
  chat(data: ChatRequest): Promise<ChatResponse> {
    return request({
      url: '/ai/chat',
      method: 'post',
      data
    })
  },
  
  recommendWorker(workOrderId: number): Promise<RecommendWorkerResponse> {
    return request({
      url: `/ai/recommend-worker/${workOrderId}`,
      method: 'get'
    })
  },
  
  summarizeContract(contractId: number): Promise<any> {
    return request({
      url: `/ai/summarize-contract/${contractId}`,
      method: 'get'
    })
  },
  
  answerTenantQuestion(data: TenantQuestionRequest): Promise<TenantQuestionResponse> {
    return request({
      url: '/ai/tenant-question',
      method: 'post',
      data
    })
  }
}