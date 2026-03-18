import { HashRouter, useRoutes } from 'react-router-dom'
import { routes } from './routes'
import { AppLayout } from './components/layout'

function App() {
  const element = useRoutes(routes)
  return <AppLayout routes={routes}>{element}</AppLayout>
}

export default function AppWrapper() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  )
}
