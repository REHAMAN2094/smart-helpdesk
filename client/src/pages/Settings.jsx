import React, { useEffect, useState } from 'react'
import { Paper, Typography, Stack, TextField, Button } from '@mui/material'
import api from '../api'

export default function Settings() {
  const [cfg, setCfg] = useState({ autoCloseEnabled: true, confidenceThreshold: 0.78, slaHours: 24 })
  const load = async () => {
    const { data } = await api.get('/api/config')
    setCfg({ autoCloseEnabled: data?.autoCloseEnabled ?? true, confidenceThreshold: data?.confidenceThreshold ?? 0.78, slaHours: data?.slaHours ?? 24 })
  }
  useEffect(()=>{ load() }, [])

  const save = async () => {
    await api.put('/api/config', cfg)
    await load()
  }

  return (
    <Paper sx={{ p:2 }}>
      <Typography variant="h6">Settings</Typography>
      <Stack spacing={2} sx={{ mt:1, maxWidth: 360 }}>
        <TextField label="Auto Close Enabled" value={String(cfg.autoCloseEnabled)} onChange={e=>setCfg(p=>({...p, autoCloseEnabled: e.target.value === 'true'}))} />
        <TextField label="Confidence Threshold (0-1)" type="number" value={cfg.confidenceThreshold} onChange={e=>setCfg(p=>({...p, confidenceThreshold: Number(e.target.value)}))} />
        <TextField label="SLA Hours" type="number" value={cfg.slaHours} onChange={e=>setCfg(p=>({...p, slaHours: Number(e.target.value)}))} />
        <Button variant="contained" onClick={save}>Save</Button>
      </Stack>
    </Paper>
  )
}
