# Requirements Document

## Introduction

本规范旨在为 `features/auth` 与 `services/auth` 模块构建系统化的 Vitest 单元测试。核心目标是验证 Supabase 认证服务封装、`useAuth` Hook、认证验证器与路由守卫等关键单元在成功与失败场景下都能产生可预期的响应，确保账号体系的可靠性及产品上线前的回归效率。

## Alignment with Product Vision

认证体验直接影响到平台的留存与安全策略。稳定且可重复的单元测试能够在持续交付中快速捕获回归问题，支撑“开箱即用、可信赖”的产品愿景，让前端团队可以自信地演进认证 UI/UX，而不会破坏现有流程。

## Requirements

### Requirement 1

**User Story:** 作为认证服务的维护开发者，我希望 SupabaseAuthService 的 Vitest 单元测试覆盖所有 API 分支，这样任何依赖服务层的业务在失败时都能收到统一格式的错误并具备正确的数据映射。

#### Acceptance Criteria

1. WHEN Supabase SDK 返回成功响应 THEN 服务 SHALL 将 User/Session 对象转换成 camelCase 的 `AuthUser`/`AuthSession` 并通过 `AuthResult.data` 暴露。
2. IF Supabase SDK 返回业务错误（含 code / status） THEN 服务 SHALL 通过 `mapSupabaseError` 将其分类为系统/业务错误并在 `AuthResult.error` 中提供完整字段。
3. WHEN Supabase SDK 抛出异常（网络、超时、未知） THEN 服务 SHALL 使用 `createSystemError` 包装，并且任何单元测试都需要断言 `isSystemError === true`。

### Requirement 2

**User Story:** 作为前端应用开发者，我希望 `useAuth` Hook 在各种 Mutation / Query 情况下都有详尽的测试，以便我能依赖其 loading、error、toast、副作用行为构建 UI。

#### Acceptance Criteria

1. WHEN `signIn`, `signUp`, `signOut`, `resetPassword`, `updatePassword` Mutation 成功 THEN Hook SHALL 清空 `error`、正确设置 TanStack Query 缓存（如 `setQueryData` 或 `clear`），并触发相应的 toast。
2. IF Mutation 因业务错误失败 THEN Hook SHALL 将 `loading` 复位、`error` 指向 `AuthError`，并跳过系统 toast。
3. WHEN `sessionQuery` fetch 失败或返回空 THEN Hook SHALL 抛弃缓存数据并维持可重试状态（retry=false），测试需模拟 QueryFn 以断言 `loading` 翻转与错误分派。
4. WHEN `initializeSession` 被调用 THEN Hook SHALL 触发一次 `sessionQuery.refetch` 并注册 `authService.onAuthStateChange`，测试需验证回调更新 Query 缓存。

### Requirement 3

**User Story:** 作为 QA 工程师，我希望认证实用工具（validators、authGuard）都有确定性的测试，这样我们能快速定位输入验证或路由保护的回归。

#### Acceptance Criteria

1. WHEN 传入空值、格式错误或短密码 THEN 各验证函数 SHALL 返回指定的本地化错误文案；合法输入 SHALL 返回 `null`。
2. WHEN `validatePasswordMatch` 接收不一致的密码对 THEN SHALL 返回“密码不一致”错误；一致时返回 `null`。
3. IF `authService.getSession` 返回数据或抛异常 THEN `getAuthGuardSession`/`isAuthenticated` SHALL 依据结果返回 `AuthSession | null` 与 boolean，并在异常路径中吞掉错误避免崩溃。

### Requirement 4

**User Story:** 作为团队技术负责人，我希望单元测试能够覆盖未来可扩展的依赖（如多认证实现、TanStack Query 行为配置），从而为后续重构提供安全网。

#### Acceptance Criteria

1. WHEN 我们替换底层服务实现（通过 mock IAuthService） THEN 测试 SHALL 仅依赖接口行为，而不绑定 Supabase 具体类型。
2. IF 新增 Mutation/Query 选项（如 `retry`, `staleTime`） THEN 现有测试 SHALL 捕捉关键配置的意外改动（例如 fallback 至默认 `retry=true`）。
3. WHEN 添加新的 toast 或交互副作用 THEN 测试 SHALL 覆盖对应分支，保证消息系统不重复、不遗漏。

## Non-Functional Requirements

### Code Architecture and Modularity

- 单元测试必须完全基于 Vitest + @vue/test-utils + @tanstack/vue-query 的官方测试工具，禁止访问真实网络。
- 通过自定义 mock（Supabase 客户端、toast、TanStack Query）隔离依赖，确保 IAuthService 实例可替换。
- 测试文件与目标实现同路径存放（例如 `services/auth/__tests__` 或 `*.test.ts`），命名需与被测单元一致。

### Performance

- 整个 auth 测试套件在 CI 中的执行时间应低于 5 秒（pnpm test --filter auth），并支持并行运行。
- 避免使用 `await new Promise(setTimeout)` 等真实计时器，必要时使用 `vi.useFakeTimers()`。

### Security

- 测试中禁止写入真实 Supabase 凭据，所有密钥通过环境 mock 注入。
- 记录错误时不得输出包含 Token 的敏感信息。

### Reliability

- 针对 `features/auth` 与 `services/auth` 的语句覆盖率需 ≥ 85%，并对错误路径（异常、网络失败）提供断言。
- 测试需在 Node 18 + jsdom 环境下稳定运行，杜绝对浏览器专属 API 的真实依赖。

### Usability

- 测试输出需提供清晰描述（`describe`/`it` 文案采用中文+英文的混合描述），使团队成员能迅速了解失败原因。
- 在 README 或贡献文档中补充运行命令示例 `pnpm test auth`, 以便新成员快速上手。
