import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
  id: "geeker-user",
  state: (): UserState => ({
    token: {
      tokenName: "",
      tokenValue: ""
    },
    userInfo: {
      userId: "",
      orgId: "",
      nickName: "",
      headImg: ""
    }
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: UserState["token"]) {
      Object.assign(this.token, token);
    },
    clearToken() {
      this.token = {
        tokenName: "",
        tokenValue: ""
      };
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    }
  },
  persist: piniaPersistConfig("geeker-user")
});
