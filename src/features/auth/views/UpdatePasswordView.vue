/**
 * UpdatePasswordView
 *
 * 更新密码页面（从邮件链接访问）
 * 使用 TanStack Form 管理表单状态
 * 集成 useAuth hook 处理密码更新
 */

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from '@tanstack/vue-form'
import { useRouter } from 'vue-router'
import { useAuth } from '../hooks/useAuth'
import { validators } from '../utils/validators'
import AuthForm from '@/features/auth/components/AuthForm.vue'
import PasswordInput from '@/features/auth/components/PasswordInput.vue'
import { Label } from '@/shadcn/components/ui/label'
import { Button } from '@/shadcn/components/ui/button'
import { CheckCircle } from 'lucide-vue-next'

// Router
const router = useRouter()

// Auth hook
const { updatePasswordMutation, error } = useAuth()

// 成功状态
const isSuccessful = ref(false)

// TanStack Form
const form = useForm({
  defaultValues: {
    password: '',
    confirmPassword: '',
  },
  validators: {
    // 表单级别验证（跨字段）
    onSubmit: ({ value }) => {
      if (value.password !== value.confirmPassword) {
        return '两次输入的密码不一致'
      }
      if (value.password.length < 8) {
        return '密码至少需要8个字符'
      }
    },
  },
  onSubmit: async ({ value }) => {
    try {
      await updatePasswordMutation.mutateAsync(value.password)

      // 更新成功
      isSuccessful.value = true
    } catch {
      // 错误已经在 useAuth hook 中处理
    }
  },
})

// 跳转到登录页面
const goToLogin = () => {
  router.push('/auth/login')
}

// 获取错误消息（将 AuthError 转换为 string）
const errorMessage = computed(() => {
  return error.value?.message || null
})
</script>

<template>
  <div class="w-full">
    <!-- 成功状态 -->
    <div v-if="isSuccessful" class="w-full max-w-md space-y-6">
      <div class="text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle class="h-8 w-8 text-green-600 dark:text-green-500" />
        </div>
        <h3 class="text-2xl font-bold text-foreground">
          密码更新成功
        </h3>
        <p class="mt-2 text-sm text-muted-foreground">
          您的密码已成功更新，现在可以使用新密码登录。
        </p>
      </div>

      <Button @click="goToLogin" class="w-full">
        前往登录
      </Button>
    </div>

    <!-- 表单状态 -->
    <AuthForm
      v-else
      title="设置新密码"
      description="请输入您的新密码"
      submit-label="更新密码"
      :loading="updatePasswordMutation.isPending.value"
      :error="errorMessage"
      @submit="form.handleSubmit"
    >
      <!-- 新密码字段 -->
      <form.Field
        name="password"
        :validators="{
          onChange: ({ value }) => {
            if (!value) return '密码不能为空'
            if (value.length < 8) return '密码至少需要8个字符'
          },
        }"
      >
        <template #default="{ field }">
          <div class="space-y-2">
            <Label for="password">新密码</Label>
            <PasswordInput
              id="password"
              placeholder="请输入新密码（至少8个字符）"
              :model-value="field.state.value"
              :show-strength-indicator="true"
              @update:model-value="(v) => field.handleChange(String(v))"
            />
          </div>
        </template>
      </form.Field>

      <!-- 确认密码字段 -->
      <form.Field
        name="confirmPassword"
        :validators="{
          onChange: ({ value }) => {
            if (!value) return '请确认密码'
          },
        }"
      >
        <template #default="{ field }">
          <div class="space-y-2">
            <Label for="confirmPassword">确认新密码</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="请再次输入新密码"
              :model-value="field.state.value"
              @update:model-value="(v) => field.handleChange(String(v))"
            />
            <div v-if="field.state.meta.errors.length > 0" class="flex items-center gap-1 text-sm text-destructive">
              {{ field.state.meta.errors[0] }}
            </div>
          </div>
        </template>
      </form.Field>

      <!-- 密码提示 -->
      <div class="rounded-md border border-muted-foreground/20 bg-muted/50 p-4 text-sm text-muted-foreground">
        <p class="font-medium">密码要求：</p>
        <ul class="ml-4 mt-2 list-disc space-y-1">
          <li>至少8个字符</li>
          <li>包含字母和数字</li>
          <li>不与其他密码相同</li>
        </ul>
      </div>
    </AuthForm>
  </div>
</template>
