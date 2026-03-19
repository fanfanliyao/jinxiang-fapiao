import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 解析命令行参数中的 --feature 参数（支持多个）
function parseFeatureArgs(): string[] {
  const args = process.argv
  const features: string[] = []

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--feature' && i + 1 < args.length) {
      const feature = args[i + 1]
      if (feature && !feature.startsWith('--')) {
        features.push(feature)
        i++ // 跳过下一个参数，因为已经处理了
      }
    }
  }

  return features
}

const features = parseFeatureArgs()
const featuresEnv = features.length > 0 ? features.join(',') : undefined

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.VITE_FEATURES': JSON.stringify(featuresEnv),
  },
})
