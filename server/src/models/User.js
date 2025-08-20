import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, index: true },
  password_hash: String,
  role: { type: String, enum: ['admin','agent','user'], default: 'user' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

export const User = mongoose.model('User', userSchema);
