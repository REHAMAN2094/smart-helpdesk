import { Article } from '../models/Article.js';

export async function retrieveTopArticles(query, limit = 3) {
  const q = (query || '').toLowerCase();
  const all = await Article.find({ status: 'published' }).lean();
  const scored = all.map(a => {
    const hay = `${a.title} ${a.body} ${(a.tags||[]).join(' ')}`.toLowerCase();
    const score = (q.split(/\s+/).filter(Boolean).reduce((acc, term) => acc + (hay.includes(term) ? 1 : 0), 0)) + (a.tags||[]).length*0.1;
    return { ...a, _score: score };
  }).sort((x,y) => y._score - x._score);
  return scored.slice(0, limit);
}
