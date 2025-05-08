import { defineStore } from "pinia";
import { lock } from "@/utils/threadLock";
import { DictionaryState } from "../interface";
import { toRaw } from "vue";
import { dictDataApi } from "@/api/modules/system/dict";

export const useDictStore = defineStore("dictStore", {
  state: (): DictionaryState => ({
    dictionary: new Map<string, Array<DictModel>>()
  }),
  actions: {
    async getDictionary(code: string): Promise<Array<DictModel>> {
      if (this.dictionary.has(code)) {
        return this.dictionary.get(code)!;
      } else {
        const unlock = await lock();
        const list = await this.addDictionary(code);
        unlock();
        return list;
      }
    },
    async addDictionary(code: string): Promise<Array<DictModel>> {
      const list = this.dictionary.get(code);
      if (list && list?.length > 0) {
        return toRaw(list);
      } else {
        const { data } = await dictDataApi.getDictByType(code);
        if (data && data.length > 0) {
          this.dictionary.set(code, data);
        }
        return data;
      }
    }
  }
});
