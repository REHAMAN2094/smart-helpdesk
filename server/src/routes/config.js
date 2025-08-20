import { Router } from 'express';
import { z } from 'zod';
import { Config } from '../models/Config.js';
import { auth, requireRole } from '../middleware/auth.js';

export const configRouter = Router();

configRouter.get('/', auth(), async (req,res,next) => {
  try {
    const cfg = await Config.findOne().lean();
    res.json(cfg || {});
  } catch (e) { next(e); }
});

const cfgSchema = z.object({
  autoCloseEnabled: z.boolean().optional(),
  confidenceThreshold: z.number().min(0).max(1).optional(),
  slaHours: z.number().int().positive().optional()
});

configRouter.put('/', auth(), requireRole('admin'), async (req,res,next) => {
  try {
    const data = cfgSchema.parse(req.body);
    const cfg = await Config.findOneAndUpdate({}, data, { new: true, upsert: true });
    res.json(cfg);
  } catch (e) { next(e); }
});
