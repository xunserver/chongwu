/**
 * AddressInfoCard Component
 *
 * 地址信息卡片组件
 */

<script setup lang="ts">
import { computed } from 'vue'
import type { UserProfile } from '../types/profile'
import { Card, CardHeader, CardContent, CardAction } from '@/shadcn/components/ui/card'
import { Button } from '@/shadcn/components/ui/button'
import { provinceData } from '../utils/province-data'

interface Props {
  profile: UserProfile
}

interface Emits {
  (e: 'edit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const fullAddress = computed(() => {
  const province = provinceData.find((p) => p.code === props.profile.province)?.name
  const city = provinceData
    .find((p) => p.code === props.profile.province)
    ?.cities.find((c) => c.code === props.profile.city)?.name
  const district = provinceData
    .find((p) => p.code === props.profile.province)
    ?.cities
    .find((c) => c.code === props.profile.city)
    ?.districts.find((d) => d.code === props.profile.district)?.name

  return `${province || ''}${city || ''}${district || ''} ${props.profile.detailed_address}`
})
</script>

<template>
  <Card class="overflow-hidden">
    <CardHeader class="border-b px-4 py-3">
      <div
        class="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto]"
      >
        <div>
          <h3 class="text-lg font-semibold leading-none tracking-tight">
            地址信息
          </h3>
          <p class="text-sm text-muted-foreground">宠物配送地址</p>
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
      <div class="flex gap-3">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted"
        >
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
              d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
            />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <p class="break-words text-sm leading-relaxed">
            {{ fullAddress }}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
