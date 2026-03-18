import React from 'react'
import Table from '@hi-ui/table'
import InvoiceDetailDrawer from './InvoiceDetailDrawer'
import { makeFilterColumn, useColumnFilters } from './ColumnFilter'

const columnDefs = [
  { dataKey: 'receiveMonth',   title: 'Receive Month',      width: 130 },
  { dataKey: 'documentSource', title: 'Document Source',    width: 150 },
  { dataKey: 'documentNo',     title: 'Document no.',       width: 150 },
  { dataKey: 'supplier',       title: 'Supplier',           width: 200 },
  { dataKey: 'supplierVatNo',  title: 'Supplier VAT no.',   width: 160 },
  { dataKey: 'invoiceNumber',  title: 'Invoice number',     width: 140 },
  { dataKey: 'invoiceDate',    title: 'Invoice Date',       width: 120 },
  { dataKey: 'currency',       title: 'currency',           width: 90  },
  { dataKey: 'netAmountNoVat', title: 'Net amount w/o VAT', width: 170 },
  { dataKey: 'vat',            title: 'VAT',                width: 80  },
  { dataKey: 'totalAmount',    title: 'Total amount',       width: 130 },
  { dataKey: 'vatRate',        title: 'VAT rate',           width: 90  },
  { dataKey: 'purchaseItem',   title: 'Purchase item',      width: 260 },
  { dataKey: 'reverseCharge',  title: '是否反向征税',         width: 110 },
  { dataKey: 'deductible',     title: '能否抵扣',             width: 90  },
  { dataKey: '_action',        title: '操作',                width: 80  },
]

const filterableKeys = ['documentNo']

const data = [
  {
    id: 1,
    receiveMonth: 202603,
    documentSource: 'Public Payment',
    documentNo: 'P202602260399',
    supplier: 'Drewes Electronics GmbH',
    supplierVatNo: 'DE180673466',
    invoiceNumber: 432900,
    invoiceDate: 46058,
    currency: 'EUR',
    netAmountNoVat: 48820,
    vat: 9275.8,
    totalAmount: 58095.8,
    vatRate: 0.19,
    purchaseItem: 'VDF Drewes 25 Q4返利结算 返利单号：FL2602260139',
    reverseCharge: '',
    deductible: '',
  },
  {
    id: 2,
    receiveMonth: 202603,
    documentSource: 'Public Payment',
    documentNo: 'P202602250409',
    supplier: 'Sfone GmbH & Co. KG',
    supplierVatNo: 'DE347479811',
    invoiceNumber: 'RG015053',
    invoiceDate: 46052,
    currency: 'EUR',
    netAmountNoVat: 38420,
    vat: 7299.8,
    totalAmount: 45719.8,
    vatRate: 0.19,
    purchaseItem: '运营商Sfone GmbH & Co.KG-VDF 25Q4返利结算 返利单号：FL2602250102',
    reverseCharge: '',
    deductible: '',
  },
]

function toFields(row: (typeof data)[0]) {
  return [
    { label: 'Receive Month',      value: row.receiveMonth },
    { label: 'Document Source',    value: row.documentSource },
    { label: 'Document no.',       value: row.documentNo },
    { label: 'Supplier',           value: row.supplier },
    { label: 'Supplier VAT no.',   value: row.supplierVatNo },
    { label: 'Invoice number',     value: row.invoiceNumber },
    { label: 'Invoice Date',       value: row.invoiceDate },
    { label: 'currency',           value: row.currency },
    { label: 'Net amount w/o VAT', value: row.netAmountNoVat },
    { label: 'VAT',                value: row.vat },
    { label: 'Total amount',       value: row.totalAmount },
    { label: 'VAT rate',           value: row.vatRate },
    { label: 'Purchase item',      value: row.purchaseItem },
    { label: '是否反向征税',          value: row.reverseCharge },
    { label: '能否抵扣',              value: row.deductible },
  ]
}

export default function GermanyTable() {
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
        title="德国发票详情"
        fields={activeRow ? toFields(activeRow) : []}
      />
    </>
  )
}
