import http from "@/api";
import BaseApi from "@/api/crud";

class StatisticsApi extends BaseApi {
  constructor() {
    super("/bigData");
  }

  // 工作开展情况
  getWork(params = {}) {
    return http.get<Array<any>>(`/bigData/workCarriedOut`, params, { loading: false });
  }

  // 监督员类型统计
  getSupervisorType(params = {}) {
    return http.get<Array<any>>(`/bigData/typeStatistics`, params, { loading: false });
  }

  // 医疗机构派驻情况
  getMedical(params = {}) {
    return http.get(`/bigData/residencyOfMedicalInstitutions`, params, { loading: false });
  }

  // 问题完结数前三名
  getProblem(params = {}) {
    return http.get<Array<any>>(`/bigData/inspectorTop3`, params, { loading: false });
  }

  // 督导问题情况
  getSupervision(params = {}) {
    return http.get(`/bigData/inspectionSupervisionProblemChat`, params, { loading: false });
  }

  // 逾期督导单列表
  getOverdue(params = {}) {
    return http.get(`/bigData/inspectionSupervisionList`, params, { loading: false });
  }

  // 医院问题数前五
  getHospital(params = {}) {
    return http.get<Array<any>>(`/bigData/hospitalTop5`, params, { loading: false });
  }
}

const statisticsApi = new StatisticsApi();

export default statisticsApi;
