/**
 * LoginView
 *
 * 用户登录页面
 * 使用 TanStack Form 管理表单状态
 * 集成 useAuth hook 处理认证逻辑
 */

<script setup lang="ts">
import { computed } from 'vue'
import { useForm } from '@tanstack/vue-form'
import { useRouter } from 'vue-router'
import { useAuth } from '../hooks/useAuth'
import { validators } from '../utils/validators'
import AuthForm from '@/features/auth/components/AuthForm.vue'
import PasswordInput from '@/features/auth/components/PasswordInput.vue'
import { Input } from '@/shadcn/components/ui/input'
import { Label } from '@/shadcn/components/ui/label'
import { Checkbox } from '@/shadcn/components/ui/checkbox'

// Router
const router = useRouter()

// Auth hook
const { signInMutation, error } = useAuth()

// TanStack Form
const form = useForm({
  defaultValues: {
    email: '',
    password: '',
    rememberMe: false,
  },
  onSubmit: async ({ value }) => {
    try {
      await signInMutation.mutateAsync({
        email: value.email,
        password: value.password,
      })

      // 登录成功，跳转到首页或重定向页面
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/')
    } catch {
      // 错误已经在 useAuth hook 中处理
      // 业务错误会显示在表单下方
    }
  },
})

// 跳转到注册页面
const goToRegister = () => {
  router.push('/auth/register')
}

// 跳转到忘记密码页面
const goToForgotPassword = () => {
  router.push('/auth/forgot-password')
}

// 获取错误消息（将 AuthError 转换为 string）
const errorMessage = computed(() => {
  return error.value?.message || null
})
</script>

<template>
  <div class="w-full">
    <AuthForm
      title="登录"
      description="输入您的账号信息进行登录"
      submit-label="登录"
      :loading="signInMutation.isPending.value"
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
              placeholder="请输入邮箱"
              :model-value="field.state.value"
              @update:model-value="(v) => field.handleChange(String(v))"
            />
            <div v-if="field.state.meta.errors.length > 0" class="flex items-center gap-1 text-sm text-destructive">
              {{ field.state.meta.errors[0] }}
            </div>
          </div>
        </template>
      </form.Field>

      <!-- 密码字段 -->
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
            <Label for="password">密码</Label>
            <PasswordInput
              id="password"
              placeholder="请输入密码"
              :model-value="field.state.value"
              @update:model-value="(v) => field.handleChange(String(v))"
            />
            <div v-if="field.state.meta.errors.length > 0" class="flex items-center gap-1 text-sm text-destructive">
              {{ field.state.meta.errors[0] }}
            </div>
          </div>
        </template>
      </form.Field>

      <!-- 记住我 & 忘记密码 -->
      <div class="flex items-center justify-between">
        <!-- 记住我 -->
        <form.Field name="rememberMe">
          <template #default="{ field }">
            <div class="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                :checked="field.state.value"
                @update:checked="(v: boolean) => field.handleChange(v)"
              />
              <Label
                for="remember-me"
                class="cursor-pointer text-sm font-normal"
              >
                记住我
              </Label>
            </div>
          </template>
        </form.Field>

        <!-- 忘记密码 -->
        <button
          type="button"
          class="text-sm text-primary hover:underline"
          @click="goToForgotPassword"
        >
          忘记密码？
        </button>
      </div>

      <!-- 底部插槽：注册链接 -->
      <template #footer>
        <div class="flex items-center justify-center gap-1 text-sm text-muted-foreground">
          还没有账号？
          <button
            type="button"
            class="font-medium text-primary hover:underline"
            @click="goToRegister"
          >
            立即注册
          </button>
        </div>
      </template>
    </AuthForm>
  </div>
</template>
