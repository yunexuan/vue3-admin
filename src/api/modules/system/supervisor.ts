import http from "@/api";
import BaseApi from "@/api/crud";

class SupervisorApi extends BaseApi {
  constructor() {
    super("/sysInspectorInfo");
  }

  // 获取菜单树
  getList(params = {}) {
    return http.get<Array<any>>(`/sysInspectorInfo/list`, params, { loading: false });
  }
}

const supervisorApi = new SupervisorApi();

export default supervisorApi;
