# 用户中心路由配置

## 路由信息

- **路径**: `/profile`
- **名称**: `profile`
- **访问权限**: 需要登录（`requiresAuth: true`）
- **组件**: `@/features/profile/views/ProfileView.vue`

## 路由配置

已更新 `src/router/index.ts` 中的 `profileRoute`，指向新的用户中心页面：

```typescript
const profileRoute: RouteRecordRaw = {
  path: '/profile',
  name: 'profile',
  component: () => import('@/features/profile/views/ProfileView.vue'),
  meta: {
    title: '用户中心',
    description: '查看和管理您的账户信息',
    requiresAuth: true, // 需要登录才能访问
  },
}
```

## 访问方式

### 1. 通过路由跳转

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

// 方式1：使用路径
router.push('/profile')

// 方式2：使用路由名称
router.push({ name: 'profile' })
```

### 2. 通过RouterLink组件

```vue
<router-link to="/profile">用户中心</router-link>
```

### 3. 从底部Tab导航

在底部导航栏中添加"个人"Tab，点击后跳转到用户中心。

## 路由守卫

- 未登录用户访问 `/profile` 会被重定向到 `/auth/login`
- 登录后会显示toast提示："请先登录以访问此页面"
- 登录成功后会保留原始访问路径

## 旧页面处理

旧的测试页面已备份为：
- `src/views/ProfileView.vue.backup`

如果需要恢复，可以重命名回 `ProfileView.vue`。

## 测试方法

1. **未登录访问**：
   ```bash
   # 访问 http://localhost:5173/#/profile
   # 应该重定向到登录页
   ```

2. **登录后访问**：
   ```bash
   # 1. 先登录
   # 2. 访问 http://localhost:5173/#/profile
   # 应该显示用户中心页面
   ```

3. **功能测试**：
   - 检查基础信息卡片是否正常显示
   - 点击"编辑"按钮，测试抽屉是否打开
   - 测试表单提交是否成功
   - 测试退出登录功能

## 注意事项

1. **数据库表**: 需要在Supabase中创建 `profiles` 表
2. **头像资源**: 需要在 `public/avatars/` 目录下放置头像图片
3. **RLS策略**: 需要设置正确的行级安全策略
4. **权限**: 只有用户本人可以查看和编辑自己的信息
