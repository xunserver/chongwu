/**
 * LogoutButton Component
 *
 * 退出登录按钮组件
 */

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/shadcn/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'

const router = useRouter()
const { signOutMutation } = useAuth()

const handleSignOut = async () => {
  await signOutMutation.mutateAsync()
  router.push('/')
}
</script>

<template>
  <Button
    variant="destructive"
    class="w-full"
    :disabled="signOutMutation.isPending.value"
    @click="handleSignOut"
  >
    <svg
      v-if="!signOutMutation.isPending.value"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="mr-2"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
    <span>{{
      signOutMutation.isPending.value ? '退出中...' : '退出登录'
    }}</span>
  </Button>
</template>
