import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Tickets from './pages/Tickets.jsx'
import TicketDetail from './pages/TicketDetail.jsx'
import KBList from './pages/KBList.jsx'
import KBEditor from './pages/KBEditor.jsx'
import Settings from './pages/Settings.jsx'

function Nav() {
  const nav = useNavigate()
  const token = localStorage.getItem('token')
  const logout = () => { localStorage.removeItem('token'); nav('/login') }
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Smart Helpdesk</Link>
        </Typography>
        {token ? <Button color="inherit" onClick={logout}>Logout</Button> : <Button color="inherit" onClick={()=>nav('/login')}>Login</Button>}
      </Toolbar>
    </AppBar>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route path="/" element={<Tickets />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/kb" element={<KBList />} />
          <Route path="/kb/:id" element={<KBEditor />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Container>
    </>
  )
}
