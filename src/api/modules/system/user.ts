import http from '@/api'
import BaseApi from '@/api/crud'

class SysUserApi extends BaseApi {
  constructor() {
    super('/sys/user')
  }

  getList(params = {}) {
    return http.get<Array<any>>(`/sys/user/list`, params, { loading: false })
  }

  resetUserPassWord() {
    throw new Error('Method not implemented.')
  }
}

const sysUserApi = new SysUserApi()

export default sysUserApi
