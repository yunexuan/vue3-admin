import http from "@/api";
import BaseApi from "@/api/crud";

class DictTypeApi extends BaseApi {
  constructor() {
    super("/sys/dictType");
  }

  // 获取菜单树
  getList(params = {}) {
    return http.get<Array<any>>(`/sys/role/list`, params, { loading: false });
  }
}
class DictDataApi extends BaseApi {
  constructor() {
    super("/sys/dictData");
  }

  // 获取菜单树
  getList(params = {}) {
    return http.get<Array<any>>(`/sys/role/list`, params, { loading: false });
  }

  /**
   * 根据类型查询字典
   */
  getDictByType(code: string) {
    return http.get<Array<DictModel>>("/sys/dictData/getDictByType", { code }, { loading: false });
  }
}

const dictDataApi = new DictDataApi();
const dictTypeApi = new DictTypeApi();

export { dictDataApi, dictTypeApi };
