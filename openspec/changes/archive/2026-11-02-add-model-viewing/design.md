# Design

## Context

项目已初始化为 Vite + React 19 + TypeScript，并装好 `three`、`@react-three/fiber`、`@react-three/drei`。目前 `src/App.tsx` 仍是 Vite 默认演示页，没有任何 3D 场景。需求与验收标准见 `specs/model-viewing/spec.md`，动机见 `proposal.md`。

约束：

- 目标用户是桌面浏览器（简历展示场景），移动端适配不在本次范围
- 必须支持 GitHub Pages 子路径部署，静态资源引用不能使用根路径绝对路径
- 模型资产尚未确定，骨架必须能在无模型时独立跑通

## Goals / Non-Goals

**Goals:**

- 建立可复用的场景骨架：一个 Canvas 容器 + 独立可替换的模型组件
- 模型加载、相机交互、环境光照三件事在结构上解耦，便于后续接入换色/换材质
- 模型缺失时用程序化占位球鞋跑通全链路，保证学习节奏不被素材阻塞

**Non-Goals:**

- 不做点击拾取与材质替换（属于 `product-configuration` 变更）
- 不做后处理特效、模型压缩、移动端手势适配
- 不引入路由与多页面架构

## Decisions

### D1 用 R3F 声明式场景，而非命令式 Three.js 拼装

选择 `@react-three/fiber`：场景以组件树表达，`<Canvas>` 内部元素即 three 对象（`<mesh>`、`<ambientLight>`）。相比手写 `scene.add()` + `requestAnimationFrame`，减少样板代码，且模型加载/替换可以靠组件组合完成。

替代方案：原生 Three.js（更贴近底层，但需要自己管理生命周期与资源释放，与 React 状态同步成本高）——放弃，因为本项目目标 B 是做出可展示作品。

### D2 相机交互用 drei 的 `<OrbitControls>`，自动旋转自己实现

`OrbitControls` 自带阻尼、极角限制、距离限制，`autoRotate` 也可直接用。但"交互后暂停 3 秒再恢复"需要自己控制：用 `controls` 引用 + 监听 `start`/`end` 事件维护 `isInteracting` 状态，配合 `useEffect` 定时器。

替代方案：`<PresentationControls>`（更受限、适合单品展示但不够自由）——放弃，用户需要自由查看细节。

### D3 光照用工作室 Lightformer 环境 + 接触阴影，而非 CDN HDRI 或多盏点光源

用 drei 的 `<Environment>` 配合若干 `<Lightformer>` 在场景内搭一块虚拟柔光箱环境，提供 IBL 反射与高光；`<ContactShadows>` 用低成本方式在台面生成柔和阴影，比真实 shadow map 更稳、更省性能。

替代方案：
- `<Environment preset="city" />`：依赖运行时从 CDN 下载 HDR 文件，国内网络或离线环境下可能缺失，放弃。
- 多盏 `<directionalLight castShadow>` 手工布光：调参成本高、效果不稳定，放弃。

### D4 模型加载统一走 `useGLTF` + `Suspense`，并做占位降级

模型 URL 用一个常量集中管理（`src/three/config.ts`）。组件挂载时先渲染占位球鞋；若 `sneaker.glb` 存在则替换为真实模型。加载中由 drei `<Html center>` 显示进度文案，失败由 React ErrorBoundary 捕获并展示兜底。

替代方案：手动 `GLTFLoader` + 回调——放弃，`useGLTF` 已内置缓存，且与 Suspense 集成更自然。

### D5 状态用 zustand，但本次只建 store 骨架

本次只需 `isInteracting` / `autoRotate` 这类场景状态，直接放在组件内即可。zustand store 先建文件与类型定义（部件名、颜色、材质预设），留给 `product-configuration` 变更使用，避免后续重构入口。

替代方案：本次不建 store——放弃，提前确定契约可减少下个变更的破坏性改动。

### D6 渲染性能：dpr 上限 2，开发期挂 stats

`<Canvas dpr={[1, 2]}>` 限制高分屏像素比；开发环境用 drei 的 `<Stats />`，生产环境关闭。

## Risks / Trade-offs

- [环境光依赖外部资源] → 已改用 Lightformer 自建环境，不依赖 CDN；若后续希望更真实的反射，可换成本地 HDR 文件（放入 `public/hdr/`）。
- [占位模型与真实模型尺度不一致] → 换模型时相机距离、阴影位置可能穿帮。缓解：在 `config.ts` 中定义统一缩放常量与展示台高度，模型加载后按包围盒归一化。
- [GitHub Pages 子路径导致模型 404] → 静态资源必须用 `import.meta.env.BASE_URL` 拼接，不能写 `/models/sneaker.glb`。缓解：`config.ts` 统一导出 `MODEL_URL`。
- [3 秒恢复计时器在拖拽中误触发] → 用 `start`/`end` 事件成对计数，避免快速连续操作时计时器错乱。缓解：暂停前先 `clearTimeout`。

## Open Questions

- 球鞋 GLB 的最终来源与许可证（CC0/CC-BY）待定，由 tasks.md 中的素材任务收敛；此问题不影响骨架实现。
