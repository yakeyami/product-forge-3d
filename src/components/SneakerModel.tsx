import { Component, Suspense, useEffect, useMemo, type ReactNode } from 'react'
import { Html, RoundedBox, useGLTF } from '@react-three/drei'
import { Box3, Mesh, MeshStandardMaterial, Vector3, type Object3D } from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { MODEL_TARGET_SIZE, MODEL_URL } from '../three/config'
import { resolvePart, toMaterialProps } from '../three/parts'
import { useConfigurator, type PartId } from '../store/configurator'

/** 真实模型：加载后按包围盒归一化，保证不同来源模型的尺度一致 */
function NormalizedSneaker() {
  const { scene } = useGLTF(MODEL_URL)
  const colors = useConfigurator((state) => state.colors)
  const materials = useConfigurator((state) => state.materials)
  const activePart = useConfigurator((state) => state.activePart)
  const setActivePart = useConfigurator((state) => state.setActivePart)

  const { object, position, scale } = useMemo(() => {
    const object = scene.clone(true)

    // 该模型是左右两只鞋，左鞋节点名带 lConv，移除后只展示单只
    const leftShoeNodes: Object3D[] = []
    object.traverse((node) => {
      if (node.name.includes('lConv')) leftShoeNodes.push(node)
    })
    leftShoeNodes.forEach((node) => node.parent?.remove(node))

    // 打标部件并克隆材质，避免各部件共享材质导致串色
    object.traverse((node) => {
      if (!(node as Mesh).isMesh) return
      const mesh = node as Mesh
      const part = resolvePart(mesh.name)
      if (!part) return

      mesh.userData.part = part
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((item) => item.clone())
        : mesh.material.clone()
    })

    const box = new Box3().setFromObject(object)
    const size = new Vector3()
    const center = new Vector3()
    box.getSize(size)
    box.getCenter(center)

    const scale = MODEL_TARGET_SIZE / Math.max(size.x, size.y, size.z)
    // 让模型在水平方向居中，底部贴合展示台
    const position: [number, number, number] = [
      -center.x * scale,
      -box.min.y * scale,
      -center.z * scale,
    ]

    return { object, position, scale }
  }, [scene])

  // 颜色、材质与选中态变化后同步到模型
  useEffect(() => {
    object.traverse((node) => {
      if (!(node as Mesh).isMesh) return
      const mesh = node as Mesh
      const part = mesh.userData.part as PartId | undefined
      if (!part) return

      const material = mesh.material as MeshStandardMaterial
      const props = toMaterialProps(materials[part])
      material.color.set(colors[part])
      material.metalness = props.metalness
      material.roughness = props.roughness

      const isActive = part === activePart
      material.emissive.set(isActive ? colors[part] : '#000000')
      material.emissiveIntensity = isActive ? 0.06 : 0
    })
  }, [object, colors, materials, activePart])

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    // 一次点击可能同时命中多个子网格，只取最近的可识别部件并终止后续命中
    event.stopPropagation()
    // 拖拽旋转后的轻微位移不应触发选中
    if (event.delta > 4) return

    const hit = event.intersections.find((item) => item.object.userData.part)
    const part = hit?.object.userData.part as PartId | undefined
    if (part) setActivePart(part)
  }

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    if (event.object.userData.part) document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto'
  }

  return (
    <group position={position} scale={scale}>
      <primitive
        object={object}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </group>
  )
}

/**
 * 占位球鞋：真实模型尚未就位时的兜底，用基础几何体拼出球鞋轮廓。
 * 它同时保证「模型加载失败」场景下页面不白屏。
 */
function PlaceholderSneaker() {
  return (
    <group rotation={[0, -0.4, 0]}>
      {/* 大底 */}
      <RoundedBox
        args={[3.24, 0.14, 1.42]}
        radius={0.06}
        smoothness={3}
        position={[0, 0.07, 0]}
      >
        <meshStandardMaterial color="#d9a441" roughness={0.75} metalness={0.05} />
      </RoundedBox>

      {/* 中底 */}
      <RoundedBox
        args={[3.18, 0.4, 1.34]}
        radius={0.18}
        smoothness={4}
        position={[0, 0.32, 0]}
      >
        <meshStandardMaterial color="#f4f4f5" roughness={0.45} metalness={0.05} />
      </RoundedBox>

      {/* 鞋面主体 */}
      <RoundedBox
        args={[2.3, 0.92, 1.16]}
        radius={0.4}
        smoothness={6}
        position={[-0.25, 0.85, 0]}
        rotation={[0, 0, -0.07]}
      >
        <meshStandardMaterial color="#2b6cf6" roughness={0.5} metalness={0.1} />
      </RoundedBox>

      {/* 鞋头 */}
      <mesh position={[-1.28, 0.62, 0]} scale={[1.35, 0.78, 1]}>
        <sphereGeometry args={[0.52, 24, 16]} />
        <meshStandardMaterial color="#f4f4f5" roughness={0.4} metalness={0.08} />
      </mesh>

      {/* 鞋帮 / 脚踝领口 */}
      <mesh position={[0.62, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.13, 16, 32]} />
        <meshStandardMaterial color="#2b6cf6" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* 鞋带 */}
      {[-0.55, -0.28, -0.01].map((x) => (
        <mesh key={x} position={[x, 1.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.86, 10]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.65} />
        </mesh>
      ))}

      {/* 后跟标 */}
      <mesh position={[0.95, 0.9, 0]}>
        <boxGeometry args={[0.08, 0.32, 0.34]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  )
}

type BoundaryProps = { children: ReactNode }
type BoundaryState = { failed: boolean }

/** 捕获模型加载错误，降级到占位模型并给出可读提示 */
class ModelErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false }

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <group>
          <PlaceholderSneaker />
          <Html center position={[0, 2.1, 0]}>
            <div className="w-56 rounded-lg border border-amber-400/30 bg-black/60 px-3 py-2 text-center backdrop-blur">
              <p className="text-[11px] leading-relaxed text-amber-200">
                真实模型未就绪，当前为占位模型
                <br />
                <span className="text-neutral-400">
                  请放入 public/models/sneaker.glb
                </span>
              </p>
            </div>
          </Html>
        </group>
      )
    }

    return this.props.children
  }
}

export function SneakerModel() {
  return (
    <ModelErrorBoundary>
      <Suspense fallback={null}>
        <NormalizedSneaker />
      </Suspense>
    </ModelErrorBoundary>
  )
}
