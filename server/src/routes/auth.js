import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const authRouter = Router();

const creds = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(6)
});

authRouter.post('/register', async (req,res,next) => {
  try {
    const { name, email, password } = creds.parse(req.body);
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email in use' });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name || email.split('@')[0], email, password_hash, role: 'user' });
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (e) { 
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: e.errors });
    }
    next(e); 
  }
});

authRouter.post('/login', async (req,res,next) => {
  try {
    const { email, password } = creds.partial({ name: true }).parse(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (e) { 
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: e.errors });
    }
    next(e); 
  }
});
