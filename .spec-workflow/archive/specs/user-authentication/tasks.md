# 实现任务列表

## Phase 1: 基础设施层

- [x] 1. 创建Supabase客户端配置
  - File: src/lib/supabase.ts
  - 创建Supabase客户端实例
  - 配置环境变量（VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY）
  - Purpose: 提供Supabase客户端全局访问点
  - _Requirements: 技术栈对齐 - Supabase Auth_
  - 调用Supabase mcp工具，该工具已经登录，可以直接配置数据库，通过cli执行sql

- [x] 2. 创建全局toast工具
  - File: src/utils/toast.ts
  - 实现toast通知函数（success, error, info, warning）
  - 使用shadcn-vue的Toast组件
  - Purpose: 提供全局toast提示功能（用于系统错误）
  - _Leverage: src/shadcn/components/ui/toast/_
  - _Requirements: 需求7 - 错误处理和用户反馈_

## Phase 2: 服务层（API抽象）

- [x] 3. 定义认证服务接口
  - File: src/services/auth/types.ts
  - 定义AuthUser、AuthSession、AuthError接口（使用camelCase）
  - 定义AuthResult类型
  - 定义IAuthService接口（signUp, signIn, signOut, resetPassword, updatePassword, getSession, onAuthStateChange）
  - Purpose: 建立认证服务抽象接口，实现与后端解耦
  - _Requirements: 所有认证需求（需求1-5）_
  - _Prompt: Role: TypeScript架构师 | Task: 创建认证服务接口定义，使用camelCase命名，确保类型安全和接口抽象 | Restrictions: 所有字段使用camelCase，接口必须完整定义所有认证方法 | Success: 接口定义完整，类型检查通过，支持所有认证场景_

- [x] 4. 实现Supabase认证服务
  - File: src/services/auth/implementations/supabase.ts
  - 实现IAuthService接口
  - 创建错误映射函数（包含isSystemError判断）
  - 创建数据转换函数（Supabase snake_case → 应用camelCase）
  - Purpose: 提供Supabase的具体实现
  - _Leverage: src/lib/supabase.ts_
  - _Requirements: 所有认证需求（需求1-5）_
  - _Prompt: Role: 后端开发工程师，精通Supabase SDK | Task: 实现Supabase认证服务，转换数据格式（snake_case→camelCase），实现错误分类（系统错误vs业务错误） | Restrictions: 必须实现IAuthService接口，错误必须包含isSystemError字段，数据转换使用camelCase | Success: 所有接口方法实现正确，数据转换无误，错误分类准确_

- [x] 5. 导出认证服务实例
  - File: src/services/auth/index.ts
  - 导出authService单例
  - 导出所有类型定义
  - Purpose: 提供服务的统一访问点
  - _Requirements: 所有认证需求_

- [x] 6. 创建全局服务导出
  - File: src/services/index.ts
  - 重新导出authService和类型
  - Purpose: 统一服务层导出
  - _Requirements: 架构原则_

## Phase 3: Auth Feature - 类型定义

- [x] 7. 定义auth feature类型
  - File: src/features/auth/types/index.ts
  - 导出认证相关的本地类型（如表单数据类型）
  - 从服务层重新导出AuthUser、AuthSession等类型
  - Purpose: 为auth feature提供类型定义
  - _Leverage: src/services/auth/types.ts_
  - _Requirements: 需求5 - 表单验证_

## Phase 4: Auth Feature - 工具函数

- [x] 8. 创建表单验证器
  - File: src/features/auth/utils/validators.ts
  - 实现邮箱验证函数
  - 实现密码强度验证函数（最小8字符）
  - 实现密码匹配验证函数
  - Purpose: 提供表单验证逻辑
  - _Requirements: 需求5 - 表单验证_
  - _Prompt: Role: 前端开发工程师，精通表单验证 | Task: 创建表单验证函数（邮箱、密码强度、密码匹配） | Restrictions: 验证函数必须返回清晰错误消息，密码最小8字符 | Success: 验证逻辑正确，错误消息友好_

## Phase 5: 全局状态管理（客户端状态）

- [x] 9. 创建 UI Pinia Store
  - File: src/stores/ui.ts
  - 定义客户端状态（sidebarOpen, theme, language, notifications）
  - 实现客户端状态操作（toggleSidebar, setTheme, setLanguage, addNotification等）
  - 配置持久化（pinia-plugin-persistedstate）
  - Purpose: 管理全局客户端UI状态
  - _Requirements: UI状态管理（主题、侧边栏、语言等）_
  - _Prompt: Role: Vue.js状态管理专家，精通Pinia | Task: 创建UI Store管理客户端状态，配置持久化 | Restrictions: 使用TypeScript，状态使用camelCase，仅管理客户端状态（不管理服务器状态如会话数据），持久化UI相关字段 | Success: Store正确配置，持久化工作正常_

## Phase 6: Auth Feature - Hooks

- [x] 10. 创建useAuth hook
  - File: src/features/auth/hooks/useAuth.ts
  - 集成TanStack Query管理服务器状态（会话数据）
  - 实现认证方法（signUp, signIn, signOut, resetPassword, updatePassword）
  - 实现错误处理逻辑（系统错误→toast，业务错误→返回）
  - 实现会话初始化和持久化（使用Query persist插件）
  - **不依赖auth Pinia store**（会话数据由TanStack Query管理）
  - Purpose: 封装认证逻辑和服务器状态管理
  - _Leverage: src/services/auth/, src/utils/toast.ts_
  - _Requirements: 需求1-4_
  - _Prompt: Role: Vue 3 Composition API专家 | Task: 实现useAuth hook，集成TanStack Query管理会话数据，实现错误分类处理 | Restrictions: 必须使用authService接口，使用TanStack Query管理会话状态（不使用Pinia），错误根据isSystemError分类处理 | Success: Hook方法完整，TanStack Query缓存工作正常，错误处理正确_

## Phase 7: Auth Feature - 组件

- [x] 11. 创建PasswordInput组件
  - File: src/features/auth/components/PasswordInput.vue
  - 实现密码输入框（带显示/隐藏切换）
  - 添加密码强度指示
  - 支持内联错误显示
  - 使用shadcn-vue的Input组件
  - Purpose: 提供可复用的密码输入组件
  - _Leverage: src/shadcn/components/ui/input/, src/shadcn/components/ui/button/_
  - _Requirements: 需求1, 2 - 密码输入和验证_
  - _Prompt: Role: Vue 3组件开发专家 | Task: 创建密码输入组件，支持显示/隐藏切换，使用shadcn-vue组件 | Restrictions: 必须使用shadcn-vue的Input和Button组件，支持v-model，显示内联错误 | Success: 组件功能完整，交互流畅，样式一致_

- [x] 12. 创建AuthForm组件
  - File: src/features/auth/components/AuthForm.vue
  - 实现通用认证表单容器
  - 提供title、description、submitLabel props
  - 提供default和footer slots
  - 支持loading和error状态
  - 使用shadcn-vue的Card组件
  - Purpose: 提供认证表单的通用UI结构
  - _Leverage: src/shadcn/components/ui/card/, src/shadcn/components/ui/button/_
  - _Requirements: 需求7 - 错误处理和用户反馈_
  - _Prompt: Role: Vue 3组件开发专家 | Task: 创建通用认证表单组件，提供props和slots，使用shadcn-vue | Restrictions: 必须使用shadcn-vue组件，支持loading状态，显示内联错误 | Success: 组件可复用，props和slots设计合理_

- [x] 13. 创建AuthLayout组件
  - File: src/features/auth/components/AuthLayout.vue
  - 实现认证页面布局（居中、响应式）
  - 提供title、showLogo props
  - 提供header、default、footer slots
  - 使用shadcn-vue组件
  - Purpose: 为所有认证页面提供统一布局
  - _Leverage: src/shadcn/components/ui/_
  - _Requirements: 需求8 - 响应式设计_
  - _Prompt: Role: Vue 3组件开发专家，精通响应式设计 | Task: 创建认证页面布局，居中显示，响应式设计，使用shadcn-vue | Restrictions: 必须使用flexbox居中，最大宽度448px或512px，支持移动端 | Success: 布局正确，响应式工作正常，样式一致_

## Phase 8: Auth Feature - 视图

- [x] 14. 创建LoginView视图
  - File: src/features/auth/views/LoginView.vue
  - 实现登录表单（email、password、rememberMe）
  - 集成useAuth hook
  - 实现表单验证
  - 实现业务错误内联显示
  - 添加"忘记密码"和"注册"链接
  - 使用AuthLayout和AuthForm
  - Purpose: 用户登录页面
  - _Leverage: src/features/auth/components/AuthLayout.vue, src/features/auth/components/AuthForm.vue, src/features/auth/hooks/useAuth.ts_
  - _Requirements: 需求2 - 用户登录_
  - _Prompt: Role: Vue 3视图开发专家 | Task: 创建登录视图，集成useAuth，实现表单验证，显示业务错误，使用AuthLayout和AuthForm | Restrictions: 必须使用Tanstack Vue Form，错误显示在表单内，系统错误用toast | Success: 登录流程完整，验证正确，错误处理符合规范_

- [x] 15. 创建RegisterView视图
  - File: src/features/auth/views/RegisterView.vue
  - 实现注册表单（email、password、confirmPassword、agreeToTerms）
  - 集成useAuth hook
  - 实现表单验证（密码匹配）
  - 实现业务错误内联显示
  - 添加"已有账号？登录"链接
  - 使用AuthLayout和AuthForm
  - Purpose: 用户注册页面
  - _Leverage: src/features/auth/components/AuthLayout.vue, src/features/auth/components/AuthForm.vue, src/features/auth/hooks/useAuth.ts, src/features/auth/utils/validators.ts_
  - _Requirements: 需求1 - 用户注册_
  - _Prompt: Role: Vue 3视图开发专家 | Task: 创建注册视图，集成useAuth和validators，实现密码确认验证，使用AuthLayout和AuthForm | Restrictions: 必须验证密码匹配，显示业务错误，系统错误用toast | Success: 注册流程完整，验证正确，密码必须匹配_

- [x] 16. 创建ForgotPasswordView视图
  - File: src/features/auth/views/ForgotPasswordView.vue
  - 实现忘记密码表单（email）
  - 集成useAuth hook的resetPassword方法
  - 实现表单验证
  - 显示成功消息
  - 添加"返回登录"链接
  - 使用AuthLayout和AuthForm
  - Purpose: 密码重置请求页面
  - _Leverage: src/features/auth/components/AuthLayout.vue, src/features/auth/components/AuthForm.vue, src/features/auth/hooks/useAuth.ts_
  - _Requirements: 需求3 - 密码重置_
  - _Prompt: Role: Vue 3视图开发专家 | Task: 创建忘记密码视图，集成useAuth.resetPassword，显示成功消息 | Restrictions: 邮箱不存在也显示成功消息（安全最佳实践） | Success: 重置邮件发送成功，用户体验友好_

- [x] 17. 创建UpdatePasswordView视图
  - File: src/features/auth/views/UpdatePasswordView.vue
  - 实现更新密码表单（password、confirmPassword）
  - 集成useAuth hook的updatePassword方法
  - 实现表单验证（密码匹配）
  - 成功后重定向到登录页
  - 使用AuthLayout和AuthForm
  - 使用PasswordInput组件
  - Purpose: 更新密码页面（从邮件链接访问）
  - _Leverage: src/features/auth/components/AuthLayout.vue, src/features/auth/components/AuthForm.vue, src/features/auth/components/PasswordInput.vue, src/features/auth/hooks/useAuth.ts_
  - _Requirements: 需求3 - 密码重置_
  - _Prompt: Role: Vue 3视图开发专家 | Task: 创建更新密码视图，集成useAuth.updatePassword，使用PasswordInput组件 | Restrictions: 必须验证密码匹配，成功后重定向到登录页 | Success: 密码更新成功，重定向正确_

## Phase 8.5: 集成测试和运行

- [x] 17.5. 集成测试和项目运行
  - File: src/main.ts, src/App.vue, index.html
  - 安装必要的依赖（@tanstack/vue-query, @tanstack/vue-form, vue-router, pinia, pinia-plugin-persistedstate等）
  - 配置Vue Query插件和QueryClient
  - 配置Pinia和持久化插件
  - 配置路由器（Vue Router）
  - 创建临时测试入口，展示所有已开发的组件和视图
  - 运行开发服务器，测试功能
  - Purpose: 将已开发的组件集成起来，确保项目能够正常运行，验证组件功能和交互
  - _Requirements: 验证所有已开发的功能（UI组件、表单验证、useAuth hook）_
  - _Prompt: Role: 全栈开发工程师，擅长项目配置和集成 | Task: 配置项目运行环境，安装依赖，创建测试入口，运行项目验证功能 | Restrictions: 必须确保所有依赖正确安装，插件正确配置，能够访问各个页面和组件 | Success: 项目成功运行，所有页面可访问，表单验证正常，UI交互流畅_
  - **具体步骤**:
    1. 安装依赖：`pnpm add @tanstack/vue-query @tanstack/vue-form vue-router pinia pinia-plugin-persistedstate lucide-vue-next reka-ui @vueuse/core`
    2. 配置 src/main.ts：
       - 创建 QueryClient 实例
       - 注册 VueQuery 插件
       - 注册 Pinia
       - 注册 Router
    3. 配置 src/App.vue：添加路由视图和Sonner组件
    4. 创建临时测试路由配置（简单版本的routes.ts）
    5. 创建测试页面展示所有组件
    6. 运行 `pnpm dev` 启动开发服务器
    7. 测试所有页面：登录页、注册页、忘记密码页、更新密码页
    8. 验证表单验证、错误提示、加载状态等
    9. 修复发现的问题

## Phase 9: 路由配置

- [x] 18. 创建auth feature路由导出
  - File: src/features/auth/routes.ts
  - 定义/auth嵌套路由（login, register, forgot-password, update-password）
  - 配置路由meta（requiresGuest, requiresAuth）
  - 使用AuthLayout作为父路由
  - Purpose: 导出auth feature的路由配置
  - _Leverage: src/features/auth/components/AuthLayout.vue, src/features/auth/views/_
  - _Requirements: 需求6 - 导航和路由_
  - _Prompt: Role: Vue Router配置专家 | Task: 创建auth feature路由，嵌套路由配置，使用AuthLayout | Restrictions: 必须使用AuthLayout作为父路由，登录/注册/忘记密码使用requiresGuest，更新密码使用requiresAuth | Success: 路由配置正确，嵌套工作正常_

- [x] 19. 配置全局路由
  - File: src/router/index.ts
  - 导入authRoutes
  - 注册auth路由到全局router
  - 实现路由守卫（requiresAuth, requiresGuest）
  - 实现会话初始化
  - Purpose: 集成auth路由到全局路由系统
  - _Leverage: src/features/auth/routes.ts, src/features/auth/stores/auth.ts, src/features/auth/hooks/useAuth.ts_
  - _Requirements: 需求4, 6 - 会话管理和导航路由_
  - _Prompt: Role: Vue Router专家 | Task: 集成authRoutes，实现路由守卫（requiresAuth重定向到登录，requiresGuest重定向到首页），初始化会话 | Restrictions: 必须在全局前置守卫初始化会话，路由守卫逻辑正确 | Success: 路由守卫工作正常，会话自动恢复，重定向逻辑正确_

## Phase 10: 测试和优化

- [x] 20. 表单验证测试
  - File: tests/features/auth/utils/validators.test.ts
  - 测试邮箱验证（有效、无效格式）
  - 测试密码强度验证（有效、过弱）
  - 测试密码匹配验证（匹配、不匹配）
  - Purpose: 确保表单验证逻辑正确
  - _Leverage: src/features/auth/utils/validators.ts_
  - _Requirements: 需求5 - 表单验证_
  - _Prompt: Role: 测试工程师，精通Vitest | Task: 编写validators单元测试，覆盖所有验证场景 | Restrictions: 必须覆盖成功和失败场景，边界情况 | Success: 测试覆盖率100%，所有验证逻辑正确_

- [x] 21. useAuth hook测试
  - File: tests/features/auth/hooks/useAuth.test.ts
  - Mock authService
  - 测试所有认证方法
  - 测试错误处理（系统错误vs业务错误）
  - 测试与authStore的集成
  - Purpose: 确保useAuth hook功能正确
  - _Leverage: src/features/auth/hooks/useAuth.ts, src/services/auth/_
  - _Requirements: 需求1-4_
  - _Prompt: Role: 测试工程师，精通Vue测试工具 | Task: 编写useAuth hook单元测试，mock所有依赖，测试所有方法 | Restrictions: 必须mock authStore和authService，测试错误分类 | Success: 所有方法测试通过，错误处理逻辑正确_

~~- [ ] 22. 端到端测试 - 登录流程~~
  ~~- File: tests/e2e/auth/login.spec.ts~~
  ~~- 测试完整登录流程~~
  ~~- 测试表单验证~~
  ~~- 测试错误处理~~
  ~~- Purpose: 验证登录功能端到端~~
  ~~_Leverage: Playwright或Cypress_~~
  ~~_Requirements: 需求2 - 用户登录_~~
  ~~**已跳过：项目不需要端到端测试**~~

~~- [ ] 23. 端到端测试 - 注册流程~~
  ~~- File: tests/e2e/auth/register.spec.ts~~
  ~~- 测试完整注册流程~~
  ~~- 测试密码确认验证~~
  ~~- 测试重定向到登录页~~
  ~~- Purpose: 验证注册功能端到端~~
  ~~_Leverage: Playwright或Cypress_~~
  ~~_Requirements: 需求1 - 用户注册_~~
  ~~**已跳过：项目不需要端到端测试**~~

~~- [ ] 24. 端到端测试 - 密码重置流程~~
  ~~- File: tests/e2e/auth/reset-password.spec.ts~~
  ~~- 测试忘记密码流程~~
  ~~- 测试更新密码流程~~
  ~~- 测试使用新密码登录~~
  ~~- Purpose: 验证密码重置功能端到端~~
  ~~_Leverage: Playwright或Cypress_~~
  ~~_Requirements: 需求3 - 密码重置_~~
  ~~**已跳过：项目不需要端到端测试**~~

~~- [ ] 25. 响应式设计测试~~
  ~~- File: tests/e2e/auth/responsive.spec.ts~~
  ~~- 测试移动端布局~~
  ~~- 测试桌面端布局~~
  ~~- 测试触摸目标尺寸~~
  ~~- Purpose: 确保响应式设计符合要求~~
  ~~_Requirements: 需求8 - 响应式设计_~~
  ~~**已跳过：项目不需要端到端测试**~~

## Phase 11: 文档和清理

- [x] 26. 编写组件使用文档
  - File: docs/features/auth/components.md
  - 记录所有组件的props、slots、events
  - 提供使用示例
  - Purpose: 为开发者提供组件使用指南
  - _Requirements: 文档要求_

- [x] 27. 更新README
  - File: README.md（创建）
  - 添加认证功能说明
  - 更新环境变量配置说明
  - 添加开发指南链接
  - Purpose: 更新项目文档
  - _Requirements: 文档要求_
