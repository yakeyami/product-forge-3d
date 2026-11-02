import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats, useProgress } from '@react-three/drei'
import { SneakerModel } from './SneakerModel'
import { StudioEnvironment } from './StudioEnvironment'

/** 无操作后恢复自动旋转的延迟（毫秒） */
const IDLE_RESUME_DELAY = 3000

/** 模型加载进度：用 Canvas 外的 DOM 浮层，避免 drei Html 卸载时的 React 树冲突 */
function LoadingOverlay() {
  const { active, progress } = useProgress()
  if (!active) return null

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="w-40 rounded-lg bg-white/10 px-3 py-2 text-center backdrop-blur">
        <p className="text-[11px] tracking-widest text-neutral-300">
          LOADING {Math.round(progress)}%
        </p>
        <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded bg-white/15">
          <div
            className="h-full bg-sky-400 transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export function Scene() {
  const [autoRotate, setAutoRotate] = useState(true)
  const idleTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!import.meta.env.DEV) return
    // OrbitControls 会拦截 canvas 的 contextmenu，开发时放行以便右键「检查」
    const allowContextMenu = (event: MouseEvent) => event.stopPropagation()
    window.addEventListener('contextmenu', allowContextMenu, true)
    return () => window.removeEventListener('contextmenu', allowContextMenu, true)
  }, [])

  const pauseAutoRotate = () => {
    window.clearTimeout(idleTimer.current)
    setAutoRotate(false)
  }

  const scheduleAutoRotate = () => {
    window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => {
      setAutoRotate(true)
    }, IDLE_RESUME_DELAY)
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 45, position: [3, 2, 5], near: 0.1, far: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#0b0b0f']} />
        <fog attach="fog" args={['#0b0b0f', 9, 20]} />

        <ambientLight intensity={0.35} />

        <StudioEnvironment />
        <SneakerModel />

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={2.5}
          maxDistance={8}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI / 2 - 0.05}
          target={[0, 0.75, 0]}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          onStart={pauseAutoRotate}
          onEnd={scheduleAutoRotate}
        />

        {import.meta.env.DEV && <Stats />}
      </Canvas>

      <LoadingOverlay />
    </div>
  )
}
