/**
 * Auth Feature Routes
 *
 * 导出认证相关的所有路由配置
 * 使用嵌套路由结构，AuthLayout作为父路由
 */

import type { RouteRecordRaw } from 'vue-router'
import AuthLayout from './components/AuthLayout.vue'

/**
 * Auth 路由配置
 *
 * 路由结构：
 * /auth (父路由 - AuthLayout)
 *   /login - 登录页面
 *   /register - 注册页面
 *   /forgot-password - 忘记密码
 *   /update-password - 更新密码
 */
export const authRoutes: RouteRecordRaw = {
  path: '/auth',
  component: AuthLayout,
  children: [
    {
      path: 'login',
      name: 'login',
      component: () => import('./views/LoginView.vue'),
      meta: {
        title: '登录',
        requiresGuest: true, // 未登录用户可访问
        description: '用户登录页面',
      },
    },
    {
      path: 'register',
      name: 'register',
      component: () => import('./views/RegisterView.vue'),
      meta: {
        title: '注册',
        requiresGuest: true, // 未登录用户可访问
        description: '用户注册页面',
      },
    },
    {
      path: 'forgot-password',
      name: 'forgot-password',
      component: () => import('./views/ForgotPasswordView.vue'),
      meta: {
        title: '忘记密码',
        requiresGuest: true, // 未登录用户可访问
        description: '密码重置请求页面',
      },
    },
    {
      path: 'update-password',
      name: 'update-password',
      component: () => import('./views/UpdatePasswordView.vue'),
      meta: {
        title: '更新密码',
        requiresAuth: true, // 需要登录用户才能访问
        description: '更新密码页面（从邮件链接访问）',
      },
    },
  ],
}

/**
 * 默认导出
 */
export default authRoutes
