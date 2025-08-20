import React, { useState } from 'react'
import { TextField, Button, Paper, Typography, Stack } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Register() {
  const [name, setName] = useState('New User')
  const [email, setEmail] = useState('new@example.com')
  const [password, setPassword] = useState('password123')
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password })
      localStorage.setItem('token', data.token)
      nav('/')
    } catch (e) {
      setErr(e?.response?.data?.error || 'Register failed')
    }
  }
  return (
    <Paper sx={{ p:3, maxWidth: 480, mx:'auto' }}>
      <Typography variant="h5" gutterBottom>Register</Typography>
      <form onSubmit={submit}>
        <Stack spacing={2}>
          <TextField label="Name" value={name} onChange={e=>setName(e.target.value)} fullWidth />
          <TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} fullWidth />
          {err && <Typography color="error">{err}</Typography>}
          <Button type="submit" variant="contained">Create account</Button>
          <Typography variant="body2">Have an account? <Link to="/login">Login</Link></Typography>
        </Stack>
      </form>
    </Paper>
  )
}
