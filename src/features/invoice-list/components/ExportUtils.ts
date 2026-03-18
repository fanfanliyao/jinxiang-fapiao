/**
 * 将数据导出为 CSV 格式并下载
 */
export function exportToCSV(filename: string, data: Record<string, unknown>[], columnDefs: { dataKey: string; title: string }[]) {
  // 过滤掉特殊列（_delete, _action）
  const visibleColumns = columnDefs.filter((col) => !col.dataKey.startsWith('_'))

  // 生成 CSV 表头
  const headers = visibleColumns.map((col) => `"${col.title}"`).join(',')

  // 生成 CSV 行
  const rows = data.map((row) =>
    visibleColumns
      .map((col) => {
        const value = row[col.dataKey]
        const strValue = String(value ?? '')
        // 如果包含逗号、引号或换行符，需要用引号包围并转义
        return strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')
          ? `"${strValue.replace(/"/g, '""')}"`
          : `"${strValue}"`
      })
      .join(','),
  )

  // 组合 CSV 内容
  const csvContent = [headers, ...rows].join('\n')

  // 创建 Blob 并下载
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
