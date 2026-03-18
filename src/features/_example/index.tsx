import { SunFilled } from '@hi-ui/icons'
import ExampleBasic from './components/basic'
import ExampleAbout from './components/about'
import type { MenuRouteObject } from '../../types/routes'

// 示例 feature 路由配置
// 可以导出数组或对象，都会被自动归一化为数组
const routes: MenuRouteObject[] = [
  {
    title: '示例',
    path: 'examples',
    icon: <SunFilled />,
    children: [
      {
        title: '示例',
        path: 'example',
        children: [
          // children
          { title: '基础示例', path: 'basic', element: <ExampleBasic /> },
        ],
      },
      {
        title: '其他',
        path: 'other',
        children: [
          // children
          { title: '关于', path: 'about', element: <ExampleAbout /> },
        ],
      },
    ],
  },
]

export default routes
