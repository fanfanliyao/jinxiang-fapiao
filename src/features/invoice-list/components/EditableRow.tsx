/** 新增行按钮 */
export function AddRowButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 12px',
        fontSize: 12,
        border: '1px solid #2660ff',
        borderRadius: 4,
        background: '#fff',
        color: '#2660ff',
        cursor: 'pointer',
        fontWeight: 500,
      }}
    >
      + 新增
    </button>
  )
}

/** 创建一个空行（所有字段都是空值） */
export function createEmptyRow<T extends Record<string, unknown>>(
  keys: (keyof T)[],
  maxId: number,
): T {
  const row: Record<string, unknown> = { id: maxId + 1 }
  keys.forEach((key) => {
    row[String(key)] = ''
  })
  return row as T
}

/** 可编辑的单元格渲染 */
export function EditableCell({
  value,
  onChange,
  type = 'text',
}: {
  value: unknown
  onChange: (v: unknown) => void
  type?: 'text' | 'number'
}) {
  return (
    <input
      type={type}
      value={String(value ?? '')}
      onChange={(e) => onChange(type === 'number' ? Number(e.target.value) || '' : e.target.value)}
      style={{
        width: '100%',
        padding: '4px 8px',
        border: '1px solid #d1d5db',
        borderRadius: 4,
        fontSize: 13,
        boxSizing: 'border-box',
      }}
    />
  )
}
