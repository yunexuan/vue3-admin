import http from "@/api";
import BaseApi from "@/api/crud";

class ExpertApi extends BaseApi {
  constructor() {
    super("/sysExpertInfo");
  }

  // 获取菜单树
  getList(params = {}) {
    return http.get<Array<any>>(`/sysExpertInfo/list`, params, { loading: false });
  }
}

const expertApi = new ExpertApi();

export default expertApi;
