import React from 'react'
import Table from '@hi-ui/table'
import InvoiceDetailDrawer from './InvoiceDetailDrawer'
import { makeFilterColumn, useColumnFilters } from './ColumnFilter'
import { EditableCell, createEmptyRow } from './EditableRow'
import { DeleteOutlined } from '@hi-ui/icons'
import { exportToCSV } from './ExportUtils'

const columnDefs = [
  { dataKey: '_delete',           title: '',                               width: 40  },
  { dataKey: 'fileType',          title: 'File Type',                    width: 90  },
  { dataKey: 'paymentNo',         title: 'Payment No.',                  width: 150 },
  { dataKey: 'wdNo',              title: 'WD No.',                       width: 100 },
  { dataKey: 'month',             title: 'Month',                        width: 90  },
  { dataKey: 'invoiceNo',         title: 'Invoice No.',                  width: 160 },
  { dataKey: 'invoiceDate',       title: 'Invoice Date',                 width: 120 },
  { dataKey: 'vendorName',        title: 'Vendor/Beneficiary Name',      width: 240 },
  { dataKey: 'vendorAddress',     title: 'Vendor/Beneficiary Address',   width: 200 },
  { dataKey: 'vendorTaxId',       title: 'Vendor/Beneficiary Tax ID',    width: 180 },
  { dataKey: 'country',           title: 'Country',                      width: 90  },
  { dataKey: 'taxCode',           title: 'Tax Code',                     width: 100 },
  { dataKey: 'paymentDesc',       title: 'Payment Description',          width: 180 },
  { dataKey: 'netAmountCurrency', title: 'Net amount in Currency',       width: 180 },
  { dataKey: 'currency',          title: 'Currency',                     width: 100 },
  { dataKey: 'rate',              title: 'Rate (1 EUR =)',                width: 130 },
  { dataKey: 'netAmountEur',      title: 'Net amount in EUR',            width: 160 },
  { dataKey: 'vatRate',           title: 'VAT Rate',                     width: 100 },
  { dataKey: 'vatAmount',         title: 'VAT Amount',                   width: 110 },
  { dataKey: 'rsAmount',          title: 'RS Amount',                    width: 110 },
  { dataKey: 'totalTaxAmount',    title: 'Total Tax Amount',             width: 150 },
  { dataKey: 'totalAmount',       title: 'Total Amount',                 width: 130 },
  { dataKey: '_action',           title: '操作',                          width: 80  },
]

const filterableKeys = ['paymentNo', 'wdNo', 'invoiceNo']

const data = [
  {
    id: 1,
    fileType: 'CP',
    paymentNo: 'P202511250294',
    wdNo: 'WD531058',
    month: 202601,
    invoiceNo: 'PL03PL30090335',
    invoiceDate: 45980,
    vendorName: 'EY Doradztwo Podatkowe Krupa sp. k.',
    vendorAddress: 'Rondo ONZ 1\n00-124 Warszawa\nPoland',
    vendorTaxId: 'PL5261183835',
    country: 'PL',
    taxCode: '4B',
    paymentDesc: 'EY-NLPL-专户转出&更正服务费',
    netAmountCurrency: 993.74,
    currency: 'EUR',
    rate: 1,
    netAmountEur: 993.74,
    vatRate: 0,
    vatAmount: 0,
    rsAmount: 208.69,
    totalTaxAmount: 208.69,
    totalAmount: 993.74,
  },
  {
    id: 2,
    fileType: 'CP',
    paymentNo: 'P202512120181',
    wdNo: 'WD536979',
    month: 202601,
    invoiceNo: 'X2591211',
    invoiceDate: 45982,
    vendorName: 'KPMG Tax SRL',
    vendorAddress: 'DN1, Soseaua Bucuresti-Ploiesti nr. 89A, Sector 1 013685 București Romania',
    vendorTaxId: 'RO12624270',
    country: 'RO',
    taxCode: '4B',
    paymentDesc: '付罗马尼亚KP税务咨询费',
    netAmountCurrency: 1500,
    currency: 'EUR',
    rate: 1,
    netAmountEur: 1500,
    vatRate: 0,
    vatAmount: 0,
    rsAmount: 315,
    totalTaxAmount: 315,
    totalAmount: 1500,
  },
]

function toFields(row: (typeof data)[0]) {
  return [
    { label: 'File Type',                  value: row.fileType },
    { label: 'Payment No.',                value: row.paymentNo },
    { label: 'WD No.',                     value: row.wdNo },
    { label: 'Month',                      value: row.month },
    { label: 'Invoice No.',                value: row.invoiceNo },
    { label: 'Invoice Date',               value: row.invoiceDate },
    { label: 'Vendor/Beneficiary Name',    value: row.vendorName },
    { label: 'Vendor/Beneficiary Address', value: row.vendorAddress },
    { label: 'Vendor/Beneficiary Tax ID',  value: row.vendorTaxId },
    { label: 'Country',                    value: row.country },
    { label: 'Tax Code',                   value: row.taxCode },
    { label: 'Payment Description',        value: row.paymentDesc },
    { label: 'Net amount in Currency',     value: row.netAmountCurrency },
    { label: 'Currency',                   value: row.currency },
    { label: 'Rate (1 EUR =)',             value: row.rate },
    { label: 'Net amount in EUR',          value: row.netAmountEur },
    { label: 'VAT Rate',                   value: row.vatRate },
    { label: 'VAT Amount',                 value: row.vatAmount },
    { label: 'RS Amount',                  value: row.rsAmount },
    { label: 'Total Tax Amount',           value: row.totalTaxAmount },
    { label: 'Total Amount',               value: row.totalAmount },
  ]
}

export default function NetherlandsTable({ onAddRowHandlerReady }: { onAddRowHandlerReady?: (handler: () => void) => void }) {
  const [drawerVisible, setDrawerVisible] = React.useState(false)
  const [activeRow, setActiveRow] = React.useState<(typeof data)[0] | null>(null)
  const [editingData, setEditingData] = React.useState([...data])
  const [newRowIds, setNewRowIds] = React.useState<Set<number>>(new Set())

  const { filters, setFilter, filteredData } = useColumnFilters(editingData as Record<string, unknown>[], filterableKeys)

  const handleAddRow = () => {
    const maxId = Math.max(...editingData.map((r) => r.id), 0)
    const newId = maxId + 1
    const newRow = createEmptyRow<(typeof data)[0]>(
      columnDefs.map((c) => c.dataKey).filter((k) => k !== '_action' && k !== '_delete') as (keyof (typeof data)[0])[],
      maxId,
    )
    setEditingData([...editingData, newRow])
    setNewRowIds(new Set([...newRowIds, newId]))
  }

  React.useEffect(() => {
    onAddRowHandlerReady?.(handleAddRow)
  }, [onAddRowHandlerReady, editingData, newRowIds])

  // 注册导出函数到全局 window 对象
  React.useEffect(() => {
    (window as any).__invoiceExportData = () => {
      exportToCSV('荷兰发票', filteredData as typeof data, columnDefs)
    }
    return () => {
      delete (window as any).__invoiceExportData
    }
  }, [filteredData])

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
    // 编辑完成后，该行变成只读
    setNewRowIds((prev) => {
      const updated = new Set(prev)
      updated.delete(rowId)
      return updated
    })
  }

  const tableColumns = columnDefs.map((col) => {
    // 删除列
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
    // 操作列
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
    // 只给 filterableKeys 里的列加筛选
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
    // 筛选列
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
        title="荷兰发票详情"
        fields={activeRow ? toFields(activeRow) : []}
      />
    </>
  )
}
