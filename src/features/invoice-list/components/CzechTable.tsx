import React from 'react'
import Table from '@hi-ui/table'
import InvoiceDetailDrawer from './InvoiceDetailDrawer'
import { makeFilterColumn, useColumnFilters } from './ColumnFilter'

const columnDefs = [
  { dataKey: 'pOrderNo',           title: 'P单号',                              width: 150 },
  { dataKey: 'period',             title: 'Period',                             width: 90  },
  { dataKey: 'vendorName',         title: 'Vendor name',                        width: 170 },
  { dataKey: 'vendorVatNo',        title: 'Vendor VAT no.',                     width: 140 },
  { dataKey: 'invoiceNo',          title: 'Invoice no.',                        width: 130 },
  { dataKey: 'supplyDate',         title: 'Supply date',                        width: 120 },
  { dataKey: 'currency',           title: 'Currency',                           width: 100 },
  { dataKey: 'taxRate',            title: 'Tax rate',                           width: 100 },
  { dataKey: 'exchangeRate',       title: 'Exchange rate (foreign currency/CZK)', width: 280 },
  { dataKey: 'dateOfExchangeRate', title: 'Date of exchange rate',              width: 190 },
  { dataKey: 'netAmountForeign',   title: 'Net amount in foreign currency',     width: 230 },
  { dataKey: 'vatAmountForeign',   title: 'VAT amount in foreign currency',     width: 230 },
  { dataKey: 'netAmountCzk',       title: 'Net amount in CZK',                  width: 170 },
  { dataKey: 'vatAmountCzk',       title: 'VAT amount in CZK',                  width: 170 },
  { dataKey: 'description',        title: 'Description',                        width: 200 },
  { dataKey: 'comments',           title: 'Comments',                           width: 200 },
  { dataKey: '_action',            title: '操作',                                width: 80  },
]

const filterableKeys = ['pOrderNo', 'invoiceNo']

const data = [
  {
    id: 1,
    pOrderNo: 'P202601120363',
    period: 46023,
    vendorName: 'CGI Metropole, s.r.o',
    vendorVatNo: 'CZ26120313',
    invoiceNo: '2026100140',
    supplyDate: 46024,
    currency: 'CZK',
    taxRate: 0.21,
    exchangeRate: null as number | null,
    dateOfExchangeRate: null as number | null,
    netAmountForeign: null as number | null,
    vatAmountForeign: null as number | null,
    netAmountCzk: 29009.6,
    vatAmountCzk: 6092.02,
    description: 'Marketing fee 26Q1',
    comments: 'This payment remained unpaid in January',
  },
  {
    id: 2,
    pOrderNo: 'P202601230300',
    period: 46023,
    vendorName: 'KATASTRA s.r.o',
    vendorVatNo: 'CZ21034478',
    invoiceNo: 'FV-117/2025',
    supplyDate: 46022,
    currency: 'CZK',
    taxRate: 0,
    exchangeRate: 24.325,
    dateOfExchangeRate: 46022,
    netAmountForeign: 83483.79,
    vatAmountForeign: null as number | null,
    netAmountCzk: 2030743.19,
    vatAmountCzk: null as number | null,
    description: 'renovation of the commercial premises-reverse charge',
    comments: 'This payment remained unpaid in January',
  },
  {
    id: 3,
    pOrderNo: 'P202601280105',
    period: 46058,
    vendorName: 'PROXY as',
    vendorVatNo: 'CZ15270301',
    invoiceNo: '200252080',
    supplyDate: 46022,
    currency: 'CZK',
    taxRate: 0.21,
    exchangeRate: null as number | null,
    dateOfExchangeRate: null as number | null,
    netAmountForeign: null as number | null,
    vatAmountForeign: null as number | null,
    netAmountCzk: 9371,
    vatAmountCzk: 1968.75,
    description: '【200252080】XRCZ_VAT compliance _2511 | net: CZK 9375 + vat: CZK 1968.75= CZK 11343.75',
    comments: '',
  },
]

function toFields(row: (typeof data)[0]) {
  return [
    { label: 'P单号',                              value: row.pOrderNo },
    { label: 'Period',                             value: row.period },
    { label: 'Vendor name',                        value: row.vendorName },
    { label: 'Vendor VAT no.',                     value: row.vendorVatNo },
    { label: 'Invoice no.',                        value: row.invoiceNo },
    { label: 'Supply date',                        value: row.supplyDate },
    { label: 'Currency',                           value: row.currency },
    { label: 'Tax rate',                           value: row.taxRate },
    { label: 'Exchange rate (foreign currency/CZK)', value: row.exchangeRate },
    { label: 'Date of exchange rate',              value: row.dateOfExchangeRate },
    { label: 'Net amount in foreign currency',     value: row.netAmountForeign },
    { label: 'VAT amount in foreign currency',     value: row.vatAmountForeign },
    { label: 'Net amount in CZK',                  value: row.netAmountCzk },
    { label: 'VAT amount in CZK',                  value: row.vatAmountCzk },
    { label: 'Description',                        value: row.description },
    { label: 'Comments',                           value: row.comments },
  ]
}

export default function CzechTable() {
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
        title="捷克发票详情"
        fields={activeRow ? toFields(activeRow) : []}
      />
    </>
  )
}
