import React from 'react'
import Table from '@hi-ui/table'
import InvoiceDetailDrawer from './InvoiceDetailDrawer'
import { makeFilterColumn, useColumnFilters } from './ColumnFilter'

const columnDefs = [
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

export default function SpainTable() {
  const [drawerVisible, setDrawerVisible] = React.useState(false)
  const [activeRow, setActiveRow] = React.useState<(typeof data)[0] | null>(null)

  const { filters, setFilter, filteredData } = useColumnFilters(data as Record<string, unknown>[], filterableKeys)

  const tableColumns = columnDefs.map((col) => {
    if (col.dataKey === '_action') {
      return {
        ...col,
        render: (_: unknown, row: (typeof data)[0]) => (
          <span
            style={{ color: '#2660ff', cursor: 'pointer' }}
            onClick={() => { setActiveRow(row); setDrawerVisible(true) }}
          >
            详情
          </span>
        ),
      }
    }
    // 只给 filterableKeys 里的列加筛选
    if (!filterableKeys.includes(col.dataKey)) {
      return col
    }
    return {
      ...col,
      ...makeFilterColumn(
        filters[col.dataKey],
        (v) => setFilter(col.dataKey, v),
      ),
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
