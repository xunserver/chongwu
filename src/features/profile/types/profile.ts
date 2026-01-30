/**
 * Profile Feature Types
 *
 * 用户中心相关类型定义
 */

export interface UserProfile {
  // 基础信息
  id: string // 用户ID（Supabase auth.uid()）
  nickname: string // 昵称，必填
  avatar: string // 头像URL（预设头像）
  gender: 'male' | 'female' | 'secret' // 性别，必填
  birthday: string // 生日，ISO日期格式
  bio: string // 个人简介，最多200字

  // 邮箱
  email: string // 邮箱，必填，已验证

  // 地址信息
  province: string // 省份代码，必填
  city: string // 城市代码，必填
  district: string // 区县代码，必填
  detailed_address: string // 详细地址，必填

  // 时间戳
  created_at: string
  updated_at: string
}

export interface AvatarOption {
  id: string // 头像ID
  name: string // 头像名称
  url: string // 头像URL
  category: 'cat' | 'dog' | 'other' // 头像分类
}

export type ProfileSection = 'basic' | 'address' | 'security'
