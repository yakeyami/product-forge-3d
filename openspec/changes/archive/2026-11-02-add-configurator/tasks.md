# Tasks

## 1. 部件映射与纯逻辑

- [x] 1.1 新建 `src/three/parts.ts`：实现 `resolvePart(nodeName)` 与 `toMaterialProps(preset)`；验证：`tsc -b` 通过，未知节点返回 `null`
- [x] 1.2 安装 `vitest` 并在 `package.json` 增加 `test` 脚本；验证：`npm run test` 能启动并输出结果
- [x] 1.3 编写 `src/three/parts.test.ts`：覆盖 laces、tongue、converse 子网格 0/1、rivet 与未知节点；验证：红绿循环后全部通过

## 2. 场景绑定

- [x] 2.1 在 `SneakerModel.tsx` 加载后遍历目标网格：克隆材质、写入 `userData.part`；验证：控制台打印每个网格的部件归属与材质 uuid，无重复 uuid
- [x] 2.2 订阅 `useConfigurator` 的颜色与材质，应用到对应部件；验证：改鞋面颜色时鞋底与鞋带颜色不变
- [x] 2.3 选中部件时施加轻微 `emissive` 高亮，切换部件后旧部件恢复；验证：高亮只在当前部件出现

## 3. 场景拾取

- [x] 3.1 场景接入 `onClick`：命中带 `part` 的网格时切换当前部件，并设置指针样式；验证：点击鞋面、鞋底、鞋带分别正确切换
- [x] 3.2 处理空白点击；验证：点击展示台或空白处当前部件不变，拖拽旋转不受影响

## 4. 配置面板

- [x] 4.1 新建 `src/components/ConfigPanel.tsx`：部件列表（含选中态）、6 色色板、3 个材质按钮、重置按钮；验证：面板四项操作均能改动 store
- [x] 4.2 挂载面板到 `App.tsx` 并处理布局与事件穿透；验证：桌面端左下角不遮挡模型，面板外仍可拖拽旋转

## 5. 集成验证

- [x] 5.1 逐条执行 `specs/product-configuration/spec.md` 的 Scenario 做人工验收；验证：全部 Scenario 通过
- [x] 5.2 三部件分别设成不同颜色与材质；验证：无串色、无闪变，重置后全部恢复默认
- [x] 5.3 执行 `npm run lint`、`tsc -b`、`npm run test`、`npm run build`；验证：全部通过且生产构建无子路径 404
- [x] 5.4 执行 `openspec validate add-configurator --strict`；验证：无 error 与 warning

## Workflow follow-up

- 验收通过后执行 `openspec archive add-configurator`，将 `product-configuration` 规格合入主 specs。
