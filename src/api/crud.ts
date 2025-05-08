import type { ResPage } from './interface'
import http from '@/api'

export default class BaseApi {
  private readonly basePath: string

  constructor(basePath: string) {
    this.basePath = basePath
  }

  getPage<T = any>(params = {}) {
    return http.get<ResPage<T>>(`${this.basePath}/page`, params)
  }

  getById(id: string) {
    return http.get(`${this.basePath}/${id}`)
  }

  save(params: any) {
    return http.post(`${this.basePath}`, params)
  }

  batchRemove(ids: Array<string>) {
    return http.delete(`${this.basePath}`, ids)
  }

  remove(id: string) {
    return http.delete(`${this.basePath}`, [id])
  }
}
