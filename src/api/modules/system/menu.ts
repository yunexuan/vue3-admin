import http from '@/api'
import BaseApi from '@/api/crud'

class SysMenuApi extends BaseApi {
  constructor() {
    super('/sys/menu')
  }

  // 获取菜单树
  getMenuTree(params = {}) {
    return http.get<Array<any>>(`/sys/menu/tree`, params, { loading: false })
  }
}

const sysMenuApi = new SysMenuApi()

export default sysMenuApi
