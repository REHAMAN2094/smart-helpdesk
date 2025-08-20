import { Router } from 'express';
import { z } from 'zod';
import { auth } from '../middleware/auth.js';
import { Ticket } from '../models/Ticket.js';
import { AgentSuggestion } from '../models/AgentSuggestion.js';
import { triageTicket } from '../agent/triage.js';
import { AuditLog } from '../models/AuditLog.js';

export const ticketsRouter = Router();

const ticketSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['billing','tech','shipping','other']).optional(),
  attachments: z.array(z.string().url()).optional()
});

ticketsRouter.post('/', auth(), async (req,res,next) => {
  try {
    const body = ticketSchema.parse(req.body);
    const ticket = await Ticket.create({ ...body, createdBy: req.user.id, status: 'open' });
    // trigger triage
    const result = await triageTicket(ticket);
    await AuditLog.create({ ticketId: ticket._id, traceId: result.traceId, actor: 'system', action: 'TRIAGE_ENQUEUED', meta: {}, timestamp: new Date() });
    res.status(201).json({ ticketId: ticket._id });
  } catch (e) { next(e); }
});

ticketsRouter.get('/', auth(), async (req,res,next) => {
  try {
    const my = req.query.mine === 'true';
    const filter = my ? { createdBy: req.user.id } : {};
    const list = await Ticket.find(filter).sort({ updatedAt: -1 }).lean();
    res.json(list);
  } catch (e) { next(e); }
});

ticketsRouter.get('/:id', auth(), async (req,res,next) => {
  try {
    const t = await Ticket.findById(req.params.id).lean();
    if (!t) return res.status(404).json({ error: 'Not found' });
    const suggestion = t.agentSuggestionId ? await AgentSuggestion.findById(t.agentSuggestionId).lean() : null;
    res.json({ ticket: t, suggestion });
  } catch (e) { next(e); }
});

const replySchema = z.object({ message: z.string().min(1), close: z.boolean().optional() });
ticketsRouter.post('/:id/reply', auth(), async (req,res,next) => {
  try {
    const { message, close } = replySchema.parse(req.body);
    const t = await Ticket.findById(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    await AuditLog.create({ ticketId: t._id, traceId: t._id.toString(), actor: 'agent', action: 'REPLY_SENT', meta: { message }, timestamp: new Date() });
    t.status = close ? 'closed' : 'resolved';
    await t.save();
    res.json({ ok: true });
  } catch (e) { next(e); }
});
