import React, { useState } from 'react'
import { TextField, Button, Paper, Typography, Stack } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Login() {
  const [email, setEmail] = useState('user@example.com')
  const [password, setPassword] = useState('password123')
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      nav('/')
    } catch (e) {
      setErr(e?.response?.data?.error || 'Login failed')
    }
  }
  return (
    <Paper sx={{ p:3, maxWidth: 420, mx:'auto' }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <form onSubmit={submit}>
        <Stack spacing={2}>
          <TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} fullWidth />
          {err && <Typography color="error">{err}</Typography>}
          <Button type="submit" variant="contained">Sign in</Button>
          <Typography variant="body2">No account? <Link to="/register">Register</Link></Typography>
        </Stack>
      </form>
    </Paper>
  )
}
