import React, { FC, forwardRef, useImperativeHandle } from 'react'
import { Retool } from '@tryretool/custom-component-support'

// STABLE GRID: Unified config+responses component with support for checkbox, radio, and misc types
export const StableGrid: FC = () => {
  // Single state variable containing unified config+responses structure
  const [configString, setConfigString] = Retool.useStateString({ 
    name: 'config',
    label: 'Grid Config',
    description: 'Unified JSON configuration including type, rows, columns, and responses',
    inspector: 'text',
    initialValue: ''
  })

  // WORKAROUND: Hidden state variable for external access to current responses
  const [currentResponses, setCurrentResponses] = Retool.useStateString({
    name: 'currentResponses',
    label: 'Current Responses',
    description: 'JSON string of current user responses - accessible externally',
    inspector: 'hidden',  // Hidden from UI but accessible via stableGrid1.currentResponses
    initialValue: '{}'
  })

  // WORKAROUND: Event callback to notify external components when responses change
  const onResponsesChanged = Retool.useEventCallback({
    name: 'onResponsesChanged'
  })

  // Safe string conversion function
  const safeStringify = (value: any): string => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value)
      } catch (e) {
        return '[Object]'
      }
    }
    return String(value)
  }

  // Parse unified config safely - handle both string and object inputs
  let config: any = null
  let configDisplay = ''
  try {
    if (typeof configString === 'string') {
      configDisplay = configString
      config = configString && configString.trim() ? JSON.parse(configString) : null
    } else if (typeof configString === 'object' && configString !== null) {
      configDisplay = safeStringify(configString)
      config = configString
    } else {
      configDisplay = safeStringify(configString)
    }
  } catch (e) {
    console.log('Config parsing error:', e)
    configDisplay = safeStringify(configString)
    config = null
  }

  // RESET DETECTION: Check for special reset configuration
  React.useEffect(() => {
    if (config && config.type === 'RESET_COMPONENT') {
      console.log('Reset command detected - clearing component state')
      
      // Clear both internal and external state
      setConfigString('')
      setCurrentResponses('{}')
      
      // Fire event to notify external components
      onResponsesChanged()
    }
  }, [config, setConfigString, setCurrentResponses, onResponsesChanged])

  // Extract responses from unified config (default to empty object)
  const responses = config?.responses || {}

  // Update responses within unified config structure - DUAL STATE PATTERN with workaround
  const updateResponses = (newResponses: any) => {
    if (!config) {
      console.log('No config available for update')
      return
    }
    
    const updatedConfig = {
      ...config,
      responses: newResponses
    }
    
    console.log('Updating config with new responses:', updatedConfig)
    
    // INTERNAL STATE: Update unified config for component display
    setConfigString(JSON.stringify(updatedConfig))
    
    // WORKAROUND: Update external accessible state for external components
    setCurrentResponses(JSON.stringify(newResponses))
    
    // WORKAROUND: Fire event to notify external components of changes
    onResponsesChanged()
  }

  // Show debug if no config
  if (!config || !config.type) {
    return (
      <div style={{ padding: '20px', border: '2px solid #007bff', borderRadius: '8px', backgroundColor: '#e7f3ff' }}>
        <h3 style={{ color: '#004085' }}>🔧 Stable Grid (Unified Structure)</h3>
        <p><strong>Config Type:</strong> <code>{safeStringify(typeof configString)}</code></p>
        <p><strong>Config Value:</strong> <code>{configDisplay || 'EMPTY'}</code></p>
        
        <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#cce7ff', borderRadius: '4px', fontSize: '12px' }}>
          <strong>Test Examples:</strong><br/>
          <strong>Checkbox:</strong> <code>{'{"type":"checkbox","rows":["Q1","Q2"],"columns":["A","B"],"responses":{}}'}</code><br/>
          <strong>Radio:</strong> <code>{'{"type":"radio","rows":["Q1","Q2"],"columns":["A","B"],"responses":{}}'}</code><br/>
          <strong>Textboxes:</strong> <code>{'{"type":"misc","rows":["Field1","Field2"],"responses":{"Field1":"","Field2":""}}'}</code>
        </div>
      </div>
    )
  }

  // Checkbox / Radio grid
  if (config.type === 'checkbox' || config.type === 'radio') {
    const rows = config.rows || []
    const columns = config.columns || []
    
    return (
      <>
        <style>{`
          .stable-grid-container * {
            font-size: 12px !important;
            font-family: "Inter var", Inter, sans-serif !important;
          }
          .stable-grid-container table {
            font-size: 12px !important;
          }
          .stable-grid-container th, .stable-grid-container td {
            font-size: 12px !important;
          }
        `}</style>
        <div className="stable-grid-container" style={{ fontFamily: '"Inter var", Inter, sans-serif', fontSize: '12px' }}>
          <table style={{ borderCollapse: 'collapse', border: '1px solid #ccc', width: '100%', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left', fontFamily: '"Inter var", Inter, sans-serif', fontSize: '12px' }}></th>
              {columns.map((col: string, idx: number) => (
                <th key={idx} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center', fontWeight: 'bold', fontFamily: '"Inter var", Inter, sans-serif', fontSize: '12px' }}>
                  {safeStringify(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: string, rIdx: number) => (
              <tr key={rIdx}>
                <td style={{ border: '1px solid #ccc', padding: '8px', fontWeight: 'bold', backgroundColor: '#f9f9f9', fontFamily: '"Inter var", Inter, sans-serif', fontSize: '12px' }}>
                  {safeStringify(row)}
                </td>
                {columns.map((col: string, cIdx: number) => {
                  const checked = !!(responses[row] && responses[row][col])
                  return (
                    <td key={cIdx} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                      <input
                        type={config.type}
                        name={row}
                        checked={checked}
                        onChange={(e) => {
                          if (config.type === 'checkbox') {
                            const newResponses = {
                              ...responses,
                              [row]: { ...(responses[row] || {}), [col]: e.target.checked },
                            }
                            updateResponses(newResponses)
                          } else if (config.type === 'radio') {
                            const newResponses = { ...responses, [row]: { [col]: true } }
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
      </>
    )
  }

  // Textbox grid (misc type)
  if (config.type === 'misc') {
    const rows = config.rows || []
    
    return (
      <>
        <style>{`
          .stable-grid-textbox * {
            font-size: 12px !important;
            font-family: "Inter var", Inter, sans-serif !important;
          }
          .stable-grid-textbox input {
            font-size: 12px !important;
          }
          .stable-grid-textbox label {
            font-size: 12px !important;
          }
        `}</style>
        <div className="stable-grid-textbox" style={{ fontFamily: '"Inter var", Inter, sans-serif', fontSize: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rows.map((rowLabel: string, idx: number) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '6px', fontWeight: 'bold', color: '#333', fontFamily: '"Inter var", Inter, sans-serif', fontSize: '12px' }}>
                {safeStringify(rowLabel)}
              </label>
              <input
                type="text"
                value={safeStringify(responses[rowLabel] || '')}
                style={{ 
                  border: '1px solid #ccc', 
                  borderRadius: '4px', 
                  padding: '8px',
                  fontSize: '12px',
                  fontFamily: '"Inter var", Inter, sans-serif'
                }}
                onChange={(e) => {
                  const newResponses = { ...responses, [rowLabel]: e.target.value }
                  updateResponses(newResponses)
                }}
                placeholder={`Enter ${safeStringify(rowLabel)}...`}
              />
            </div>
          ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        .stable-grid-error * {
          font-size: 12px !important;
          font-family: "Inter var", Inter, sans-serif !important;
        }
      `}</style>
      <div className="stable-grid-error" style={{ padding: '20px', color: '#666', border: '1px solid #ccc', borderRadius: '8px', fontFamily: '"Inter var", Inter, sans-serif', fontSize: '12px' }}>
        <strong>Unknown grid type:</strong> {safeStringify(config.type)}
      </div>
    </>
  )
}

// Export for Retool Custom Component Library
export const DynamicControlLibrary = { 
  StableGrid
}
