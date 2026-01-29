/**
 * ProfileView
 *
 * 用户测试页面
 * 显示当前登录用户信息和会话详情
 * 提供修改密码和退出登录功能
 */

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from '@tanstack/vue-form'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@/shadcn/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shadcn/components/ui/card'
import { Badge } from '@/shadcn/components/ui/badge'
import { Separator } from '@/shadcn/components/ui/separator'
import { Input } from '@/shadcn/components/ui/input'
import { Label } from '@/shadcn/components/ui/label'
import { LogOut, RefreshCw, Mail, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Key } from 'lucide-vue-next'
import { toast } from '@/utils/toast'

const router = useRouter()
const { sessionQuery, signOutMutation, updatePasswordMutation } = useAuth()

// 修改密码表单显示状态
const showUpdatePassword = ref(false)

// 密码修改成功状态
const passwordUpdateSuccess = ref(false)

// 判断是否已登录
const isAuthenticated = computed(() => Boolean(sessionQuery.data.value?.user))

// 判断会话是否过期
const isSessionExpired = computed(() => {
  if (!sessionQuery.data.value?.expiresAt) return false
  return Date.now() > sessionQuery.data.value.expiresAt
})

// 格式化过期时间
const formatExpirationTime = computed(() => {
  const expiresAt = sessionQuery.data.value?.expiresAt
  if (!expiresAt) return '未知'

  const date = new Date(expiresAt)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()

  if (diffMs <= 0) return '已过期'

  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) return `${diffDays}天后过期`
  if (diffHours > 0) return `${diffHours}小时后过期`
  if (diffMins > 0) return `${diffMins}分钟后过期`
  return '即将过期'
})

// 退出登录
const handleSignOut = async () => {
  await signOutMutation.mutateAsync()
  router.push('/auth/login')
}

// 刷新会话
const refreshSession = async () => {
  await sessionQuery.refetch()
  toast.success('会话已刷新')
}

// 切换修改密码表单显示
const toggleUpdatePassword = () => {
  showUpdatePassword.value = !showUpdatePassword.value
  passwordUpdateSuccess.value = false
}

// 修改密码表单
const updatePasswordForm = useForm({
  defaultValues: {
    newPassword: '',
    confirmPassword: '',
  },
  validators: {
    onSubmit: ({ value }) => {
      if (value.newPassword !== value.confirmPassword) {
        return '两次输入的密码不一致'
      }
      if (value.newPassword.length < 8) {
        return '密码至少需要8个字符'
      }
    },
  },
  onSubmit: async ({ value }) => {
    try {
      await updatePasswordMutation.mutateAsync(value.newPassword)
      passwordUpdateSuccess.value = true
      showUpdatePassword.value = false
      toast.success('密码修改成功！')
    } catch {
      // 错误已经在 useAuth hook 中处理
    }
  },
})
</script>

<template>
  <div class="min-h-screen bg-muted/30">
    <!-- 头部 -->
    <header class="border-b bg-background">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 class="text-2xl font-bold">用户中心</h1>
        <Button variant="outline" size="sm" @click="router.push('/')">
          返回首页
        </Button>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="container mx-auto px-4 py-12">
      <div class="mx-auto max-w-3xl space-y-6">
        <!-- 未登录状态 -->
        <Card v-if="!isAuthenticated">
          <CardHeader class="text-center">
            <XCircle class="mx-auto h-16 w-16 text-destructive mb-4" />
            <CardTitle class="text-2xl">未登录</CardTitle>
            <CardDescription>您还未登录，请先登录以查看用户信息</CardDescription>
          </CardHeader>
          <CardContent class="flex gap-3 justify-center">
            <Button @click="router.push('/auth/login')">前往登录</Button>
            <Button variant="outline" @click="router.push('/auth/register')">注册账号</Button>
          </CardContent>
        </Card>

        <!-- 已登录状态 -->
        <div v-else class="space-y-6">
          <!-- 用户基本信息 -->
          <Card>
            <CardHeader>
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle class="text-2xl">欢迎回来！</CardTitle>
                  <CardDescription>您已成功登录</CardDescription>
                </div>
                <CheckCircle class="h-12 w-12 text-green-600 dark:text-green-500" />
              </div>
            </CardHeader>
            <CardContent class="space-y-4">
              <!-- 用户邮箱 -->
              <div class="flex items-center gap-3">
                <Mail class="h-5 w-5 text-muted-foreground" />
                <div class="flex-1">
                  <p class="text-sm text-muted-foreground">邮箱</p>
                  <p class="font-medium">{{ sessionQuery.data?.user?.email }}</p>
                </div>
              </div>

              <Separator />

              <!-- 用户ID -->
              <div>
                <p class="text-sm text-muted-foreground mb-1">用户ID</p>
                <code class="block rounded bg-muted px-3 py-2 text-sm">
                  {{ sessionQuery.data?.user?.id }}
                </code>
              </div>

              <!-- 邮箱验证状态 -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-muted-foreground">邮箱验证</p>
                  <Badge :variant="sessionQuery.data?.user?.emailConfirmed ? 'default' : 'secondary'">
                    {{ sessionQuery.data?.user?.emailConfirmed ? '已验证' : '未验证' }}
                  </Badge>
                </div>
              </div>

              <!-- 注册时间 -->
              <div v-if="sessionQuery.data?.user?.createdAt">
                <p class="text-sm text-muted-foreground mb-1">注册时间</p>
                <p class="text-sm">
                  {{ new Date(sessionQuery.data.user.createdAt).toLocaleString('zh-CN') }}
                </p>
              </div>

              <!-- 用户元数据 -->
              <details v-if="sessionQuery.data?.user?.userMetadata" class="mt-4">
                <summary class="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  查看用户元数据
                </summary>
                <pre class="mt-2 rounded bg-muted p-3 text-xs overflow-auto max-h-40">{{ JSON.stringify(sessionQuery.data.user.userMetadata, null, 2) }}</pre>
              </details>
            </CardContent>
          </Card>

          <!-- 会话信息 -->
          <Card>
            <CardHeader>
              <div class="flex items-center justify-between">
                <CardTitle>会话信息</CardTitle>
                <Button variant="ghost" size="sm" @click="refreshSession">
                  <RefreshCw class="mr-2 h-4 w-4" />
                  刷新
                </Button>
              </div>
            </CardHeader>
            <CardContent class="space-y-4">
              <!-- 访问令牌类型 -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-muted-foreground">令牌类型</p>
                  <p class="font-medium">{{ sessionQuery.data?.tokenType || 'Bearer' }}</p>
                </div>
              </div>

              <!-- 过期时间 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Clock class="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p class="text-sm text-muted-foreground">会话过期</p>
                    <p class="font-medium">{{ formatExpirationTime }}</p>
                  </div>
                </div>
                <Badge :variant="isSessionExpired ? 'destructive' : 'default'">
                  {{ isSessionExpired ? '已过期' : '有效' }}
                </Badge>
              </div>

              <!-- 完整会话对象 -->
              <details class="mt-4">
                <summary class="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  查看完整会话数据
                </summary>
                <pre class="mt-2 rounded bg-muted p-3 text-xs overflow-auto max-h-60">{{ JSON.stringify(sessionQuery.data, null, 2) }}</pre>
              </details>
            </CardContent>
          </Card>

          <!-- 账户操作 -->
          <Card>
            <CardHeader>
              <CardTitle>账户操作</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <!-- 修改密码按钮 -->
              <Button
                variant="outline"
                class="w-full"
                @click="toggleUpdatePassword"
              >
                <Key class="mr-2 h-4 w-4" />
                修改密码
                <ChevronDown v-if="!showUpdatePassword" class="ml-auto h-4 w-4" />
                <ChevronUp v-else class="ml-auto h-4 w-4" />
              </Button>

              <!-- 修改密码表单 (可折叠) -->
              <div v-if="showUpdatePassword" class="space-y-4 mt-4 p-4 rounded-lg border bg-muted/30">
                <div v-if="passwordUpdateSuccess" class="text-center py-4">
                  <CheckCircle class="mx-auto h-12 w-12 text-green-600 dark:text-green-500 mb-2" />
                  <p class="font-medium">密码修改成功！</p>
                  <p class="text-sm text-muted-foreground mt-1">您现在可以使用新密码登录</p>
                </div>

                <form v-else @submit="updatePasswordForm.handleSubmit">
                  <div class="space-y-4">
                    <!-- 新密码字段 -->
                    <updatePasswordForm.Field
                      name="newPassword"
                      :validators="{
                        onChange: ({ value }) => {
                          if (!value) return '密码不能为空'
                          if (value.length < 8) return '密码至少需要8个字符'
                        },
                      }"
                    >
                      <template #default="{ field }">
                        <div class="space-y-2">
                          <Label for="newPassword">新密码</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="请输入新密码（至少8个字符）"
                            :model-value="field.state.value"
                            @update:model-value="(v) => field.handleChange(String(v))"
                          />
                          <div v-if="field.state.meta.errors.length > 0" class="flex items-center gap-1 text-sm text-destructive">
                            {{ field.state.meta.errors[0] }}
                          </div>
                        </div>
                      </template>
                    </updatePasswordForm.Field>

                    <!-- 确认密码字段 -->
                    <updatePasswordForm.Field
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
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="请再次输入新密码"
                            :model-value="field.state.value"
                            @update:model-value="(v) => field.handleChange(String(v))"
                          />
                          <div v-if="field.state.meta.errors.length > 0" class="flex items-center gap-1 text-sm text-destructive">
                            {{ field.state.meta.errors[0] }}
                          </div>
                        </div>
                      </template>
                    </updatePasswordForm.Field>

                    <!-- 密码提示 -->
                    <div class="rounded-md border border-muted-foreground/20 bg-muted/50 p-3 text-sm text-muted-foreground">
                      <p class="font-medium">密码要求：</p>
                      <ul class="ml-4 mt-2 list-disc space-y-1">
                        <li>至少8个字符</li>
                        <li>包含字母和数字</li>
                        <li>不与当前密码相同</li>
                      </ul>
                    </div>

                    <!-- 提交按钮 -->
                    <Button
                      type="submit"
                      class="w-full"
                      :disabled="updatePasswordMutation.isPending.value"
                    >
                      <RefreshCw v-if="updatePasswordMutation.isPending.value" class="mr-2 h-4 w-4 animate-spin" />
                      {{ updatePasswordMutation.isPending.value ? '更新中...' : '更新密码' }}
                    </Button>
                  </div>
                </form>
              </div>

              <!-- 退出登录按钮 -->
              <Button
                variant="destructive"
                class="w-full"
                :disabled="signOutMutation.isPending.value"
                @click="handleSignOut"
              >
                <LogOut v-if="!signOutMutation.isPending.value" class="mr-2 h-4 w-4" />
                <RefreshCw v-else class="mr-2 h-4 w-4 animate-spin" />
                {{ signOutMutation.isPending.value ? '退出中...' : '退出登录' }}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>
