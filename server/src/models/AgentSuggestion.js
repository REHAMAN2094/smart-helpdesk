import mongoose from 'mongoose';

const agentSuggestionSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  predictedCategory: { type: String, enum: ['billing','tech','shipping','other'] },
  articleIds: [String],
  draftReply: String,
  confidence: Number,
  autoClosed: Boolean,
  modelInfo: {
    provider: String,
    model: String,
    promptVersion: String,
    latencyMs: Number
  }
}, { timestamps: { createdAt: 'createdAt' } });

export const AgentSuggestion = mongoose.model('AgentSuggestion', agentSuggestionSchema);
