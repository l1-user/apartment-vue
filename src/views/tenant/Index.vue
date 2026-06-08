<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">租户管理</h2>

    <!-- 筛选条件 -->
    <ElForm :inline="true" class="mb-4">
      <ElForm-item label="姓名">
        <ElInput v-model="filters.realName" placeholder="输入租户姓名" clearable style="width: 160px" />
      </ElForm-item>
      <ElForm-item label="手机号">
        <ElInput v-model="filters.phone" placeholder="输入手机号" clearable style="width: 160px" />
      </ElForm-item>
      <ElForm-item label="状态">
        <ElSelect v-model="filters.status" placeholder="全部" clearable style="width: 140px">
          <ElOption label="正常" :value="1" />
          <ElOption label="黑名单" :value="2" />
          <ElOption label="已退租" :value="3" />
        </ElSelect>
      </ElForm-item>
      <ElForm-item>
        <ElButton type="primary" @click="loadTenants">查询</ElButton>
        <ElButton type="success" @click="openDialog">新增租户</ElButton>
        <ElButton @click="resetFilters">重置</ElButton>
      </ElForm-item>
    </ElForm>

    <!-- 租户列表 -->
    <ElTable :data="tenants" border stripe>
      <ElTable-column prop="tenantCode" label="租户编号" width="120" />
      <ElTable-column prop="realName" label="姓名" width="100" />
      <ElTable-column prop="gender" label="性别" width="80">
        <template #default="{ row }">{{ row.gender === 1 ? '男' : row.gender === 2 ? '女' : '未知' }}</template>
      </ElTable-column>
      <ElTable-column prop="idCardNo" label="身份证号" width="200" show-overflow-tooltip />
      <ElTable-column prop="phone" label="手机号" width="130" />
      <ElTable-column prop="profession" label="职业" width="120" show-overflow-tooltip />
      <ElTable-column prop="emergencyContactName" label="紧急联系人" width="120" show-overflow-tooltip />
      <ElTable-column prop="emergencyContactPhone" label="紧急联系电话" width="140" show-overflow-tooltip />
      <ElTable-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <ElTag :type="row.status === 1 ? 'success' : row.status === 2 ? 'danger' : 'info'" size="small">
            {{ row.status === 1 ? '正常' : row.status === 2 ? '黑名单' : '已退租' }}
          </ElTag>
        </template>
      </ElTable-column>
      <ElTable-column prop="creditScore" label="信用分" width="80" />
      <ElTable-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <ElButton type="primary" link size="small" @click="openDialog(row)">编辑</ElButton>
          <ElButton type="warning" link size="small" @click="changeStatus(row)">改状态</ElButton>
          <ElButton type="danger" link size="small" @click="deleteTenant(row)">删除</ElButton>
        </template>
      </ElTable-column>
    </ElTable>

    <!-- 新增/编辑弹窗 -->
    <ElDialog v-model="dialogVisible" :title="form.id ? '编辑租户' : '新增租户'" width="680px">
      <ElForm :model="form" label-width="120px" :rules="rules" ref="formRef">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElForm-item label="租户编码" prop="tenantCode">
              <ElInput v-model="form.tenantCode" placeholder="如 T001" />
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="姓名" prop="realName">
              <ElInput v-model="form.realName" />
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="性别" prop="gender">
              <ElSelect v-model="form.gender" style="width: 100%">
                <ElOption label="男" :value="1" />
                <ElOption label="女" :value="2" />
                <ElOption label="未知" :value="3" />
              </ElSelect>
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="身份证号" prop="idCardNo">
              <ElInput v-model="form.idCardNo" maxlength="18" />
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="手机号" prop="phone">
              <ElInput v-model="form.phone" maxlength="11" />
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="邮箱">
              <ElInput v-model="form.email" />
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="生日">
              <ElDatePicker v-model="form.birthday" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="职业">
              <ElInput v-model="form.profession" />
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="公司名称">
              <ElInput v-model="form.companyName" />
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="紧急联系人">
              <ElInput v-model="form.emergencyContactName" />
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="紧急联系电话">
              <ElInput v-model="form.emergencyContactPhone" />
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="状态" prop="status">
              <ElRadio-group v-model="form.status">
                <ElRadio :value="1">正常</ElRadio>
                <ElRadio :value="2">黑名单</ElRadio>
                <ElRadio :value="3">已退租</ElRadio>
              </ElRadio-group>
            </ElForm-item>
          </ElCol>
          <ElCol :span="12">
            <ElForm-item label="信用分" prop="creditScore">
              <ElInput-number v-model="form.creditScore" :min="0" :max="100" style="width: 100%" />
            </ElForm-item>
          </ElCol>
          <ElCol :span="24">
            <ElForm-item label="备注">
              <ElInput v-model="form.remark" type="textarea" :rows="2" />
            </ElForm-item>
          </ElCol>
        </ElRow>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="saveTenant">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElSelect, ElOption, ElInput,
  ElTag, ElDialog, ElRadioGroup, ElRadio, ElMessage, ElMessageBox, ElInputNumber, ElDatePicker, ElRow, ElCol
} from 'element-plus'
import type { Tenant } from '@/types'
import { tenantApi } from '@/api/tenant'

const tenants = ref<Tenant[]>([])
const filters = reactive({ realName: '', phone: '', status: undefined as number | undefined })

const dialogVisible = ref(false)
const formRef = ref()
const form = reactive<Partial<Tenant>>({ status: 1, gender: 1, creditScore: 100 })
const rules = {
  tenantCode: [{ required: true, message: '请输入租户编码', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  idCardNo: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /^\d{17}[\dXx]$/, message: '身份证号格式不正确', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const loadTenants = async () => {
  try {
    const res = await tenantApi.getAll()
    let list: Tenant[] = (res && Array.isArray(res) ? res : []) as Tenant[]
    if (filters.realName) list = list.filter(t => t.realName && t.realName.includes(filters.realName))
    if (filters.phone) list = list.filter(t => t.phone && t.phone.includes(filters.phone))
    if (filters.status) list = list.filter(t => t.status === filters.status)
    tenants.value = list
  } catch (e) {
    ElMessage.warning('后端接口不可用，显示空数据')
    tenants.value = []
  }
}

const resetFilters = () => {
  filters.realName = ''
  filters.phone = ''
  filters.status = undefined
  loadTenants()
}

const openDialog = (row?: Tenant) => {
  if (row) {
    Object.assign(form, { ...row })
  } else {
    Object.assign(form, {
      status: 1, gender: 1, creditScore: 100, tenantCode: '', realName: '', idCardNo: '', phone: '',
      email: '', profession: '', companyName: '', emergencyContactName: '', emergencyContactPhone: '', remark: ''
    })
  }
  dialogVisible.value = true
}

const saveTenant = async () => {
  try {
    const ok = form.id
      ? await tenantApi.update(form as Tenant) as unknown as boolean
      : await tenantApi.save(form as Tenant) as unknown as boolean
    if (ok === true) {
      ElMessage.success(form.id ? '更新成功' : '新增成功')
      dialogVisible.value = false
      loadTenants()
    } else {
      ElMessage.error('保存失败')
    }
  } catch (e) {
    ElMessage.error('保存失败，请检查后端服务')
  }
}

const changeStatus = (row: Tenant) => {
  ElMessageBox.prompt('请输入新状态（1-正常 2-黑名单 3-已退租）', '修改状态', {
    inputValue: String(row.status || 1),
    inputPlaceholder: '输入 1-3'
  }).then(async ({ value }) => {
    const newStatus = Number(value)
    if (newStatus >= 1 && newStatus <= 3) {
      try {
        const ok = await tenantApi.updateStatus(row.id!, newStatus) as unknown as boolean
        if (ok === true) { ElMessage.success('修改成功'); loadTenants() } else { ElMessage.error('修改失败') }
      } catch (e) { ElMessage.error('修改失败，请检查后端服务') }
    }
  }).catch(() => {})
}

const deleteTenant = (row: Tenant) => {
  ElMessageBox.confirm(`确定删除租户 ${row.realName}?`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        const ok = await tenantApi.delete(row.id!) as unknown as boolean
        if (ok === true) { ElMessage.success('删除成功'); loadTenants() } else { ElMessage.error('删除失败') }
      } catch (e) { ElMessage.error('删除失败，请检查后端服务') }
    }).catch(() => {})
}

onMounted(() => loadTenants())
</script>

<style scoped>
.p-4 { padding: 1rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.font-bold { font-weight: 700; }
.mb-4 { margin-bottom: 1rem; }
</style>
