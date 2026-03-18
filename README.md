# Workspace Scaffold

一个功能完整的 Vite + React + TypeScript + HiUI 项目骨架，支持模块化路由和动态 Feature 加载。

## 特性

### 核心技术栈

- ⚡️ [Vite](https://vite.dev/) - 快速的构建工具
- ⚛️ [React 18](https://react.dev/) - UI 库
- 📘 [TypeScript](https://www.typescriptlang.org/) - 类型安全
- 🎨 [HiUI v5](https://hiui.xiaomi.com/) - 企业级 UI 组件库
- 🧭 [React Router](https://reactrouter.com/) - 路由管理

### 核心功能

- 🗂️ **模块化路由系统** - 路由配置独立管理，支持动态扫描和合并
- 📦 **Feature 模块化** - 支持按 Feature 组织代码，自动扫描并合并路由
- 🔍 **Feature 过滤** - 支持通过 `--feature` 参数过滤特定 Feature，便于开发和构建
- 🎯 **HiUI Layout 集成** - 内置侧边栏、浮动菜单、搜索等完整布局方案
- 📄 **PageHeader 集成** - 统一的页面头部组件，支持面包屑和操作按钮
- 🔄 **动态路由扫描** - 自动扫描 `features` 文件夹下的路由配置
- 📝 **类型安全** - 完整的 TypeScript 类型定义

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
# 启动开发服务器（加载所有 features）
pnpm dev

# 只加载指定的 feature
pnpm dev --feature example

# 加载多个 features
pnpm dev --feature example --feature another
```

### 构建

```bash
# 构建所有 features
pnpm build

# 只构建指定的 feature
pnpm build --feature example
```

### 预览

```bash
pnpm preview
```

## 项目结构

```
workspace-scaffold/
├── src/
│   ├── App.tsx              # 应用入口组件
│   ├── main.tsx             # 应用启动文件
│   ├── routes.tsx           # 路由配置（默认路由 + 动态扫描）
│   ├── index.css            # 全局样式
│   ├── env.d.ts             # 环境变量类型定义
│   ├── types/
│   │   └── routes.ts        # 路由类型定义
│   ├── utils/
│   │   └── menu-route.ts    # 路由工具函数
│   ├── components/
│   │   └── layout.tsx       # 布局组件（HiUI Layout）
│   └── features/             # Feature 模块目录
│       └── _example/         # 示例 Feature
│           ├── index.tsx     # Feature 路由配置
│           └── components/   # Feature 组件
├── index.html               # HTML 入口
├── vite.config.mts          # Vite 配置（支持 --feature 参数）
├── tsconfig.json            # TypeScript 配置
└── package.json             # 项目配置
```

## Feature 模块化

### 创建 Feature

在 `src/features` 目录下创建新的 Feature 文件夹，例如：

```
src/features/
└── my-feature/
    ├── index.tsx           # 导出路由配置
    └── components/         # Feature 相关组件
        └── my-component.tsx
```

### Feature 路由配置

在 `src/features/my-feature/index.tsx` 中导出路由配置：

```tsx
import type { MenuRouteObject } from '../../types/routes'
import MyComponent from './components/my-component'

// 可以导出数组
const routes: MenuRouteObject[] = [
  {
    title: '我的功能',
    path: 'my-feature',
    children: [{ title: '功能页面', path: 'page', element: <MyComponent /> }],
  },
]

export default routes

// 或者导出对象（会自动归一化为数组）
// export default { routes }
```

### Feature 过滤

使用 `--feature` 参数可以只加载指定的 Feature：

```bash
# 只加载 example feature
pnpm dev --feature example

# 加载多个 features
pnpm dev --feature example --feature my-feature
```

## 路由系统

### 路由配置

路由配置支持以下特性：

- **嵌套路由** - 支持多级路由嵌套
- **动态扫描** - 自动扫描 `features` 文件夹下的路由
- **类型安全** - 完整的 TypeScript 类型支持
- **归一化处理** - 自动处理数组和对象格式的路由导出

### 路由类型

```typescript
type MenuRouteObject = RouteObject & {
  title?: string
  children?: MenuRouteObject[]
}
```

## HiUI Layout

项目集成了 HiUI 的 Layout 组件，包含：

- **侧边栏菜单** - 支持折叠、搜索、图标
- **浮动菜单** - 二级菜单悬浮显示
- **应用列表** - 多应用切换
- **用户资料** - 用户信息和设置
- **页面头部** - 统一的 PageHeader 组件

## 技术细节

### 路径别名

项目已配置 `@` 别名指向 `src` 目录：

```typescript
import { routes } from '@/routes'
```

### 环境变量

支持通过环境变量控制 Feature 过滤：

- `VITE_FEATURES` - 逗号分隔的 Feature 列表

### 路由扫描机制

使用 Vite 的 `import.meta.glob` API 动态扫描：

```typescript
const featureModules = import.meta.glob('/src/features/*/index.tsx', { eager: true })
```

## 更新日志

### v1.0.0

- ✨ 初始版本
- ✨ 集成 HiUI Layout 组件
- ✨ 实现 Feature 模块化系统
- ✨ 支持动态路由扫描
- ✨ 支持 `--feature` 参数过滤
- ✨ 集成 PageHeader 组件
- ✨ 完整的 TypeScript 类型支持
