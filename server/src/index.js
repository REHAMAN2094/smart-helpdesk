import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { rateLimit } from 'express-rate-limit';

import { authRouter } from './routes/auth.js';
import { kbRouter } from './routes/kb.js';
import { ticketsRouter } from './routes/tickets.js';
import { agentRouter } from './routes/agent.js';
import { configRouter } from './routes/config.js';
import { auditRouter } from './routes/audit.js';
import { errorHandler } from './middleware/error.js';
import { seedOnStart } from './seed.js';

// Set fallback environment variables if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'fallback-jwt-secret-change-in-production';
  console.warn('Warning: JWT_SECRET not set, using fallback secret. Please set JWT_SECRET in production.');
}

if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb://localhost:27017/helpdesk';
  console.warn('Warning: MONGO_URI not set, using default MongoDB connection.');
}

const app = express();
const logger = pino({ level: 'info' });

app.use(pinoHttp({ logger }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));
app.use(cors({ origin: '*', credentials: true }));

app.get('/healthz', (req,res) => res.json({ ok: true }));
app.get('/readyz', (req,res) => res.json({ ready: !!mongoose.connection.readyState }));

// rate limit login/register
const authLimiter = rateLimit({ windowMs: 60_000, max: 20 });
app.use('/api/auth', authLimiter, authRouter);

app.use('/api/kb', kbRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/agent', agentRouter);
app.use('/api/config', configRouter);
app.use('/api', auditRouter); // /api/tickets/:id/audit

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/helpdesk';

mongoose.connect(MONGO_URI).then(async () => {
  logger.info({ msg: 'Mongo connected' });
  if (process.env.SEED_ON_START === 'true') {
    try {
      await seedOnStart();
      logger.info({ msg: 'Database seeded successfully' });
    } catch (seedError) {
      logger.error({ msg: 'Failed to seed database', error: seedError });
    }
  }
  app.listen(PORT, () => logger.info({ msg: `API listening on ${PORT}` }));
}).catch(err => {
  logger.error({ msg: 'Failed to connect to MongoDB', error: err.message, uri: MONGO_URI });
  process.exit(1);
});
