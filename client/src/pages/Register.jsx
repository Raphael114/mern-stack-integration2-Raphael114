import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    try {
      await authService.register({ name, email, password })
      nav('/')
    } catch (err) {
      alert('Registration failed')
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
      <h3>Create account</h3>
      <form onSubmit={handle}>
        <div className="field"><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="field"><label>Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="field"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <div className="actions"><button className="btn" type="submit">Register</button></div>
      </form>
    </div>
  )
}
