import type { MaterialPreset, PartId } from '../store/configurator'

const MATERIAL_PROPS: Record<
  MaterialPreset,
  { metalness: number; roughness: number }
> = {
  matte: { metalness: 0.02, roughness: 0.85 },
  glossy: { metalness: 0.08, roughness: 0.3 },
  metal: { metalness: 0.9, roughness: 0.2 },
}

/**
 * 把 GLB 的实际节点名映射到配置部件。
 * 当前模型：converse 鞋面含两个子网格（0=鞋面，1=鞋底），鞋舌归入鞋面。
 */
export function resolvePart(nodeName: string): PartId | null {
  const name = nodeName.toLowerCase()

  if (name.includes('laces')) return 'laces'
  if (name.includes('conv_tongue')) return 'upper'
  if (name.includes('converse')) {
    return name.endsWith('_1') ? 'sole' : 'upper'
  }

  return null
}

/** 材质预设到 PBR(基于物理的渲染) 参数，颜色由调用方单独设置 */
export function toMaterialProps(preset: MaterialPreset) {
  return MATERIAL_PROPS[preset]
}
