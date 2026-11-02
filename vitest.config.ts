import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // .superpowers 内置的是自研测试脚本，不属于本项目的 vitest 用例
    exclude: ['**/node_modules/**', '**/dist/**', '**/.superpowers/**'],
  },
})
