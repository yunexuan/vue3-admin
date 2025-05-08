import http from '@/api'
import BaseApi from '@/api/crud'

class RegAgencyApi extends BaseApi {
  constructor() {
    super('/sysSupervision')
  }

  // 获取列表
  getList(params = {}) {
    return http.get<Array<any>>(`/sysSupervision/list`, params, { loading: false })
  }

  // 获取机构树
  getTree(params = {}) {
    return http.get<Array<any>>(`/sysSupervision/tree`, params, { loading: false })
  }
}

const regAgencyApi = new RegAgencyApi()

export default regAgencyApi
