import type { ReactNode } from 'react'
import type { MenuDataItem } from '@hi-ui/menu'
import type { MenuRouteObject } from '../types/routes'

// 将路由配置转换为 Menu 组件所需的数据格式
export const convertRoutesToMenuData = (routes: MenuRouteObject[], parentPath = '', parentId = 0): MenuDataItem[] => {
  let currentId = parentId
  return routes
    .map((route) => {
      if (!route.title) return null as unknown as MenuDataItem

      const path = parentPath + (route.path || '')
      const id = path || `route-${currentId++}`
      const menuItem: MenuDataItem = {
        id,
        title: route.title,
        // 只在顶级菜单（没有 parentPath）时添加图标，子菜单不显示图标
        ...(parentPath === '' && route.icon ? { icon: route.icon } : {}),
      }

      if (route.children && route.children.length > 0) {
        menuItem.children = convertRoutesToMenuData(route.children, path + '/', currentId)
      }

      return menuItem
    })
    .filter(Boolean) as MenuDataItem[]
}

// 根据路径查找对应的路由标题
export const findRouteTitle = (routes: MenuRouteObject[], path: string, parentPath = ''): string | null => {
  for (const route of routes) {
    const currentPath = parentPath + (route.path || '')

    // 精确匹配
    if (currentPath === path || (path === '/' && currentPath === '/')) {
      return route.title || null
    }

    // 如果有子路由，递归查找
    if (route.children && route.children.length > 0) {
      const childTitle = findRouteTitle(route.children, path, currentPath + '/')
      if (childTitle) {
        return childTitle
      }
    }
  }

  return null
}

// 根据 id 查找对应的路径
export const findPathById = (routes: MenuRouteObject[], id: string | number, parentPath = ''): string | null => {
  for (const route of routes) {
    const currentPath = parentPath + (route.path || '')
    const routeId = currentPath || `route-${routes.indexOf(route)}`

    if (routeId === id || String(routeId) === String(id)) {
      return currentPath || '/'
    }

    if (route.children && route.children.length > 0) {
      const childPath = findPathById(route.children, id, currentPath + '/')
      if (childPath) {
        return childPath
      }
    }
  }

  return null
}

// 根据路径查找当前路由的 extra
export const findRouteExtra = (routes: MenuRouteObject[], path: string, parentPath = ''): ReactNode | null => {
  for (const route of routes) {
    const currentPath = parentPath + (route.path || '')
    if (currentPath === path || (path === '/' && currentPath === '/')) {
      return route.extra ?? null
    }
    if (route.children && route.children.length > 0) {
      const childExtra = findRouteExtra(route.children, path, currentPath + '/')
      if (childExtra !== null) return childExtra
    }
  }
  return null
}
