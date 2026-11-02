# Tasks

## 1. 模型资产准备（风险 D1，优先执行）

- [ ] 1.1 在 Sketchfab（筛选 CC0/CC-BY）或 Poly Pizza 搜索 "sneaker low poly"，确认模型允许商用且鞋面/鞋底/鞋带为独立命名的网格；验证：记录模型链接与许可证到本任务行下方
- [x] 1.2 若 1.1 无合适结果，改用程序化占位球鞋（箱体鞋身 + 圆角鞋底 + 圆柱鞋带），验证：`npm run dev` 画面中可见完整球鞋轮廓
- [ ] 1.3 模型放入 `public/models/sneaker.glb`，用 gltf.report 或 three.js editor 检查节点命名；验证：节点列表中能找到 upper / sole / laces 三类部件

## 2. 场景骨架

- [x] 2.1 新增 `src/three/config.ts` 导出模型路径（用 `import.meta.env.BASE_URL` 拼接）与展示台参数；验证：`npm run build` 通过，产物中模型路径为 `/product-forge-3d/models/...`
- [x] 2.2 新增 `src/components/Scene.tsx`：`<Canvas dpr={[1,2]}>` + 相机 fov 45、位置 [3,2,5]；验证：页面渲染出画布与天空色背景，无控制台报错
- [x] 2.3 新增 `src/components/StudioEnvironment.tsx`：`<Environment>` + `<Lightformer>` + `<ContactShadows>` + 展示台；验证：占位球鞋表面有反射高光、底部有柔和阴影
- [x] 2.4 新增 `src/components/SneakerModel.tsx`：`useGLTF` 加载 + `Suspense` 进度提示 + `ErrorBoundary` 失败兜底；验证：模型缺失时页面显示占位球鞋与错误提示而非白屏

## 3. 相机交互

- [x] 3.1 在 Scene 中接入 `<OrbitControls>`，开启阻尼并设置 `minDistance` / `maxDistance` / `maxPolarAngle`；验证：拖拽有惯性、滚轮拉到极限不穿模
- [x] 3.2 实现空闲自动旋转：无交互 3 秒后 `autoRotate=true`，`start` 事件立即暂停并清除计时器；验证：拖拽时立即停转，松手 3 秒后恢复

## 4. 状态骨架与页面整合

- [x] 4.1 新增 `src/store/configurator.ts`：定义部件枚举、颜色、材质预设类型与初始值（暂不接 UI）；验证：`tsc -b` 通过且类型可被 import
- [x] 4.2 重写 `src/App.tsx` 与 `src/index.css`：移除 Vite 演示页，改为全屏深色展示布局，左上角显示商品名与操作提示；验证：页面无滚动条、Canvas 铺满视口
- [x] 4.3 开发环境挂 `<Stats />` 显示 FPS，生产构建自动关闭；验证：`npm run dev` 右下角出现 FPS 面板，`npm run build` 产物不含面板

## 5. 集成验证

- [x] 5.1 逐条执行 `specs/model-viewing/spec.md` 的 Scenario 做人工验收，记录每条结果；验证：全部 Scenario 勾选通过
- [x] 5.2 桌面 Chrome 持续拖拽 30 秒，读 stats 面板；验证：帧率 ≥ 50 FPS
- [x] 5.3 执行 `npm run build && npm run preview`，在 `/product-forge-3d/` 子路径下访问；验证：模型、阴影、交互均正常无 404
- [x] 5.4 执行 `openspec validate add-model-viewing --strict`；验证：无 error 与 warning

## Workflow follow-up

- 验收通过后执行 `openspec archive add-model-viewing`，将 `model-viewing` 规格合入主 specs。
