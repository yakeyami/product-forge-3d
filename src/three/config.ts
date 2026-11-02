/**
 * 场景与资产配置。
 * 模型路径必须拼 BASE_URL，否则 GitHub Pages 子路径部署会 404。
 */
export const MODEL_URL = `${import.meta.env.BASE_URL}models/sneaker.glb`

/** 模型归一化目标：最长边缩放到该尺寸，保证不同来源的模型视觉大小一致 */
export const MODEL_TARGET_SIZE = 3

/** 展示台高度（模型底部落在此高度） */
export const STAGE_Y = 0
