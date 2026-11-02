# Proposal

## Why

`model-viewing` 能力已让球鞋"看得见、转得动"，但用户还不能对它做任何修改，离"配置器"这个核心卖点还差一步。M3 要解决的是：把 3D 模型从"可展示资产"变成"可编辑商品"，让配色与材质选择成为页面的主要交互。

## What Changes

- 新增 `product-configuration` 能力：部件选择、部件换色、材质预设、配置面板与重置
- 新增部件映射层 `src/three/parts.ts`：把 GLB(3D 模型封装格式) 的实际节点名映射到 `upper` / `sole` / `laces`
- 扩展 3D 场景：为部件打标、隔离材质、响应状态变化并在选中时高亮
- 新增配置面板 `src/components/ConfigPanel.tsx`：部件切换、色板、材质预设、重置
- 新增纯逻辑单元测试（部件映射与材质参数换算），视觉表现仍以 spec(规格) Scenario 人工验收

本次不包含相机预设机位与截图导出（仍属于 M4 的 `presentation` 能力）。

## Capabilities

### New Capabilities

- `product-configuration`: 商品配置能力，负责部件选择、颜色与材质修改、配置面板状态同步

### Modified Capabilities

（无）

## Impact

- 代码：`src/components/`、`src/store/`、`src/three/`、`src/App.tsx`
- 依赖：新增 `vitest`（仅开发依赖，用于纯逻辑测试）
- 资产：沿用 `public/models/sneaker.glb`，不新增模型
- 风险：模型节点名与子网格顺序不稳定会导致部件识别失败，需在 `parts.ts` 中集中兜底
