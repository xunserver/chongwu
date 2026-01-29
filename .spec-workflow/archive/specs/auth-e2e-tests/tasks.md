# 实现任务列表

## Phase 1: 项目初始化和基础设施

- [ ] 1. 创建 E2E 测试目录结构
  - File: tests/e2e/auth/
  - 创建测试目录结构（helpers/, fixtures/）
  - 设置 TypeScript 配置用于测试代码
  - Purpose: 建立清晰的测试代码组织结构
  - _Requirements: Requirement 5_
  - _Prompt: 实现 E2E 测试的目录结构，创建 tests/e2e/auth/ 目录，包含 helpers/ 和 fixtures/ 子目录，配置 tsconfig.json 用于测试代码编译_

- [ ] 2. 创建测试配置文件
  - File: tests/fixtures/auth-config.ts
  - 定义测试配置接口（baseUrl, timeout, screenshotOnFailure 等）
  - 从 .env.test 加载测试环境配置
  - Purpose: 集中管理测试配置，支持不同环境
  - _Leverage: .env.example_
  - _Requirements: Requirement 5 (Usability)_
  - _Prompt: Role: 配置工程师 | Task: 创建测试配置文件 auth-config.ts，定义 TestConfig 接口包含 baseUrl, timeout, screenshotOnFailure, cleanupTestData 等配置项，从 .env.test 文件加载 Supabase 测试环境凭据 | Restrictions: 配置必须包含错误处理，提供默认值，不暴露敏感信息 | Success: 配置文件能正确加载环境变量，提供类型安全的配置对象_

## Phase 2: 辅助函数和工具

- [ ] 3. 实现元素选择器常量
  - File: tests/e2e/auth/helpers/selectors.ts
  - 定义所有测试用到的选择器（emailInput, passwordInput, submitButton 等）
  - 使用 data-testid 属性与前端组件对应
  - Purpose: 集中管理选择器，便于维护
  - _Leverage: src/features/auth/views/_
  - _Requirements: Requirement 1-4_
  - _Prompt: Role: 前端测试工程师 | Task: 创建 selectors.ts 文件，定义 AuthSelectors 接口包含所有认证页面的元素选择器（邮箱输入框、密码输入框、提交按钮、错误消息等），使用 data-testid 属性名 | Restrictions: 选择器名称清晰描述，与前端组件对应，易于理解和维护 | Success: 所有认证页面的关键元素都有对应的选择器常量_

- [ ] 4. 实现测试数据管理器
  - File: tests/e2e/auth/helpers/test-data.ts
  - 实现生成唯一测试邮箱的方法（使用时间戳）
  - 定义预定义测试数据（有效/无效邮箱、有效/短密码）
  - 实现清理测试用户的方法（使用 Supabase admin API）
  - Purpose: 管理测试数据，确保测试隔离和数据清理
  - _Leverage: @supabase/supabase-js_
  - _Requirements: Requirement 5 (Reliability), Security_
  - _Prompt: Role: 测试数据工程师 | Task: 实现 TestDataManager 类，包含 generateUniqueEmail() 方法生成唯一邮箱，定义预定义测试数据（validEmail, invalidEmail, validPassword, shortPassword），实现 cleanupTestUser() 方法使用 Supabase admin API 删除测试用户 | Restrictions: 生成的邮箱必须唯一，清理操作使用 admin API 确保权限，处理清理失败的情况 | Success: 每次测试获得唯一邮箱，测试后能正确清理测试数据_

- [ ] 5. 实现 Chrome MCP 封装
  - File: tests/e2e/auth/helpers/browser.ts
  - 封装 Chrome MCP API，实现 BrowserHelper 接口
  - 实现页面导航、元素查找、交互操作等方法
  - 添加等待和超时处理机制
  - 实现截图功能用于错误记录
  - Purpose: 提供统一的浏览器操作接口，抽象 Chrome MCP 细节
  - _Leverage: Chrome MCP tools_
  - _Requirements: Requirement 5 (Reliability)_
  - _Prompt: Role: 浏览器自动化工程师 | Task: 实现 BrowserHelper 类封装 Chrome MCP，提供 navigateTo(), findElement(), click(), fillInput(), waitForElement(), screenshot() 等方法，添加超时处理（默认 5 秒，最长 10 秒）和错误重试机制 | Restrictions: 方法必须处理超时和元素未找到错误，失败时提供清晰的错误信息，支持自动截图 | Success: 所有浏览器操作都能通过简洁的 API 调用，错误时有详细的诊断信息_

## Phase 3: 页面对象

- [ ] 6. 实现 LoginPage 页面对象
  - File: tests/e2e/auth/helpers/page-objects.ts
  - 实现 LoginPage 类封装登录页面的所有操作
  - 提供方法：visit(), fillEmail(), fillPassword(), submit(), login()
  - 提供状态查询：getErrorMessage(), isLoading(), isRedirected()
  - Purpose: 封装登录页面交互，提高测试可读性和可维护性
  - _Leverage: tests/e2e/auth/helpers/browser.ts, tests/e2e/auth/helpers/selectors.ts_
  - _Requirements: Requirement 1_
  - _Prompt: Role: 页面对象模型专家 | Task: 实现 LoginPage 类，包含 visit() 导航到登录页，fillEmail()/fillPassword() 填写表单，submit() 提交表单，login() 完整登录流程，getErrorMessage() 获取错误消息，isLoading() 检查加载状态 | Restrictions: 方法必须等待元素可见后再操作，提供清晰的错误消息，复用 BrowserHelper 和 selectors | Success: LoginPage 能完整封装登录页的所有操作，测试代码简洁易读_

- [ ] 7. 实现 RegisterPage 页面对象
  - File: tests/e2e/auth/helpers/page-objects.ts (继续)
  - 实现 RegisterPage 类封装注册页面的所有操作
  - 提供方法：visit(), fillEmail(), fillPassword(), fillConfirmPassword(), agreeTerms(), submit(), register()
  - 提供状态查询：getErrorMessage(), getFieldError(), isRedirectedToLogin()
  - Purpose: 封装注册页面交互，支持注册流程测试
  - _Leverage: tests/e2e/auth/helpers/browser.ts, tests/e2e/auth/helpers/selectors.ts_
  - _Requirements: Requirement 2_
  - _Prompt: Role: 页面对象模型专家 | Task: 实现 RegisterPage 类，包含 visit() 导航到注册页，fillEmail()/fillPassword()/fillConfirmPassword() 填写表单，agreeTerms() 勾选服务条款，submit() 提交表单，register() 完整注册流程，getFieldError() 获取字段级错误 | Restrictions: 必须处理服务条款复选框，确认密码字段需要实时验证，提供字段级错误查询 | Success: RegisterPage 能完整封装注册页的所有操作，支持密码不一致等验证测试_

- [ ] 8. 实现 ForgotPasswordPage 页面对象
  - File: tests/e2e/auth/helpers/page-objects.ts (继续)
  - 实现 ForgotPasswordPage 类封装忘记密码页面的所有操作
  - 提供方法：visit(), fillEmail(), submit(), returnToLogin(), resend()
  - 提供状态查询：getErrorMessage(), getSuccessMessage(), isSuccessState()
  - Purpose: 封装忘记密码页面交互，支持密码重置流程测试
  - _Leverage: tests/e2e/auth/helpers/browser.ts, tests/e2e/auth/helpers/selectors.ts_
  - _Requirements: Requirement 3_
  - _Prompt: Role: 页面对象模型专家 | Task: 实现 ForgotPasswordPage 类，包含 visit() 导航到忘记密码页，fillEmail() 填写邮箱，submit() 提交表单，returnToLogin() 返回登录，resend() 重新发送邮件，getSuccessMessage() 获取成功消息 | Restrictions: 必须处理成功状态切换（表单 → 成功消息），支持返回登录和重新发送操作 | Success: ForgotPasswordPage 能完整封装密码重置流程，包括成功状态和后续操作_

## Phase 4: 测试套件 - 登录功能

- [ ] 9. 实现登录页面显示测试
  - File: tests/e2e/auth/login.spec.ts
  - 测试：访问登录页面时应显示邮箱输入框、密码输入框和登录按钮
  - 使用 LoginPage.visit() 导航到登录页
  - 验证所有元素存在且可见
  - Purpose: 验证登录页面的基本显示
  - _Leverage: tests/e2e/auth/helpers/page-objects.ts (LoginPage)_
  - _Requirements: Requirement 1.1_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例 "应显示登录表单元素"，使用 LoginPage.visit() 导航到登录页，验证邮箱输入框、密码输入框、登录按钮都存在且可见 | Restrictions: 使用页面对象方法，不直接操作 DOM，失败时截图 | Success: 测试验证登录页面的所有核心元素都正确显示_

- [ ] 10. 实现成功登录测试
  - File: tests/e2e/auth/login.spec.ts (继续)
  - 测试：输入有效邮箱和密码并点击登录按钮，应显示登录成功状态
  - 预先创建测试账号
  - 使用 LoginPage.login() 完成登录流程
  - 验证登录成功后的状态或重定向
  - Purpose: 验证登录功能正常工作
  - _Leverage: tests/e2e/auth/helpers/test-data.ts (TestDataManager), tests/e2e/auth/helpers/page-objects.ts (LoginPage)_
  - _Requirements: Requirement 1.2, Requirement 1.4_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例 "有效凭据应成功登录"，使用 TestDataManager 创建测试账号，使用 LoginPage.login() 填写有效凭据并提交，验证登录成功（跳转到首页或显示用户信息） | Restrictions: 测试前必须创建账号，测试后清理账号，验证登录成功的多种表现（重定向、UI 变化） | Success: 测试成功完成登录流程，验证登录后的状态变化_

- [ ] 11. 实现无效凭据错误提示测试
  - File: tests/e2e/auth/login.spec.ts (继续)
  - 测试：输入无效凭据（错误的邮箱或密码）应显示错误提示
  - 使用不存在的账号或错误的密码
  - 验证错误消息正确显示
  - Purpose: 验证登录失败时的错误处理
  - _Leverage: tests/e2e/auth/helpers/page-objects.ts (LoginPage)_
  - _Requirements: Requirement 1.3_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例 "无效凭据应显示错误提示"，使用 LoginPage.login() 填写不存在的账号或错误密码，使用 getErrorMessage() 验证错误消息显示 | Restrictions: 错误消息应清晰描述问题（如"邮箱或密码错误"），测试失败时截图 | Success: 测试验证无效凭据时正确显示错误消息_

- [ ] 12. 实现表单验证测试
  - File: tests/e2e/auth/login.spec.ts (继续)
  - 测试：未填写必填字段时应显示验证错误提示
  - 测试场景：空邮箱、空密码、无效邮箱格式
  - 验证字段级验证错误正确显示
  - Purpose: 验证前端表单验证规则
  - _Leverage: tests/e2e/auth/helpers/page-objects.ts (LoginPage), tests/e2e/auth/helpers/test-data.ts_
  - _Requirements: Requirement 1.5, Requirement 4.1_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例 "表单验证应显示错误提示"，测试场景：1) 空邮箱提交 2) 空密码提交 3) 无效邮箱格式（test@example.com 为有效，test 为无效），验证字段级错误消息 | Restrictions: 每个验证规则独立测试，使用 TestDataManager 的预定义无效数据 | Success: 所有表单验证规则都能正确触发并显示错误消息_

## Phase 5: 测试套件 - 注册功能

- [ ] 13. 实现注册页面显示测试
  - File: tests/e2e/auth/register.spec.ts
  - 测试：访问注册页面时应显示所有必需字段和服务条款复选框
  - 使用 RegisterPage.visit() 导航到注册页
  - 验证邮箱、密码、确认密码输入框和服务条款复选框存在
  - Purpose: 验证注册页面的基本显示
  - _Leverage: tests/e2e/auth/helpers/page-objects.ts (RegisterPage)_
  - _Requirements: Requirement 2.1_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例 "应显示注册表单元素"，使用 RegisterPage.visit() 导航到注册页，验证邮箱、密码、确认密码输入框和服务条款复选框都存在 | Restrictions: 使用页面对象方法，验证所有必需字段 | Success: 测试验证注册页面的所有核心元素都正确显示_

- [ ] 14. 实现成功注册测试
  - File: tests/e2e/auth/register.spec.ts (继续)
  - 测试：填写所有必填字段并勾选服务条款应成功注册
  - 使用 RegisterPage.register() 完成注册流程
  - 验证注册成功后自动跳转到登录页
  - Purpose: 验证注册功能正常工作
  - _Leverage: tests/e2e/auth/helpers/test-data.ts (TestDataManager), tests/e2e/auth/helpers/page-objects.ts (RegisterPage)_
  - _Requirements: Requirement 2.2, Requirement 2.6_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例 "完整填写表单应成功注册"，使用 TestDataManager.generateUniqueEmail() 生成唯一邮箱，使用 RegisterPage.register() 填写有效邮箱、密码（8+ 字符）、确认密码、勾选服务条款，验证跳转到登录页 | Restrictions: 邮箱必须唯一，测试后清理注册的账号 | Success: 测试成功完成注册流程，验证跳转到登录页_

- [ ] 15. 实现密码不一致验证测试
  - File: tests/e2e/auth/register.spec.ts (继续)
  - 测试：两次输入的密码不一致时应实时显示错误提示
  - 填写不同的密码和确认密码
  - 验证"密码不一致"错误消息实时显示
  - Purpose: 验证密码匹配验证规则
  - _Leverage: tests/e2e/auth/helpers/page-objects.ts (RegisterPage)_
  - _Requirements: Requirement 2.3_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例 "密码不一致应显示错误"，使用 RegisterPage 填写密码为 "password123"，确认密码为 "password456"，验证确认密码字段显示"两次输入的密码不一致"错误 | Restrictions: 测试实时验证（onChange），错误应在输入后立即显示 | Success: 测试验证密码不一致时立即显示错误消息_

- [ ] 16. 实现密码长度验证测试
  - File: tests/e2e/auth/register.spec.ts (继续)
  - 测试：密码少于 8 个字符时应显示"密码至少需要 8 个字符"错误
  - 填写短密码（如 "1234567"）
  - 验证密码长度验证错误正确显示
  - Purpose: 验证密码长度验证规则
  - _Leverage: tests/e2e/auth/helpers/page-objects.ts (RegisterPage), tests/e2e/auth/helpers/test-data.ts_
  - _Requirements: Requirement 2.4_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例 "密码过短应显示错误"，使用 TestDataManager.shortPassword（少于 8 字符），使用 RegisterPage 填写短密码，验证密码字段显示"密码至少需要 8 个字符"错误 | Restrictions: 使用预定义的短密码测试数据，验证字段级错误 | Success: 测试验证密码长度不足时正确显示错误消息_

- [ ] 17. 实现服务条款验证测试
  - File: tests/e2e/auth/register.spec.ts (继续)
  - 测试：未勾选服务条款时应显示"请同意服务条款和隐私政策"错误
  - 填写所有字段但不勾选服务条款
  - 提交表单并验证错误消息
  - Purpose: 验证服务条款同意验证
  - _Leverage: tests/e2e/auth/helpers/page-objects.ts (RegisterPage)_
  - _Requirements: Requirement 2.5_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例 "未勾选服务条款应显示错误"，使用 RegisterPage 填写所有字段但不调用 agreeTerms()，提交表单，验证显示"请同意服务条款和隐私政策"错误 | Restrictions: 测试表单级验证（onSubmit），错误在提交时显示 | Success: 测试验证未勾选服务条款时正确显示错误消息_

## Phase 6: 测试套件 - 密码重置功能

- [ ] 18. 实现忘记密码页面显示测试
  - File: tests/e2e/auth/forgot-password.spec.ts
  - 测试：访问忘记密码页面时应显示邮箱输入框和发送重置邮件按钮
  - 使用 ForgotPasswordPage.visit() 导航到忘记密码页
  - 验证邮箱输入框和提交按钮存在
  - Purpose: 验证忘记密码页面的基本显示
  - _Leverage: tests/e2e/auth/helpers/page-objects.ts (ForgotPasswordPage)_
  - _Requirements: Requirement 3.1_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例 "应显示忘记密码表单元素"，使用 ForgotPasswordPage.visit() 导航到忘记密码页，验证邮箱输入框和"发送重置邮件"按钮都存在 | Restrictions: 使用页面对象方法 | Success: 测试验证忘记密码页面的核心元素都正确显示_

- [ ] 19. 实现发送重置邮件成功测试
  - File: tests/e2e/auth/forgot-password.spec.ts (继续)
  - 测试：输入邮箱并提交应显示"邮件已发送"成功消息
  - 使用 ForgotPasswordPage.submit() 提交邮箱
  - 验证成功消息和状态切换
  - Purpose: 验证密码重置请求功能
  - _Leverage: tests/e2e/auth/helpers/page-objects.ts (ForgotPasswordPage), tests/e2e/auth/helpers/test-data.ts_
  - _Requirements: Requirement 3.2_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例 "提交邮箱应显示成功消息"，使用 TestDataManager.generateUniqueEmail() 生成邮箱，使用 ForgotPasswordPage.submit() 提交，验证显示"邮件已发送"成功消息，验证成功状态（isSuccessState() 返回 true） | Restrictions: 验证状态从表单切换到成功消息 | Success: 测试验证密码重置请求成功，显示成功消息_

- [ ] 20. 实现无效邮箱格式验证测试
  - File: tests/e2e/auth/forgot-password.spec.ts (继续)
  - 测试：输入无效邮箱格式时应显示验证错误
  - 填写无效邮箱（如 "test"）
  - 验证邮箱格式验证错误
  - Purpose: 验证忘记密码页的邮箱验证
  - _Leverage: tests/e2e/auth/helpers/page-objects.ts (ForgotPasswordPage), tests/e2e/auth/helpers/test-data.ts_
  - _Requirements: Requirement 3.3_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例 "无效邮箱应显示错误"，使用 TestDataManager.invalidEmail，使用 ForgotPasswordPage.fillEmail() 填写无效邮箱，验证显示"请输入有效的邮箱地址"错误 | Restrictions: 测试字段级验证，使用预定义无效数据 | Success: 测试验证无效邮箱格式时正确显示错误消息_

- [ ] 21. 实现成功状态操作测试
  - File: tests/e2e/auth/forgot-password.spec.ts (继续)
  - 测试：发送成功后应提供"返回登录"和"重新发送"按钮
  - 先提交邮箱进入成功状态
  - 验证"返回登录"和"重新发送"按钮存在
  - 测试点击"返回登录"跳转到登录页
  - Purpose: 验证密码重置成功后的后续操作
  - _Leverage: tests/e2e/auth/helpers/page-objects.ts (ForgotPasswordPage, LoginPage)_
  - _Requirements: Requirement 3.4_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例 "成功状态应提供操作按钮"，使用 ForgotPasswordPage 进入成功状态，验证"返回登录"和"重新发送"按钮存在，测试 returnToLogin() 跳转到登录页 | Restrictions: 验证两个按钮都存在且可点击 | Success: 测试验证成功状态提供正确的操作选项，返回登录功能正常_

## Phase 7: 测试套件 - 表单验证

- [ ] 22. 实现登录页邮箱格式验证测试
  - File: tests/e2e/auth/form-validation.spec.ts
  - 测试：登录页输入无效邮箱格式（如 test）应显示"请输入有效的邮箱地址"
  - 测试：输入有效邮箱格式（如 test@example.com）不应显示邮箱格式错误
  - Purpose: 验证登录页的邮箱格式验证
  - _Leverage: tests/e2e/auth/helpers/page-objects.ts (LoginPage), tests/e2e/auth/helpers/test-data.ts_
  - _Requirements: Requirement 4.1, Requirement 4.2_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例验证登录页邮箱格式验证：1) 输入 "test" 应显示"请输入有效的邮箱地址" 2) 输入 "test@example.com" 不应显示邮箱格式错误 | Restrictions: 测试正反两种场景，使用预定义的测试数据 | Success: 测试验证邮箱格式验证规则正确工作_

- [ ] 23. 实现注册页密码验证测试
  - File: tests/e2e/auth/form-validation.spec.ts (继续)
  - 测试：注册页输入有效邮箱但密码过短应显示密码长度验证错误
  - 测试：注册页输入匹配的密码不应显示密码不一致错误
  - Purpose: 验证注册页的密码验证规则
  - _Leverage: tests/e2e/auth/helpers/page-objects.ts (RegisterPage), tests/e2e/auth/helpers/test-data.ts_
  - _Requirements: Requirement 4.3, Requirement 4.4_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例验证注册页密码验证：1) 有效邮箱 + 短密码应显示密码长度错误 2) 有效邮箱 + 匹配密码不应显示密码不一致错误 | Restrictions: 测试密码长度和密码匹配两个验证规则 | Success: 测试验证密码验证规则正确工作，互不干扰_

- [ ] 24. 实现忘记密码页空邮箱验证测试
  - File: tests/e2e/auth/form-validation.spec.ts (继续)
  - 测试：忘记密码页输入空邮箱应显示"邮箱不能为空"错误
  - Purpose: 验证忘记密码页的必填字段验证
  - _Leverage: tests/e2e/auth/helpers/page-objects.ts (ForgotPasswordPage)_
  - _Requirements: Requirement 4.5_
  - _Prompt: Role: E2E 测试工程师 | Task: 编写测试用例 "空邮箱应显示错误"，使用 ForgotPasswordPage.fillEmail() 填写空字符串，提交表单，验证显示"邮箱不能为空"错误 | Restrictions: 测试必填字段验证 | Success: 测试验证空邮箱时正确显示错误消息_

## Phase 8: 测试运行器和报告

- [ ] 25. 实现测试运行器
  - File: tests/e2e/runner.ts
  - 实现 TestRunner 类，支持测试套件注册和执行
  - 实现测试生命周期钩子（beforeAll, afterAll, beforeEach, afterEach）
  - 支持超时控制和错误捕获
  - Purpose: 提供测试执行引擎，管理测试生命周期
  - _Leverage: tests/e2e/auth/helpers/browser.ts_
  - _Requirements: Requirement 5 (Reliability)_
  - _Prompt: Role: 测试框架工程师 | Task: 实现 TestRunner 类，包含 registerSuite() 注册测试套件，run() 运行所有测试，实现生命周期钩子 beforeAll（初始化浏览器）、afterAll（关闭浏览器）、beforeEach（清理状态）、afterEach（截图和清理），支持测试超时（默认 30 秒） | Restrictions: 每个测试独立运行，测试失败不中断整个套件，捕获并记录所有错误 | Success: 测试运行器能正确执行测试套件，提供生命周期管理和错误处理_

- [ ] 26. 实现测试报告生成器
  - File: tests/e2e/reporter.ts
  - 实现 TestReporter 类，记录测试执行过程
  - 提供实时进度反馈（控制台输出）
  - 生成测试结果摘要（通过/失败数量、耗时）
  - 失败测试记录错误信息和截图路径
  - Purpose: 生成清晰的测试报告，便于问题诊断
  - _Requirements: Requirement 5.1, Requirement 5.2, Requirement 5.3, Requirement 5.4_
  - _Prompt: Role: 测试报告工程师 | Task: 实现 TestReporter 类，包含 onTestStart(), onTestPass(), onTestFail() 方法记录测试过程，generateReport() 生成最终摘要，提供实时控制台输出（使用 ✓ 和 ✗ 符号），失败时显示错误信息和截图路径 | Restrictions: 报告格式清晰易读，包含测试名称、状态、耗时、失败信息 | Success: 测试报告清晰展示所有测试结果，失败测试包含详细的错误信息_

- [ ] 27. 实现主测试入口文件
  - File: tests/e2e/index.ts
  - 导入所有测试套件
  - 初始化测试配置
  - 创建 TestRunner 实例并注册所有测试套件
  - 运行测试并生成报告
  - 添加命令行脚本支持（package.json）
  - Purpose: 提供统一的测试入口，支持运行所有 E2E 测试
  - _Leverage: tests/e2e/runner.ts, tests/e2e/auth/*.spec.ts_
  - _Requirements: Requirement 5 (Usability)_
  - _Prompt: Role: 测试框架工程师 | Task: 创建测试入口文件 index.ts，导入所有测试套件（login, register, forgot-password, form-validation），初始化 TestConfig，创建 TestRunner 并注册套件，调用 run() 执行测试，在 package.json 添加 "test:e2e" 脚本 | Restrictions: 支持运行所有测试或特定测试套件，测试失败时返回非零退出码 | Success: 可以通过 `pnpm test:e2e` 运行所有 E2E 测试，生成完整报告_

## Phase 9: 前端组件 data-testid 属性添加

- [ ] 28. 为认证组件添加 data-testid 属性
  - File: src/features/auth/components/AuthForm.vue, src/features/auth/views/*.vue
  - 为关键元素添加 data-testid 属性（email, password, submit-button, auth-error, loading 等）
  - 确保选择器与 tests/e2e/auth/helpers/selectors.ts 对应
  - Purpose: 提供 E2E 测试的可靠选择器，不依赖样式或文案
  - _Leverage: tests/e2e/auth/helpers/selectors.ts_
  - _Requirements: Requirement 1-4_
  - _Prompt: Role: 前端开发工程师 | Task: 为认证相关组件添加 data-testid 属性，包括：邮箱输入框（data-testid="email"）、密码输入框（data-testid="password"）、提交按钮（data-testid="submit-button"）、错误消息（data-testid="auth-error"）、加载指示器（data-testid="loading"） | Restrictions: data-testid 名称与 selectors.ts 对应，不影响组件样式和行为 | Success: 所有 E2E 测试需要的关键元素都有 data-testid 属性_

## Phase 10: 集成测试和验证

- [ ] 29. 创建 .env.test 文件
  - File: .env.test
  - 配置测试环境 Supabase URL 和密钥
  - 添加测试配置选项（BASE_URL, TIMEOUT, SCREENSHOT_ON_FAILURE）
  - Purpose: 提供测试环境的配置，不污染开发环境
  - _Leverage: .env.example_
  - _Requirements: Security_
  - _Prompt: 创建 .env.test 文件，添加 VITE_SUPABASE_URL（测试环境）、VITE_SUPABASE_ANON_KEY（测试环境）、VITE_SUPABASE_SERVICE_KEY（用于清理测试数据）、E2E_BASE_URL（默认 http://localhost:5173）、E2E_TIMEOUT（默认 30000）、E2E_SCREENSHOT_ON_FAILURE（默认 true） | Restrictions: 使用测试环境的 Supabase 项目，不提交到版本控制（添加到 .gitignore） | Success: 测试配置完整，支持独立测试环境_

- [ ] 30. 手动执行完整 E2E 测试套件
  - File: tests/e2e/
  - 启动开发服务器（pnpm dev）
  - 运行所有 E2E 测试（pnpm test:e2e）
  - 验证所有测试通过
  - Purpose: 端到端验证 E2E 测试实现
  - _Leverage: 所有测试文件_
  - _Requirements: All_
  - _Prompt: Role: QA 工程师 | Task: 执行完整的 E2E 测试套件，验证所有测试场景：1) 启动开发服务器 2) 运行 `pnpm test:e2e` 3) 检查测试结果 4) 如果有失败，查看错误消息和截图 5) 修复问题后重新测试 | Restrictions: 确保开发服务器运行在正确端口，测试前数据库可用，测试后验证数据清理 | Success: 所有 E2E 测试通过，测试报告显示清晰的通过/失败统计_

- [ ] 31. 性能验证和优化
  - File: tests/e2e/
  - 测量单个测试用例执行时间（应 < 30 秒）
  - 测量完整测试套件执行时间（应 < 5 分钟）
  - 优化慢速测试（添加更精确的等待、减少不必要的操作）
  - Purpose: 确保测试执行性能符合要求
  - _Requirements: Requirement 5 (Performance)_
  - _Prompt: Role: 性能测试工程师 | Task: 测量 E2E 测试性能，运行完整测试套件并记录每个测试的耗时，识别超过 30 秒的测试用例，优化等待策略（使用更精确的 waitForElement 而不是固定延迟），减少不必要的操作 | Restrictions: 优化不应影响测试稳定性，保持清晰的测试逻辑 | Success: 所有单个测试 < 30 秒，完整测试套件 < 5 分钟_

- [ ] 32. 编写 E2E 测试文档
  - File: tests/e2e/README.md
  - 说明如何运行 E2E 测试
  - 列出所有测试套件和测试用例
  - 说明测试前提条件（开发服务器、测试环境）
  - 说明如何添加新的测试用例
  - Purpose: 提供清晰的使用文档，便于团队使用和扩展
  - _Requirements: Requirement 5 (Usability)_
  - _Prompt: Role: 技术文档工程师 | Task: 编写 E2E 测试 README.md，包含：环境要求（Node.js, pnpm）、前置准备（启动开发服务器、配置 .env.test）、运行测试（`pnpm test:e2e`）、测试套件说明（login, register, forgot-password, form-validation）、添加新测试的指南 | Restrictions: 文档清晰简洁，包含示例命令，说明常见问题和解决方法 | Success: 文档完整，团队成员可以根据文档独立运行和编写 E2E 测试_
