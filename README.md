# 宠物（宠物）管理系统

一个基于 Vue 3 + TypeScript + Tailwind CSS + Supabase 的现代化宠物管理系统。

## ✨ 特性

- 🚀 **Vue 3 Composition API** - 使用最新的 Vue 3 特性
- 🎨 **Tailwind CSS** - 原子化 CSS 框架
- 🧩 **shadcn-vue** - 高质量的 UI 组件库
- 🔐 **Supabase Auth** - 完整的用户认证系统
- 📦 **TanStack Query** - 强大的服务器状态管理
- 📝 **TanStack Form** - 类型安全的表单管理
- 🎭 **Pinia** - 客户端状态管理
- 💾 **TypeScript** - 类型安全

## 📋 功能

### 已实现

- ✅ 用户认证系统
  - 用户注册
  - 用户登录/登出
  - 密码重置
  - 会话管理
  - 路由守卫

- ✅ UI 组件
  - 认证页面布局
  - 通用表单容器
  - 密码输入组件（强度指示器）
  - 响应式设计

## 🛠️ 技术栈

### 前端框架
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集
- **Vite** - 下一代前端构建工具

### UI 框架
- **Tailwind CSS** - 原子化 CSS 框架
- **shadcn-vue** - 可复用的 UI 组件
- **reka-ui** - 无样式的 Vue UI 组件原语
- **Lucide Vue** - 图标库

### 状态管理
- **Pinia** - Vue 的状态管理库
- **TanStack Query** - 服务器状态管理
- **TanStack Form** - 表单状态管理

### 后端服务
- **Supabase** - 开源的 Firebase 替代方案
  - 认证 (Auth)
  - 数据库 (PostgreSQL)
  - 实时订阅

### 工具库
- **Vue Router** - 官方路由管理器
- **vue-sonner** - Toast 通知组件
- **@vueuse/core** - Vue Composition 工具集
- **clsx** / **tailwind-merge** - CSS 类名工具

## 📦 项目结构

```
src/
├── features/           # 功能模块
│   └── auth/          # 认证功能
│       ├── components/ # 认证组件
│       ├── hooks/      # 认证 hooks
│       ├── utils/      # 工具函数
│       ├── views/      # 视图页面
│       └── routes.ts   # 路由配置
├── lib/               # 核心库
│   └── supabase.ts    # Supabase 客户端
├── services/          # 服务层（API 抽象）
│   └── auth/          # 认证服务
├── stores/            # Pinia 状态管理
│   └── ui.ts          # UI 状态
├── shadcn/            # shadcn-vue 组件
│   └── components/    # UI 基础组件
├── utils/             # 工具函数
│   └── toast.ts       # Toast 工具
├── views/             # 全局视图
├── router/            # 路由配置
└── main.ts            # 应用入口
```

## 🚀 快速开始

### 环境要求

- Node.js >= 20.19.0 或 >= 22.12.0
- pnpm >= 9.0.0

### 安装依赖

```bash
pnpm install
```

### 环境变量配置

创建 `.env` 文件：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

从 Supabase 项目设置中获取这些值：
1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 创建新项目或选择现有项目
3. 进入 Settings → API
4. 复制 URL 和 anon/public key

### 开发服务器

```bash
pnpm dev
```

访问 [http://localhost:5173](http://localhost:5173)

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 📖 开发指南

### 认证功能使用

#### 1. 使用 useAuth Hook

```vue
<script setup lang="ts">
import { useAuth } from '@/features/auth/hooks/useAuth'

const {
  sessionQuery,
  signInMutation,
  signOutMutation
} = useAuth()
</script>

<template>
  <div v-if="sessionQuery.data">
    欢迎, {{ sessionQuery.data.user.email }}!
    <button @click="signOutMutation.mutate()">登出</button>
  </div>
</template>
```

#### 2. 路由守卫

```typescript
// 需要登录的路由
{
  path: '/dashboard',
  meta: { requiresAuth: true },
  component: DashboardView
}

// 仅未登录用户可访问的路由
{
  path: '/auth/login',
  meta: { requiresGuest: true },
  component: LoginView
}
```

#### 3. 使用认证组件

```vue
<template>
  <AuthLayout>
    <AuthForm
      title="登录"
      :loading="isLoading"
      @submit="handleLogin"
    >
      <!-- 表单字段 -->
    </AuthForm>
  </AuthLayout>
</template>
```

更多详细信息请查看：
- [组件文档](./docs/features/auth/components.md)
- [API 文档](./docs/features/auth/api.md)

### 测试

```bash
# 运行测试
pnpm test

# 测试 UI 模式
pnpm test:ui

# 测试覆盖率
pnpm test:coverage
```

### 代码检查

```bash
# ESLint
pnpm lint

# Prettier 格式化
pnpm format

# TypeScript 类型检查
pnpm type-check
```

## 🏗️ 架构设计

### 三层状态管理

项目采用混合状态管理架构（方案3）：

1. **客户端状态** → Pinia Store
   - UI 状态（主题、侧边栏、语言等）
   - 本地持久化

2. **服务器状态** → TanStack Query
   - 会话数据
   - API 数据
   - 自动缓存和重新验证

3. **表单状态** → TanStack Form
   - 表单字段
   - 验证逻辑

### 服务层模式

```
Component (View)
    ↓
Hook (useAuth)
    ↓
Service (authService)
    ↓
Supabase Client
```

- **View**: UI 组件，只负责展示
- **Hook**: 业务逻辑 + 状态管理
- **Service**: API 抽象，与后端解耦
- **Supabase**: 实际的后端调用

## 🔒 安全最佳实践

- ✅ 所有 API 调用通过 Supabase Row Level Security (RLS) 保护
- ✅ 密码重置使用邮件链接（不直接显示密码）
- ✅ 错误分类（系统错误 vs 业务错误）
- ✅ 会话自动恢复
- ✅ 路由守卫保护敏感页面

## 📝 许可证

[MIT](LICENSE)

## 🤝 贡献

欢迎提交 Pull Request！

## 📧 联系方式

如有问题或建议，请创建 Issue。
