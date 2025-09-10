import { FC } from 'react'
import { Retool } from '@tryretool/custom-component-support'

export const DynamicControl: FC = () => {
  // Configuration object - set via Inspector in Retool UI
  const [config, setConfig] = Retool.useStateObject({ 
    name: 'config',
    label: 'Grid Configuration',
    description: 'Configuration object for the grid (type, rows, columns)',
    inspector: 'text'
  })
  
  // Responses object - updated by component interactions
  const [responses, setResponses] = Retool.useStateObject({ 
    name: 'responses',
    label: 'Grid Responses',
    description: 'Current response values from the grid',
    inspector: 'text',
    initialValue: {}
  })

  // Event callback for when responses change
  const onResponseChange = Retool.useEventCallback({ name: 'responseChange' })

  // Set default component size
  Retool.useComponentSettings({
    defaultHeight: 20,
    defaultWidth: 8,
  })

  // Type guard and validation
  const gridConfig = config as any
  const gridResponses = (responses || {}) as any

  // Handle case where config is not provided
  if (!gridConfig || !gridConfig.type) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Dynamic Control Component</h3>
        <p style={{ margin: '0 0 12px 0' }}>Configure this component using the Inspector panel:</p>
        <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '4px', border: '1px solid #ddd' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Config Property:</p>
          <code style={{ fontSize: '12px', backgroundColor: '#f5f5f5', padding: '4px', borderRadius: '2px' }}>
            {`{
  "type": "checkbox",
  "rows": ["Question 1", "Question 2"],
  "columns": ["Strongly Agree", "Agree", "Disagree"]
}`}
          </code>
        </div>
        <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: '#666' }}>
          Current config: <code>{JSON.stringify(config)}</code>
        </p>
      </div>
    )
  }

  const updateResponses = (newResponses: any) => {
    setResponses(newResponses)
    onResponseChange() // Trigger event for Retool event handlers
  }

  // Checkbox / Radio grid
  if (gridConfig.type === 'checkbox' || gridConfig.type === 'radio') {
    const rows = gridConfig.rows || []
    const columns = gridConfig.columns || []
    
    return (
      <div style={{ padding: '16px' }}>
        <table style={{ borderCollapse: 'collapse', border: '1px solid #ccc', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ccc', padding: '12px', textAlign: 'left' }}></th>
              {columns.map((col: string, idx: number) => (
                <th key={idx} style={{ border: '1px solid #ccc', padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: string, rIdx: number) => (
              <tr key={rIdx}>
                <td style={{ border: '1px solid #ccc', padding: '12px', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                  {row}
                </td>
                {columns.map((col: string, cIdx: number) => {
                  const checked = !!(gridResponses[row] && gridResponses[row][col])
                  return (
                    <td key={cIdx} style={{ border: '1px solid #ccc', padding: '12px', textAlign: 'center' }}>
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
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Textbox grid
  if (gridConfig.type === 'misc') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.entries(gridResponses).map(([label, value], idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>{label}</label>
            <input
              type="text"
              value={String(value || '')}
              style={{ 
                border: '1px solid #ccc', 
                borderRadius: '4px', 
                padding: '8px',
                fontSize: '14px'
              }}
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

  return (
    <div style={{ padding: '20px', color: '#666' }}>
      Unknown grid type: {gridConfig.type}
    </div>
  )
}

export const AlchemerImitiation = { DynamicControl }
