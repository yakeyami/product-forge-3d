# Product Forge 3D

一个可交互的 3D 球鞋配置器，用于学习 Web 3D 展示技术。对标天猫 3D 商品页 / 苹果产品页的简化版。

当前进度：**M3 配置器完成**（部件点选、换色、材质预设、配置面板），相机预设与截图导出待做。

## 本地运行

```bash
npm install
npm run dev     # 开发服务器
npm run build   # 类型检查 + 生产构建
npm run preview # 预览构建产物（子路径 /product-forge-3d/）
```

## 技术栈

| 层 | 选型 |
|---|---|
| 构建 | Vite 8 + TypeScript |
| 框架 | React 19 |
| 3D | Three.js + React Three Fiber + drei |
| 状态 | zustand |
| 样式 | Tailwind CSS 4 |
| 部署 | GitHub Pages（GitHub Actions） |
| 方法论 | OpenSpec + Superpowers |

## 目录结构

```
.
├── docs/                 # 技术选型、项目方案、架构总览
├── openspec/             # 规格驱动开发：提案、增量规格、任务
│   ├── specs/            # 已归档的能力规格（单一事实源）
│   └── changes/          # 进行中的变更
├── src/
│   ├── components/       # 场景与模型组件
│   ├── store/            # 配置器状态契约
│   └── three/            # 3D 常量与资产路径
├── public/models/        # glTF / GLB 模型
└── .trae/rules/          # 编码代理必须遵循的工作流规则
```

## 功能状态

- [x] 模型加载（进度提示 + 失败降级到占位模型）
- [x] 轨道相机（阻尼、距离/俯仰限制）
- [x] 空闲 3 秒自动旋转
- [x] 工作室光照 + 接触阴影
- [x] GitHub Pages 自动部署配置
- [x] 真实球鞋 GLB 模型
- [x] 换色 / 换材质 / 配置面板（部件点选 + 高亮）
- [ ] 相机预设机位 / 截图导出

## 文档

- [技术选型](./docs/01-技术选型.md)
- [项目方案](./docs/02-项目方案.md)
- [架构总览](./docs/03-架构总览.md)
- 变更规格：[模型展示](openspec/changes/archive/2026-11-02-add-model-viewing/proposal.md)、[配置器](openspec/changes/archive/2026-11-02-add-configurator/proposal.md)

## 部署

推送到 `main` 后由 [deploy.yml](./.github/workflows/deploy.yml) 自动构建发布。仓库首次使用时需在 Settings → Pages 把 Source 设为 **GitHub Actions**。

> 仓库名必须为 `product-forge-3d`，或同步修改 [vite.config.ts](./vite.config.ts) 的 `base`。

## 说明

本项目用于学习 Web 3D，模型资产优先使用 CC0 / CC-BY 授权的公开模型，不使用任何品牌商标。

当前模型：`Sneakers` by Poly by Google，授权 CC BY 3.0，来源 [poly.pizza](https://poly.pizza/m/2cAXk_gG3Eh)。
