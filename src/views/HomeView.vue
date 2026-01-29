/**
 * HomeView
 *
 * 首页（临时占位）
 */

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@/shadcn/components/ui/button'

const router = useRouter()
const { sessionQuery, signOutMutation } = useAuth()

const handleSignOut = async () => {
  await signOutMutation.mutateAsync()
  router.push('/auth/login')
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- 头部 -->
    <header class="border-b">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 class="text-2xl font-bold">应用名称</h1>
        <div v-if="sessionQuery.data?.user" class="flex items-center gap-4">
          <Button variant="ghost" size="sm" @click="router.push('/profile')">
            用户中心
          </Button>
          <span class="text-sm text-muted-foreground">
            {{ sessionQuery.data.user.email }}
          </span>
          <Button variant="outline" size="sm" @click="handleSignOut">
            登出
          </Button>
        </div>
        <div v-else class="flex items-center gap-2">
          <Button variant="ghost" size="sm" @click="router.push('/auth/login')">
            登录
          </Button>
          <Button size="sm" @click="router.push('/auth/register')">
            注册
          </Button>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="flex-1">
      <div class="container mx-auto px-4 py-12">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="mb-4 text-4xl font-bold">
            欢迎来到应用
          </h2>
          <p class="mb-8 text-lg text-muted-foreground">
            <span v-if="sessionQuery.data?.user">
              您已登录，欢迎回来！
            </span>
            <span v-else>
              请登录或注册以使用完整功能。
            </span>
          </p>
          <div class="flex gap-4 justify-center flex-wrap">
            <Button v-if="!sessionQuery.data?.user" @click="router.push('/auth/login')">
              前往登录
            </Button>
            <Button v-if="!sessionQuery.data?.user" variant="outline" @click="router.push('/auth/register')">
              创建账号
            </Button>
            <Button v-else @click="router.push('/profile')">
              用户中心
            </Button>
            <Button v-if="sessionQuery.data?.user" variant="outline" @click="router.push('/auth/update-password')">
              修改密码
            </Button>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="border-t py-6">
      <div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
        &copy; {{ new Date().getFullYear() }} 版权所有
      </div>
    </footer>
  </div>
</template>
