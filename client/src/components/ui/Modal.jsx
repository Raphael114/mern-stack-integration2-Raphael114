import React from 'react'

export default function Modal({ open, onClose, children, title }) {
  if (!open) return null
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
        <div>{children}</div>
        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }
const modalStyle = { width: 'min(920px, 96%)', maxHeight: '90vh', overflowY: 'auto', background: 'white', padding: 18, borderRadius: 10 }
