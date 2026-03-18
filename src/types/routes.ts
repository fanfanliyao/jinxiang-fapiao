import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'

export type MenuRouteObject = RouteObject & {
  title?: string
  icon?: ReactNode
  /** 页面右上角自定义操作区，会替换 layout 默认的"主操作"按钮 */
  extra?: ReactNode
  children?: MenuRouteObject[]
}
