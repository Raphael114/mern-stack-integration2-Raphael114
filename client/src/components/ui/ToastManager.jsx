import React, { useState } from 'react'
import Toast from './Toast'

export default function ToastManager() {
  const [toasts] = useState([])
  if (toasts.length === 0) return null
  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16 }}>
      {toasts.map((t, i) => <Toast key={i}>{t}</Toast>)}
    </div>
  )
}
