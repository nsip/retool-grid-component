import React, { FC, forwardRef, useImperativeHandle } from 'react'
import { Retool } from '@tryretool/custom-component-support'

// Type declarations for app state variables
declare global {
  interface Window {
    assessorGridConfig?: string;
    assessorGridResponses?: string;
  }
}

// Test component with useImperativeHandle for external method exposure
export const ImperativeTest = forwardRef<any, any>((props, ref) => {
  // Use useStateString (we know this works)
  const [testValue, setTestValue] = Retool.useStateString({ 
    name: 'testValue',
    label: 'Test Value',
    description: 'Test string for imperative handle',
    inspector: 'text',
    initialValue: 'initial'
  })

  // Expose methods for external access
  useImperativeHandle(ref, () => ({
    setValue: (newValue: string) => {
      console.log('ImperativeTest setValue called with:', newValue)
      setTestValue(newValue)
    },
    getValue: () => {
      console.log('ImperativeTest getValue called, returning:', testValue)
      return testValue
    }
  }))

  return (
    <div style={{ 
      padding: '20px', 
      border: '3px solid #007bff', 
      borderRadius: '8px', 
      backgroundColor: '#e7f3ff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ margin: '0 0 16px 0', color: '#004085' }}>
        🔧 Imperative Handle Test
      </h2>
      
      <div style={{ 
        padding: '12px', 
        backgroundColor: '#cce7ff', 
        borderRadius: '4px',
        marginBottom: '12px'
      }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Current Value:</h4>
        <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>
          testValue: <code>"{testValue}"</code>
        </p>
      </div>

      <div style={{ 
        padding: '12px', 
        backgroundColor: '#fff3cd', 
        borderRadius: '4px',
        marginBottom: '12px'
      }}>
        <h4 style={{ margin: '0 0 8px 0' }}>External Method Test:</h4>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
          Test these commands in browser console:
        </p>
        <code style={{ 
          fontSize: '12px', 
          backgroundColor: '#f5f5f5', 
          padding: '8px', 
          borderRadius: '2px', 
          display: 'block',
          whiteSpace: 'pre-line'
        }}>
{`// Test setValue method
imperativeTest1.setValue("Hello from external!");

// Test getValue method  
imperativeTest1.getValue();`}
        </code>
      </div>

      <div style={{ 
        padding: '12px', 
        backgroundColor: '#d4edda', 
        borderRadius: '4px'
      }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Inspector Panel:</h4>
        <p style={{ margin: '0', fontSize: '14px' }}>
          "Test Value" property should appear in Inspector panel and be manually editable.
        </p>
      </div>

      <div style={{ 
        marginTop: '16px',
        padding: '8px',
        backgroundColor: '#f8d7da',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <strong>Expected Results:</strong><br/>
        ✅ setValue() should update the display<br/>
        ✅ getValue() should return current value<br/>
        ✅ Console should show method call logs<br/>
        ✅ Inspector panel should work for manual changes
      </div>
    </div>
  )
})

// Keep previous test components for reference
export const MinimalTest: FC = () => {
  return (
    <div style={{ padding: '20px', border: '2px solid #28a745', borderRadius: '8px', backgroundColor: '#d4edda' }}>
      <h3 style={{ color: '#155724' }}>✅ Minimal Test - WORKING</h3>
      <p>Basic component rendering works correctly.</p>
    </div>
  )
}

export const StateTest: FC = () => {
  const [testValue] = Retool.useStateString({ 
    name: 'testValue',
    label: 'Test Value',
    description: 'Simple test string',
    inspector: 'text',
    initialValue: 'default'
  })

  return (
    <div style={{ padding: '20px', border: '2px solid #ffc107', borderRadius: '8px', backgroundColor: '#fff3cd' }}>
      <h3 style={{ color: '#856404' }}>⚠️ State Test - PARTIAL</h3>
      <p>Inspector works, external assignment doesn't.</p>
      <p>testValue: <code>"{testValue}"</code></p>
    </div>
  )
}

export const TestStateObject: FC = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Previous Test Components</h3>
      <p>Use ImperativeTest for the latest testing.</p>
    </div>
  )
}

export const DynamicControl: FC = () => {
  // Configuration string - using useStateString (we know this works)
  const [configString, setConfigString] = Retool.useStateString({ 
    name: 'config',
    label: 'Grid Configuration',
    description: 'JSON configuration for the grid (type, rows, columns)',
    inspector: 'text',
    initialValue: ''
  })
  
  // Responses object - using useStateString with JSON
  const [responsesString, setResponsesString] = Retool.useStateString({ 
    name: 'responses',
    label: 'Grid Responses',
    description: 'Current response values from the grid',
    inspector: 'text',
    initialValue: '{}'
  })

  // Event callback for when responses change
  const onResponseChange = Retool.useEventCallback({ name: 'responseChange' })

  // Set default component size
  Retool.useComponentSettings({
    defaultHeight: 20,
    defaultWidth: 8,
  })

  // PostMessage state for debugging
  const [lastMessage, setLastMessage] = React.useState('')
  const [messageHistory, setMessageHistory] = React.useState<string[]>([])

  // Use refs to always have access to current state values
  const configStringRef = React.useRef(configString)
  const responsesStringRef = React.useRef(responsesString)
  configStringRef.current = configString
  responsesStringRef.current = responsesString

  // App state integration - sync with global app state on mount and when values change
  React.useEffect(() => {
    // Sync from app state to component on mount
    if (typeof window !== 'undefined' && window.assessorGridConfig) {
      const appConfig = window.assessorGridConfig;
      if (appConfig && appConfig !== configString) {
        setConfigString(appConfig);
        console.log('✅ Synced config from app state to component on mount');
      }
    }
    
    if (typeof window !== 'undefined' && window.assessorGridResponses) {
      const appResponses = window.assessorGridResponses;
      if (appResponses && appResponses !== responsesString) {
        setResponsesString(appResponses);
        console.log('✅ Synced responses from app state to component on mount');
      }
    }
  }, []);

  // Sync component changes back to app state
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.assessorGridConfig = configString;
      console.log('✅ Synced config from component to app state');
    }
  }, [configString]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.assessorGridResponses = responsesString;
      console.log('✅ Synced responses from component to app state');
    }
  }, [responsesString]);

  // PostMessage listener for programmatic control
  React.useEffect(() => {
    console.log('🎯 DynamicControl: Setting up PostMessage listener');
    console.log('🎯 DynamicControl: Window context:', {
      isParent: window === window.parent,
      isTop: window === window.top,
      location: window.location.href
    });
    
    const handleMessage = (event: MessageEvent) => {
      console.log('🎯 DynamicControl: Received message:', event.data);
      console.log('🎯 DynamicControl: Message origin:', event.origin);
      console.log('🎯 DynamicControl: Event source:', event.source === window ? 'same window' : 'different window');
      
      // Allow messages from null origin (common in iframe environments) and same origin
      if (event.data && typeof event.data === 'object') {
        const { type, action, payload, id, targetIframe } = event.data
        
        console.log('🎯 DynamicControl: Message type:', type, 'action:', action);
        
        // Handle Retool's componentProps messages (the key missing piece!)
        if (event.data.componentProps) {
          console.log('🎯 DynamicControl: Processing componentProps from Retool');
          const { config, responses } = event.data.componentProps;
          
          if (config && config !== configString) {
            console.log('🎯 DynamicControl: Updating config from componentProps:', config);
            setConfigString(config);
          }
          
          if (responses && JSON.stringify(responses) !== responsesString) {
            console.log('🎯 DynamicControl: Updating responses from componentProps:', responses);
            setResponsesString(JSON.stringify(responses));
          }
        }
        
        if (type === 'RETOOL_COMPONENT_COMMAND') {
          console.log('🎯 DynamicControl: Processing RETOOL_COMPONENT_COMMAND');
          const timestamp = new Date().toLocaleTimeString()
          const messageInfo = `${timestamp}: ${action} - ${JSON.stringify(payload)}`
          
          setLastMessage(messageInfo)
          setMessageHistory(prev => [...prev.slice(-4), messageInfo]) // Keep last 5 messages
          
          // Handle different commands
          switch (action) {
            case 'setConfig':
              const configStr = typeof payload === 'string' ? payload : JSON.stringify(payload)
              setConfigString(configStr)
              // Send response back to parent
              if (window.parent) {
                window.parent.postMessage({
                  type: 'RETOOL_COMPONENT_RESPONSE',
                  action: 'setConfig',
                  success: true,
                  payload: { config: configStr },
                  id: id
                }, '*')
              }
              break
              
            case 'getConfig':
              // Send current config back to parent using ref
              if (window.parent) {
                window.parent.postMessage({
                  type: 'RETOOL_COMPONENT_RESPONSE',
                  action: 'getConfig',
                  success: true,
                  payload: { config: configStringRef.current },
                  id: id
                }, '*')
              }
              break

            case 'setResponses':
              const responsesStr = typeof payload === 'string' ? payload : JSON.stringify(payload)
              setResponsesString(responsesStr)
              onResponseChange() // Trigger Retool event
              // Send response back to parent
              if (window.parent) {
                window.parent.postMessage({
                  type: 'RETOOL_COMPONENT_RESPONSE',
                  action: 'setResponses',
                  success: true,
                  payload: { responses: responsesStr },
                  id: id
                }, '*')
              }
              break
              
            case 'getResponses':
              // Send current responses back to parent using ref
              if (window.parent) {
                window.parent.postMessage({
                  type: 'RETOOL_COMPONENT_RESPONSE',
                  action: 'getResponses',
                  success: true,
                  payload: { responses: responsesStringRef.current },
                  id: id
                }, '*')
              }
              break

            case 'ping':
              // Respond to ping requests
              if (window.parent) {
                window.parent.postMessage({
                  type: 'RETOOL_COMPONENT_RESPONSE',
                  action: 'ping',
                  success: true,
                  payload: { status: 'alive', timestamp: new Date().toISOString() },
                  id: id
                }, '*')
              }
              break

            case 'getStatus':
              // Send component status information
              if (window.parent) {
                window.parent.postMessage({
                  type: 'RETOOL_COMPONENT_RESPONSE',
                  action: 'getStatus',
                  success: true,
                  payload: { 
                    componentName: 'DynamicControl',
                    status: 'active',
                    configLength: configStringRef.current?.length || 0,
                    responsesLength: responsesStringRef.current?.length || 0,
                    timestamp: new Date().toISOString()
                  },
                  id: id
                }, '*')
              }
              break
              
            default:
              // Send error response for unknown commands
              if (window.parent) {
                window.parent.postMessage({
                  type: 'RETOOL_COMPONENT_RESPONSE',
                  action: action,
                  success: false,
                  payload: { error: `Unknown action: ${action}` },
                  id: id
                }, '*')
              }
          }
        }
      }
    }

    window.addEventListener('message', handleMessage)
    
    // Note: Removed parent window listener due to cross-origin restrictions
    // The component will only listen for direct PostMessage events
    
    // Send ready signal to parent
    if (window.parent) {
      window.parent.postMessage({
        type: 'RETOOL_COMPONENT_READY',
        componentName: 'DynamicControl',
        timestamp: new Date().toISOString()
      }, '*')
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    }
  }, [setConfigString, setResponsesString, onResponseChange])

  // Parse config from string to object
  let config: any = null
  try {
    config = configString && configString.trim() ? JSON.parse(configString) : null
  } catch (e) {
    config = null
  }

  // Parse responses from string to object
  let responses: any = {}
  try {
    responses = responsesString ? JSON.parse(responsesString) : {}
  } catch (e) {
    responses = {}
  }

  const updateResponses = (newResponses: any) => {
    setResponsesString(JSON.stringify(newResponses))
    onResponseChange() // Trigger event for Retool event handlers
  }

  // Handle case where config is not provided
  if (!config || !config.type) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <div style={{ margin: '12px 0', padding: '8px', backgroundColor: '#e8f4f8', borderRadius: '4px' }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#333' }}>
            <strong>Debug Info:</strong><br/>
            Config: <code>{JSON.stringify(config)}</code><br/>
            Responses: <code>{JSON.stringify(responses)}</code><br/>
            Component Status: <code>✅ Working (PostMessage + Inspector Panel)</code>
          </p>
        </div>

        <div style={{ margin: '12px 0', padding: '8px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>📨 PostMessage Debug:</p>
          <p style={{ margin: '0', fontSize: '12px', fontFamily: 'monospace' }}>
            Last Message: <code>{lastMessage || 'No messages received yet'}</code>
          </p>
          {messageHistory.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: 'bold' }}>Message History:</p>
              {messageHistory.map((msg, idx) => (
                <div key={idx} style={{ fontSize: '11px', fontFamily: 'monospace', marginBottom: '2px' }}>
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Checkbox / Radio grid
  if (config.type === 'checkbox' || config.type === 'radio') {
    const rows = config.rows || []
    const columns = config.columns || []
    
    return (
      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#e8f4f8', borderRadius: '4px', fontSize: '12px' }}>
          <strong>Active Grid:</strong> {config.type} | Rows: {rows.length} | Columns: {columns.length}
        </div>
        
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
                  const checked = !!(responses[row] && responses[row][col])
                  return (
                    <td key={cIdx} style={{ border: '1px solid #ccc', padding: '12px', textAlign: 'center' }}>
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
        
        <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#f0f8f0', borderRadius: '4px', fontSize: '12px' }}>
          <strong>Current Responses:</strong> <code>{JSON.stringify(responses)}</code>
        </div>
      </div>
    )
  }

  // Textbox grid
  if (config.type === 'misc') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#e8f4f8', borderRadius: '4px', fontSize: '12px' }}>
          <strong>Text Input Grid</strong>
        </div>
        
        {Object.entries(responses).map(([label, value], idx) => (
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
                const newResponses = { ...responses, [label]: e.target.value }
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
      Unknown grid type: {config.type}
    </div>
  )
}

// Test component identical to ImperativeTest but WITHOUT forwardRef
export const NonForwardTest: FC = () => {
  // Use useStateString (we know this works)
  const [testValue, setTestValue] = Retool.useStateString({ 
    name: 'testValue',
    label: 'Test Value (No ForwardRef)',
    description: 'Test string without forwardRef',
    inspector: 'text',
    initialValue: 'initial'
  })

  return (
    <div style={{ 
      padding: '20px', 
      border: '3px solid #28a745', 
      borderRadius: '8px', 
      backgroundColor: '#d4edda',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ margin: '0 0 16px 0', color: '#155724' }}>
        ✅ Non-ForwardRef Test
      </h2>
      
      <div style={{ 
        padding: '12px', 
        backgroundColor: '#c3e6cb', 
        borderRadius: '4px',
        marginBottom: '12px'
      }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Current Value:</h4>
        <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>
          testValue: <code>"{testValue}"</code>
        </p>
      </div>

      <div style={{ 
        padding: '12px', 
        backgroundColor: '#fff3cd', 
        borderRadius: '4px'
      }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Theory Test:</h4>
        <p style={{ margin: '0', fontSize: '14px' }}>
          This component is identical to ImperativeTest but uses FC instead of forwardRef.
          If this works but ImperativeTest doesn't, then forwardRef breaks Retool state hooks.
        </p>
      </div>

      <div style={{ 
        marginTop: '16px',
        padding: '8px',
        backgroundColor: '#d1ecf1',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <strong>Expected Results:</strong><br/>
        ✅ Should show "Test Value (No ForwardRef)" in Inspector<br/>
        ✅ Should display testValue: "initial"<br/>
        ✅ Should work like StateTest component
      </div>
    </div>
  )
}

// PostMessage Communication Test Component
export const GridComponentTest: FC = () => {
  const renderCount = React.useRef(0)
  renderCount.current += 1
  
  const [configValue, setConfigValue] = Retool.useStateString({ 
    name: 'config',
    label: 'Grid Configuration',
    description: 'JSON configuration for the grid',
    inspector: 'text',
    initialValue: 'NEW COMPONENT TEST'
  })

  const [lastMessage, setLastMessage] = React.useState('')
  const [messageHistory, setMessageHistory] = React.useState<string[]>([])

  // Use ref to always have access to current configValue
  const configValueRef = React.useRef(configValue)
  
  // Update ref whenever configValue changes
  React.useEffect(() => {
    configValueRef.current = configValue
    console.log('Ref updated to:', configValue)
  }, [configValue])

  // PostMessage listener
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Basic security check - in production, verify event.origin
      if (event.data && typeof event.data === 'object') {
        const { type, action, payload, id } = event.data
        
        if (type === 'RETOOL_COMPONENT_COMMAND') {
          const timestamp = new Date().toLocaleTimeString()
          const messageInfo = `${timestamp}: ${action} - ${JSON.stringify(payload)}`
          
          setLastMessage(messageInfo)
          setMessageHistory(prev => [...prev.slice(-4), messageInfo]) // Keep last 5 messages
          
          // Handle different commands
          switch (action) {
            case 'setValue':
              setConfigValue(payload.value || payload)
              // Send response back to parent
              if (window.parent) {
                window.parent.postMessage({
                  type: 'RETOOL_COMPONENT_RESPONSE',
                  action: 'setValue',
                  success: true,
                  payload: { value: payload.value || payload },
                  id: id
                }, '*')
              }
              break
              
            case 'getValue':
              // Use ref value since it's always current (state value is stale in closure)
              const currentValue = configValueRef.current
              
              console.log('getValue called - using ref value:', currentValue)
              
              if (window.parent) {
                window.parent.postMessage({
                  type: 'RETOOL_COMPONENT_RESPONSE',
                  action: 'getValue',
                  success: true,
                  payload: { value: currentValue },
                  id: id
                }, '*')
              }
              break
              
            default:
              // Send error response for unknown commands
              if (window.parent) {
                window.parent.postMessage({
                  type: 'RETOOL_COMPONENT_RESPONSE',
                  action: action,
                  success: false,
                  payload: { error: `Unknown action: ${action}` },
                  id: id
                }, '*')
              }
          }
        }
      }
    }

    window.addEventListener('message', handleMessage)
    
    // Send ready signal to parent
    if (window.parent) {
      window.parent.postMessage({
        type: 'RETOOL_COMPONENT_READY',
        componentName: 'GridComponentTest',
        timestamp: new Date().toISOString()
      }, '*')
    }

    return () => window.removeEventListener('message', handleMessage)
  }, []) // No dependencies - effect should only run once

  // Visual debug info
  const debugInfo = {
    renderCount: renderCount.current,
    configValue: configValue,
    timestamp: new Date().toLocaleTimeString(),
    hooksWorking: configValue === 'NEW COMPONENT TEST' ? '✅ YES' : '❌ NO',
    lastMessage: lastMessage || 'No messages received yet'
  }

  return (
    <div style={{ padding: '20px', border: '3px solid #ff6b35', borderRadius: '8px', backgroundColor: '#ffe5d9' }}>
      <h3 style={{ color: '#8b2500' }}>🔥 PostMessage Communication Test</h3>
      <p>This component tests PostMessage communication for programmatic control</p>
      
      <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#ffccb3', borderRadius: '4px', fontFamily: 'monospace' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>🔍 Debug Information:</h4>
        <div><strong>Render Count:</strong> {debugInfo.renderCount}</div>
        <div><strong>Config Value:</strong> "{debugInfo.configValue}"</div>
        <div><strong>Timestamp:</strong> {debugInfo.timestamp}</div>
        <div><strong>Hooks Working:</strong> {debugInfo.hooksWorking}</div>
        <div><strong>Last Message:</strong> {debugInfo.lastMessage}</div>
      </div>

      <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#ff9f7a', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>📨 Message History:</h4>
        {messageHistory.length === 0 ? (
          <div style={{ fontSize: '14px', fontStyle: 'italic' }}>No messages received yet</div>
        ) : (
          messageHistory.map((msg, idx) => (
            <div key={idx} style={{ fontSize: '12px', fontFamily: 'monospace', marginBottom: '4px' }}>
              {msg}
            </div>
          ))
        )}
      </div>
      
      <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#ffd4b3', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>🧪 Test Commands (Browser Console):</h4>
        <code style={{ fontSize: '12px', display: 'block', whiteSpace: 'pre-line', backgroundColor: '#fff', padding: '8px', borderRadius: '4px' }}>
{`// Find the component iframe
const iframe = document.querySelector('iframe[src*="retool"]');

// Test setValue command
iframe.contentWindow.postMessage({
  type: 'RETOOL_COMPONENT_COMMAND',
  action: 'setValue',
  payload: { value: 'Hello from PostMessage!' },
  id: 'test-1'
}, '*');

// Test getValue command
iframe.contentWindow.postMessage({
  type: 'RETOOL_COMPONENT_COMMAND',
  action: 'getValue',
  id: 'test-2'
}, '*');

// Listen for responses
window.addEventListener('message', (event) => {
  if (event.data.type === 'RETOOL_COMPONENT_RESPONSE') {
    console.log('Component response:', event.data);
  }
});`}
        </code>
      </div>
    </div>
  )
}

// MINIMAL TEST: Simple component that should respond to componentProps
export const SimpleConfigTest: FC = () => {
  const [configString, setConfigString] = Retool.useStateString({ 
    name: 'config',
    label: 'Simple Config',
    description: 'Simple config test',
    inspector: 'text',
    initialValue: 'INITIAL'
  })

  // PostMessage listener for componentProps
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('🧪 SimpleConfigTest: Received message:', event.data);
      
      // Handle Retool's componentProps messages
      if (event.data && event.data.componentProps) {
        console.log('🧪 SimpleConfigTest: Processing componentProps');
        const { config } = event.data.componentProps;
        
        if (config && config !== configString) {
          console.log('🧪 SimpleConfigTest: Updating config:', config);
          setConfigString(config);
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [setConfigString])

  return (
    <div style={{ padding: '20px', border: '2px solid #ff0000', borderRadius: '8px', backgroundColor: '#ffe6e6' }}>
      <h3 style={{ color: '#cc0000' }}>🧪 Simple Config Test</h3>
      <p><strong>Config Value:</strong> <code>{configString}</code></p>
      <p><strong>Test:</strong> Change the "Simple Config" property in Inspector panel</p>
      <p><strong>Expected:</strong> This display should update immediately</p>
    </div>
  )
}

// STABLE GRID: Simple component without complex PostMessage code that crashes
export const StableGrid: FC = () => {
  const [configString, setConfigString] = Retool.useStateString({ 
    name: 'config',
    label: 'Grid Config',
    description: 'JSON configuration for grid',
    inspector: 'text',
    initialValue: ''
  })

  const [responsesString, setResponsesString] = Retool.useStateString({ 
    name: 'responses',
    label: 'Grid Responses',
    description: 'JSON string for grid responses',
    inspector: 'text',
    initialValue: '{}'
  })

  // Safe string conversion function
  const safeStringify = (value: any): string => {
    if (value === null || value === undefined) return 'null'
    if (typeof value === 'string') return value
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value)
      } catch (e) {
        return '[Object]'
      }
    }
    return String(value)
  }

  // Parse config safely - handle both string and object inputs
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

  // Parse responses safely - handle both string and object inputs
  let responses: any = {}
  try {
    if (typeof responsesString === 'string') {
      responses = responsesString ? JSON.parse(responsesString) : {}
    } else if (typeof responsesString === 'object' && responsesString !== null) {
      responses = responsesString
    }
  } catch (e) {
    console.log('Responses parsing error:', e)
    responses = {}
  }

  const updateResponses = (newResponses: any) => {
    setResponsesString(JSON.stringify(newResponses))
  }

  // Show debug if no config
  if (!config || !config.type) {
    return (
      <div style={{ padding: '20px', border: '2px solid #007bff', borderRadius: '8px', backgroundColor: '#e7f3ff' }}>
        <h3 style={{ color: '#004085' }}>🔧 Stable Grid</h3>
        <p><strong>Config Type:</strong> <code>{safeStringify(typeof configString)}</code></p>
        <p><strong>Config Value:</strong> <code>{configDisplay || 'EMPTY'}</code></p>
        <p><strong>Test:</strong> Set config to: <code>{'{"type":"checkbox","rows":["Q1"],"columns":["A","B"]}'}</code></p>
      </div>
    )
  }

  // Show grid
  const rows = config.rows || []
  const columns = config.columns || []
  
  return (
    <div style={{ padding: '16px', border: '2px solid #28a745', borderRadius: '8px', backgroundColor: '#d4edda' }}>
      <h3 style={{ color: '#155724' }}>✅ Stable Grid Working</h3>
      <p><strong>Type:</strong> {safeStringify(config.type)} | <strong>Rows:</strong> {safeStringify(rows.length)} | <strong>Columns:</strong> {safeStringify(columns.length)}</p>
      
      <table style={{ borderCollapse: 'collapse', border: '1px solid #ccc', width: '100%', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}></th>
            {columns.map((col: string, idx: number) => (
              <th key={idx} style={{ border: '1px solid #ccc', padding: '8px' }}>{safeStringify(col)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: string, rIdx: number) => (
            <tr key={rIdx}>
              <td style={{ border: '1px solid #ccc', padding: '8px', fontWeight: 'bold' }}>{safeStringify(row)}</td>
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
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#c3e6cb', borderRadius: '4px', fontSize: '12px' }}>
        <strong>Responses:</strong> <code>{safeStringify(responses)}</code>
      </div>
    </div>
  )
}

export const AlchemerImitiation = { 
  DynamicControl,
  TestStateObject,
  MinimalTest,
  StateTest,
  ImperativeTest,
  NonForwardTest,
  GridComponentTest,
  SimpleConfigTest,
  StableGrid
}
