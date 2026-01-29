# Requirements Document

## Introduction

修复登录页邮箱验证功能的 bug。当前实现在用户输入**正确**的邮箱格式时，错误地提示"邮箱格式不正确"。这导致用户无法成功提交登录表单，严重影响了用户体验和系统的可用性。

## Alignment with Product Vision

本项目旨在提供流畅、可靠的用户认证体验。登录是用户访问系统的核心入口，必须确保表单验证准确无误，避免用户因技术问题而无法正常使用系统。

## Requirements

### Requirement 1: 修复邮箱验证逻辑错误

**User Story:** 作为一个用户，我希望当我输入正确的邮箱格式时，系统能够识别并允许我继续填写，以便我能顺利登录。

#### Acceptance Criteria

1. WHEN 用户输入有效的邮箱格式（如 test@example.com）THEN 系统 SHALL 不显示"邮箱格式不正确"错误提示
2. WHEN 用户输入无效的邮箱格式（如 test、test@、@example.com）THEN 系统 SHALL 显示"邮箱格式不正确"错误提示
3. WHEN 邮箱字段为空 THEN 系统 SHALL 显示"邮箱不能为空"错误提示
4. IF 用户输入的邮箱包含前后空格 THEN 系统 SHALL 自动去除空格后再验证

### Requirement 2: 确保验证器一致性

**User Story:** 作为一个开发者，我希望所有使用 `validators.email()` 的地方都能正确工作，以便保持代码的一致性和可维护性。

#### Acceptance Criteria

1. WHEN LoginView 调用 `validators.email()` THEN 系统 SHALL 正确处理返回的 `string | null` 类型
2. WHEN 验证器返回 `null`（验证通过）THEN 系统 SHALL 不显示任何错误
3. WHEN 验证器返回字符串（错误消息）THEN 系统 SHALL 显示该错误消息
4. IF 其他视图也使用了相同的验证模式 THEN 系统 SHALL 采用相同的修复方式

### Requirement 3: 验证其他登录页字段

**User Story:** 作为一个质量保证人员，我希望登录页的所有字段验证都能正确工作，以便确保整个表单的功能完整性。

#### Acceptance Criteria

1. WHEN 用户输入少于 8 个字符的密码 THEN 系统 SHALL 显示"密码至少需要8个字符"错误提示
2. WHEN 用户输入 8 个字符或更多的密码 THEN 系统 SHALL 不显示密码长度错误提示
3. WHEN 密码字段为空 THEN 系统 SHALL 显示"密码不能为空"错误提示

## Non-Functional Requirements

### Code Architecture and Modularity

- **Single Responsibility Principle**: 验证逻辑保留在 `validators.ts` 中，组件只负责调用和显示
- **Modular Design**: 修复方案应仅修改必要的代码，避免引入新的依赖
- **Clear Interfaces**: 保持 `validators.email()` 的返回类型为 `string | null`，这是正确的 API 设计

### Performance

- 验证逻辑应保持即时响应（< 16ms）
- 不应引入不必要的重渲染

### Security

- 保持现有的邮箱格式验证规则（RFC 5322 简化版）
- 不应放宽验证标准导致无效邮箱被接受

### Reliability

- 修复后必须通过所有现有的单元测试
- 应添加新的测试用例覆盖此 bug 场景

### Usability

- 错误提示必须清晰准确，避免误导用户
- 验证反馈应该即时（用户输入时）
- 错误消息位置应该贴近对应的输入字段
