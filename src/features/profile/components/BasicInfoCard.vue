/**
 * BasicInfoCard Component
 *
 * 基础信息卡片组件
 */

<script setup lang="ts">
import { computed } from 'vue'
import type { UserProfile } from '../types/profile'
import { Card, CardHeader, CardContent, CardAction } from '@/shadcn/components/ui/card'
import { Button } from '@/shadcn/components/ui/button'
import { Badge } from '@/shadcn/components/ui/badge'

interface Props {
  profile: UserProfile
}

interface Emits {
  (e: 'edit'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const genderLabels = computed<Record<string, string>>(() => ({
  male: '男',
  female: '女',
  secret: '保密',
}))

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <Card class="overflow-hidden">
    <CardHeader class="border-b px-4 py-3">
      <div
        class="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto]"
      >
        <div>
          <h3 class="text-lg font-semibold leading-none tracking-tight">
            基础信息
          </h3>
          <p class="text-sm text-muted-foreground">管理您的基本个人信息</p>
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

    <CardContent class="px-4 py-4">
      <div class="space-y-4">
        <!-- 头像和昵称 -->
        <div class="flex items-center gap-3">
          <img
            :src="profile.avatar"
            :alt="profile.nickname"
            class="h-14 w-14 flex-shrink-0 rounded-full border-2 border-muted object-cover"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium">{{ profile.nickname }}</p>
            <p class="truncate text-xs text-muted-foreground">
              {{ profile.email }}
            </p>
          </div>
        </div>

        <!-- 信息列表 -->
        <div class="space-y-3">
          <!-- 性别 -->
          <div class="flex items-center justify-between gap-4">
            <span class="text-sm text-muted-foreground">性别</span>
            <Badge variant="secondary" class="font-normal">
              {{ genderLabels[profile.gender] }}
            </Badge>
          </div>

          <!-- 生日 -->
          <div class="flex items-center justify-between gap-4">
            <span class="text-sm text-muted-foreground">生日</span>
            <span class="text-sm font-medium">{{ formatDate(profile.birthday) }}</span>
          </div>

          <!-- 个人简介 -->
          <div class="space-y-1.5">
            <p class="text-sm text-muted-foreground">个人简介</p>
            <p class="break-words text-sm leading-relaxed">
              {{ profile.bio || '暂无简介' }}
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
