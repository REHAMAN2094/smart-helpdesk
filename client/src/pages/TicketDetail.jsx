import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Paper, Typography, Stack, Divider, Button, TextField, List, ListItem, ListItemText } from '@mui/material'
import api from '../api'

export default function TicketDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [audit, setAudit] = useState([])
  const [reply, setReply] = useState('Thank you!')

  const load = async () => {
    const { data } = await api.get(`/api/tickets/${id}`)
    setData(data)
    const a = await api.get(`/api/tickets/${id}/audit`)
    setAudit(a.data)
  }
  useEffect(()=>{ load() }, [id])

  const send = async () => {
    await api.post(`/api/tickets/${id}/reply`, { message: reply, close: true })
    await load()
  }

  if (!data) return null
  const { ticket, suggestion } = data
  return (
    <Stack spacing={2}>
      <Paper sx={{ p:2 }}>
        <Typography variant="h6">{ticket.title}</Typography>
        <Typography sx={{ mb:1 }}>{ticket.description}</Typography>
        <Divider />
        <Typography sx={{ mt:1 }}>Status: <b>{ticket.status}</b></Typography>
      </Paper>

      {suggestion && (
        <Paper sx={{ p:2 }}>
          <Typography variant="h6">Agent Suggestion</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{suggestion.draftReply}</Typography>
          <Typography variant="body2">Confidence: {suggestion.confidence.toFixed(2)}</Typography>
        </Paper>
      )}

      <Paper sx={{ p:2 }}>
        <Typography variant="h6">Reply</Typography>
        <Stack direction="row" spacing={2} sx={{ mt:1 }}>
          <TextField fullWidth value={reply} onChange={e=>setReply(e.target.value)} />
          <Button variant="contained" onClick={send}>Send & Close</Button>
        </Stack>
      </Paper>

      <Paper sx={{ p:2 }}>
        <Typography variant="h6">Audit Timeline</Typography>
        <List>
          {audit.map(a => (
            <ListItem key={a._id}>
              <ListItemText primary={`${a.action}`} secondary={new Date(a.timestamp).toLocaleString()} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Stack>
  )
}
