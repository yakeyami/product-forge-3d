# Superpowers 工作流（本项目强制遵循）

技能文件位于 `.superpowers/skills/`，编码代理在对应阶段必须先读取并遵循相应 SKILL.md：

1. 写任何代码前 → 读取 `brainstorming/SKILL.md`，先澄清需求、分块确认设计
2. 设计确认后 → 读取 `writing-plans/SKILL.md`，产出带文件路径和验证步骤的任务清单
3. 实现纯逻辑代码（状态、材质映射、截图工具）→ 遵循 `test-driven-development/SKILL.md` 的红绿循环
4. 3D 视觉效果无法单测 → 用 openspec 提案中的验收清单逐条人工验证
5. 宣布完成前 → 读取 `verification-before-completion/SKILL.md`，给出验证证据
6. 遇到 bug → 遵循 `systematic-debugging/SKILL.md`，先找根因再改代码，禁止猜测式修复

所有功能变更必须先有 `openspec/changes/` 下的提案，实现后执行 `openspec verify`。
