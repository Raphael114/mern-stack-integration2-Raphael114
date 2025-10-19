import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import Button from './ui/Button'
import Card from './ui/Card'
import Modal from './ui/Modal'
import PostForm from './PostForm'
import ToastManager from './ui/ToastManager'
import { useState } from 'react'

export function Layout({ children }) {
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch (e) { return null } })()
  const [open, setOpen] = useState(false)

  return (
    <div className="app">
      <nav className="site-nav">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="brand"><Link to="/" style={{ color: 'white', textDecoration: 'none' }}><strong>PLP Blog</strong></Link></div>
          <div className="muted">— A MERN demo</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/">Home</Link>
          <Button onClick={() => setOpen(true)}>Create</Button>
          {!user && <Link to="/login">Login</Link>}
          {user && <span style={{ marginLeft: 12 }}>Hi, {user.name}</span>}
        </div>
      </nav>
      <div className="container">
        <div className="grid">
          <div>
            {children}
          </div>
          <aside>
            <Card>
              <h4>About</h4>
              <p>Simple MERN blog demo by Raphael — create posts, add comments, upload images.</p>
              <div style={{ marginTop: 12 }}>
                <Button className="ghost">Learn more</Button>
              </div>
            </Card>
          </aside>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Create post">
        <PostForm />
      </Modal>
      <ToastManager />
    </div>
  )
}

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}
