/**
 * SecuritySettingsCard Component
 *
 * 安全设置卡片组件
 */

<script setup lang="ts">
import type { UserProfile } from '../types/profile'
import { Card, CardHeader, CardContent, CardAction } from '@/shadcn/components/ui/card'
import { Button } from '@/shadcn/components/ui/button'
import { Badge } from '@/shadcn/components/ui/badge'
import { Separator } from '@/shadcn/components/ui/separator'

interface Props {
  profile: UserProfile
}

interface Emits {
  (e: 'edit'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <Card class="overflow-hidden">
    <CardHeader class="border-b px-4 py-3">
      <div
        class="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto]"
      >
        <div class="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-muted-foreground"
          >
            <path
              d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
            />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold leading-none tracking-tight">
              安全设置
            </h3>
            <p class="text-sm text-muted-foreground">密码和邮箱管理</p>
          </div>
        </div>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            class="h-8 gap-1.5 text-sm"
            @click="emit('edit')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            <span>编辑</span>
          </Button>
        </CardAction>
      </div>
    </CardHeader>

    <CardContent class="space-y-4 px-4 py-4">
      <!-- 密码 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-muted-foreground"
            >
              <path
                d="M2 18a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v2H2Z"
              />
              <circle cx="12" cy="11" r="3" />
              <path d="M22 20v2h-4v-2Z" />
              <path d="M6 20v2H2v-2Z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium">登录密码</p>
            <p class="text-xs text-muted-foreground">已设置</p>
          </div>
        </div>
        <Badge variant="secondary" class="gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>已设置</span>
        </Badge>
      </div>

      <Separator />

      <!-- 邮箱 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-muted-foreground"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium">邮箱地址</p>
            <p class="text-xs text-muted-foreground">{{ profile.email }}</p>
          </div>
        </div>
        <Badge variant="secondary" class="gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>已验证</span>
        </Badge>
      </div>
    </CardContent>
  </Card>
</template>
