/**
 * AuthForm Component
 *
 * 通用认证表单容器组件
 * 提供统一的UI结构和状态展示
 */

<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shadcn/components/ui/card'
import { Button } from '@/shadcn/components/ui/button'
import { cn } from '@/shadcn/lib/utils'
import { Loader2, AlertCircle } from 'lucide-vue-next'

interface AuthFormProps {
  title?: string
  description?: string
  submitLabel?: string
  submitDisabled?: boolean
  loading?: boolean
  error?: string | null
  class?: HTMLAttributes['class']
  showFooter?: boolean
}

const props = withDefaults(defineProps<AuthFormProps>(), {
  submitLabel: '提交',
  submitDisabled: false,
  loading: false,
  showFooter: true,
})

const emit = defineEmits<{
  submit: [event: Event]
}>()

// 计算是否显示表单错误
const hasError = computed(() => Boolean(props.error))

// 提交表单
const handleSubmit = (event: Event) => {
  event.preventDefault()
  if (!props.loading && !props.submitDisabled) {
    emit('submit', event)
  }
}
</script>

<template>
  <Card :class="cn('w-full', props.class)">
    <!-- 表单头部 -->
    <CardHeader v-if="title || description" class="space-y-1">
      <CardTitle v-if="title" class="text-2xl font-bold text-center">
        {{ title }}
      </CardTitle>
      <CardDescription v-if="description" class="text-center">
        {{ description }}
      </CardDescription>
    </CardHeader>

    <!-- 表单内容 -->
    <CardContent>
      <form @submit="handleSubmit" class="space-y-4">
        <!-- 默认插槽：表单字段 -->
        <slot />

        <!-- 全局错误提示 -->
        <div
          v-if="hasError"
          data-testid="auth-error"
          class="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle class="h-4 w-4 flex-shrink-0" />
          <span>{{ error }}</span>
        </div>

        <!-- 提交按钮插槽（可选） -->
        <slot name="submit">
          <Button
            type="submit"
            data-testid="submit-button"
            class="w-full"
            :disabled="submitDisabled || loading"
          >
            <Loader2
              v-if="loading"
              data-testid="loading"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ submitLabel }}
          </Button>
        </slot>
      </form>
    </CardContent>

    <!-- 表单底部 -->
    <CardFooter v-if="showFooter || $slots.footer">
      <div v-if="!showFooter" class="w-full">
        <slot name="footer" />
      </div>
      <div v-else class="w-full">
        <slot name="footer" />
      </div>
    </CardFooter>
  </Card>
</template>
