import http from "@/api";
import BaseApi from "@/api/crud";

export default class NoticeApi extends BaseApi {
  constructor() {
    super("/sysExceptionNotification");
  }

  // 获取菜单树
  getNoticeTop(params = {}) {
    return http.get<Array<any>>(`/sysExceptionNotification/top5`, params, { loading: false });
  }

  getUnReadCount(params = {}) {
    return http.get<any>(`/sysExceptionNotification/unReadCount`, params, { loading: false });
  }

  readAtNotice(params = {}) {
    return http.get<any>(`/sysExceptionNotification/readAt`, params, { loading: false });
  }
}
