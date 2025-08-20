import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';
import { Article } from './models/Article.js';
import { Ticket } from './models/Ticket.js';
import { Config } from './models/Config.js';

export async function seedOnStart() {
  const users = [
    { name: 'Admin', email: 'admin@example.com', role: 'admin' },
    { name: 'Agent', email: 'agent@example.com', role: 'agent' },
    { name: 'User',  email: 'user@example.com',  role: 'user'  }
  ];
  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) await User.create({ ...u, password_hash: await bcrypt.hash('password123', 10) });
  }

  const kb = [
    { title: 'How to update payment method', body: 'Steps to update payment...', tags: ['billing','payments'], status: 'published' },
    { title: 'Troubleshooting 500 errors', body: 'Check logs, verify env...', tags: ['tech','errors'], status: 'published' },
    { title: 'Tracking your shipment', body: 'Use tracking # on carrier site...', tags: ['shipping','delivery'], status: 'published' }
  ];
  for (const a of kb) {
    const exists = await Article.findOne({ title: a.title });
    if (!exists) await Article.create(a);
  }

  const cfg = await Config.findOne();
  if (!cfg) await Config.create({});

  const tcount = await Ticket.countDocuments();
  if (tcount === 0) {
    await Ticket.create([
      { title: 'Refund for double charge', description: 'I was charged twice for order #1234', category: 'other' },
      { title: 'App shows 500 on login', description: 'Stack trace mentions auth module', category: 'other' },
      { title: 'Where is my package?', description: 'Shipment delayed 5 days', category: 'other' }
    ]);
  }
}

// CLI usage
if (process.argv[1].endsWith('seed.js')) {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/helpdesk';
  mongoose.connect(uri).then(seedOnStart).then(()=>{
    console.log('Seeded');
    process.exit(0);
  });
}
