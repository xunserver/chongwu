/**
 * RegisterView
 *
 * 用户注册页面
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
const { signUpMutation, error } = useAuth()

// TanStack Form
const form = useForm({
  defaultValues: {
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  },
  validators: {
    // 表单级别验证（跨字段）
    onSubmit: ({ value }) => {
      if (value.password !== value.confirmPassword) {
        return '两次输入的密码不一致'
      }
      if (!value.agreeToTerms) {
        return '请同意服务条款和隐私政策'
      }
    },
  },
  onSubmit: async ({ value }) => {
    try {
      await signUpMutation.mutateAsync({
        email: value.email,
        password: value.password,
      })

      // 注册成功，跳转到登录页
      router.push('/auth/login')
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

// 获取表单级别验证错误
const formError = computed(() => {
  // TanStack Form 使用 form.state.errors 或通过 form.Error 组件
  const errors = form.state.errors
  if (errors && Object.keys(errors).length > 0) {
    // 获取第一个表单级错误（不是字段级错误）
    const formLevelErrors = errors.onSubmit || []
    if (formLevelErrors.length > 0) {
      return formLevelErrors[0]
    }
  }
  return null
})

// 合并错误消息（表单验证错误优先）
const displayError = computed(() => {
  return formError.value || errorMessage.value
})
</script>

<template>
  <div class="w-full">
    <AuthForm
      title="注册"
      description="填写信息创建您的账号"
      submit-label="注册"
      :loading="signUpMutation.isPending.value"
      :error="displayError"
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
              placeholder="请输入密码（至少8个字符）"
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
          onChange: ({ value, fieldApi }) => {
            if (!value) return '请确认密码'
            // 实时检查密码匹配（访问表单的 password 字段值）
            const passwordValue = fieldApi.form.state.values.password
            if (value && passwordValue && value !== passwordValue) {
              return '两次输入的密码不一致'
            }
          },
        }"
      >
        <template #default="{ field }">
          <div class="space-y-2">
            <Label for="confirmPassword">确认密码</Label>
            <PasswordInput
              id="confirmPassword"
              data-testid="confirm-password"
              placeholder="请再次输入密码"
              :model-value="field.state.value"
              @update:model-value="(v) => field.handleChange(String(v))"
            />
            <div v-if="field.state.meta.errors.length > 0" class="flex items-center gap-1 text-sm text-destructive">
              {{ field.state.meta.errors[0] }}
            </div>
          </div>
        </template>
      </form.Field>

      <!-- 服务条款 -->
      <form.Field
        name="agreeToTerms"
        :validators="{
          onChange: ({ value }) => {
            if (!value) return '请同意服务条款和隐私政策'
          },
        }"
      >
        <template #default="{ field }">
          <div class="flex items-start space-x-2">
            <Checkbox
              id="agree-terms"
              data-testid="agree-terms"
              :model-value="field.state.value"
              @update:model-value="(v) => field.handleChange(!!v)"
            />
            <Label
              for="agree-terms"
              class="cursor-pointer text-sm font-normal leading-tight"
              @click="(e) => {
                e.preventDefault()
                field.handleChange(!field.state.value)
              }"
            >
              我已阅读并同意
              <a href="#" class="text-primary hover:underline">服务条款</a>
              和
              <a href="#" class="text-primary hover:underline">隐私政策</a>
            </Label>
          </div>
          <div v-if="field.state.meta.errors.length > 0" class="flex items-center gap-1 text-sm text-destructive mt-1">
            {{ field.state.meta.errors[0] }}
          </div>
        </template>
      </form.Field>

      <!-- 底部插槽：登录链接 -->
      <template #footer>
        <div class="flex items-center justify-center gap-1 text-sm text-muted-foreground">
          已有账号？
          <button
            type="button"
            class="font-medium text-primary hover:underline"
            @click="goToLogin"
          >
            立即登录
          </button>
        </div>
      </template>
    </AuthForm>
  </div>
</template>
