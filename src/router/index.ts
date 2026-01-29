/**
 * Vue Router 配置
 *
 * 全局路由配置
 * 实现路由守卫（requiresAuth, requiresGuest）
 * 使用 authGuard 工具函数检查认证状态
 */

import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { authRoutes } from '@/features/auth/routes'
import { isAuthenticated } from '@/features/auth/utils/authGuard'
import { toast } from '@/utils/toast'

/**
 * 路由记录扩展
 */
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    description?: string
    requiresAuth?: boolean // 需要登录才能访问
    requiresGuest?: boolean // 需要未登录才能访问（已登录用户会被重定向）
  }
}

/**
 * 首页路由（需要登录）
 */
const homeRoute: RouteRecordRaw = {
  path: '/',
  name: 'home',
  component: () => import('@/views/HomeView.vue'),
  meta: {
    title: '首页',
    description: '欢迎来到首页',
    requiresAuth: true, // 需要登录才能访问
  },
}

/**
 * 用户中心路由（需要登录）
 */
const profileRoute: RouteRecordRaw = {
  path: '/profile',
  name: 'profile',
  component: () => import('@/views/ProfileView.vue'),
  meta: {
    title: '用户中心',
    description: '查看和管理您的账户信息',
    requiresAuth: true, // 需要登录才能访问
  },
}

/**
 * 404页面路由
 */
const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('@/views/NotFoundView.vue'),
  meta: {
    title: '页面未找到',
  },
}

/**
 * 路由配置
 */
const routes: RouteRecordRaw[] = [
  // 认证路由
  authRoutes,

  // 首页
  homeRoute,

  // 用户中心
  profileRoute,

  // 404页面
  notFoundRoute,
]

/**
 * 创建路由实例
 */
export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

/**
 * 全局前置守卫
 *
 * 功能：
 * 1. 处理 requiresAuth 守卫（需要登录）
 * 2. 处理 requiresGuest 守卫（需要未登录）
 * 3. 设置页面标题
 *
 * 注意：会话初始化在 App.vue 中完成
 */
router.beforeEach(async (to, _from, next) => {
  // 检查认证状态
  const authenticated = await isAuthenticated()

  // 处理 requiresAuth 守卫
  if (to.meta.requiresAuth && !authenticated) {
    // 需要登录但未登录，显示提示并重定向到登录页
    toast.warning('请先登录以访问此页面')
    const loginPath = `/auth/login?redirect=${encodeURIComponent(to.fullPath)}`
    return next(loginPath)
  }

  // 处理 requiresGuest 守卫
  if (to.meta.requiresGuest && authenticated) {
    // 需要未登录但已登录，重定向到首页
    return next({ path: '/', replace: true })
  }

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 应用名称`
  }

  next()
})

/**
 * 全局后置钩子
 */
router.afterEach(() => {
  // 页面访问统计等
  // console.log(`Navigated to: ${to.path}`)
})

/**
 * 导出路由实例
 */
export default router
