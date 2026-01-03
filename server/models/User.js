import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ['google'],
    default: 'google',
  },
  providerId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  avatar: {
    type: String,
  },
}, {
  timestamps: true,
});

userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

export default User;

