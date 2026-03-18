import React from 'react'
import Table from '@hi-ui/table'
import InvoiceDetailDrawer from './InvoiceDetailDrawer'
import { makeFilterColumn, useColumnFilters } from './ColumnFilter'
import { EditableCell, createEmptyRow } from './EditableRow'
import { DeleteOutlined } from '@hi-ui/icons'
import { exportToCSV } from './ExportUtils'

const columnDefs = [
  { dataKey: '_delete',       title: '',                               width: 40  },
  { dataKey: 'year',          title: 'Year',                         width: 80  },
  { dataKey: 'period',        title: 'Period',                       width: 80  },
  { dataKey: 'type',          title: 'Type (Invoice or Credit note)', width: 260 },
  { dataKey: 'taxCode',       title: 'Tax code',                     width: 100 },
  { dataKey: 'invoiceNumber', title: 'Invoice Number',               width: 160 },
  { dataKey: 'postingDate',   title: 'Posting date',                 width: 120 },
  { dataKey: 'issuanceDate',  title: 'Issuance date',                width: 130 },
  { dataKey: 'companyName',   title: 'Full company name',            width: 200 },
  { dataKey: 'country',       title: 'Country',                      width: 90  },
  { dataKey: 'vatNumber',     title: 'VAT number',                   width: 120 },
  { dataKey: 'vatDeductible', title: 'VAT deductible',               width: 130 },
  { dataKey: 'taxableBase',   title: 'Taxable Base',                 width: 120 },
  { dataKey: 'rate',          title: 'Rate',                         width: 80  },
  { dataKey: 'vatAmount',     title: 'VAT amount',                   width: 120 },
  { dataKey: '_action',       title: '操作',                          width: 80  },
]

const filterableKeys = ['invoiceNumber']

const data = [
  {
    id: 1,
    year: 2026,
    period: '02',
    type: 'Invoice',
    taxCode: null as string | null,
    invoiceNumber: 'F20260003',
    postingDate: null as number | null,
    issuanceDate: 46045,
    companyName: 'GRUPO CREACION EXITOSA,SL',
    country: 'ES',
    vatNumber: 'B70697826',
    vatDeductible: 12.6,
    taxableBase: 60,
    rate: 0.21,
    vatAmount: 12.6,
  },
  {
    id: 2,
    year: 2026,
    period: '02',
    type: 'Invoice',
    taxCode: null as string | null,
    invoiceNumber: '8275566518',
    postingDate: null as number | null,
    issuanceDate: 45951,
    companyName: 'TD SYNNEX SPAIN,S.L.UNIP.',
    country: 'ES',
    vatNumber: 'ESB58728585',
    vatDeductible: 7387.8,
    taxableBase: 35180,
    rate: 0.21,
    vatAmount: 7387.8,
  },
]

function toFields(row: (typeof data)[0]) {
  return [
    { label: 'Year',                         value: row.year },
    { label: 'Period',                       value: row.period },
    { label: 'Type (Invoice or Credit note)', value: row.type },
    { label: 'Tax code',                     value: row.taxCode },
    { label: 'Invoice Number',               value: row.invoiceNumber },
    { label: 'Posting date',                 value: row.postingDate },
    { label: 'Issuance date',                value: row.issuanceDate },
    { label: 'Full company name',            value: row.companyName },
    { label: 'Country',                      value: row.country },
    { label: 'VAT number',                   value: row.vatNumber },
    { label: 'VAT deductible',               value: row.vatDeductible },
    { label: 'Taxable Base',                 value: row.taxableBase },
    { label: 'Rate',                         value: row.rate },
    { label: 'VAT amount',                   value: row.vatAmount },
  ]
}

export default function SpainTable({ onAddRowHandlerReady }: { onAddRowHandlerReady?: (handler: () => void) => void }) {
  const [drawerVisible, setDrawerVisible] = React.useState(false)
  const [activeRow, setActiveRow] = React.useState<(typeof data)[0] | null>(null)
  const [editingData, setEditingData] = React.useState([...data])
  const [newRowIds, setNewRowIds] = React.useState<Set<number>>(new Set())

  const { filters, setFilter, filteredData } = useColumnFilters(editingData as Record<string, unknown>[], filterableKeys)

  const handleAddRow = () => {
    const maxId = Math.max(...editingData.map((r) => r.id), 0)
    const newRow = createEmptyRow<(typeof data)[0]>(
      columnDefs.map((c) => c.dataKey).filter((k) => k !== '_action' && k !== '_delete') as (keyof (typeof data)[0])[],
      maxId,
    )
    setEditingData([...editingData, newRow])
    setNewRowIds(new Set([...newRowIds, maxId + 1]))
  }

  const handleDeleteRow = (rowId: number) => {
    setEditingData((prev) => prev.filter((row) => row.id !== rowId))
    setNewRowIds((prev) => {
      const updated = new Set(prev)
      updated.delete(rowId)
      return updated
    })
  }

  const handleCellChange = (rowId: number, key: string, value: unknown) => {
    setEditingData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [key]: value } : row)),
    )
  }

  const handleConfirmEdit = (rowId: number) => {
    setNewRowIds((prev) => {
      const updated = new Set(prev)
      updated.delete(rowId)
      return updated
    })
  }

  React.useEffect(() => {
    onAddRowHandlerReady?.(handleAddRow)
  }, [onAddRowHandlerReady, editingData, newRowIds])

  React.useEffect(() => {
    (window as any).__invoiceExportData = () => {
      exportToCSV('西班牙发票', filteredData as typeof data, columnDefs)
    }
    return () => {
      delete (window as any).__invoiceExportData
    }
  }, [filteredData])

  const tableColumns = columnDefs.map((col) => {
    if (col.dataKey === '_delete') {
      return {
        ...col,
        render: (_: unknown, row: (typeof data)[0]) => (
          <DeleteOutlined
            style={{ color: '#ff4d4f', cursor: 'pointer', fontSize: 14 }}
            onClick={() => handleDeleteRow(row.id)}
          />
        ),
      }
    }
    if (col.dataKey === '_action') {
      return {
        ...col,
        render: (_: unknown, row: (typeof data)[0]) => {
          const isEditing = newRowIds.has(row.id)
          return isEditing ? (
            <button
              onClick={() => handleConfirmEdit(row.id)}
              style={{
                padding: '2px 8px',
                fontSize: 13,
                border: 'none',
                borderRadius: 4,
                background: '#2660ff',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              保存
            </button>
          ) : (
            <span
              style={{ color: '#2660ff', cursor: 'pointer' }}
              onClick={() => { setActiveRow(row); setDrawerVisible(true) }}
            >
              详情
            </span>
          )
        },
      }
    }
    if (!filterableKeys.includes(col.dataKey)) {
      return {
        ...col,
        render: (value: unknown, row: (typeof data)[0]) => {
          const isEditing = newRowIds.has(row.id)
          return isEditing ? (
            <EditableCell
              value={value}
              onChange={(v) => handleCellChange(row.id, col.dataKey, v)}
            />
          ) : (
            String(value ?? '')
          )
        },
      }
    }
    return {
      ...col,
      ...makeFilterColumn(
        filters[col.dataKey],
        (v) => setFilter(col.dataKey, v),
      ),
      render: (value: unknown, row: (typeof data)[0]) => {
        const isEditing = newRowIds.has(row.id)
        return isEditing ? (
          <EditableCell
            value={value}
            onChange={(v) => handleCellChange(row.id, col.dataKey, v)}
          />
        ) : (
          String(value ?? '')
        )
      },
    }
  })

  return (
    <>
      <Table
        bordered
        columns={tableColumns}
        data={filteredData as typeof data}
        maxHeight={500}
        pagination={{ pageSize: 20, total: filteredData.length, pageSizeOptions: [10, 20, 50, 100] }}
      />
      <InvoiceDetailDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        title="西班牙发票详情"
        fields={activeRow ? toFields(activeRow) : []}
      />
    </>
  )
}
