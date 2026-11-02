# Proposal

## Why

3D 商品配置器的第一步是让商品"可看、可转、看起来贵"。当前项目只有脚手架空壳，没有任何 3D 场景能力；展示层缺位时，后续的换色、换材质、相机机位都无从谈起。

## What Changes

- 新增 `model-viewing` 能力：可加载球鞋 GLB 模型、带加载进度与失败兜底
- 新增 3D 场景骨架：Canvas、相机、轨道控制器、环境光照与接触阴影
- 新增交互：拖拽旋转、滚轮缩放（带阻尼与距离限制）、无操作 3 秒后自动旋转
- 新增球鞋模型资产（`public/models/sneaker.glb`）；在素材到位前先用程序化占位球鞋验证链路
- 新增开发期调试入口：FPS 监控与灯光/相机调参面板

本次不包含换色、换材质、配置面板、相机预设与截图导出（属于后续 `product-configuration` / `presentation` 能力）。

## Capabilities

### New Capabilities

- `model-viewing`: 商品 3D 展示能力，负责模型加载、轨道相机交互与环境光照渲染

### Modified Capabilities

（无）

## Impact

- 代码：`src/App.tsx`、`src/components/`、`src/three/`、`src/index.css`
- 资产：`public/models/`
- 依赖：`three`、`@react-three/fiber`、`@react-three/drei`
- 风险：免费可商用的球鞋 GLB 模型需要部件独立命名，若找不到则使用程序化占位模型
