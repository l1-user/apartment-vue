import request from './axios'

export const sysDictApi = {
  page(pageNum: number, pageSize: number, dictType?: string): Promise<any> {
    return request({
      url: '/api/sysDict/page',
      method: 'get',
      params: { pageNum, pageSize, dictType }
    })
  },
  
  list(): Promise<any> {
    return request({
      url: '/api/sysDict/list',
      method: 'get'
    })
  },
  
  getByType(dictType: string): Promise<any> {
    return request({
      url: `/api/sysDict/type/${dictType}`,
      method: 'get'
    })
  },
  
  getById(id: number): Promise<any> {
    return request({
      url: `/api/sysDict/${id}`,
      method: 'get'
    })
  },
  
  save(data: any): Promise<any> {
    return request({
      url: '/api/sysDict/save',
      method: 'post',
      data
    })
  },
  
  delete(id: number): Promise<any> {
    return request({
      url: `/api/sysDict/${id}`,
      method: 'delete'
    })
  }
}

export const sysOperLogApi = {
  page(pageNum: number, pageSize: number, operName?: string, startTime?: string, endTime?: string): Promise<any> {
    return request({
      url: '/api/sysOperLog/page',
      method: 'get',
      params: { pageNum, pageSize, operName, startTime, endTime }
    })
  },
  
  getById(id: number): Promise<any> {
    return request({
      url: `/api/sysOperLog/${id}`,
      method: 'get'
    })
  }
}

export const sysUserApi = {
  page(pageNum: number, pageSize: number, username?: string): Promise<any> {
    return request({
      url: '/api/sysUser/page',
      method: 'get',
      params: { pageNum, pageSize, username }
    })
  },
  
  list(): Promise<any> {
    return request({
      url: '/api/sysUser/list',
      method: 'get'
    })
  },
  
  getById(id: number): Promise<any> {
    return request({
      url: `/api/sysUser/${id}`,
      method: 'get'
    })
  },
  
  save(data: any): Promise<any> {
    return request({
      url: '/api/sysUser/save',
      method: 'post',
      data
    })
  },
  
  delete(id: number): Promise<any> {
    return request({
      url: `/api/sysUser/${id}`,
      method: 'delete'
    })
  }
}

export const sysRoleApi = {
  page(pageNum: number, pageSize: number, roleName?: string): Promise<any> {
    return request({
      url: '/api/sysRole/page',
      method: 'get',
      params: { pageNum, pageSize, roleName }
    })
  },
  
  list(): Promise<any> {
    return request({
      url: '/api/sysRole/list',
      method: 'get'
    })
  },
  
  getById(id: number): Promise<any> {
    return request({
      url: `/api/sysRole/${id}`,
      method: 'get'
    })
  },
  
  save(data: any): Promise<any> {
    return request({
      url: '/api/sysRole/save',
      method: 'post',
      data
    })
  },
  
  delete(id: number): Promise<any> {
    return request({
      url: `/api/sysRole/${id}`,
      method: 'delete'
    })
  }
}

export const sysPermissionApi = {
  page(pageNum: number, pageSize: number): Promise<any> {
    return request({
      url: '/api/sysPermission/page',
      method: 'get',
      params: { pageNum, pageSize }
    })
  },
  
  list(): Promise<any> {
    return request({
      url: '/api/sysPermission/list',
      method: 'get'
    })
  },
  
  getById(id: number): Promise<any> {
    return request({
      url: `/api/sysPermission/${id}`,
      method: 'get'
    })
  },
  
  save(data: any): Promise<any> {
    return request({
      url: '/api/sysPermission/save',
      method: 'post',
      data
    })
  },
  
  delete(id: number): Promise<any> {
    return request({
      url: `/api/sysPermission/${id}`,
      method: 'delete'
    })
  }
}