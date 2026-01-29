/**
 * 全局Toast通知工具
 *
 * 用于显示系统级别的通知（主要用于系统错误）
 * 业务错误应该在组件内处理
 *
 * 集成 vue-sonner 和 shadcn-vue 的 Sonner 组件
 *
 * 使用方法：
 * 1. 在 App.vue 中添加 Sonner 组件：
 *    <Sonner />
 * 2. 在代码中调用：
 *    import { toast } from '@/utils/toast'
 *    toast.success('操作成功')
 */

import { toast as sonnerToast } from 'vue-sonner'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

/**
 * 显示成功消息
 * @param message 消息内容
 */
export function success(message: string): void {
  sonnerToast.success(message)
}

/**
 * 显示错误消息
 * @param message 错误消息
 */
export function error(message: string): void {
  sonnerToast.error(message)
}

/**
 * 显示信息消息
 * @param message 信息内容
 */
export function info(message: string): void {
  sonnerToast.info(message)
}

/**
 * 显示警告消息
 * @param message 警告内容
 */
export function warning(message: string): void {
  sonnerToast.warning(message)
}

/**
 * 显示加载消息
 * @param message 加载消息
 * @returns Promise，用于手动关闭加载状态
 */
export function loading(message: string): Promise<{ id: number | string; dismiss: () => void }> {
  return new Promise((resolve) => {
    const toastId = sonnerToast.loading(message, {
      onAutoClose: () => {
        // toast自动关闭时的处理
      }
    })
    resolve({
      id: toastId,
      dismiss: () => sonnerToast.dismiss(toastId)
    })
  })
}

/**
 * Toast对象（命名导出）
 */
export const toast = {
  success,
  error,
  info,
  warning,
  loading
}

/**
 * 默认导出toast对象
 */
export default toast
