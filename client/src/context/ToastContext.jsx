import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random()
    const toast = { id, message, ...opts }
    setToasts((t) => [toast, ...t])
    if (!opts.sticky) {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), opts.duration || 4000)
    }
    return id
  }, [])

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1000 }}>
        {toasts.map((t) => (
          <div key={t.id} className="toast" role="status" aria-live="polite" style={{ marginBottom: 8 }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
