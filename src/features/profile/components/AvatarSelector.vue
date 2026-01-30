/**
 * AvatarSelector Component
 *
 * 头像选择器组件
 */

<script setup lang="ts">
import { avatarOptions } from '../utils/avatar-options'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function selectAvatar(avatarId: string) {
  emit('update:modelValue', avatarId)
}
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-5 gap-3">
      <button
        v-for="avatar in avatarOptions"
        :key="avatar.id"
        type="button"
        :class="[
          'relative aspect-square h-16 w-16 rounded-full border-2 p-0.5 transition-all',
          modelValue === avatar.id
            ? 'border-primary bg-primary/10'
            : 'border-muted hover:border-muted-foreground/50',
        ]"
        @click="selectAvatar(avatar.id)"
      >
        <img
          :src="avatar.url"
          :alt="avatar.name"
          class="h-full w-full rounded-full object-cover"
        />
        <div
          v-if="modelValue === avatar.id"
          class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
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
        </div>
      </button>
    </div>
  </div>
</template>
