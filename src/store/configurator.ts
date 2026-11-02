import { create } from 'zustand'

/** 可配置部件：与模型节点命名约定保持一致 */
export const PART_IDS = ['upper', 'sole', 'laces'] as const
export type PartId = (typeof PART_IDS)[number]

export const PART_LABELS: Record<PartId, string> = {
  upper: '鞋面',
  sole: '鞋底',
  laces: '鞋带',
}

export type MaterialPreset = 'matte' | 'glossy' | 'metal'

export interface ConfiguratorState {
  activePart: PartId
  colors: Record<PartId, string>
  materials: Record<PartId, MaterialPreset>
  setActivePart: (part: PartId) => void
  setPartColor: (part: PartId, color: string) => void
  setPartMaterial: (part: PartId, material: MaterialPreset) => void
  reset: () => void
}

const INITIAL_COLORS: Record<PartId, string> = {
  upper: '#2b6cf6',
  sole: '#f4f4f5',
  laces: '#f8fafc',
}

const INITIAL_MATERIALS: Record<PartId, MaterialPreset> = {
  upper: 'matte',
  sole: 'matte',
  laces: 'matte',
}

export const useConfigurator = create<ConfiguratorState>((set) => ({
  activePart: 'upper',
  colors: INITIAL_COLORS,
  materials: INITIAL_MATERIALS,
  setActivePart: (activePart) => set({ activePart }),
  setPartColor: (part, color) =>
    set((state) => ({ colors: { ...state.colors, [part]: color } })),
  setPartMaterial: (part, material) =>
    set((state) => ({ materials: { ...state.materials, [part]: material } })),
  reset: () => set({ colors: INITIAL_COLORS, materials: INITIAL_MATERIALS }),
}))
