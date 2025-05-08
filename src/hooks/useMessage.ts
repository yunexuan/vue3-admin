import type { Message } from './interface'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

export function useMessage() {
  return {
    // 消息提示
    info(content: string) {
      ElMessage.info(content)
    },
    // 错误消息
    error(content: string) {
      ElMessage.error(content)
    },
    // 成功消息
    success(content: string) {
      ElMessage.success(content)
    },
    // 警告消息
    warning(content: string) {
      ElMessage.warning(content)
    },
    // 弹出提示
    alert(content: string) {
      ElMessageBox.alert(content, '系统提示')
    },
    // 错误提示
    alertError(content: string) {
      ElMessageBox.alert(content, '系统提示', { type: 'error' })
    },
    // 成功提示
    alertSuccess(content: string) {
      ElMessageBox.alert(content, '系统提示', { type: 'success' })
    },
    // 警告提示
    alertWarning(content: string) {
      ElMessageBox.alert(content, '系统提示', { type: 'warning' })
    },
    // 通知提示
    notify(content: string) {
      ElNotification.info(content)
    },
    // 错误通知
    notifyError(content: string) {
      ElNotification.error(content)
    },
    // 成功通知
    notifySuccess(content: string) {
      ElNotification.success(content)
    },
    // 警告通知
    notifyWarning(content: string) {
      ElNotification.warning(content)
    },
    // 确认窗体
    confirm(option: Message.confirmOption) {
      return new Promise((resolve) => {
        ElMessageBox.confirm(option.message ? option.message : '确认？', option.title ? option.title : '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            if (option.onConfirm) {
              await option.onConfirm()
            }
            resolve(true)
          })
          .catch(async () => {
            if (option.onCancel) {
              await option.onCancel()
            }
            resolve(false)
          })
      })
    },
    // 删除窗体
    delConfirm(option: Message.confirmOption) {
      return new Promise((resolve) => {
        ElMessageBox.confirm(option.message ? option.message : '确定要删除该数据？', option.title ? option.title : '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            if (option.onConfirm) {
              await option.onConfirm()
            }
            resolve(true)
          })
          .catch(async () => {
            if (option.onCancel) {
              await option.onCancel()
            }
            resolve(false)
          })
      })
    },
    // 导出窗体
    exportConfirm(content?: string, tip?: string) {
      return ElMessageBox.confirm(content || '确定要导出数据？', tip || '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
    },
    // 提交内容
    prompt(content: string, tip: string) {
      return ElMessageBox.prompt(content, tip, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
    },

    // 提交内容
    customPrompt(option: Message.promptOption) {
      return new Promise((resolve) => {
        ElMessageBox.prompt(option.message, option.title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          inputType: option.inputType,
          inputValue: option.inputValue,
        })
          .then(async ({ value }) => {
            option.onConfirm(value)
            resolve(true)
          })
          .catch(() => {
            if (option.onCancel) {
              option.onCancel()
              resolve(false)
            }
          })
      })
    },
  }
}
