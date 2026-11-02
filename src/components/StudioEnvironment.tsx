import { ContactShadows, Environment, Lightformer } from '@react-three/drei'

/**
 * 演播室光照：用 Lightformer 搭一块虚拟柔光箱环境，不依赖外部 HDR 文件。
 * 相比 <Environment preset> 从 CDN 下载 HDR，这种方式离线可用、可控性更强。
 */
export function StudioEnvironment() {
  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={3}
          position={[0, 4, -3]}
          scale={[8, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          position={[-4, 1.5, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[4, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          position={[4, 1.5, 2]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[4, 3, 1]}
        />
        <Lightformer
          form="circle"
          intensity={2.4}
          position={[0, 2, 5]}
          scale={3}
        />
      </Environment>

      {/* 展示台 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[3.2, 64]} />
        <meshStandardMaterial color="#15151a" roughness={0.9} metalness={0} />
      </mesh>

      {/* 接触阴影：比真实 shadow map 更省性能，且边缘更柔和 */}
      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.55}
        scale={8}
        blur={2.6}
        far={4}
        resolution={512}
        color="#000000"
      />
    </>
  )
}
