import http from "@/api";
import BaseApi from "@/api/crud";

class HospitalApi extends BaseApi {
  constructor() {
    super("/sysHospitalInfo");
  }

  // 获取菜单树
  getList(params = {}) {
    return http.get<Array<any>>(`/sysHospitalInfo/list`, params, { loading: false });
  }
}

const hospitalApi = new HospitalApi();

export default hospitalApi;
