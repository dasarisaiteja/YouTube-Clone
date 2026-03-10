# 🎬 YouTube Clone — MERN Stack

A full-stack YouTube clone that replicates the core features and user experience
of YouTube, built using the MERN stack (MongoDB, Express, React, Node.js).
Users can browse videos, search and filter by category, authenticate securely,
manage their own channel, upload videos, and interact through likes, dislikes,
and comments.

---

## 📸 Screenshots

### 🏠 Home Page
![Home Page](screenshots/home.png)

### 🔐 Login Page
![Login](screenshots/login.png)

### 📝 Register Page
![Register](screenshots/register.png)

### 🎬 Video Player Page
![Video Player](screenshots/watch.png)

### 📺 Channel Page
![Channel](screenshots/channel.png)

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP requests to backend |
| Context API | Global auth state management |
| CSS3 | Custom styling & responsive design |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework & API routing |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| JSON Web Tokens (JWT) | Secure authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variable management |
| CORS | Cross-origin resource sharing |

---

## 📁 Project Structure
```
youtube-clone/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT auth middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Channel.js         # Channel schema
│   │   └── Video.js           # Video + embedded comments schema
│   ├── routes/
│   │   ├── auth.js            # Register & login routes
│   │   ├── videos.js          # Video CRUD + like/dislike
│   │   ├── channels.js        # Channel create & fetch
│   │   └── comments.js        # Comment CRUD
│   ├── .env                   # Environment variables
│   ├── package.json
│   ├── seed.js                # Database seeder
│   └── server.js              # Express app entry point
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx         # Top navigation bar
    │   │   ├── Sidebar.jsx        # Collapsible sidebar
    │   │   ├── VideoCard.jsx      # Video thumbnail card
    │   │   ├── FilterBar.jsx      # Category filter buttons
    │   │   └── CommentSection.jsx # Comment add/edit/delete
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state
    │   ├── pages/
    │   │   ├── Home.jsx           # Home page with video grid
    │   │   ├── Watch.jsx          # Video player page
    │   │   ├── Login.jsx          # Login page
    │   │   ├── Register.jsx       # Register page
    │   │   └── Channel.jsx        # Channel management page
    │   ├── utils/
    │   │   └── api.js             # Axios instance with JWT
    │   ├── App.jsx                # Root component & routing
    │   ├── main.jsx               # React entry point
    │   └── index.css              # Global styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) (local) or a [MongoDB Atlas](https://www.mongodb.com/atlas) account
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/youtube-clone.git
cd youtube-clone
```

---

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/youtube-clone
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

> 💡 If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://<username>:<password>@cluster.mongodb.net/youtube-clone`

Start the backend server:
```bash
npm run dev
```

You should see:
```
MongoDB Connected: localhost
Server running on port 8000
```

#### Seed the Database (Optional but Recommended)

To populate the database with sample videos, a channel, and a test user:
```bash
node seed.js
```

You should see:
```
✅ Database seeded successfully!
```

> **Test credentials after seeding:**
> - Email: `john@example.com`
> - Password: `password123`

---

### 3. Frontend Setup

Open a **new terminal** and run:
```bash
cd frontend
npm install
npm run dev
```

The app will be available at:
```
http://localhost:5173
```

---

## 🔌 API Routes

### 🔐 Authentication — `/api/auth`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | ❌ | Register a new user |
| POST | `/api/auth/login` | ❌ | Login and receive JWT token |

**Register Request Body:**
```json
{
  "username": "JohnDoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### 🎬 Videos — `/api/videos`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/videos` | ❌ | Get all videos (supports `?search=` and `?category=`) |
| GET | `/api/videos/:id` | ❌ | Get single video + increment view count |
| POST | `/api/videos` | ✅ | Upload a new video |
| PUT | `/api/videos/:id` | ✅ | Update video details |
| DELETE | `/api/videos/:id` | ✅ | Delete a video |
| PUT | `/api/videos/:id/like` | ✅ | Toggle like on a video |
| PUT | `/api/videos/:id/dislike` | ✅ | Toggle dislike on a video |

**Query Parameters for GET /api/videos:**
```
/api/videos?search=react        → search by title
/api/videos?category=JavaScript → filter by category
/api/videos?search=node&category=Web Development → combined
```

---

### 📺 Channels — `/api/channels`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/channels/:id` | ❌ | Get channel info and its videos |
| POST | `/api/channels` | ✅ | Create a new channel |

**Create Channel Request Body:**
```json
{
  "channelName": "My Channel",
  "description": "Welcome to my channel!",
  "channelBanner": "https://example.com/banner.jpg"
}
```

---

### 💬 Comments — `/api/comments`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/comments/:videoId` | ✅ | Add a comment to a video |
| PUT | `/api/comments/:videoId/:commentId` | ✅ | Edit your comment |
| DELETE | `/api/comments/:videoId/:commentId` | ✅ | Delete your comment |

---

## ✨ Features

- ✅ **User Authentication** — Register, login, logout with JWT
- ✅ **Home Page** — Video grid with thumbnails, titles, views, channel name
- ✅ **Search** — Search videos by title from the header search bar
- ✅ **Filter** — Filter videos by category (10 categories)
- ✅ **Video Player** — Supports YouTube embed links and direct video URLs
- ✅ **Like / Dislike** — Toggle like and dislike with mutual exclusion
- ✅ **View Counter** — Auto-increments on every video open
- ✅ **Comments** — Full CRUD: add, edit, delete (owners only)
- ✅ **Channel Page** — Create a channel, upload, edit, and delete videos
- ✅ **Collapsible Sidebar** — Toggle via hamburger menu
- ✅ **Responsive Design** — Works on mobile, tablet, and desktop

---

## 🗄️ Database Schema

### User
```json
{
  "username": "String (unique, required)",
  "email": "String (unique, required)",
  "password": "String (hashed with bcrypt)",
  "avatar": "String (URL)",
  "channels": ["ObjectId → Channel"]
}
```

### Channel
```json
{
  "channelName": "String (unique, required)",
  "owner": "ObjectId → User",
  "description": "String",
  "channelBanner": "String (URL)",
  "subscribers": "Number",
  "videos": ["ObjectId → Video"]
}
```

### Video
```json
{
  "title": "String (required)",
  "description": "String",
  "videoUrl": "String (required)",
  "thumbnailUrl": "String",
  "channelId": "ObjectId → Channel",
  "uploader": "ObjectId → User",
  "category": "String (enum)",
  "views": "Number",
  "likes": ["ObjectId → User"],
  "dislikes": ["ObjectId → User"],
  "comments": [
    {
      "userId": "ObjectId → User",
      "username": "String",
      "text": "String",
      "timestamp": "Date"
    }
  ]
}
```

---

## 🚀 Deployment (Optional)

### Backend — Render / Railway
1. Push backend to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`
4. Set build command: `npm install`
5. Set start command: `node server.js`

### Frontend — Vercel / Netlify
1. Push frontend to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable if needed: `VITE_API_URL=https://your-backend.onrender.com`

---

## 👨‍💻 Author

**Your Name**
- GitHub: [dasarisaiteja](https://github.com/dasarisaiteja/YouTube-Clone)
- Email: dasarisaiteja210@gmail.com

---

## 📄 License

This project is built as a capstone submission for the Full Stack Development
course at [Internshala Trainings](https://trainings.internshala.com/).