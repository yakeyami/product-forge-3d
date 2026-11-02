# Design

## Decisions

### D1 单一状态源

继续使用 `src/store/configurator.ts` 的 zustand(轻量状态管理库) store 作为唯一状态源。配置面板按需订阅 `activePart`、`colors`、`materials`；3D 场景通过 selector 订阅，只在其关心的切片变化时更新材质，不在 `useFrame(逐帧钩子)` 中读取 React 状态。

理由：面板与模型必须天然一致，避免出现"面板显示蓝色、模型还是白色"的双状态问题。

### D2 部件映射集中在一处

新建 `src/three/parts.ts`，导出纯函数 `resolvePart(nodeName: string): PartId | null`，映射规则如下：

| 实际节点名（右鞋） | 逻辑部件 |
| --- | --- |
| 含 `laces` | `laces` |
| 含 `conv_tongue` | `upper` |
| 含 `converse` 且子网格序号为 1 | `sole` |
| 含 `converse` 且子网格序号为 0 | `upper` |
| 其余（rivet 等细节） | `null`，不参与配置 |

不把映射散落在组件里，也不依赖"第几个 child"这种脆弱写法；解析函数单独可测。

### D3 材质必须克隆

`useGLTF` 返回的 scene 被多处共享，且模型内多个网格可能复用同一材质。加载后遍历目标网格，对每个材质执行 `.clone()`，再写入 `color` / `metalness` / `roughness`，避免改鞋面时鞋带一起变色。

### D4 拾取用 `userData` 打标

遍历时给目标网格写入 `userData.part = resolvePart(nodeName)`；场景 `onClick` 从 `event.object.userData.part` 读取。相比额外维护 raycaster(射线拾取) 与对象数组，这方式不需要新增依赖，也能自然忽略空白点击。

### D5 选中高亮用自发光

选中部件通过轻微 `emissive` 提亮（强度约 0.06）表达，不改变 `color`。理由：换色本身已经占用颜色通道，若用颜色表达选中会与配置结果混淆。

### D6 面板布局与交互边界

新增 `src/components/ConfigPanel.tsx`，固定在页面左下（移动端贴底）。面板容器使用 `pointer-events-auto`，其余覆盖层继续 `pointer-events-none`，保证面板外仍能拖拽旋转模型。色板使用固定 6 色预设，材质使用 3 个分段按钮，重置按钮置于面板底部。

### D7 纯逻辑走单元测试

引入 `vitest`(前端单元测试框架) 覆盖两处纯逻辑：

- `resolvePart`：节点名 → 部件映射，包含未知节点返回 `null`
- `toMaterialProps(preset)`：材质预设 → `{ metalness, roughness }` 参数

3D 视觉结果无法用断言可靠表达，仍按 spec(规格) 的 Scenario 做人工验收。

## Risks

- **R1 节点名不稳定**：若替换模型，`resolvePart` 会全部返回 `null`，表现为无法选中任何部件。缓解：映射集中在一处，替换模型时只需改一个文件。
- **R2 子网格顺序变化**：`converse` 的两个子网格按序号区分鞋面与鞋底，若加载器命名规则变化可能错位。缓解：开发时打印一次子网格名与材质名核对，必要时改用材质名兜底。
- **R3 材质共享串色**：漏掉某个网格的材质克隆会导致部件联动换色。缓解：遍历后逐网格校验 `material.uuid` 唯一。
- **R4 金属预设在小尺寸鞋带上看不出差异**：鞋带几何过细，金属反射不明显。缓解：金属预设允许同时降低粗糙度；验收以鞋面为主。
- **R5 面板遮挡交互**：面板区域过大时挤压 3D 操作空间。缓解：窄屏下收纳为底部条，桌面端固定左下角。

## Open Questions

- MVP 是否需要在 6 色预设之外提供任意取色器？当前按 6 色实现，若后续需要再扩展。
