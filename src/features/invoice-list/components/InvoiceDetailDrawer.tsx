import React from 'react'
import Drawer from '@hi-ui/drawer'
import Modal from '@hi-ui/modal'
import { Descriptions } from '@hi-ui/descriptions'

export interface InvoiceDetailDrawerProps {
  visible: boolean
  onClose: () => void
  title?: string
  /** 描述列表数据，每项 { label, value } */
  fields: { label: string; value: React.ReactNode }[]
  /** 票面预览图片 URL，暂无时留空 */
  previewUrl?: string
}

export default function InvoiceDetailDrawer({
  visible,
  onClose,
  title = '发票详情',
  fields,
  previewUrl,
}: InvoiceDetailDrawerProps) {
  const [previewVisible, setPreviewVisible] = React.useState(false)

  // 在 fields 末尾追加"我的票面"行
  const allFields = [
    ...fields,
    {
      label: '我的票面',
      value: (
        <span
          style={{ color: '#2660ff', cursor: 'pointer' }}
          onClick={() => setPreviewVisible(true)}
        >
          发票预览
        </span>
      ),
    },
  ]

  return (
    <>
      <Drawer
        visible={visible}
        title={title}
        width={520}
        onClose={onClose}
        footer={null}
      >
        <Descriptions
          column={1}
          labelWidth={180}
          appearance="table"
          data={allFields.map((f, i) => ({
            id: String(i),
            label: f.label,
            value: f.value,
          }))}
        />
      </Drawer>

      <Modal
        visible={previewVisible}
        title="发票预览"
        width={800}
        footer={null}
        onClose={() => setPreviewVisible(false)}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="发票票面"
            style={{ width: '100%', display: 'block' }}
          />
        ) : (
          <div
            style={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#91959e',
              fontSize: 14,
            }}
          >
            暂无票面图片
          </div>
        )}
      </Modal>
    </>
  )
}
