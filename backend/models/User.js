import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String, required: true, unique: true,
    minlength: [3, 'Username must be at least 3 characters'],
  },
  email: {
    type: String, required: true, unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String, required: true,
    minlength: [6, 'Password must be at least 6 characters'],
  },
  avatar: { type: String, default: '' },
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password'));
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);