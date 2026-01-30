/**
 * EditDrawer Component
 *
 * 编辑抽屉组件
 */

<script setup lang="ts">
import { computed } from 'vue'
import type { UserProfile, ProfileSection } from '../types/profile'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/shadcn/components/ui/drawer'
import { Button } from '@/shadcn/components/ui/button'
import BasicInfoForm from './BasicInfoForm.vue'
import AddressInfoForm from './AddressInfoForm.vue'
import SecuritySettingsForm from './SecuritySettingsForm.vue'

interface Props {
  open: boolean
  section: ProfileSection | null
  profile: UserProfile | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const drawerTitle = computed(() => {
  if (props.section === 'basic') return '编辑基础信息'
  if (props.section === 'address') return '编辑地址信息'
  if (props.section === 'security') return '安全设置'
  return ''
})
</script>

<template>
  <Drawer :open="open" @update:open="emit('update:open', $event)">
    <DrawerContent class="h-[85vh] rounded-t-3xl">
      <DrawerHeader class="border-b px-6 py-4 text-center">
        <div
          class="mx-auto mb-3 h-1.5 w-12 shrink-0 rounded-full bg-muted"
        />
        <DrawerTitle class="text-xl">{{ drawerTitle }}</DrawerTitle>
        <Button
          variant="ghost"
          size="icon"
          class="absolute right-4 top-4 h-8 w-8"
          @click="emit('update:open', false)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </DrawerHeader>

      <div
        class="scrollbar-hide overflow-y-auto px-6 pb-6"
      >
        <!-- 基础信息表单 -->
        <BasicInfoForm
          v-if="section === 'basic' && profile"
          :profile="profile"
          @close="emit('update:open', false)"
        />

        <!-- 地址信息表单 -->
        <AddressInfoForm
          v-if="section === 'address' && profile"
          :profile="profile"
          @close="emit('update:open', false)"
        />

        <!-- 安全设置表单 -->
        <SecuritySettingsForm
          v-if="section === 'security' && profile"
          :profile="profile"
          @close="emit('update:open', false)"
        />
      </div>
    </DrawerContent>
  </Drawer>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
