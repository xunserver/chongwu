/**
 * SecuritySettingsForm Component
 *
 * 安全设置表单（密码和邮箱修改）
 */

<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from '@tanstack/vue-form'
import type { UserProfile } from '../types/profile'
import { Button } from '@/shadcn/components/ui/button'
import { Input } from '@/shadcn/components/ui/input'
import { Label } from '@/shadcn/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs'
import { PasswordInput } from '@/features/auth/components'
import { useProfileUpdate } from '../hooks/useProfileUpdate'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { toast } from '@/utils/toast'

interface Props {
  profile: UserProfile
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { updateMutation } = useProfileUpdate()
const { updateEmailMutation } = useAuth()

const activeTab = ref<'password' | 'email'>('password')

// 修改密码表单
const passwordForm = useForm({
  defaultValues: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  validators: {
    onChange: ({ value }) => {
      if (value.newPassword !== value.confirmPassword) {
        return '两次密码不一致'
      }
    },
  },
  onSubmit: async ({ value }) => {
    try {
      await updateMutation.mutateAsync({
        section: 'security',
        action: 'updatePassword',
        data: {
          oldPassword: value.oldPassword,
          newPassword: value.newPassword,
        },
      })
      toast.success('密码修改成功')
      passwordForm.reset()
    } catch (error) {
      // 错误已经在 hook 中处理
    }
  },
})

// 修改邮箱表单
const emailForm = useForm({
  defaultValues: {
    password: '',
    newEmail: '',
  },
  onSubmit: async ({ value }) => {
    try {
      await updateEmailMutation.mutateAsync({
        password: value.password,
        newEmail: value.newEmail,
      })
      toast.success('邮箱修改成功，请查收验证邮件')
      emailForm.reset()
      emit('close')
    } catch (error) {
      // 错误已经在 useAuth hook 中处理
    }
  },
})
</script>

<template>
  <div class="space-y-6">
    <Tabs v-model="activeTab" class="w-full">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="password" class="gap-1.5">
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
          >
            <path
              d="M2 18a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v2H2Z"
            />
            <circle cx="12" cy="11" r="3" />
            <path d="M22 20v2h-4v-2Z" />
            <path d="M6 20v2H2v-2Z" />
          </svg>
          修改密码
        </TabsTrigger>
        <TabsTrigger value="email" class="gap-1.5">
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
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          修改邮箱
        </TabsTrigger>
      </TabsList>

      <!-- 修改密码 -->
      <TabsContent value="password" class="space-y-4 pt-4">
        <form @submit="passwordForm.handleSubmit">
          <div class="space-y-4">
            <passwordForm.Field
              name="oldPassword"
              :validators="{
                onChange: ({ value }) => {
                  if (!value) return '请输入当前密码'
                },
              }"
            >
              <template #default="{ field }">
                <PasswordInput
                  label="当前密码"
                  placeholder="请输入当前密码"
                  :model-value="field.state.value"
                  @update:model-value="field.handleChange($event as string)"
                  :disabled="updateMutation.isPending.value"
                  required
                />
                <div
                  v-if="field.state.meta.errors.length > 0"
                  class="mt-1 text-sm text-destructive"
                >
                  {{ field.state.meta.errors[0] }}
                </div>
              </template>
            </passwordForm.Field>

            <passwordForm.Field
              name="newPassword"
              :validators="{
                onChange: ({ value }) => {
                  if (!value) return '请输入新密码'
                  if (value.length < 8) return '新密码至少8个字符'
                  if (!/[A-Z]/.test(value)) return '新密码必须包含大写字母'
                  if (!/[a-z]/.test(value)) return '新密码必须包含小写字母'
                  if (!/[0-9]/.test(value)) return '新密码必须包含数字'
                },
              }"
            >
              <template #default="{ field }">
                <PasswordInput
                  label="新密码"
                  placeholder="请输入新密码"
                  :model-value="field.state.value"
                  @update:model-value="field.handleChange($event as string)"
                  :disabled="updateMutation.isPending.value"
                  :show-strength-indicator="true"
                  required
                />
                <div
                  v-if="field.state.meta.errors.length > 0"
                  class="mt-1 text-sm text-destructive"
                >
                  {{ field.state.meta.errors[0] }}
                </div>
              </template>
            </passwordForm.Field>

            <passwordForm.Field
              name="confirmPassword"
              :validators="{
                onChange: ({ value }) => {
                  if (!value) return '请确认新密码'
                },
              }"
            >
              <template #default="{ field }">
                <PasswordInput
                  label="确认新密码"
                  placeholder="请再次输入新密码"
                  :model-value="field.state.value"
                  @update:model-value="field.handleChange($event as string)"
                  :disabled="updateMutation.isPending.value"
                  required
                />
                <div
                  v-if="field.state.meta.errors.length > 0"
                  class="mt-1 text-sm text-destructive"
                >
                  {{ field.state.meta.errors[0] }}
                </div>
              </template>
            </passwordForm.Field>

            <Button
              type="submit"
              class="w-full"
              :disabled="updateMutation.isPending.value"
            >
              <svg
                v-if="updateMutation.isPending.value"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mr-2 animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              修改密码
            </Button>
          </div>
        </form>
      </TabsContent>

      <!-- 修改邮箱 -->
      <TabsContent value="email" class="space-y-4 pt-4">
        <form @submit="emailForm.handleSubmit">
          <div class="space-y-4">
            <div
              class="rounded-lg border border-muted-foreground/20 bg-muted/50 p-4"
            >
              <p class="text-sm font-medium">当前邮箱</p>
              <p class="mt-1 text-sm text-muted-foreground">
                {{ profile.email }}
              </p>
            </div>

            <emailForm.Field
              name="password"
              :validators="{
                onChange: ({ value }) => {
                  if (!value) return '请输入密码以验证身份'
                },
              }"
            >
              <template #default="{ field }">
                <PasswordInput
                  label="验证密码"
                  placeholder="请输入密码以验证身份"
                  :model-value="field.state.value"
                  @update:model-value="field.handleChange($event as string)"
                  :disabled="updateEmailMutation.isPending.value"
                  required
                />
                <div
                  v-if="field.state.meta.errors.length > 0"
                  class="mt-1 text-sm text-destructive"
                >
                  {{ field.state.meta.errors[0] }}
                </div>
              </template>
            </emailForm.Field>

            <emailForm.Field
              name="newEmail"
              :validators="{
                onChange: ({ value }) => {
                  if (!value) return '请输入新邮箱'
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return '请输入有效的邮箱地址'
                  }
                  if (value === profile.email) {
                    return '新邮箱不能与当前邮箱相同'
                  }
                },
              }"
            >
              <template #default="{ field }">
                <div class="space-y-2">
                  <Label for="newEmail"
                    >新邮箱 <span class="text-destructive">*</span></Label
                  >
                  <Input
                    id="newEmail"
                    type="email"
                    placeholder="请输入新邮箱"
                    :model-value="field.state.value"
                    @update:model-value="field.handleChange($event as string)"
                    :disabled="updateEmailMutation.isPending.value"
                  />
                  <div
                    v-if="field.state.meta.errors.length > 0"
                    class="text-sm text-destructive"
                  >
                    {{ field.state.meta.errors[0] }}
                  </div>
                </div>
              </template>
            </emailForm.Field>

            <Button
              type="submit"
              class="w-full"
              :disabled="updateEmailMutation.isPending.value"
            >
              <svg
                v-if="updateEmailMutation.isPending.value"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mr-2 animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              发送验证邮件
            </Button>

            <p class="text-xs text-muted-foreground">
              修改邮箱后，我们需要向新邮箱发送验证邮件以完成更改
            </p>
          </div>
        </form>
      </TabsContent>
    </Tabs>

    <Button
      type="button"
      variant="outline"
      class="w-full"
      @click="emit('close')"
    >
      关闭
    </Button>
  </div>
</template>
