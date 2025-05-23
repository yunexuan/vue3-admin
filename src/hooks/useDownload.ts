import { isString } from '@/utils/is'
import { ElNotification } from 'element-plus'

/**
 * @description 接收数据流生成 blob，创建链接，下载文件
 * @param {string | Function} api 导出表格的api方法 (必传)
 * @param {string} tempName 导出的文件名 (必传)
 * @param {object} params 导出的参数 (默认{})
 * @param {boolean} isNotify 是否有导出消息提示 (默认为 true)
 * @param {string} fileType 导出的文件格式 (默认为.xlsx)
 */
export async function useDownload(api: string | ((param: any) => Promise<any>), tempName: string, params: any = {}, isNotify: boolean = true, fileType: string = '.xlsx') {
  if (isNotify) {
    ElNotification({
      title: '温馨提示',
      message: '如果数据庞大会导致下载缓慢哦，请您耐心等待！',
      type: 'info',
      duration: 3000,
    })
  }
  try {
    if (isString(api)) {
      const exportFile = document.createElement('a')
      exportFile.style.display = 'none'
      exportFile.download = `${tempName}${fileType}`
      exportFile.href = api as string
      document.body.appendChild(exportFile)
      exportFile.click()
      // 去除下载对 url 的影响
      document.body.removeChild(exportFile)
    }
    else {
      const res = await api(params)
      const blob = new Blob([res])
      // 兼容 edge 不支持 createObjectURL 方法
      if ('msSaveOrOpenBlob' in navigator)
        return window.navigator.msSaveOrOpenBlob(blob, tempName + fileType)
      const blobUrl = window.URL.createObjectURL(blob)
      const exportFile = document.createElement('a')
      exportFile.style.display = 'none'
      exportFile.download = `${tempName}${fileType}`
      exportFile.href = blobUrl
      document.body.appendChild(exportFile)
      exportFile.click()
      // 去除下载对 url 的影响
      document.body.removeChild(exportFile)
      window.URL.revokeObjectURL(blobUrl)
    }
  }
  catch (error) {
    console.log(error)
  }
}
