import { FC } from 'react'
import { Retool } from '@tryretool/custom-component-support'

export const RoundedBox: FC = () => {
  const [headerText] = Retool.useStateString({ name: 'headerText' })
  const [bodyText] = Retool.useStateString({ name: 'bodyText' })
  
  return (
    <div style={{
      border: '2px solid #007bff',
      borderRadius: '12px',
      padding: '20px',
      margin: '10px',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#007bff', marginTop: 0 }}>{headerText}</h2>
      <p style={{ color: '#333', lineHeight: '1.5' }}>{bodyText}</p>
    </div>
  )
}
