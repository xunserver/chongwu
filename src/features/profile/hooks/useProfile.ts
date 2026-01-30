/**
 * useProfile Hook
 *
 * 获取用户信息
 * 如果没有 profile 记录，会自动创建一个默认的
 */

import { useQuery } from '@tanstack/vue-query'
import type { UserProfile } from '../types/profile'
import { supabase } from '@/lib/supabase'

export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('未登录')

      // 先尝试获取 profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) throw error

      // 如果没有 profile 记录，创建一个默认的
      if (!data) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email!,
            nickname: '用户',
            avatar: 'avatar-1',
            gender: 'secret',
            birthday: '2000-01-01',
            bio: '',
            province: '',
            city: '',
            district: '',
            detailed_address: '',
          })
          .select()
          .single()

        if (insertError) throw insertError
        if (!newProfile) throw new Error('创建用户信息失败')

        return newProfile as UserProfile
      }

      return data as UserProfile
    },
    staleTime: 1000 * 60 * 5, // 5分钟
  })
}
