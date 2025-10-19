import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    try {
      await authService.login({ email, password })
      nav('/')
    } catch (err) { alert('Login failed') }
  }

  return (
    <div className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
      <h3>Login</h3>
      <form onSubmit={handle}>
        <div className="field"><label>Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="field"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <div className="actions"><button className="btn" type="submit">Login</button></div>
      </form>
    </div>
  )
}
