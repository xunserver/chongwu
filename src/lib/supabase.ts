import { createClient } from '@supabase/supabase-js'

/**
 * Supabase客户端配置
 *
 * 环境变量：
 * - VITE_SUPABASE_URL: Supabase项目URL
 * - VITE_SUPABASE_PUBLISHABLE_KEY: Supabase匿名密钥（publishable/key）
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// 支持两种环境变量命名：VITE_SUPABASE_PUBLISHABLE_KEY（推荐）或 VITE_SUPABASE_ANON_KEY（向后兼容）
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing env.VITE_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing env.VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY')
}

/**
 * Supabase客户端实例
 * 用于所有Supabase操作（认证、数据库、存储等）
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 自动刷新token
    autoRefreshToken: true,
    // 检测会话变化
    detectSessionInUrl: true,
    // 会话持久化
    persistSession: true,
    // 使用localStorage存储会话
    storage: window.localStorage
  }
})

/**
 * 类型导出
 */
export type { AuthError, AuthResponse, User, Session } from '@supabase/supabase-js'
