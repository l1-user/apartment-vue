// 通用分页结果（MyBatis-Plus IPage 返回格式）
export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages?: number
  orders?: any[]
  hitCount?: boolean
  searchCount?: boolean
}

// 门店
export interface Store {
  id?: number
  storeCode?: string
  storeName: string
  storeType?: number // 1-直营店 2-加盟店 3-托管店
  province?: string
  city?: string
  district?: string
  address?: string
  longitude?: string | number
  latitude?: string | number
  contactPerson?: string
  contactPhone?: string
  totalBuildings?: number
  totalRooms?: number
  totalFloors?: number
  status?: number // 0-停用 1-正常 2-维护中
  remark?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  isDeleted?: number
}

// 楼栋
export interface Building {
  id?: number
  buildingCode?: string
  buildingName: string
  storeId: number
  totalFloors?: number
  totalRooms?: number
  hasElevator?: number // 0-无 1-有
  constructionYear?: string
  status?: number // 0-停用 1-正常 2-维护中
  remark?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  isDeleted?: number
}

// 房型
export interface RoomType {
  id?: number
  storeId?: number
  typeCode?: string
  typeName: string
  bedType?: string
  maxOccupancy?: number
  area?: string | number
  windowType?: number // 1-无窗 2-内窗 3-外窗
  hasBalcony?: number // 0-无 1-有
  hasBathroom?: number
  hasKitchen?: number
  hasAirConditioner?: number
  hasHeating?: number
  hasWaterHeater?: number
  hasWashingMachine?: number
  hasRefrigerator?: number
  hasTv?: number
  hasWifi?: number
  standardRent?: string | number
  depositMonths?: number
  status?: number // 0-停用 1-启用
  remark?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  isDeleted?: number
}

// 房间
export interface Room {
  id?: number
  roomCode: string
  roomName?: string
  storeId: number
  buildingId: number
  floorNumber: number
  roomTypeId?: number
  area?: string | number
  orientation?: string
  status?: number // 1-空闲 2-已租 3-维修中 4-预留 5-已预订
  currentRent?: string | number
  rentUnit?: string
  currentTenantId?: number
  lastMaintenanceTime?: string
  nextMaintenanceTime?: string
  statusRemark?: string
  remark?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  isDeleted?: number
}

// 租户
export interface Tenant {
  id?: number
  tenantCode?: string
  realName: string
  nickname?: string
  gender?: number // 1-男 2-女 3-未知
  birthday?: string
  idCardNo: string
  idCardFrontUrl?: string
  idCardBackUrl?: string
  ocrResult?: string
  phone: string
  email?: string
  wechat?: string
  alipay?: string
  profession?: string
  companyName?: string
  companyAddress?: string
  education?: string
  maritalStatus?: number // 1-未婚 2-已婚 3-离异
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelation?: string
  emergencyContactAddress?: string
  status?: number // 1-正常 2-黑名单 3-已退租
  creditScore?: number // 0-100
  remark?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  isDeleted?: number
}

// 合同
export interface Contract {
  id?: number
  contractNo: string
  roomId: number
  tenantId: number
  storeId?: number
  contractType?: number // 1-新签 2-续签 3-变更
  signDate?: string
  startDate: string
  endDate: string
  leaseTerm?: number
  rentAmount?: string | number
  depositAmount?: string | number
  paymentCycle?: number // 1-月付 2-季付 3-半年付 4-年付
  paymentDay?: number
  rentFreeDays?: number
  rentFreeAmount?: string | number
  otherFees?: string
  contractFileUrl?: string
  contractStatus?: number // 1-草稿 2-生效中 3-已到期 4-已终止 5-已续签
  terminationReason?: string
  terminationDate?: string
  remark?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  isDeleted?: number
}

// 账单
export interface Bill {
  id?: number
  billNo?: string
  contractId?: number
  tenantId?: number
  roomId?: number
  storeId?: number
  billType?: number // 1-租金 2-押金 3-水电费 4-物业费 5-网络费 6-维修费 7-违约金 8-其他
  billPeriodStart?: string
  billPeriodEnd?: string
  dueDate?: string
  amount?: string | number
  paidAmount?: string | number
  discountAmount?: string | number
  lateFee?: string | number
  finalAmount?: string | number
  billStatus?: number // 1-待支付 2-部分支付 3-已支付 4-逾期 5-已作废
  paymentMethod?: string
  paymentTime?: string
  paymentTransactionId?: string
  remark?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  isDeleted?: number
}

// 维修工单
export interface MaintenanceOrder {
  id?: number
  orderNo?: string
  roomId: number
  tenantId?: number
  storeId?: number
  category?: string // 水电/家电/家具/门窗/卫浴/网络/其他
  urgencyLevel?: number // 1-紧急 2-普通 3-一般
  description: string
  photos?: string
  reportTime?: string
  assigneeId?: number
  assigneeName?: string
  assignTime?: string
  estimatedCost?: string | number
  actualCost?: string | number
  repairTime?: string
  repairResult?: string
  orderStatus?: number // 1-待派单 2-已派单 3-维修中 4-待验收 5-已完成 6-已取消
  tenantRating?: number
  tenantComment?: string
  remark?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  isDeleted?: number
}

// 退租申请
export interface CheckOutApplication {
  id?: number
  applicationNo?: string
  contractId?: number
  tenantId?: number
  roomId?: number
  storeId?: number
  applicationDate?: string
  expectedCheckOutDate?: string
  actualCheckOutDate?: string
  checkOutReason?: string
  applicationStatus?: number // 1-待审核 2-审核通过 3-已拒绝 4-已完成
  approver?: string
  approveTime?: string
  approveRemark?: string
  remark?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  isDeleted?: number
}

// 保洁计划
export interface CleaningPlan {
  id?: number
  planNo?: string
  planName?: string
  storeId?: number
  buildingId?: number
  planType?: number // 1-日常保洁 2-深度保洁 3-退租保洁 4-定期大扫除
  frequency?: string // daily/weekly/monthly/quarterly
  frequencyValue?: number // 如每周3=周三，每月15=15号
  assignedTo?: string // 指派保洁员
  estimatedDuration?: number // 预计耗时(分钟)
  status?: number // 0-停用 1-启用
  remark?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  isDeleted?: number
}

// 入住记录
export interface CheckIn {
  id?: number
  checkInNo?: string
  contractId?: number
  tenantId?: number
  roomId?: number
  storeId?: number
  checkInDate?: string
  expectedCheckOutDate?: string
  actualCheckOutDate?: string
  occupantName?: string
  occupantIdCard?: string
  occupantPhone?: string
  checkInStatus?: number // 1-待入住 2-已入住 3-已退房 4-已取消
  remark?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  isDeleted?: number
}

// 房态统计
export interface RoomStatusStats {
  1?: number // 空闲
  2?: number // 已租
  3?: number // 维修中
  4?: number // 预留
  5?: number // 已预订
}
