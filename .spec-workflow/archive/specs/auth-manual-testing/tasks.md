# Tasks Document

- [x] 1. 建立手工测试目录与 JSON 骨架
  - File: docs/testing/auth-manual/cases.json, docs/testing/auth-manual/README.md
  - 创建 `docs/testing/auth-manual/` 目录，产出 `cases.json` 的空数组与字段说明 README，确保设计中的 JSON 结构与共享夹具链接被引用。
  - Purpose: 为后续用例填充提供统一入口与文档化字段解释。
  - _Leverage: docs/testing/\_shared-fixtures.md, .spec-workflow/specs/auth-manual-testing/design.md_
  - _Requirements: Requirement 1, Requirement 2, Requirement 3_
  - _Prompt: Implement the task for spec auth-manual-testing, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA 文档工程师，擅长构建测试资料结构 | Task: 在 docs/testing/auth-manual/ 下创建 README 说明与 cases.json 骨架（含 id/title/journey/preconditions/steps/expectedResults/artifacts 字段示例），并引用共享夹具，满足设计文档要求 | Restrictions: 不改动应用代码，只能创建/修改文档与 JSON，字段名必须与设计保持一致 | \_Leverage: docs/testing/\_shared-fixtures.md, .spec-workflow/specs/auth-manual-testing/design.md_ | _Requirements: Requirement 1, Requirement 2, Requirement 3_ | Success: README 解释 JSON 字段及证据收集方式，cases.json 为合法 JSON 数组且含示例对象；执行前先在 tasks.md 将该任务标记为 [-]，完成后使用 log-implementation 记录工单并把任务改为 [x].\_

- [x] 2. 填充正向认证用例 JSON
  - File: docs/testing/auth-manual/cases.json
  - 在 `cases.json` 中添加旅程为 `happy-path` 的用例对象（至少覆盖成功登录、会话保持、登出验证等），详细列出前置条件、操作步骤、预期结果与证据要求。
  - Purpose: 将 Requirement 1 明确转化为结构化手工测试清单。
  - _Leverage: docs/testing/auth-manual/README.md, docs/testing/\_shared-fixtures.md, .spec-workflow/specs/auth-manual-testing/requirements.md_
  - _Requirements: Requirement 1_
  - _Prompt: Implement the task for spec auth-manual-testing, first run spec-workflow-guide to get the workflow guide then implement the task: Role: 高级 QA 工程师，专注登录体验验证 | Task: 根据 Requirement 1 在 cases.json 中编写至少 3 条 happy-path 用例，逐一列出 preconditions/steps/expectedResults 及 artifacts，确保响应时间、会话复用、登出后访问等情况均有覆盖 | Restrictions: 不可更改非 happy-path 对象，禁止编写任何代码，只能编辑 JSON 内容；字段顺序保持一致 | \_Leverage: docs/testing/auth-manual/README.md, docs/testing/\_shared-fixtures.md, requirements 文档_ | _Requirements: Requirement 1_ | Success: JSON 通过格式校验，新增用例 id 唯一且含 evidence 要求；执行前将任务改为 [-]，完成后使用 log-implementation 记录并把任务标记为 [x].\_

- [x] 3. 填充异常凭证用例 JSON
  - File: docs/testing/auth-manual/cases.json
  - 新增 `journey: "negative"` 的对象，覆盖错误密码锁定、禁用账号提示、HTTP 拦截等场景，写明触发日志与告警的期望。
  - Purpose: 将 Requirement 2 的防护策略以手工脚本形式落地。
  - _Leverage: docs/testing/auth-manual/README.md, docs/testing/\_shared-fixtures.md, .spec-workflow/specs/auth-manual-testing/requirements.md_
  - _Requirements: Requirement 2_
  - _Prompt: Implement the task for spec auth-manual-testing, first run spec-workflow-guide to get the workflow guide then implement the task: Role: 安全测试工程师，熟悉暴力破解与策略验证 | Task: 在 cases.json 中添加至少 3 条 negative 用例，覆盖速率限制/锁定、禁用账号、HTTP/HSTS 拦截等，明确 preconditions（账号状态、网络配置）、steps 与 expectedResults（日志、告警、用户提示），并在 artifacts 中指定需要收集的日志与截图 | Restrictions: 仅修改 negative 相关对象，不新增示例字段；保证 JSON 语法正确 | \_Leverage: README、shared fixtures、requirements_ | _Requirements: Requirement 2_ | Success: 用例清晰反映策略与用户体验，可直接导入 QA 工具；执行前标记 [-]，完成后使用 log-implementation 并改为 [x].\_

- [x] 4. 填充恢复与 MFA 用例 JSON
  - File: docs/testing/auth-manual/cases.json
  - 新增 `journey: "recovery-mfa"` 的对象，覆盖忘记密码流程、MFA 新设备登录、恢复码失效等，记录邮件/OTP 证据。
  - Purpose: 将 Requirement 3 的关键安全流程编入手工测试列表。
  - _Leverage: docs/testing/auth-manual/README.md, docs/testing/\_shared-fixtures.md, .spec-workflow/specs/auth-manual-testing/requirements.md_
  - _Requirements: Requirement 3_
  - _Prompt: Implement the task for spec auth-manual-testing, first run spec-workflow-guide to get the workflow guide then implement the task: Role: 身份安全 QA，擅长恢复与多因子验证 | Task: 在 cases.json 中为 recovery-mfa 旅程添加至少 3 条用例（忘记密码、MFA 新设备登录、恢复码刷新），详述 preconditions（邮件沙箱、OTP 种子）、steps、expectedResults，并在 artifacts 中说明邮件/日志/通知要求 | Restrictions: 不得修改其他旅程对象，保持 JSON 排序一致，严禁加入应用代码 | \_Leverage: README、shared fixtures、requirements_ | _Requirements: Requirement 3_ | Success: 新增用例满足 Requirement 3 验收点，字段齐全且可直接执行；执行前标记 [-]，完成后 log-implementation 并改为 [x].\_

- [x] 5. 使用 Chrome MCP 逐条执行并记录结果
  - File: docs/testing/auth-manual/EXECUTION.md（新增），Chrome MCP 运行截图/日志
  - 在完成 `cases.json` 全部用例后，使用 Chrome MCP 客户端按 JSON 顺序逐条执行测试，并将每条用例的执行人、时间戳、结果、证据链接写入新的执行记录文档。
  - Purpose: 确保所有手工用例均经过实际验证，并存档 Chrome MCP 运行凭据。
  - _Leverage: docs/testing/auth-manual/cases.json, docs/testing/auth-manual/README.md_
  - _Requirements: Requirement 1, Requirement 2, Requirement 3_
  - _Prompt: Implement the task for spec auth-manual-testing, first run spec-workflow-guide to get the workflow guide then implement the task: Role: 手工测试执行工程师，熟悉 Chrome MCP | Task: 在完成 JSON 用例后，使用 Chrome MCP 依次运行每条用例，采集 artifacts 中要求的证据，并在 docs/testing/auth-manual/EXECUTION.md 中以 Markdown 表格记录 case id、journey、执行人、开始/结束时间、结果（Pass/Fail）、Chrome MCP 运行说明以及证据链接 | Restrictions: 禁止修改 cases.json，用例执行顺序需与 JSON 一致；执行记录必须注明“通过 Chrome MCP 执行”字样 | \_Leverage: cases.json, README 字段说明_ | _Requirements: Requirement 1, Requirement 2, Requirement 3_ | Success: EXECUTION.md 覆盖全部用例且字段完整，附带 Chrome MCP 运行说明；执行前将任务设为 [-]，完成后使用 log-implementation 记录并改为 [x].\_
