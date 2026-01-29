/**
 * UI Store - 客户端状态管理
 *
 * 仅管理客户端状态：
 * - UI 状态（侧边栏、模态框等）
 * - 用户偏好（主题、语言等）
 * - 应用设置
 *
 * 不管理服务器状态（会话、用户数据等），这些由 TanStack Query 管理
 */

import { defineStore } from 'pinia'

/**
 * UI 状态接口
 */
export interface UIState {
  // 侧边栏状态
  sidebarOpen: boolean

  // 主题设置
  theme: 'light' | 'dark' | 'auto'

  // 语言设置
  language: string

  // 通知列表
  notifications: Notification[]
}

/**
 * 通知接口
 */
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  timestamp: number
}

/**
 * UI Actions 接口
 */
export interface UIActions {
  // 侧边栏操作
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  // 主题操作
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  toggleTheme: () => void

  // 语言操作
  setLanguage: (language: string) => void

  // 通知操作
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

/**
 * UI Store
 *
 * 管理所有客户端 UI 状态
 * 使用 pinia-plugin-persistedstate 持久化到 localStorage
 */
export const useUIStore = defineStore<'ui', UIState, Record<string, never>, UIActions>(
  'ui',
  {
    // 状态定义
    state: (): UIState => ({
      sidebarOpen: true,
      theme: 'light',
      language: 'zh-CN',
      notifications: [],
    }),

    // Actions
    actions: {
      /**
       * 切换侧边栏状态
       */
      toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen
      },

      /**
       * 设置侧边栏状态
       */
      setSidebarOpen(open: boolean) {
        this.sidebarOpen = open
      },

      /**
       * 设置主题
       */
      setTheme(theme: 'light' | 'dark' | 'auto') {
        this.theme = theme

        // 应用主题到 document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark')
        } else {
          // auto: 根据系统偏好
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          document.documentElement.classList.toggle('dark', prefersDark)
        }
      },

      /**
       * 切换主题（light <-> dark）
       */
      toggleTheme() {
        this.setTheme(this.theme === 'light' ? 'dark' : 'light')
      },

      /**
       * 设置语言
       */
      setLanguage(language: string) {
        this.language = language
        // 可以在这里添加 i18n 集成
      },

      /**
       * 添加通知
       */
      addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
        const id = Math.random().toString(36).substring(2, 9)
        const newNotification: Notification = {
          id,
          ...notification,
          timestamp: Date.now(),
        }

        this.notifications.push(newNotification)

        // 自动移除通知（如果设置了 duration）
        if (notification.duration !== 0) {
          const duration = notification.duration || 5000
          setTimeout(() => {
            this.removeNotification(id)
          }, duration)
        }
      },

      /**
       * 移除通知
       */
      removeNotification(id: string) {
        const index = this.notifications.findIndex((n) => n.id === id)
        if (index !== -1) {
          this.notifications.splice(index, 1)
        }
      },

      /**
       * 清除所有通知
       */
      clearNotifications() {
        this.notifications = []
      },
    },

    // 持久化配置
    persist: {
      key: 'ui',
      storage: localStorage,
      // 持久化所有字段（除了通知，通知是临时的）
      pick: ['sidebarOpen', 'theme', 'language'],
    },
  },
)
