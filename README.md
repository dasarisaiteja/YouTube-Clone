# YouTube Clone — MERN Stack

A full-stack YouTube clone built with MongoDB, Express, React (Vite), and Node.js.

## Features
- JWT Authentication (Register / Login / Logout)
- Home page with video grid, filter by category, search by title
- Video player with YouTube embed support + like/dislike
- Full comment CRUD (Add, Edit, Delete)
- Channel creation and video management (Upload, Edit, Delete)
- Responsive design across mobile, tablet, and desktop

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
# Edit .env with your MONGO_URI and JWT_SECRET
npm run dev        # Runs on http://localhost:5000
node seed.js       # Optional: seed sample data
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Runs on http://localhost:5173
```

## Tech Stack
- **Frontend:** React 18, React Router v6, Axios, Vite
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **Auth:** JWT + bcryptjs

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Register user |
| POST | /api/auth/login | ❌ | Login user |
| GET | /api/videos | ❌ | Get all videos (search/filter) |
| GET | /api/videos/:id | ❌ | Get single video + increment views |
| POST | /api/videos | ✅ | Upload video |
| PUT | /api/videos/:id | ✅ | Edit video |
| DELETE | /api/videos/:id | ✅ | Delete video |
| PUT | /api/videos/:id/like | ✅ | Like video |
| PUT | /api/videos/:id/dislike | ✅ | Dislike video |
| GET | /api/channels/:id | ❌ | Get channel info |
| POST | /api/channels | ✅ | Create channel |
| POST | /api/comments/:videoId | ✅ | Add comment |
| PUT | /api/comments/:videoId/:commentId | ✅ | Edit comment |
| DELETE | /api/comments/:videoId/:commentId | ✅ | Delete comment |
```

---

## 🚀 How to Set Up Your Project

**Step 1** — Create folders and paste files:
```
youtube-clone/
  backend/   ← all backend files above
  frontend/  ← all frontend files above