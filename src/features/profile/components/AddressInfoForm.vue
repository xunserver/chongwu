/**
 * AddressInfoForm Component
 *
 * 地址信息编辑表单
 */

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useForm } from '@tanstack/vue-form'
import type { UserProfile } from '../types/profile'
import { Button } from '@/shadcn/components/ui/button'
import { Label } from '@/shadcn/components/ui/label'
import { Textarea } from '@/shadcn/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/components/ui/select'
import { useProfileUpdate } from '../hooks/useProfileUpdate'
import { provinceData } from '../utils/province-data'
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
    province: props.profile.province,
    city: props.profile.city,
    district: props.profile.district,
    detailed_address: props.profile.detailed_address,
  },
  onSubmit: async ({ value }) => {
    try {
      await updateMutation.mutateAsync({
        section: 'address',
        data: value,
      })
      toast.success('地址信息更新成功')
      emit('close')
    } catch (error) {
      // 错误已经在 hook 中处理
    }
  },
})

const cities = computed(() => {
  if (!form.state.values.province) return []
  const province = provinceData.find((p) => p.code === form.state.values.province)
  return province?.cities || []
})

const districts = computed(() => {
  if (!form.state.values.city) return []
  const city = cities.value.find((c) => c.code === form.state.values.city)
  return city?.districts || []
})

// 省份变化时清空城市和区县
watch(
  () => form.state.values.province,
  () => {
    form.setFieldValue('city', '')
    form.setFieldValue('district', '')
  },
)

// 城市变化时清空区县
watch(
  () => form.state.values.city,
  () => {
    form.setFieldValue('district', '')
  },
)
</script>

<template>
  <form @submit="form.handleSubmit">
    <div class="space-y-6">
      <!-- 省市区三级联动 -->
      <div class="grid grid-cols-3 gap-3">
        <!-- 省份 -->
        <form.Field
          name="province"
          :validators="{
            onChange: ({ value }) => {
              if (!value) return '请选择省份'
            },
          }"
        >
          <template #default="{ field }">
            <div class="space-y-2">
              <Label>省份 <span class="text-destructive">*</span></Label>
              <Select
                :model-value="field.state.value"
                @update:model-value="field.handleChange($event as string)"
                :disabled="updateMutation.isPending.value"
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择省份" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="province in provinceData"
                    :key="province.code"
                    :value="province.code"
                  >
                    {{ province.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <div
                v-if="field.state.meta.errors.length > 0"
                class="text-xs text-destructive"
              >
                {{ field.state.meta.errors[0] }}
              </div>
            </div>
          </template>
        </form.Field>

        <!-- 城市 -->
        <form.Field
          name="city"
          :validators="{
            onChange: ({ value }) => {
              if (!value) return '请选择城市'
            },
          }"
        >
          <template #default="{ field }">
            <div class="space-y-2">
              <Label>城市 <span class="text-destructive">*</span></Label>
              <Select
                :model-value="field.state.value"
                @update:model-value="field.handleChange($event as string)"
                :disabled="
                  updateMutation.isPending.value || !form.state.values.province
                "
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择城市" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="city in cities"
                    :key="city.code"
                    :value="city.code"
                  >
                    {{ city.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <div
                v-if="field.state.meta.errors.length > 0"
                class="text-xs text-destructive"
              >
                {{ field.state.meta.errors[0] }}
              </div>
            </div>
          </template>
        </form.Field>

        <!-- 区县 -->
        <form.Field
          name="district"
          :validators="{
            onChange: ({ value }) => {
              if (!value) return '请选择区县'
            },
          }"
        >
          <template #default="{ field }">
            <div class="space-y-2">
              <Label>区县 <span class="text-destructive">*</span></Label>
              <Select
                :model-value="field.state.value"
                @update:model-value="field.handleChange($event as string)"
                :disabled="
                  updateMutation.isPending.value || !form.state.values.city
                "
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择区县" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="district in districts"
                    :key="district.code"
                    :value="district.code"
                  >
                    {{ district.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <div
                v-if="field.state.meta.errors.length > 0"
                class="text-xs text-destructive"
              >
                {{ field.state.meta.errors[0] }}
              </div>
            </div>
          </template>
        </form.Field>
      </div>

      <!-- 详细地址 -->
      <form.Field
        name="detailed_address"
        :validators="{
          onChange: ({ value }) => {
            if (!value) return '详细地址不能为空'
            if (value.length < 5) return '详细地址至少5个字符'
            if (value.length > 100) return '详细地址最多100个字符'
          },
        }"
      >
        <template #default="{ field }">
          <div class="space-y-2">
            <Label for="detailed_address"
              >详细地址 <span class="text-destructive">*</span></Label
            >
            <Textarea
              id="detailed_address"
              placeholder="请输入详细地址，如街道、小区、楼号等"
              :model-value="field.state.value"
              @update:model-value="field.handleChange($event as string)"
              :disabled="updateMutation.isPending.value"
              rows="3"
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
