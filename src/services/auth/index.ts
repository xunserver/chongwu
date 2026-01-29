/**
 * 认证服务导出
 *
 * 导出认证服务实例和所有类型定义
 * 提供统一的访问点
 */

import type { IAuthService } from './types'
import { SupabaseAuthService } from './implementations/supabase'

/**
 * 认证服务实例（单例）
 *
 * 可以根据环境变量选择不同实现
 * 当前使用Supabase实现
 */
const authService: IAuthService = new SupabaseAuthService()

/**
 * 导出认证服务实例
 */
export { authService }

/**
 * 导出所有类型定义
 */
export type * from './types'
