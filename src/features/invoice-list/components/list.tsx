import Tabs, { TabPane } from '@hi-ui/tabs'
import NetherlandsTable from './NetherlandsTable'
import GermanyTable from './GermanyTable'
import CzechTable from './CzechTable'
import SpainTable from './SpainTable'
import UKTable from './UKTable'

const TABS = [
  { id: 'nl', title: '荷兰', component: <NetherlandsTable /> },
  { id: 'de', title: '德国', component: <GermanyTable /> },
  { id: 'cz', title: '捷克', component: <CzechTable /> },
  { id: 'es', title: '西班牙', component: <SpainTable /> },
  { id: 'gb', title: '英国', component: <UKTable /> },
]

export default function InvoiceList() {
  return (
    <Tabs defaultActiveId="nl" type="line">
      {TABS.map((tab) => (
        <TabPane key={tab.id} tabId={tab.id} tabTitle={tab.title}>
          <div style={{ paddingTop: 16 }}>
            {tab.component}
          </div>
        </TabPane>
      ))}
    </Tabs>
  )
}
