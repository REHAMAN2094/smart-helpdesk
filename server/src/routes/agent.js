import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { AgentSuggestion } from '../models/AgentSuggestion.js';

export const agentRouter = Router();

agentRouter.get('/suggestion/:ticketId', auth(), async (req,res,next) => {
  try {
    const s = await AgentSuggestion.findOne({ ticketId: req.params.ticketId }).lean();
    if (!s) return res.status(404).json({ error: 'Not found' });
    res.json(s);
  } catch (e) { next(e); }
});
