/**
 * ForgotPasswordView
 *
 * 忘记密码页面
 * 使用 TanStack Form 管理表单状态
 * 集成 useAuth hook 处理密码重置
 */

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from '@tanstack/vue-form'
import { useRouter } from 'vue-router'
import { useAuth } from '../hooks/useAuth'
import { validators } from '../utils/validators'
import AuthForm from '@/features/auth/components/AuthForm.vue'
import { Input } from '@/shadcn/components/ui/input'
import { Label } from '@/shadcn/components/ui/label'
import { Button } from '@/shadcn/components/ui/button'
import { Mail } from 'lucide-vue-next'

// Router
const router = useRouter()

// Auth hook
const { resetPasswordMutation, error } = useAuth()

// 成功状态
const isSuccessful = ref(false)

// TanStack Form
const form = useForm({
  defaultValues: {
    email: '',
  },
  validators: {
    onChange: ({ value }) => {
      if (value.email) {
        const emailError = validators.email(value.email)
        if (emailError) return emailError
      }
    },
  },
  onSubmit: async ({ value }) => {
    try {
      await resetPasswordMutation.mutateAsync(value.email)

      // 发送成功（无论邮箱是否存在都显示成功）
      isSuccessful.value = true
    } catch {
      // 错误已经在 useAuth hook 中处理
    }
  },
})

// 返回登录页面
const goToLogin = () => {
  router.push('/auth/login')
}

// 重新发送
const resend = () => {
  isSuccessful.value = false
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
          <Mail
            data-testid="success-icon"
            class="h-8 w-8 text-green-600 dark:text-green-500"
          />
        </div>
        <h3 class="text-2xl font-bold text-foreground">
          邮件已发送
        </h3>
        <p
          data-testid="success-message"
          class="mt-2 text-sm text-muted-foreground"
        >
          我们已向您的邮箱发送了密码重置链接，请查收。
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <Button @click="goToLogin" class="w-full">
          返回登录
        </Button>
        <Button variant="outline" @click="resend" class="w-full">
          重新发送
        </Button>
      </div>
    </div>

    <!-- 表单状态 -->
    <AuthForm
      v-else
      title="忘记密码？"
      description="输入您的邮箱地址，我们将发送重置密码的链接"
      submit-label="发送重置邮件"
      :loading="resetPasswordMutation.isPending.value"
      :error="errorMessage"
      @submit="form.handleSubmit"
    >
      <!-- 邮箱字段 -->
      <form.Field
        name="email"
        :validators="{
          onChange: ({ value }) => {
            if (!value) return '邮箱不能为空'
            const emailError = validators.email(value)
            if (emailError) return emailError
          },
        }"
      >
        <template #default="{ field }">
          <div class="space-y-2">
            <Label for="email">邮箱</Label>
            <Input
              id="email"
              data-testid="email"
              type="email"
              placeholder="请输入注册时使用的邮箱"
              :model-value="field.state.value"
              @update:model-value="(v) => field.handleChange(String(v))"
            />
            <div v-if="field.state.meta.errors.length > 0" class="flex items-center gap-1 text-sm text-destructive">
              {{ field.state.meta.errors[0] }}
            </div>
          </div>
        </template>
      </form.Field>

      <!-- 底部插槽：返回登录链接 -->
      <template #footer>
        <div class="flex items-center justify-center">
          <button
            type="button"
            class="text-sm text-muted-foreground hover:text-foreground"
            @click="goToLogin"
          >
            返回登录
          </button>
        </div>
      </template>
    </AuthForm>
  </div>
</template>
