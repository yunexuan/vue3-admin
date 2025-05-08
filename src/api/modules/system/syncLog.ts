import BaseApi from "@/api/crud";

export default class SyncLogApi extends BaseApi {
  constructor() {
    super("/apiLogInfo");
  }
}
