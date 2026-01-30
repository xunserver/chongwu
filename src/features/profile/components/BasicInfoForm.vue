/**
 * BasicInfoForm Component
 *
 * 基础信息编辑表单
 */

<script setup lang="ts">
import { computed } from 'vue'
import { useForm } from '@tanstack/vue-form'
import type { UserProfile } from '../types/profile'
import { Button } from '@/shadcn/components/ui/button'
import { Input } from '@/shadcn/components/ui/input'
import { Label } from '@/shadcn/components/ui/label'
import { Textarea } from '@/shadcn/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/shadcn/components/ui/radio-group'
import AvatarSelector from './AvatarSelector.vue'
import { useProfileUpdate } from '../hooks/useProfileUpdate'
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

const form = useForm({
  defaultValues: {
    nickname: props.profile.nickname,
    avatar: props.profile.avatar,
    gender: props.profile.gender,
    birthday: props.profile.birthday,
    bio: props.profile.bio,
  },
  onSubmit: async ({ value }) => {
    try {
      await updateMutation.mutateAsync({
        section: 'basic',
        data: value,
      })
      toast.success('基础信息更新成功')
      emit('close')
    } catch (error) {
      // 错误已经在 hook 中处理
    }
  },
})

const bioCharCount = computed(() => form.state.values.bio.length)
const bioRemainingChars = computed(() => 200 - bioCharCount.value)
</script>

<template>
  <form @submit="form.handleSubmit">
    <div class="space-y-6">
      <!-- 头像选择 -->
      <div class="space-y-2">
        <Label for="avatar">头像 <span class="text-destructive">*</span></Label>
        <form.Field
          name="avatar"
          :validators="{
            onChange: ({ value }) => {
              if (!value) return '请选择头像'
            },
          }"
        >
          <template #default="{ field }">
            <div>
              <AvatarSelector
                :model-value="field.state.value"
                @update:model-value="field.handleChange($event)"
              />
              <div
                v-if="field.state.meta.errors.length > 0"
                class="mt-1 text-sm text-destructive"
              >
                {{ field.state.meta.errors[0] }}
              </div>
            </div>
          </template>
        </form.Field>
      </div>

      <!-- 昵称 -->
      <form.Field
        name="nickname"
        :validators="{
          onChange: ({ value }) => {
            if (!value) return '昵称不能为空'
            if (value.length > 20) return '昵称最多20个字符'
          },
        }"
      >
        <template #default="{ field }">
          <div class="space-y-2">
            <Label for="nickname">昵称 <span class="text-destructive">*</span></Label>
            <Input
              id="nickname"
              placeholder="请输入昵称"
              :model-value="field.state.value"
              @update:model-value="field.handleChange($event as string)"
              :disabled="updateMutation.isPending.value"
            />
            <div
              v-if="field.state.meta.errors.length > 0"
              class="text-sm text-destructive"
            >
              {{ field.state.meta.errors[0] }}
            </div>
          </div>
        </template>
      </form.Field>

      <!-- 性别 -->
      <form.Field
        name="gender"
        :validators="{
          onChange: ({ value }) => {
            if (!value) return '请选择性别'
          },
        }"
      >
        <template #default="{ field }">
          <div class="space-y-2">
            <Label>性别 <span class="text-destructive">*</span></Label>
            <RadioGroup
              :model-value="field.state.value"
              @update:model-value="field.handleChange($event as 'male' | 'female' | 'secret')"
              :disabled="updateMutation.isPending.value"
            >
              <div class="flex gap-6">
                <div class="flex items-center space-x-2">
                  <RadioGroupItem id="male" value="male" />
                  <Label for="male" class="cursor-pointer font-normal">男</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem id="female" value="female" />
                  <Label for="female" class="cursor-pointer font-normal">女</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem id="secret" value="secret" />
                  <Label for="secret" class="cursor-pointer font-normal"
                    >保密</Label
                  >
                </div>
              </div>
            </RadioGroup>
            <div
              v-if="field.state.meta.errors.length > 0"
              class="text-sm text-destructive"
            >
              {{ field.state.meta.errors[0] }}
            </div>
          </div>
        </template>
      </form.Field>

      <!-- 生日 -->
      <form.Field
        name="birthday"
        :validators="{
          onChange: ({ value }) => {
            if (!value) return '请选择生日'
            const date = new Date(value)
            if (date > new Date()) return '生日不能晚于今天'
          },
        }"
      >
        <template #default="{ field }">
          <div class="space-y-2">
            <Label for="birthday">生日 <span class="text-destructive">*</span></Label>
            <Input
              id="birthday"
              type="date"
              :model-value="field.state.value"
              @update:model-value="field.handleChange($event as string)"
              :disabled="updateMutation.isPending.value"
              :max="new Date().toISOString().split('T')[0]"
            />
            <div
              v-if="field.state.meta.errors.length > 0"
              class="text-sm text-destructive"
            >
              {{ field.state.meta.errors[0] }}
            </div>
          </div>
        </template>
      </form.Field>

      <!-- 个人简介 -->
      <form.Field name="bio">
        <template #default="{ field }">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="bio"
                >个人简介 <span class="text-destructive">*</span></Label
              >
              <span
                class="text-xs"
                :class="
                  bioRemainingChars < 0
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                "
              >
                {{ bioRemainingChars }}/200
              </span>
            </div>
            <Textarea
              id="bio"
              placeholder="介绍一下自己吧..."
              :model-value="field.state.value"
              @update:model-value="field.handleChange($event as string)"
              :disabled="updateMutation.isPending.value"
              rows="4"
              class="resize-none"
            />
            <div
              v-if="field.state.meta.errors.length > 0"
              class="text-sm text-destructive"
            >
              {{ field.state.meta.errors[0] }}
            </div>
          </div>
        </template>
      </form.Field>

      <!-- 操作按钮 -->
      <div class="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          class="flex-1"
          :disabled="updateMutation.isPending.value"
          @click="emit('close')"
        >
          取消
        </Button>
        <Button
          type="submit"
          class="flex-1"
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
          保存
        </Button>
      </div>
    </div>
  </form>
</template>
