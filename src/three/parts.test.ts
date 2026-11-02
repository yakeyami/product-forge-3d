import { describe, expect, it } from 'vitest'
import { resolvePart, toMaterialProps } from './parts'

describe('resolvePart', () => {
  it('把鞋带节点识别为 laces', () => {
    expect(resolvePart('Sneakers_rConv_laces1')).toBe('laces')
  })

  it('把鞋舌节点归入 upper', () => {
    expect(resolvePart('Sneakers_rConv_conv_tongue1')).toBe('upper')
  })

  it('把 converse 子网格 0 识别为 upper', () => {
    expect(resolvePart('Sneakers_rConv_converse1_0')).toBe('upper')
  })

  it('把 converse 子网格 1 识别为 sole', () => {
    expect(resolvePart('Sneakers_rConv_converse1_1')).toBe('sole')
  })

  it('忽略铆钉等细节节点', () => {
    expect(resolvePart('Sneakers_rConv_rivet32')).toBeNull()
  })

  it('未知节点返回 null', () => {
    expect(resolvePart('SomeOtherMesh')).toBeNull()
  })
})

describe('toMaterialProps', () => {
  it('哑光预设粗糙度高、金属度低', () => {
    expect(toMaterialProps('matte')).toEqual({ metalness: 0.02, roughness: 0.85 })
  })

  it('亮面预设更光滑但保留非金属', () => {
    expect(toMaterialProps('glossy')).toEqual({ metalness: 0.08, roughness: 0.3 })
  })

  it('金属预设金属度高、粗糙度低', () => {
    expect(toMaterialProps('metal')).toEqual({ metalness: 0.9, roughness: 0.2 })
  })
})
