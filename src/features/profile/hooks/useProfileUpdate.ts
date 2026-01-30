/**
 * useProfileUpdate Hook
 *
 * 更新用户信息
 */

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { supabase } from '@/lib/supabase'
import { toast } from '@/utils/toast'

export interface UpdateProfileData {
  section: 'basic' | 'address' | 'security'
  action?: 'updatePassword' | 'updateEmail'
  data: Record<string, unknown>
}

export function useProfileUpdate() {
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: async ({ section, action, data }: UpdateProfileData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('未登录')

      // 安全设置需要特殊处理
      if (section === 'security') {
        if (action === 'updatePassword') {
          // 验证旧密码
          const { error: verifyError } = await supabase.auth.signInWithPassword({
            email: user.email!,
            password: data.oldPassword as string,
          })

          if (verifyError) {
            throw new Error('当前密码错误')
          }

          // 更新密码
          const { error } = await supabase.auth.updateUser({
            password: data.newPassword as string,
          })

          if (error) throw error
          return { success: true }
        }
      }

      // 普通字段更新
      const { error } = await supabase.from('profiles').update(data).eq('id', user.id)

      if (error) throw error
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || '更新失败，请重试')
    },
  })

  return { updateMutation }
}
