# Profiles表数据库配置完成

## ✅ 已完成的配置

### 1. 表结构
- ✅ 创建 `profiles` 表，包含13个字段
- ✅ 主键：`id` (UUID，关联 auth.users)
- ✅ 所有字段都设置了中文注释

### 2. 索引（遵循查询性能最佳实践）
- ✅ `profiles_pkey` - 主键索引（id）
- ✅ `profiles_email_idx` - 邮箱索引（提高登录查询性能）
- ✅ `profiles_nickname_idx` - 昵称索引（提高搜索性能）
- ✅ `profiles_province_city_idx` - 复合索引（提高地区查询性能）

### 3. 行级安全策略（RLS）
- ✅ 启用 RLS
- ✅ `Users can view own profile` - 用户只能查看自己的资料
- ✅ `Users can insert own profile` - 用户只能插入自己的资料
- ✅ `Users can update own profile` - 用户只能更新自己的资料
- ✅ `Users can delete own profile` - 用户只能删除自己的资料

### 4. 触发器
- ✅ `update_profiles_updated_at` - 自动更新 `updated_at` 字段

### 5. 安全加固
- ✅ 修复函数 `search_path` 安全问题
- ✅ 设置 `SECURITY DEFINER` 权限
- ✅ 创建 `handle_new_user()` 函数（用于自动创建profile）

## 📊 表字段详情

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | uuid | ✅ | - | 用户ID（关联auth.users） |
| nickname | text | ✅ | - | 用户昵称 |
| avatar | text | ✅ | 'avatar-1' | 头像ID |
| gender | text | ✅ | - | 性别（male/female/secret） |
| birthday | date | ✅ | - | 生日 |
| bio | text | ✅ | - | 个人简介（≤200字） |
| email | text | ✅ | - | 邮箱地址 |
| province | text | ✅ | - | 省份代码 |
| city | text | ✅ | - | 城市代码 |
| district | text | ✅ | - | 区县代码 |
| detailed_address | text | ✅ | - | 详细地址 |
| created_at | timestamptz | ✅ | now() | 创建时间 |
| updated_at | timestamptz | ✅ | now() | 更新时间 |

## 🔒 约束和检查

- ✅ `gender` 字段：只能为 male/female/secret
- ✅ `bio` 字段：最多200个字符
- ✅ `id` 外键：关联 auth.users(id)，级联删除

## ⚠️ 需要手动完成的步骤

### 1. 在 Supabase Dashboard 中创建触发器

由于需要修改 `auth` schema，请在 Supabase Dashboard 的 SQL 编辑器中执行：

```sql
-- 创建触发器：新用户注册时自动创建 profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**访问路径**：Supabase Dashboard → SQL Editor → 粘贴上述SQL → Run

### 2. 验证触发器

注册一个新用户，检查是否自动创建了对应的 profile 记录：

```sql
SELECT * FROM profiles WHERE id = '<新用户的user_id>';
```

## 📝 测试SQL

### 测试插入数据
```sql
INSERT INTO profiles (id, email, nickname, avatar, gender, birthday, bio, province, city, district, detailed_address)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  '测试用户',
  'avatar-1',
  'secret',
  '2000-01-01',
  '这是一个测试用户',
  '110000',
  '110100',
  '110101',
  '北京市东城区某街道123号'
);
```

### 测试查询
```sql
-- 查询所有 profiles（只能看到自己的）
SELECT * FROM profiles;

-- 按地区查询
SELECT * FROM profiles WHERE province = '110000' AND city = '110100';

-- 搜索昵称
SELECT * FROM profiles WHERE nickname LIKE '%测试%';
```

### 测试更新
```sql
UPDATE profiles
SET nickname = '新昵称', bio = '更新后的简介'
WHERE id = '<your_user_id>';
```

## 🎯 性能优化说明

1. **索引策略**：为常用查询字段（email、nickname、province+city）创建索引
2. **复合索引**：`profiles_province_city_idx` 支持地区查询优化
3. **RLS性能**：使用 `auth.uid() = id` 快速过滤，避免全表扫描
4. **触发器优化**：`updated_at` 自动更新，避免应用层处理

## 📚 相关文档

- [Supabase RLS最佳实践](https://supabase.com/docs/guides/auth/row-level-security)
- [Postgres性能优化](https://supabase.com/docs/guides/database/postgres/optimization)
- [数据库安全](https://supabase.com/docs/guides/database/database-linter)

## ✨ 下一步

1. ✅ 数据库表创建完成
2. ✅ 索引和RLS配置完成
3. ⏳ 在Dashboard中创建auth触发器
4. ⏳ 测试用户注册流程
5. ⏳ 添加头像图片资源
