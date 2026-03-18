import React from 'react'
import Button from '@hi-ui/button'
import Modal from '@hi-ui/modal'
import Upload from '@hi-ui/upload'
import { UploadOutlined } from '@hi-ui/icons'

export default function BatchImportButton() {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <Button type="primary" icon={<UploadOutlined />} onClick={() => setVisible(true)}>
        批量导入
      </Button>

      <Modal
        visible={visible}
        title="批量导入发票"
        width={560}
        footer={null}
        onClose={() => setVisible(false)}
      >
        <div style={{ paddingBottom: 16 }}>
          <Upload
            type="drag"
            accept=".pdf"
            multiple
            maxCount={99999999999}
            tips="支持上传 PDF 格式，可批量选择多个文件"
            onChange={(files) => {
              console.log('已选择文件：', files)
            }}
          />
        </div>
      </Modal>
    </>
  )
}
