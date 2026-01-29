/**
 * PasswordInput Component
 *
 * 密码输入组件，支持显示/隐藏切换和密码强度指示
 * 优化性能：减少不必要的重新渲染
 */

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { Eye, EyeOff, AlertCircle } from 'lucide-vue-next'
import { Input } from '@/shadcn/components/ui/input'
import { Button } from '@/shadcn/components/ui/button'
import { cn } from '@/shadcn/lib/utils'

interface PasswordInputProps {
  modelValue: string
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
  showStrengthIndicator?: boolean
}

const props = withDefaults(defineProps<PasswordInputProps>(), {
  placeholder: '请输入密码',
  showStrengthIndicator: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// 密码可见性状态
const isVisible = ref(false)

// 切换密码可见性
const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}

// 缓存密码强度计算结果
const passwordStrength = ref({ level: 0, label: '', color: '' })

// 计算密码强度（带缓存，避免频繁计算）
const calculatePasswordStrength = (password: string) => {
  if (!password) return { level: 0, label: '', color: '' }

  let score = 0

  // 长度检查
  if (password.length >= 8) score++
  if (password.length >= 12) score++

  // 复杂度检查
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 2) {
    return { level: 1, label: '弱', color: 'bg-destructive' }
  } else if (score <= 4) {
    return { level: 2, label: '中', color: 'bg-yellow-500' }
  } else {
    return { level: 3, label: '强', color: 'bg-green-500' }
  }
}

// 只在密码变化时重新计算强度
watchEffect(() => {
  passwordStrength.value = calculatePasswordStrength(props.modelValue || '')
})

// 输入框样式
const inputClass = computed(() => cn(
  'pr-10',
  props.error && 'border-destructive focus-visible:ring-destructive/20'
))
</script>

<template>
  <div class="space-y-2">
    <!-- Label -->
    <label
      v-if="label"
      :for="id || name"
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </label>

    <!-- 密码输入框 -->
    <div class="relative">
      <Input
        :id="id || name"
        :name="name"
        data-testid="password"
        :type="isVisible ? 'text' : 'password'"
        :model-value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClass"
        @update:model-value="emit('update:modelValue', $event)"
      />

      <!-- 显示/隐藏按钮 -->
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
        :disabled="disabled"
        @click="toggleVisibility"
      >
        <Eye v-if="!isVisible" class="h-4 w-4 text-muted-foreground" />
        <EyeOff v-else class="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>

    <!-- 密码强度指示器（移除 transition-colors 动画以避免卡顿） -->
    <div
      v-if="showStrengthIndicator && modelValue"
      class="space-y-1"
    >
      <div class="flex gap-1">
        <div
          v-for="i in 3"
          :key="i"
          class="h-1.5 flex-1 rounded-full bg-muted"
          :class="[i <= passwordStrength.level ? passwordStrength.color : '']"
        />
      </div>
      <p class="text-xs text-muted-foreground">
        密码强度: {{ passwordStrength.label }}
      </p>
    </div>

    <!-- 错误消息 -->
    <div
      v-if="error"
      class="flex items-center gap-1 text-sm text-destructive"
    >
      <AlertCircle class="h-4 w-4" />
      <span>{{ error }}</span>
    </div>
  </div>
</template>
