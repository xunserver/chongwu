# 用户中心页面 - 实现说明

## 功能概述

实现了一个完整的移动端H5用户中心页面，包含基础信息、地址信息、安全设置三大模块。

## 目录结构

```
src/features/profile/
├── components/
│   ├── AddressInfoCard.vue          # 地址信息卡片
│   ├── AddressInfoForm.vue          # 地址信息编辑表单
│   ├── AvatarSelector.vue           # 头像选择器
│   ├── BasicInfoCard.vue            # 基础信息卡片
│   ├── BasicInfoForm.vue            # 基础信息编辑表单
│   ├── EditDrawer.vue               # 编辑抽屉容器
│   ├── LogoutButton.vue             # 退出登录按钮
│   ├── SecuritySettingsCard.vue     # 安全设置卡片
│   └── SecuritySettingsForm.vue     # 安全设置表单
├── hooks/
│   ├── useProfile.ts                # 获取用户信息
│   └── useProfileUpdate.ts          # 更新用户信息
├── types/
│   └── profile.ts                   # TypeScript类型定义
├── utils/
│   ├── avatar-options.ts            # 预设头像配置
│   ├── province-data.ts             # 省市区数据
│   └── validation.ts                # 表单验证规则
└── views/
    └── ProfileView.vue              # 用户中心页面
```

## 主要功能

### 1. 基础信息管理
- 昵称、头像、性别、生日、个人简介
- 头像从预设列表中选择（15种宠物头像）
- 性别选项：男/女/保密
- 生日使用日期选择器
- 个人简介最多200字，实时显示剩余字数

### 2. 地址信息管理
- 省市区三级联动选择器
- 详细地址文本输入
- 数据包含主要省市：北京、上海、广东、浙江、江苏

### 3. 安全设置
- 修改密码（需验证当前密码）
- 修改邮箱（需验证密码，发送验证邮件）

### 4. 退出登录
- 底部退出登录按钮
- 退出后跳转到首页

## 技术栈

- **框架**: Vue 3 + TypeScript
- **UI库**: shadcn-vue
- **样式**: Tailwind CSS v4
- **表单**: TanStack Form + Zod验证
- **状态管理**: TanStack Vue Query
- **后端**: Supabase

## 设计原则

- 移动端优先，触摸目标最小44px
- 卡片式布局，清晰的信息层级
- 抽屉式编辑，流畅的交互体验
- 表单验证实时反馈
- 所有字段必填（用于宠物配送）

## 使用方式

1. 用户从底部Tab导航进入用户中心
2. 点击卡片上的"编辑"按钮打开抽屉
3. 在抽屉中编辑信息
4. 点击"保存"提交更改
5. 编辑完成后自动刷新数据

## 待办事项

- [ ] 创建实际的头像图片资源（public/avatars/）
- [ ] 完善省市区数据（当前为简化版）
- [ ] 在Supabase中创建profiles表
- [ ] 设置RLS策略
- [ ] 添加E2E测试
- [ ] 添加单元测试

## 数据库Schema

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 基础信息
  nickname TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT 'avatar-1',
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'secret')),
  birthday DATE NOT NULL,
  bio TEXT NOT NULL CHECK (char_length(bio) <= 200),

  -- 邮箱
  email TEXT NOT NULL,

  -- 地址信息
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  detailed_address TEXT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```
