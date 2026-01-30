# Auth模块 E2E测试说明

## 测试文件结构

```
e2e/auth/
├── auth-flow.spec.ts           # 完整认证流程测试
├── login.spec.ts               # 登录页面测试
├── register.spec.ts            # 注册页面测试
├── forgot-password.spec.ts     # 忘记密码页面测试
├── helpers/
│   └── auth.helpers.ts         # 测试辅助函数
└── fixtures/
    └── auth.fixtures.ts        # 测试fixtures
```

## 测试覆盖范围

### 1. 登录页面 (login.spec.ts)
- ✅ 页面元素显示验证
- ✅ 成功登录流程
- ✅ 表单验证(空邮箱、无效邮箱格式、空密码、密码长度)
- ✅ 错误场景(无效凭证)
- ✅ "记住我"功能
- ✅ 页面导航(跳转到注册/忘记密码)

### 2. 注册页面 (register.spec.ts)
- ✅ 页面元素显示验证
- ✅ 成功注册流程
- ✅ 表单验证(邮箱、密码、确认密码匹配、服务条款)
- ✅ 密码强度指示器
- ✅ 实时密码匹配验证
- ✅ 错误场景(邮箱已存在)
- ✅ 页面导航(跳转到登录)

### 3. 忘记密码页面 (forgot-password.spec.ts)
- ✅ 页面元素显示验证
- ✅ 成功发送重置邮件
- ✅ 成功状态显示
- ✅ 表单验证(邮箱格式)
- ✅ 返回登录和重新发送功能

### 4. 完整认证流程 (auth-flow.spec.ts)
- ✅ 注册 -> 登录 -> 登出完整流程
- ✅ 忘记密码流程
- ✅ 页面间跳转和导航
- ✅ 表单状态保持
- ✅ 键盘操作支持
- ✅ 响应式设计(移动端、平板端)

## 运行测试

### 运行所有auth模块测试
```bash
npm run test:e2e e2e/auth
```

### 运行特定测试文件
```bash
npm run test:e2e e2e/auth/login.spec.ts
npm run test:e2e e2e/auth/register.spec.ts
npm run test:e2e e2e/auth/forgot-password.spec.ts
npm run test:e2e e2e/auth/auth-flow.spec.ts
```

### 运行特定测试用例
```bash
npm run test:e2e e2e/auth/login.spec.ts -g "应该显示登录页面标题和表单"
```

### 调试模式(运行时打开浏览器)
```bash
npm run test:e2e e2e/auth --headed
```

### 查看测试报告
测试运行后会生成HTML报告:
```bash
npm run test:e2e e2e/auth --reporter=html
# 报告位置: playwright-report/index.html
```

## 测试数据

当前使用的测试数据(定义在 `helpers/auth.helpers.ts`):

```typescript
testUsers = {
  valid: {
    email: 'test@example.com',
    password: 'Test123456',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'WrongPassword123',
  },
}
```

**注意**: 部分测试需要数据库中存在对应的测试用户。你可能需要:
1. 创建测试用户种子数据
2. 使用mock数据
3. 在测试前创建用户

## 注意事项

### 1. Supabase配置
测试需要Supabase实例正常运行。确保:
- `.env` 文件中有正确的Supabase配置
- Supabase项目已启动且可访问

### 2. 测试环境
建议在测试环境中运行:
- 使用专用的测试数据库
- 避免在开发/生产数据库上运行测试

### 3. 并发测试
Playwright默认并行运行测试以加快速度。如果遇到问题:
```bash
# 单线程运行
npm run test:e2e e2e/auth --workers=1
```

### 4. 测试失败时
- 查看截图: `test-results/`
- 查看trace: 使用 `npx playwright show-trace trace.zip`
- 查看HTML报告: `playwright-report/index.html`

## 后续改进建议

1. **真实邮件测试**: 集成测试邮箱服务(如Mailtrap)测试真实邮件流程
2. **测试数据清理**: 添加测试后清理逻辑,避免污染数据库
3. **性能测试**: 添加页面加载和响应时间测试
4. **可访问性测试**: 添加axe-core测试可访问性
5. **视觉回归测试**: 使用Percy或Chromatic进行视觉测试

## 测试最佳实践

1. **隔离性**: 每个测试应该独立运行,不依赖其他测试
2. **可重复性**: 测试结果应该一致,不受环境影响
3. **快速性**: 测试应该快速执行
4. **清晰性**: 测试名称和断言应该清晰描述测试意图
5. **维护性**: 使用辅助函数和fixtures减少代码重复
