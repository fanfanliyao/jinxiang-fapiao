import React from 'react'

// SVG 漏斗图标：无筛选时灰色，有筛选时蓝色
function FilterIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill={active ? '#2660ff' : '#8c8c8c'}
      style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 2 }}
    >
      <path d="M1 2h10L7 6.5V11L5 9.5V6.5L1 2z" />
    </svg>
  )
}

// 内部组件，保证 useState 合法
function FilterPanel({
  initialText,
  onConfirm,
  setFilterDropdownVisible,
}: {
  initialText: string
  onConfirm: (v: string) => void
  // eslint-disable-next-line @typescript-eslint/ban-types
  setFilterDropdownVisible: Function
}) {
  const [draft, setDraft] = React.useState(initialText)

  const confirm = () => {
    onConfirm(draft)
    setFilterDropdownVisible(false)
  }
  const reset = () => {
    setDraft('')
    onConfirm('')
    setFilterDropdownVisible(false)
  }

  return (
    <div style={{ padding: '8px 12px', minWidth: 180 }}>
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') confirm() }}
        placeholder="搜索..."
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '4px 8px',
          border: '1px solid #d1d5db',
          borderRadius: 4,
          fontSize: 13,
          outline: 'none',
          marginBottom: 8,
        }}
      />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button
          onClick={reset}
          style={{
            padding: '2px 10px',
            fontSize: 13,
            border: '1px solid #d1d5db',
            borderRadius: 4,
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          重置
        </button>
        <button
          onClick={confirm}
          style={{
            padding: '2px 10px',
            fontSize: 13,
            border: 'none',
            borderRadius: 4,
            background: '#2660ff',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          确定
        </button>
      </div>
    </div>
  )
}

/**
 * 返回用于某一列的 filterIcon 和 filterDropdown 配置
 * filterIcon 始终有值（HiUI 只有 filterIcon 存在时才渲染筛选触发器）
 */
export function makeFilterColumn(
  filterText: string,
  setFilterText: (v: string) => void,
) {
  return {
    filterIcon: <FilterIcon active={!!filterText} />,
    filterDropdown: ({ setFilterDropdownVisible }: { setFilterDropdownVisible: Function }) => (
      <FilterPanel
        initialText={filterText}
        onConfirm={setFilterText}
        setFilterDropdownVisible={setFilterDropdownVisible}
      />
    ),
  }
}

/** 管理多列筛选状态，返回过滤后的数据 */
export function useColumnFilters<T extends Record<string, unknown>>(
  data: T[],
  filterableKeys: string[],
) {
  const [filters, setFilters] = React.useState<Record<string, string>>(
    () => Object.fromEntries(filterableKeys.map((k) => [k, ''])),
  )

  const setFilter = React.useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const filteredData = React.useMemo(() => {
    return data.filter((row) =>
      filterableKeys.every((key) => {
        const text = filters[key]
        if (!text) return true
        const cell = row[key]
        return String(cell ?? '').toLowerCase().includes(text.toLowerCase())
      }),
    )
  }, [data, filters, filterableKeys])

  return { filters, setFilter, filteredData }
}
