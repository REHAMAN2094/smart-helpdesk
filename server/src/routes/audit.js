import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { AuditLog } from '../models/AuditLog.js';

export const auditRouter = Router();

auditRouter.get('/tickets/:id/audit', auth(), async (req,res,next) => {
  try {
    const logs = await AuditLog.find({ ticketId: req.params.id }).sort({ timestamp: 1 }).lean();
    res.json(logs);
  } catch (e) { next(e); }
});
