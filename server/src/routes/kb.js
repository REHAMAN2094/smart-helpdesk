import { Router } from 'express';
import { z } from 'zod';
import { Article } from '../models/Article.js';
import { auth, requireRole } from '../middleware/auth.js';

export const kbRouter = Router();

kbRouter.get('/', auth(false), async (req,res,next) => {
  try {
    const q = (req.query.query || '').toString().toLowerCase();
    const or = q ? { $or: [
      { title: new RegExp(q, 'i') },
      { body: new RegExp(q, 'i') },
      { tags: { $in: [ new RegExp(q, 'i') ] } }
    ] } : {};
    const docs = await Article.find(or).sort({ updatedAt: -1 }).lean();
    res.json(docs);
  } catch (e) { next(e); }
});

const upsertSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft','published']).default('draft')
});

kbRouter.post('/', auth(), requireRole('admin'), async (req,res,next) => {
  try {
    const doc = upsertSchema.parse(req.body);
    const created = await Article.create(doc);
    res.status(201).json(created);
  } catch (e) { next(e); }
});

kbRouter.put('/:id', auth(), requireRole('admin'), async (req,res,next) => {
  try {
    const doc = upsertSchema.partial().parse(req.body);
    const updated = await Article.findByIdAndUpdate(req.params.id, doc, { new: true });
    res.json(updated);
  } catch (e) { next(e); }
});

kbRouter.delete('/:id', auth(), requireRole('admin'), async (req,res,next) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
});
