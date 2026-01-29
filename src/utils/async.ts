/**
 * 异步工具函数
 *
 * 提供扁平化的Promise错误处理方式，避免大量的try-catch嵌套
 * 类似Go语言的错误处理风格
 */

/**
 * 异步操作结果类型
 * T: 成功时返回的数据类型
 * E: 失败时返回的错误类型，默认为Error
 */
export type AsyncResult<T, E = Error> = [T | null, E | null]

/**
 * 将Promise转换为扁平化的结果格式
 *
 * 这个函数捕获所有异常，返回 [data, error] 元组
 * 类似Go语言的错误处理方式
 *
 * @param promise 要处理的Promise
 * @returns Promise<[data | null, error | null]>
 *
 * @example
 * ```typescript
 * // 传统try-catch方式
 * try {
 *   const user = await getUser()
 *   console.log(user)
 * } catch (error) {
 *   console.error(error)
 * }
 *
 * // 使用to函数
 * const [user, error] = await to(getUser())
 * if (error) {
 *   console.error(error)
 *   return
 * }
 * console.log(user)
 * ```
 */
export async function to<T>(
  promise: Promise<T>
): Promise<AsyncResult<T>> {
  try {
    const data = await promise
    return [data, null]
  } catch (error) {
    return [null, error as Error]
  }
}

/**
 * 专门用于服务层的safeAsync函数
 * 自动处理Promise并返回 { data, error } 对象格式
 *
 * @param promise 要处理的Promise
 * @param errorMapper 可选的错误映射函数，用于转换错误类型
 * @returns Promise<{ data: T | null; error: E | null }>
 *
 * @example
 * ```typescript
 * // 在服务层使用
 * const result = await safeAsync(
 *   supabase.auth.signIn({ email, password }),
 *   (error) => ({
 *     code: 'AUTH_ERROR',
 *     message: error.message,
 *     isSystemError: true
 *   })
 * )
 *
 * if (result.error) {
 *   return result
 * }
 *
 * // 处理成功逻辑
 * ```
 */
export async function safeAsync<T, E = Error>(
  promise: Promise<T>,
  errorMapper?: (error: Error) => E
): Promise<{ data: T | null; error: E | null }> {
  const [data, error] = await to(promise)

  if (error) {
    return {
      data: null,
      error: errorMapper ? errorMapper(error) : (error as unknown as E)
    }
  }

  return { data, error: null }
}

/**
 * 创建系统错误对象
 *
 * @param message 错误消息
 * @param code 错误代码，默认为'SYSTEM_ERROR'
 * @returns 系统错误对象
 */
export function createSystemError(
  message: string,
  code: string = 'SYSTEM_ERROR'
): { code: string; message: string; isSystemError: boolean } {
  return {
    code,
    message,
    isSystemError: true
  }
}

/**
 * 创建业务错误对象
 *
 * @param message 错误消息
 * @param code 错误代码
 * @returns 业务错误对象
 */
export function createBusinessError(
  message: string,
  code: string
): { code: string; message: string; isSystemError: boolean } {
  return {
    code,
    message,
    isSystemError: false
  }
}
