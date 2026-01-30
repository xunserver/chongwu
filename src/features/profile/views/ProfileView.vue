/**
 * ProfileView
 *
 * 用户中心页面
 * 展示和编辑用户个人信息、地址、安全设置
 */

<script setup lang="ts">
import { ref } from 'vue'
import { useProfile } from '../hooks/useProfile'
import { Loader2 } from 'lucide-vue-next'
import BasicInfoCard from '../components/BasicInfoCard.vue'
import AddressInfoCard from '../components/AddressInfoCard.vue'
import SecuritySettingsCard from '../components/SecuritySettingsCard.vue'
import LogoutButton from '../components/LogoutButton.vue'
import EditDrawer from '../components/EditDrawer.vue'
import type { ProfileSection } from '../types/profile'

const { data: profile, isLoading } = useProfile()
const activeSection = ref<ProfileSection | null>(null)
const isDrawerOpen = ref(false)

function openEdit(section: ProfileSection) {
  activeSection.value = section
  isDrawerOpen.value = true
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 加载状态 -->
    <div
      v-if="isLoading"
      class="flex min-h-screen items-center justify-center"
    >
      <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
    </div>

    <!-- 主内容区 -->
    <div v-else-if="profile" class="space-y-4 p-4 pb-safe">
      <BasicInfoCard :profile="profile" @edit="openEdit('basic')" />

      <AddressInfoCard :profile="profile" @edit="openEdit('address')" />

      <SecuritySettingsCard :profile="profile" @edit="openEdit('security')" />

      <LogoutButton />
    </div>

    <!-- 编辑抽屉 -->
    <EditDrawer
      v-model:open="isDrawerOpen"
      :section="activeSection"
      :profile="profile"
    />
  </div>
</template>
