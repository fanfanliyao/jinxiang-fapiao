import { FileTxtOutlined } from '@hi-ui/icons'
import InvoiceList from './components/list'
import BatchImportButton from './components/BatchImportButton'
import type { MenuRouteObject } from '../../types/routes'

const routes: MenuRouteObject[] = [
  {
    title: '进项发票',
    path: 'invoice',
    icon: <FileTxtOutlined />,
    children: [
      {
        title: '发票管理',
        path: 'manage',
        children: [
          {
            title: '进项发票列表',
            path: 'list',
            element: <InvoiceList />,
            extra: <BatchImportButton />,
          },
        ],
      },
    ],
  },
]

export default routes
