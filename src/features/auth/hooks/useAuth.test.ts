/**
 * useAuth Hook 单元测试
 *
 * 测试认证 hook 的所有方法
 * Mock authService 和 TanStack Query
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { authService } from '@/services/auth'
import { toast } from '@/utils/toast'

// Mock authService
vi.mock('@/services/auth', () => ({
  authService: {
    getSession: vi.fn(),
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn(),
    updatePassword: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
}))

// Mock toast
vi.mock('@/utils/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}))

// Mock TanStack Query
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn(() => ({
    data: { value: null },
    isLoading: { value: false },
    refetch: vi.fn(),
  })),
  useMutation: vi.fn(({ mutationFn }) => ({
    mutateAsync: mutationFn,
    isPending: { value: false },
    mutate: vi.fn(),
  })),
  useQueryClient: vi.fn(() => ({
    setQueryData: vi.fn(),
    clear: vi.fn(),
  })),
}))

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Helper component to test the hook
  const TestComponent = defineComponent({
    setup() {
      const auth = useAuth()
      return () => h('div', { id: 'test' })
    },
  })

  async function testHook(fn: (auth: ReturnType<typeof useAuth>) => void | Promise<void>) {
    let capturedAuth: ReturnType<typeof useAuth> | null = null

    const wrapper = mount({
      setup() {
        const auth = useAuth()
        capturedAuth = auth
        fn(auth)
        return () => h('div')
      },
    })

    await wrapper.vm.$nextTick()

    if (!capturedAuth) {
      throw new Error('Hook not captured')
    }

    return { auth: capturedAuth, wrapper }
  }

  describe('signIn', () => {
    it('应该成功登录用户', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'test@example.com',
        },
        accessToken: 'token',
      }

      vi.mocked(authService.signIn).mockResolvedValue({
        data: mockSession,
        error: null,
      })

      const { auth } = await testHook(async (auth) => {
        await auth.signIn('test@example.com', 'password123')
      })

      expect(authService.signIn).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(toast.success).toHaveBeenCalledWith('登录成功')
      expect(auth.error.value).toBeNull()
    })

    it('应该处理登录失败', async () => {
      const mockError = {
        message: 'Invalid credentials',
        isSystemError: false,
      }

      vi.mocked(authService.signIn).mockResolvedValue({
        data: null,
        error: mockError,
      })

      const { auth } = await testHook(async (auth) => {
        try {
          await auth.signIn('test@example.com', 'wrongpassword')
        } catch (error) {
          expect(error).toEqual(mockError)
        }
      })

      expect(auth.error.value).toEqual(mockError)
      // 业务错误不应该显示 toast
      expect(toast.error).not.toHaveBeenCalled()
    })

    it('系统错误应该显示 toast', async () => {
      const mockError = {
        message: 'Network error',
        isSystemError: true,
      }

      vi.mocked(authService.signIn).mockResolvedValue({
        data: null,
        error: mockError,
      })

      const { auth } = await testHook(async (auth) => {
        try {
          await auth.signIn('test@example.com', 'password123')
        } catch (error) {
          // Expected error
        }
      })

      expect(toast.error).toHaveBeenCalledWith('Network error')
    })
  })

  describe('signUp', () => {
    it('应该成功注册用户', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
      }

      vi.mocked(authService.signUp).mockResolvedValue({
        data: mockUser,
        error: null,
      })

      const { auth } = await testHook(async (auth) => {
        await auth.signUp('test@example.com', 'password123')
      })

      expect(authService.signUp).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(toast.success).toHaveBeenCalledWith('注册成功，请登录')
    })
  })

  describe('signOut', () => {
    it('应该成功登出用户', async () => {
      vi.mocked(authService.signOut).mockResolvedValue({
        data: undefined,
        error: null,
      })

      const { auth } = await testHook(async (auth) => {
        await auth.signOut()
      })

      const result = await auth.signOut()
      expect(result).toBe(true)
      expect(authService.signOut).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith('已登出')
    })

    it('应该处理登出失败', async () => {
      const mockError = {
        message: 'Sign out failed',
        isSystemError: false,
      }

      vi.mocked(authService.signOut).mockResolvedValue({
        data: undefined,
        error: mockError,
      })

      const { auth } = await testHook(async (auth) => {
        await auth.signOut()
      })

      const result = await auth.signOut()
      expect(result).toBe(false)
      expect(auth.error.value).toEqual(mockError)
    })
  })

  describe('resetPassword', () => {
    it('应该成功发送密码重置邮件', async () => {
      vi.mocked(authService.resetPassword).mockResolvedValue({
        data: undefined,
        error: null,
      })

      const { auth } = await testHook(async (auth) => {
        await auth.resetPassword('test@example.com')
      })

      const result = await auth.resetPassword('test@example.com')
      expect(result).toBe(true)
      expect(authService.resetPassword).toHaveBeenCalledWith('test@example.com')
      expect(toast.success).toHaveBeenCalledWith('密码重置邮件已发送，请检查您的邮箱')
    })
  })

  describe('updatePassword', () => {
    it('应该成功更新密码', async () => {
      vi.mocked(authService.updatePassword).mockResolvedValue({
        data: undefined,
        error: null,
      })

      const { auth } = await testHook(async (auth) => {
        await auth.updatePassword('newPassword123')
      })

      const result = await auth.updatePassword('newPassword123')
      expect(result).toBe(true)
      expect(authService.updatePassword).toHaveBeenCalledWith('newPassword123')
      expect(toast.success).toHaveBeenCalledWith('密码更新成功')
    })
  })

  describe('initializeSession', () => {
    it('应该成功初始化会话', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'test@example.com',
        },
        accessToken: 'token',
      }

      vi.mocked(authService.getSession).mockResolvedValue({
        data: mockSession,
        error: null,
      })

      const { auth } = await testHook(async (auth) => {
        await auth.initializeSession()
      })

      expect(authService.getSession).toHaveBeenCalled()
      expect(authService.onAuthStateChange).toHaveBeenCalled()
    })
  })
})
