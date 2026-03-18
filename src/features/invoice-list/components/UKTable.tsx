import React from 'react'
import Table from '@hi-ui/table'
import InvoiceDetailDrawer from './InvoiceDetailDrawer'
import { makeFilterColumn, useColumnFilters } from './ColumnFilter'

const columnDefs = [
  { dataKey: 'fileType',       title: 'File Type',            width: 90  },
  { dataKey: 'month',          title: 'Month',                width: 80  },
  { dataKey: 'invoiceDate',    title: 'Invoice Date',         width: 120 },
  { dataKey: 'invoiceNumber',  title: 'Invoice number',       width: 150 },
  { dataKey: 'vendorName',     title: 'Vendor Name',          width: 200 },
  { dataKey: 'country',        title: 'Country',              width: 90  },
  { dataKey: 'taxCode',        title: 'Tax Code',             width: 100 },
  { dataKey: 'taxCodeDesc',    title: 'Tax Code Description', width: 200 },
  { dataKey: 'description',    title: 'Description',          width: 220 },
  { dataKey: 'deductible',     title: 'Deductible',           width: 110 },
  { dataKey: 'gbpNetAmount',   title: 'GBP Net Amount',       width: 150 },
  { dataKey: 'taxRate',        title: 'Tax Rate',             width: 100 },
  { dataKey: 'vatAmount',      title: 'VAT Amount',           width: 120 },
  { dataKey: 'rsAmount',       title: 'RS Amount',            width: 110 },
  { dataKey: 'totalAmount',    title: 'Total Amount',         width: 130 },
  { dataKey: 'paymentOrderNo', title: 'Payment Order No.',    width: 170 },
  { dataKey: 'remark',         title: 'remark',               width: 90  },
  { dataKey: '_action',        title: '操作',                  width: 80  },
]

const filterableKeys = ['invoiceNumber']

const data = [
  {
    id: 1,
    fileType: 'ISP',
    month: 2,
    invoiceDate: 46036,
    invoiceNumber: 'RHK260100011',
    vendorName: 'HONGKONG YH GLOBAL LOGISTICS CS CO., LIMITED',
    country: 'HK',
    taxCode: 'RS',
    taxCodeDesc: 'Purchase (Reverse Charge)',
    description: 'warehouse storage charge、Last Mile Delivery Charge',
    deductible: 'RS',
    gbpNetAmount: 15069.13,
    taxRate: 0,
    vatAmount: 0,
    rsAmount: 3013.826,
    totalAmount: 15069.13,
    paymentOrderNo: '',
    remark: '',
  },
  {
    id: 2,
    fileType: 'ISP',
    month: 2,
    invoiceDate: 46045,
    invoiceNumber: 16776945,
    vendorName: 'DPDgroup UK Ltd.',
    country: 'GB',
    taxCode: 'P1',
    taxCodeDesc: 'Domestic Purchase - Standard Rate 20%',
    description: 'Parcel',
    deductible: 1,
    gbpNetAmount: 440.71,
    taxRate: 0.2,
    vatAmount: 88.142,
    rsAmount: 0,
    totalAmount: 528.852,
    paymentOrderNo: '',
    remark: '',
  },
  {
    id: 3,
    fileType: 'ISP',
    month: 2,
    invoiceDate: 46037,
    invoiceNumber: 1310019962,
    vendorName: 'SBE Limited',
    country: 'GB',
    taxCode: 'P1',
    taxCodeDesc: 'Domestic Purchase - Standard Rate 20%',
    description: 'labour,logistic costs, special operation',
    deductible: 1,
    gbpNetAmount: 22783.55,
    taxRate: 0.2,
    vatAmount: 4556.71,
    rsAmount: 0,
    totalAmount: 27340.26,
    paymentOrderNo: '',
    remark: '',
  },
]

function toFields(row: (typeof data)[0]) {
  return [
    { label: 'File Type',            value: row.fileType },
    { label: 'Month',                value: row.month },
    { label: 'Invoice Date',         value: row.invoiceDate },
    { label: 'Invoice number',       value: row.invoiceNumber },
    { label: 'Vendor Name',          value: row.vendorName },
    { label: 'Country',              value: row.country },
    { label: 'Tax Code',             value: row.taxCode },
    { label: 'Tax Code Description', value: row.taxCodeDesc },
    { label: 'Description',          value: row.description },
    { label: 'Deductible',           value: row.deductible },
    { label: 'GBP Net Amount',       value: row.gbpNetAmount },
    { label: 'Tax Rate',             value: row.taxRate },
    { label: 'VAT Amount',           value: row.vatAmount },
    { label: 'RS Amount',            value: row.rsAmount },
    { label: 'Total Amount',         value: row.totalAmount },
    { label: 'Payment Order No.',    value: row.paymentOrderNo },
    { label: 'remark',               value: row.remark },
  ]
}

export default function UKTable() {
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
        title="英国发票详情"
        fields={activeRow ? toFields(activeRow) : []}
      />
    </>
  )
}
