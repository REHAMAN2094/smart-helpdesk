import { v4 as uuidv4 } from 'uuid';
import { LLMProvider } from './llmProvider.js';
import { retrieveTopArticles } from './retriever.js';
import { AgentSuggestion } from '../models/AgentSuggestion.js';
import { Ticket } from '../models/Ticket.js';
import { AuditLog } from '../models/AuditLog.js';
import { Config } from '../models/Config.js';

export async function triageTicket(ticket) {
  const traceId = uuidv4();
  const llm = new LLMProvider();
  const start = Date.now();
  const cfg = await Config.findOne() || { autoCloseEnabled: process.env.AUTO_CLOSE_ENABLED === 'true', confidenceThreshold: Number(process.env.CONFIDENCE_THRESHOLD || 0.78) };
  const appendAudit = async (action, meta = {}) => {
    await AuditLog.create({ ticketId: ticket._id, traceId, actor: 'system', action, meta, timestamp: new Date() });
  };

  await appendAudit('TICKET_RECEIVED', { ticketId: ticket._id });

  // CLASSIFY
  const cls = await llm.classify(`${ticket.title} ${ticket.description}`);
  await appendAudit('AGENT_CLASSIFIED', cls);

  // RETRIEVE
  const articles = await retrieveTopArticles(ticket.description || ticket.title || '');
  await appendAudit('KB_RETRIEVED', { count: articles.length, articleIds: articles.map(a=>a._id) });

  // DRAFT
  const draft = await llm.draft(ticket.description || ticket.title || '', articles);
  await appendAudit('DRAFT_GENERATED', { draftPreview: draft.draftReply.slice(0,180), citations: draft.citations });

  // DECIDE
  const decision = (cfg.autoCloseEnabled && cls.confidence >= cfg.confidenceThreshold);
  const suggestion = await AgentSuggestion.create({
    ticketId: ticket._id,
    predictedCategory: cls.predictedCategory,
    articleIds: articles.map(a=>String(a._id)),
    draftReply: draft.draftReply,
    confidence: cls.confidence,
    autoClosed: decision,
    modelInfo: { ...cls.modelInfo, latencyMs: Date.now() - start }
  });

  ticket.agentSuggestionId = suggestion._id;
  ticket.status = decision ? 'resolved' : 'waiting_human';
  if (decision) await appendAudit('AUTO_CLOSED', { confidence: cls.confidence });
  else await appendAudit('ASSIGNED_TO_HUMAN', {});
  await ticket.save();

  return { suggestionId: suggestion._id, decision, traceId };
}
