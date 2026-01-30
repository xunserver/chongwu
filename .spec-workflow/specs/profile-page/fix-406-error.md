# 修复 406 Not Acceptable 错误

## 问题描述

访问用户中心页面时出现 406 错误：
```
GET https://xxx.supabase.co/rest/v1/profiles?select=*&id=eq.xxx 406 (Not Acceptable)
```

## 原因分析

406 错误的原因是：**用户还没有对应的 profile 记录**

当用户注册时，如果没有触发器自动创建 profile 记录，或者触发器没有正确配置，用户登录后查询 profile 表时就会返回 406 错误（RLS 策略拒绝访问不存在的记录）。

## 解决方案

### 方案1：为现有用户创建 profile 记录（已执行）

✅ 已为所有现有用户创建默认的 profile 记录：

```sql
INSERT INTO profiles (id, email, nickname, avatar, gender, birthday, bio, province, city, district, detailed_address)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'nickname', '用户'),
  COALESCE(raw_user_meta_data->>'avatar', 'avatar-1'),
  COALESCE(raw_user_meta_data->>'gender', 'secret'),
  COALESCE((raw_user_meta_data->>'birthday')::date, '2000-01-01'::date),
  COALESCE(raw_user_meta_data->>'bio', ''),
  COALESCE(raw_user_meta_data->>'province', ''),
  COALESCE(raw_user_meta_data->>'city', ''),
  COALESCE(raw_user_meta_data->>'district', ''),
  COALESCE(raw_user_meta_data->>'detailed_address', '')
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = auth.users.id
);
```

### 方案2：修改代码自动创建 profile（已实现）

✅ 已修改 `useProfile` hook，使用 `maybeSingle()` 代替 `single()`，当没有 profile 时自动创建：

```typescript
export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('未登录')

      // 使用 maybeSingle() 避免 406 错误
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()  // 关键：使用 maybeSingle() 而不是 single()

      if (error) throw error

      // 如果没有 profile 记录，自动创建
      if (!data) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email!,
            nickname: '用户',
            avatar: 'avatar-1',
            gender: 'secret',
            birthday: '2000-01-01',
            bio: '',
            province: '',
            city: '',
            district: '',
            detailed_address: '',
          })
          .select()
          .single()

        if (insertError) throw insertError
        if (!newProfile) throw new Error('创建用户信息失败')

        return newProfile as UserProfile
      }

      return data as UserProfile
    },
    staleTime: 1000 * 60 * 5,
  })
}
```

## 关键改动

### 1. 使用 `maybeSingle()` 代替 `single()`

- `single()`: 要求必须返回一条记录，否则抛出错误
- `maybeSingle()`: 允许返回 0 或 1 条记录，不会抛出 406 错误

### 2. 自动创建默认 profile

当查询不到 profile 记录时，自动创建一个默认的 profile，包含：
- 昵称：'用户'
- 头像：'avatar-1'
- 性别：'secret'
- 生日：'2000-01-01'
- 其他字段：空字符串

### 3. 默认值处理

使用 `COALESCE()` 处理可能的 null 值：
```typescript
COALESCE(raw_user_meta_data->>'nickname', '用户')
```

## 长期解决方案

### 在 Supabase Dashboard 中创建触发器

为了确保新用户注册时自动创建 profile，需要在 Dashboard 中执行：

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**触发器函数已创建**：
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname, avatar, gender, birthday, bio, province, city, district, detailed_address)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nickname', '用户'),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'avatar-1'),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'secret'),
    COALESCE((NEW.raw_user_meta_data->>'birthday')::date, '2000-01-01'::date),
    COALESCE(NEW.raw_user_meta_data->>'bio', ''),
    COALESCE(NEW.raw_user_meta_data->>'province', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'district', ''),
    COALESCE(NEW.raw_user_meta_data->>'detailed_address', '')
  );
  RETURN NEW;
END;
$$ language 'plpgsql'
SECURITY DEFINER
SET search_path = public;
```

## 测试验证

### 1. 测试现有用户
```bash
# 访问 /profile 页面
# 应该正常显示用户信息
```

### 2. 测试新用户注册
```bash
# 1. 注册一个新用户
# 2. 登录后访问 /profile
# 3. 应该自动创建 profile 并正常显示
```

### 3. 测试首次访问
```bash
# 首次访问时，profile 为空或只有默认值
# 用户需要点击"编辑"按钮完善信息
```

## 用户体验优化

### 引导用户完善信息

首次访问时，可以显示提示引导用户完善信息：

```vue
<template v-if="isEmptyProfile">
  <Card>
    <CardContent class="pt-6">
      <p class="text-center text-muted-foreground">
        欢迎来到用户中心！请完善您的个人信息。
      </p>
      <Button @click="openEdit('basic')" class="mt-4">
        立即完善
      </Button>
    </CardContent>
  </Card>
</template>
```

## 相关文档

- [Supabase RLS 最佳实践](https://supabase.com/docs/guides/auth/row-level-security)
- [处理 406 错误](https://supabase.com/docs/guides/api/errors)
- [使用触发器自动化](https://supabase.com/docs/guides/database/webhooks)

## 总结

✅ **问题已解决**：
1. 为所有现有用户创建了 profile 记录
2. 修改代码使用 `maybeSingle()` 避免 406 错误
3. 添加自动创建 profile 的逻辑
4. 提供了长期解决方案（触发器）

现在用户访问 /profile 页面不会再出现 406 错误了！🎉
