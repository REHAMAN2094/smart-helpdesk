export class LLMProvider {
  constructor() {
    this.stub = process.env.STUB_MODE === 'true';
    this.promptVersion = 'v1';
  }
  async classify(text) {
    if (this.stub) {
      const t = text.toLowerCase();
      let predicted = 'other'; let score = 0.5;
      if (/(refund|invoice|payment|charged)/.test(t)) { predicted = 'billing'; score = 0.9; }
      else if (/(error|bug|stack|500|crash)/.test(t)) { predicted = 'tech'; score = 0.88; }
      else if (/(delivery|shipment|package|tracking)/.test(t)) { predicted = 'shipping'; score = 0.86; }
      return { predictedCategory: predicted, confidence: score, modelInfo: { provider: 'stub', model: 'keyword', promptVersion: this.promptVersion } };
    }
    // Real LLM could go here
    return { predictedCategory: 'other', confidence: 0.5, modelInfo: { provider: 'none', model: 'none', promptVersion: this.promptVersion } };
  }
  async draft(text, articles) {
    if (this.stub) {
      const titles = articles.map((a, i) => `${i+1}. ${a.title}`).join('\n');
      return {
        draftReply: `Thanks for reaching out. Based on your ticket, here are helpful references:\n${titles}\nIf this resolves your issue, we will close the ticket. Otherwise an agent will assist.`,
        citations: articles.map(a => String(a._id)),
        modelInfo: { provider: 'stub', model: 'templater', promptVersion: this.promptVersion }
      };
    }
    return { draftReply: 'Draft unavailable', citations: [] };
  }
}
