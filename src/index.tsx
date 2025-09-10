import { FC, forwardRef, useImperativeHandle } from 'react'
import { Retool } from '@tryretool/custom-component-support'

interface GridConfig {
  type: 'checkbox' | 'radio' | 'misc'
  rows?: string[]
  columns?: string[]
}

interface GridResponses {
  [key: string]: any
}

export const DynamicControl = forwardRef<any, any>((props, ref) => {
  const [config, setConfig] = Retool.useStateObject({ name: 'config' })
  const [responses, setResponses] = Retool.useStateObject({ name: 'responses' })

  // Expose setValue methods for iframe access
  useImperativeHandle(ref, () => ({
    setValue: (newValue: any) => {
      setConfig(newValue)
    },
    getValue: () => config,
    setResponses: (newResponses: any) => {
      setResponses(newResponses)
    },
    getResponses: () => responses
  }))

  // Type guard and validation
  const gridConfig = config as unknown as GridConfig
  const gridResponses = (responses || {}) as GridResponses

  // Handle case where config is not provided - show default grid
  if (!gridConfig || !gridConfig.type) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Dynamic Control Component</h3>
        <p>Ready to receive configuration via setValue():</p>
        <ul>
          <li><strong>config</strong>: Grid configuration object</li>
          <li><strong>responses</strong>: Current response values</li>
        </ul>
        <p>Example: <code>assessorGrid.setValue({`{type: 'checkbox', rows: ['Row1'], columns: ['Col1']}`})</code></p>
        <p>Current config: <code>{JSON.stringify(config)}</code></p>
      </div>
    )
  }

  const updateResponses = (newResponses: GridResponses) => {
    setResponses(newResponses)
  }

  // Checkbox / Radio grid
  if (gridConfig.type === 'checkbox' || gridConfig.type === 'radio') {
    const rows = gridConfig.rows || []
    const columns = gridConfig.columns || []
    
    return (
      <table style={{ borderCollapse: 'collapse', border: '1px solid #ccc' }}>
        <thead>
          <tr>
            <th></th>
            {columns.map((col: string, idx: number) => (
              <th key={idx} style={{ border: '1px solid #ccc', padding: '8px' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: string, rIdx: number) => (
            <tr key={rIdx}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{row}</td>
              {columns.map((col: string, cIdx: number) => {
                const checked = !!(gridResponses[row] && gridResponses[row][col])
                return (
                  <td key={cIdx} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                    <input
                      type={gridConfig.type}
                      name={row}
                      checked={checked}
                      onChange={(e) => {
                        if (gridConfig.type === 'checkbox') {
                          const newResponses = {
                            ...gridResponses,
                            [row]: { ...(gridResponses[row] || {}), [col]: e.target.checked },
                          }
                          updateResponses(newResponses)
                        } else if (gridConfig.type === 'radio') {
                          const newResponses = { ...gridResponses, [row]: { [col]: true } }
                          updateResponses(newResponses)
                        }
                      }}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  // Textbox grid
  if (gridConfig.type === 'misc') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Object.entries(gridResponses).map(([label, value], idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '4px', fontWeight: 'bold' }}>{label}</label>
            <input
              type="text"
              value={String(value || '')}
              style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '4px' }}
              onChange={(e) => {
                const newResponses = { ...gridResponses, [label]: e.target.value }
                updateResponses(newResponses)
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  return <div>Unknown type: {gridConfig.type}</div>
})

DynamicControl.displayName = 'DynamicControl'

export const AlchemerImitiation = { DynamicControl }
