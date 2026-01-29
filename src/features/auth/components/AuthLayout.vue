<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/shadcn/lib/utils'

interface AuthLayoutProps {
  showLogo?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<AuthLayoutProps>(), {
  showLogo: true,
})
</script>

<template>
  <div
    :class="
      cn(
        'flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8',
        props.class,
      )
    "
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div class="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
    </div>

    <!-- 主容器 -->
    <div class="w-full max-w-md space-y-8">
      <!-- Logo 区域 -->
      <div v-if="$slots.header || showLogo" class="text-center">
        <slot name="header">
          <!-- Logo -->
          <div
            v-if="showLogo"
            class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
          >
            <svg
              class="h-8 w-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </slot>
      </div>

      <!-- 主内容区域（子路由） -->
      <div class="w-full">
        <router-view />
      </div>

      <!-- 底部区域 -->
      <div v-if="$slots.footer" class="text-center text-sm text-muted-foreground">
        <slot name="footer" />
      </div>
    </div>

    <!-- 版权信息（可选） -->
    <div class="absolute bottom-4 text-center text-xs text-muted-foreground/50">
      &copy; {{ new Date().getFullYear() }} 版权所有
    </div>
  </div>
</template>

<style scoped>
/* 平滑过渡 */
* {
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}
</style>
