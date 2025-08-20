import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Paper, Typography, Stack, TextField, Button, Chip } from '@mui/material'
import api from '../api'

export default function KBEditor() {
  const { id } = useParams()
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState('billing,payments')
  const [status, setStatus] = useState('published')

  useEffect(()=>{
    const load = async () => {
      if (id && id !== 'new') {
        const { data } = await api.get('/api/kb?query=')
        const doc = data.find(d => d._id === id)
        if (doc) {
          setTitle(doc.title); setBody(doc.body); setTags((doc.tags||[]).join(',')); setStatus(doc.status)
        }
      }
    }
    load()
  }, [id])

  const save = async () => {
    const payload = { title, body, tags: tags.split(',').map(s=>s.trim()).filter(Boolean), status }
    if (id === 'new') await api.post('/api/kb', payload)
    else await api.put(`/api/kb/${id}`, payload)
    nav('/kb')
  }

  return (
    <Paper sx={{ p:2 }}>
      <Typography variant="h6">{id==='new' ? 'New' : 'Edit'} Article</Typography>
      <Stack spacing={2} sx={{ mt:1 }}>
        <TextField label="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <TextField label="Body" value={body} onChange={e=>setBody(e.target.value)} multiline minRows={6} />
        <TextField label="Tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} />
        <TextField label="Status" value={status} onChange={e=>setStatus(e.target.value)} />
        <Stack direction="row" spacing={1}>
          {tags.split(',').filter(Boolean).map(t => <Chip key={t} label={t.trim()} />)}
        </Stack>
        <Button variant="contained" onClick={save}>Save</Button>
      </Stack>
    </Paper>
  )
}
