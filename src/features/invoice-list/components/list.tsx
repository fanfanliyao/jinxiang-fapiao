import React from 'react'
import Tabs, { TabPane } from '@hi-ui/tabs'
import NetherlandsTable from './NetherlandsTable'
import GermanyTable from './GermanyTable'
import CzechTable from './CzechTable'
import SpainTable from './SpainTable'
import UKTable from './UKTable'
import { AddRowButton } from './EditableRow'

const TABS = [
  { id: 'nl', title: '荷兰', component: NetherlandsTable },
  { id: 'de', title: '德国', component: GermanyTable },
  { id: 'cz', title: '捷克', component: CzechTable },
  { id: 'es', title: '西班牙', component: SpainTable },
  { id: 'gb', title: '英国', component: UKTable },
]

export default function InvoiceList() {
  const [activeTabId, setActiveTabId] = React.useState('nl')
  const [addRowHandlers, setAddRowHandlers] = React.useState<Record<string, () => void>>({})

  const activeComponent = TABS.find((t) => t.id === activeTabId)?.component
  const addRowHandler = addRowHandlers[activeTabId]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <Tabs
          defaultActiveId="nl"
          type="line"
          onChange={(id) => setActiveTabId(String(id))}
          style={{ flex: 1 }}
        >
          {TABS.map((tab) => (
            <TabPane key={tab.id} tabId={tab.id} tabTitle={tab.title} />
          ))}
        </Tabs>
        {addRowHandler && <AddRowButton onClick={addRowHandler} />}
      </div>
      {activeComponent && React.createElement(activeComponent, {
        onAddRowHandlerReady: (handler: () => void) => {
          setAddRowHandlers((prev) => ({ ...prev, [activeTabId]: handler }))
        },
      })}
    </div>
  )
}
