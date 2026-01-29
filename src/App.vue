<script setup lang="ts">
import { onMounted, watch } from 'vue'
import Sonner from '@shadcn/components/ui/sonner/Sonner.vue'
import { useAuth } from '@/features/auth/hooks/useAuth'

// 初始化认证会话
const { initializeSession, sessionQuery } = useAuth()

// 在应用挂载时初始化会话
onMounted(async () => {
  await initializeSession()
})

// 监听会话状态变化
watch(
  () => sessionQuery.data.value,
  (session) => {
    if (session?.user) {
      console.log('Session updated:', session.user.email)
    } else {
      console.log('Session cleared')
    }
  },
)
</script>

<template>
  <div id="app">
    <router-view />
    <Sonner />
  </div>
</template>

<style>
/* 全局样式（如果有） */
</style>
