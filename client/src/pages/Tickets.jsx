import React, { useEffect, useState } from 'react'
import { Button, Paper, Typography, Stack, TextField, List, ListItem, ListItemText } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const [title, setTitle] = useState('Where is my package?')
  const [description, setDescription] = useState('Shipment delayed 5 days')
  const nav = useNavigate()

  const load = async () => {
    const { data } = await api.get('/api/tickets?mine=true')
    setTickets(data)
  }
  useEffect(() => { load() }, [])

  const create = async () => {
    await api.post('/api/tickets', { title, description })
    await load()
  }

  return (
    <Stack spacing={2}>
      <Paper sx={{ p:2 }}>
        <Typography variant="h6">Create Ticket</Typography>
        <Stack direction="row" spacing={2} sx={{ mt:2 }}>
          <TextField label="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <TextField label="Description" value={description} onChange={e=>setDescription(e.target.value)} sx={{ flex:1 }} />
          <Button variant="contained" onClick={create}>Submit</Button>
        </Stack>
      </Paper>

      <Paper sx={{ p:2 }}>
        <Typography variant="h6">My Tickets</Typography>
        <List>
          {tickets.map(t => (
            <ListItem key={t._id} button onClick={()=>nav(`/tickets/${t._id}`)}>
              <ListItemText primary={`${t.title} — ${t.status}`} secondary={new Date(t.updatedAt).toLocaleString()} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Stack>
  )
}
