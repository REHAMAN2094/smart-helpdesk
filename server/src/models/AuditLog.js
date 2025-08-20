import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  traceId: String,
  actor: { type: String, enum: ['system','agent','user'] },
  action: String,
  meta: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: () => new Date() }
}, { timestamps: false });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
