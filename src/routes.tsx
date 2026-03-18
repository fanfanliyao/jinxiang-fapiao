import { AppStoreFilled } from '@hi-ui/icons'
import type { MenuRouteObject } from './types/routes'

// 默认路由配置
const defaultRoutes: MenuRouteObject[] = [
  {
    title: '首页',
    path: '/',
    icon: <AppStoreFilled />,
    element: (
      <div>
        <p>点击"进项发票"；</p>
        <p>查看进项发票票面信息💕</p>
      </div>
    ),
  },
]

// 归一化路由：将对象或数组统一转换为数组
function normalizeRoutes(exported: unknown): MenuRouteObject[] {
  if (Array.isArray(exported)) {
    return exported
  }

  if (typeof exported === 'object' && exported !== null) {
    // 如果对象有 routes 字段，提取它
    if ('routes' in exported && Array.isArray(exported.routes)) {
      return exported.routes
    }
    // 如果对象本身符合 MenuRouteObject，包装为数组
    if ('path' in exported || 'element' in exported) {
      return [exported as MenuRouteObject]
    }
  }

  return []
}

// 获取过滤的 feature 列表
function getFilteredFeatures(): string[] | null {
  const featuresEnv = import.meta.env.VITE_FEATURES
  if (!featuresEnv) {
    return null
  }
  return featuresEnv
    .split(',')
    .map((f: string) => f.trim())
    .filter(Boolean)
}

// 动态扫描并合并 features 路由
function scanFeatureRoutes(): MenuRouteObject[] {
  const filteredFeatures = getFilteredFeatures()

  // 使用 Vite 的 glob 功能动态扫描 features 文件夹
  const featureModules = import.meta.glob('/src/features/*/index.tsx', {
    eager: true,
  })

  const featureRoutes: MenuRouteObject[] = []

  for (const [path, module] of Object.entries(featureModules)) {
    // 从路径中提取 feature 名称：/src/features/example/index.tsx -> example
    const match = path.match(/\/src\/features\/([^/]+)\/index\.tsx$/)
    if (!match) continue

    const featureName = match[1]

    // 如果指定了过滤列表，只处理匹配的 feature
    if (filteredFeatures && !filteredFeatures.includes(featureName)) {
      continue
    }

    // 获取模块的默认导出或命名导出
    const moduleExports = module as {
      default?: unknown
      routes?: unknown
      [key: string]: unknown
    }

    let exportedRoutes: unknown

    // 优先使用 default 导出，其次使用 routes 导出
    if (moduleExports.default !== undefined) {
      exportedRoutes = moduleExports.default
    } else if (moduleExports.routes !== undefined) {
      exportedRoutes = moduleExports.routes
    } else {
      // 如果没有找到导出，跳过
      continue
    }

    // 归一化并合并路由
    const normalized = normalizeRoutes(exportedRoutes)
    featureRoutes.push(...normalized)
  }

  return featureRoutes
}

// 合并所有路由
export const routes: MenuRouteObject[] = [
  // routes
  ...defaultRoutes,
  ...scanFeatureRoutes(),
]
