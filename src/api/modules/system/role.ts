import http from "@/api";
import BaseApi from "@/api/crud";

class SysRoleApi extends BaseApi {
  constructor() {
    super("/sys/role");
  }

  // 获取菜单树
  getList(params = {}) {
    return http.get<Array<any>>(`/sys/role/list`, params, { loading: false });
  }
}

const sysRoleApi = new SysRoleApi();

export default sysRoleApi;
