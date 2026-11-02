import { Scene } from './components/Scene'
import { ConfigPanel } from './components/ConfigPanel'

function App() {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#0b0b0f] text-neutral-100 select-none">
      <Scene />

      <ConfigPanel />

      {/* 顶部品牌区 */}
      <header className="pointer-events-none absolute top-0 left-0 w-full p-6 md:p-8">
        <p className="text-[10px] tracking-[0.35em] text-neutral-500 uppercase">
          Product Forge
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">
          FORGE ONE
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          低帮球鞋 · 概念配色
        </p>
      </header>

      {/* 右上角阶段标记 */}
      <div className="pointer-events-none absolute top-6 right-6 md:top-8 md:right-8 text-right">
        <p className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
          Stage 02
        </p>
        <p className="mt-1 text-[11px] text-neutral-500">3D Viewer</p>
      </div>

      {/* 底部操作提示 */}
      <footer className="pointer-events-none absolute bottom-0 left-0 hidden w-full p-6 md:block md:p-8">
        <p className="text-[11px] tracking-wide text-neutral-500">
          拖拽旋转 · 滚轮缩放 · 静止 3 秒后自动旋转
        </p>
      </footer>
    </div>
  )
}

export default App
