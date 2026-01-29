/**
 * NotFoundView
 *
 * 404页面
 */

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/shadcn/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4">
    <div class="mx-auto max-w-md text-center">
      <h1 class="mb-4 text-9xl font-bold text-muted-foreground">404</h1>
      <h2 class="mb-4 text-2xl font-bold">页面未找到</h2>
      <p class="mb-8 text-muted-foreground">
        抱歉，您访问的页面不存在。
      </p>
      <Button @click="router.push('/')">
        <ArrowLeft class="mr-2 h-4 w-4" />
        返回首页
      </Button>
    </div>
  </div>
</template>
