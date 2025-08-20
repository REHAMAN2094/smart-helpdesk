import React, { useEffect, useState } from 'react'
import { Paper, Typography, Stack, TextField, Button, List, ListItem, ListItemText } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function KBList() {
  const [q, setQ] = useState('')
  const [list, setList] = useState([])
  const nav = useNavigate()
  const load = async () => {
    const { data } = await api.get(`/api/kb?query=${encodeURIComponent(q)}`)
    setList(data)
  }
  useEffect(()=>{ load() }, [])
  return (
    <Stack spacing={2}>
      <Paper sx={{ p:2 }}>
        <Stack direction="row" spacing={2}>
          <TextField label="Search" value={q} onChange={e=>setQ(e.target.value)} />
          <Button variant="outlined" onClick={load}>Search</Button>
          <Button variant="contained" onClick={()=>nav('/kb/new')}>New Article</Button>
        </Stack>
      </Paper>
      <Paper sx={{ p:2 }}>
        <List>
          {list.map(a => (
            <ListItem key={a._id} button onClick={()=>nav(`/kb/${a._id}`)}>
              <ListItemText primary={`${a.title} (${a.status})`} secondary={a.tags?.join(', ')} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Stack>
  )
}
