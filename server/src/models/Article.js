import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: String,
  body: String,
  tags: [String],
  status: { type: String, enum: ['draft','published'], default: 'draft' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

export const Article = mongoose.model('Article', articleSchema);
