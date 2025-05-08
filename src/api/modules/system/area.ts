import http from "@/api";

class SysAreaApi {
  // 获取区域树
  getAreaTree(parentCode?: string) {
    return http.get(`/sysAreaInfo/tree`, { parentCode }, { loading: false });
  }

  // 懒加载获取区域树
  getAreaLazyTree(parentCode?: string) {
    return http.get(`/sysAreaInfo/lazyTree`, { parentCode }, { loading: false });
  }

  getUserArea() {
    return http.get(`/sysAreaInfo/getAreaInfo`, {}, { loading: false });
  }
}

const sysAreaApi = new SysAreaApi();

export default sysAreaApi;
