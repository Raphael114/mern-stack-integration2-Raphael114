import React from 'react'

export default function Sidebar({ children }) {
  return (
    <aside style={{ width: 280 }}>
      <div className="card">{children}</div>
    </aside>
  )
}
