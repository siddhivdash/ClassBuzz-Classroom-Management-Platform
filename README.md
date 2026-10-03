# 📚 ClassBuzz — Classroom Management Platform

ClassBuzz is a full-stack classroom management platform built with the **MERN stack**. It helps teachers and students stay connected through announcements, assignment deadlines, doubt discussions, and live classroom polls.

## ✨ Features

- 🔐 **User Authentication** — Secure signup and login using JWT-based authentication
- 🏫 **Classroom Management** — Teachers can create classrooms and students can join them
- 📢 **Announcements** — Share important updates and class-related information
- 📅 **Deadlines** — Create, view, and track assignment or task deadlines
- ❓ **Doubts / Q&A** — Students can post doubts and participate in discussions
- 📊 **Polls** — Create polls and collect real-time classroom feedback
- 🎨 **Responsive UI** — Built with React for a clean, modern user experience
- 🌐 **REST API** — Express.js backend with MongoDB database

## 🛠️ Tech Stack

| Layer      | Technology |
|-----------|------------|
| Frontend  | React, React Router, Axios, CSS |
| Backend   | Node.js, Express.js |
| Database  | MongoDB, Mongoose |
| Auth      | JSON Web Tokens (JWT), bcrypt |
| Dev Tools | Git, GitHub, Postman, VS Code |

## 📁 Project Structure

```bash
ClassBuzz-Classroom-Management-Platform/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
│
├── server/          # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

> Update the folder names above if your repository uses a different structure.

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MongoDB](https://www.mongodb.com/) or a MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone [https://github.com/siddhivdash/ClassBuzz-Classroom-Management-Platform.git](https://github.com/siddhivdash/ClassBuzz-Classroom-Management-Platform.git)
cd ClassBuzz-Classroom-Management-Platform
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Start the backend server

```bash
npm run dev
```

The backend will usually run at:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open a new terminal:

```bash
cd ../client
npm install
```

### 6. Start the React frontend

```bash
npm start
```

The frontend will run at:

```text
http://localhost:3000
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in an existing user |
| `POST` | `/api/classrooms` | Create a classroom |
| `POST` | `/api/classrooms/join` | Join a classroom |
| `GET`  | `/api/classrooms` | Get classrooms for the logged-in user |
| `POST` | `/api/announcements` | Create an announcement |
| `GET`  | `/api/announcements/:classroomId` | Get announcements for a classroom |
| `POST` | `/api/deadlines` | Create a deadline |
| `GET`  | `/api/deadlines/:classroomId` | Get deadlines for a classroom |
| `POST` | `/api/doubts` | Post a doubt |
| `GET`  | `/api/doubts/:classroomId` | Get doubts for a classroom |
| `POST` | `/api/polls` | Create a poll |
| `POST` | `/api/polls/:pollId/vote` | Vote in a poll |

> Adjust these routes to match your actual Express route files.

## 🖼️ Screenshots

Add screenshots of your dashboard, classroom page, announcements, polls, and doubt section here:

```md


```

## 🧪 Testing the API

You can test the backend using [Postman](https://www.postman.com/) or Thunder Client.

Example login request:

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch  
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes  
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch  
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request



## 👤 Author

**Siddhi Dash**  
GitHub: [@siddhivdash](https://github.com/siddhivdash)



If you found this project useful, please consider giving it a star on GitHub!
