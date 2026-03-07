import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Channel from './models/Channel.js';
import Video from './models/Video.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

await User.deleteMany({});
await Channel.deleteMany({});
await Video.deleteMany({});

const hashedPw = await bcrypt.hash('password123', 10);

const user = await User.create({
  username: 'JohnDoe',
  email: 'john@example.com',
  password: hashedPw,
});

const channel = await Channel.create({
  channelName: 'Code with John',
  owner: user._id,
  description: 'Coding tutorials and tech reviews by John Doe.',
  subscribers: 5200,
});

user.channels.push(channel._id);
await user.save();

const videos = [
  { title: 'Learn React in 30 Minutes', category: 'Web Development', videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0', thumbnailUrl: 'https://img.youtube.com/vi/Ke90Tje7VS0/hqdefault.jpg', description: 'A quick tutorial to get started with React.', views: 15200 },
  { title: 'JavaScript Crash Course', category: 'JavaScript', videoUrl: 'https://www.youtube.com/watch?v=hdI2bqOjy3c', thumbnailUrl: 'https://img.youtube.com/vi/hdI2bqOjy3c/hqdefault.jpg', description: 'Full JavaScript crash course for beginners.', views: 42000 },
  { title: 'Node.js Full Tutorial', category: 'Web Development', videoUrl: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', thumbnailUrl: 'https://img.youtube.com/vi/fBNz5xF-Kx4/hqdefault.jpg', description: 'Build backend apps with Node.js and Express.', views: 32100 },
  { title: 'Data Structures in JS', category: 'Data Structures', videoUrl: 'https://www.youtube.com/watch?v=t2CEgPsws3U', thumbnailUrl: 'https://img.youtube.com/vi/t2CEgPsws3U/hqdefault.jpg', description: 'Learn common data structures using JavaScript.', views: 18500 },
  { title: 'Chill Lo-Fi Music Mix', category: 'Music', videoUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A', thumbnailUrl: 'https://img.youtube.com/vi/5qap5aO4i9A/hqdefault.jpg', description: 'Relax and code with this lo-fi music stream.', views: 8900 },
  { title: 'Top Gaming Highlights 2024', category: 'Gaming', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', description: 'Best gaming moments compiled.', views: 21300 },
];

for (const v of videos) {
  const video = await Video.create({ ...v, channelId: channel._id, uploader: user._id });
  channel.videos.push(video._id);
}
await channel.save();

console.log('✅ Database seeded successfully!');
process.exit();