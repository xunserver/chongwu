/**
 * Profile Validation Schemas
 *
 * 使用 Zod 定义表单验证规则
 */

import { z } from 'zod'

export const basicInfoSchema = z.object({
  nickname: z
    .string()
    .min(1, '昵称不能为空')
    .max(20, '昵称最多20个字符'),
  avatar: z.string().min(1, '请选择头像'),
  gender: z.enum(['male', 'female', 'secret']),
  birthday: z
    .string()
    .min(1, '请选择生日')
    .refine(
      (date) => {
        const d = new Date(date)
        const now = new Date()
        return d < now
      },
      { message: '生日不能晚于今天' },
    ),
  bio: z.string().max(200, '个人简介最多200个字符'),
})

export const addressInfoSchema = z.object({
  province: z.string().min(1, '请选择省份'),
  city: z.string().min(1, '请选择城市'),
  district: z.string().min(1, '请选择区县'),
  detailed_address: z
    .string()
    .min(5, '详细地址至少5个字符')
    .max(100, '详细地址最多100个字符'),
})

export const passwordUpdateSchema = z
  .object({
    oldPassword: z.string().min(1, '请输入当前密码'),
    newPassword: z
      .string()
      .min(8, '新密码至少8个字符')
      .regex(/[A-Z]/, '新密码必须包含大写字母')
      .regex(/[a-z]/, '新密码必须包含小写字母')
      .regex(/[0-9]/, '新密码必须包含数字'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '两次密码不一致',
    path: ['confirmPassword'],
  })

export const emailUpdateSchema = z.object({
  password: z.string().min(1, '请输入密码以验证身份'),
  newEmail: z.string().email('请输入有效的邮箱地址'),
})

export type BasicInfoForm = z.infer<typeof basicInfoSchema>
export type AddressInfoForm = z.infer<typeof addressInfoSchema>
export type PasswordUpdateForm = z.infer<typeof passwordUpdateSchema>
export type EmailUpdateForm = z.infer<typeof emailUpdateSchema>
