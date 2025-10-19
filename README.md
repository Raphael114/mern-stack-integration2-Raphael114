# 📰 MERN Blog Application

A full-stack **MERN (MongoDB, Express, React, Node.js)** blog platform where users can create, edit, and manage blog posts with category and image upload support. The app demonstrates modern full-stack development practices, including RESTful APIs, React Router, context-based state management, and cloud integration for uploads.

---

## 🚀 Features

### 🧠 Frontend (React + Vite)

* Built with **React 18** and **Vite** for lightning-fast performance
* **React Router v6** for smooth client-side navigation
* Reusable components (PostsList, PostForm, PostEdit, Layout, etc.)
* Integration with backend API using Axios or Fetch
* Form validation and image uploads
* Responsive and modern UI using Tailwind CSS or your preferred CSS framework

### ⚙️ Backend (Node.js + Express)

* **RESTful API** built with Express
* **Mongoose ODM** for MongoDB schema and queries
* API routes for:

  * Post creation, editing, deletion, and retrieval
  * Image upload and serving
  * Category management
* **Environment variables** for secure configuration
* Error handling and CORS configuration

### 🗄️ Database

* **MongoDB Atlas** (cloud) or **local MongoDB** connection
* Collections for:

  * `posts`
  * `categories`
  * (Optional) `users` for authentication

---

## 🏗️ Project Structure

```
mern-blog-app/
│
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── vite.config.js
│
├── server/                    # Node.js backend
│   ├── models/
│   │   ├── Post.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── postRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── categoryRoutes.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   └── .env
│
└── README.md
```

---

## ⚡ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/mern-blog-app.git
cd mern-blog-app
```

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
UPLOAD_PATH=uploads
```

Start the backend:

```bash
npm run dev
```

Backend will run on:
👉 `http://localhost:5000`

---

### 3️⃣ Setup Frontend

```bash
cd ../client
npm install
```

Create a `.env` file inside the `client` directory and add:

```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on:
👉 `http://localhost:5173`

---

## 🧩 API Endpoints

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| GET    | /api/posts      | Get all posts      |
| GET    | /api/posts/:id  | Get single post    |
| POST   | /api/posts      | Create new post    |
| PUT    | /api/posts/:id  | Update a post      |
| DELETE | /api/posts/:id  | Delete a post      |
| POST   | /api/upload     | Upload an image    |
| GET    | /api/categories | Get all categories |

---

## 🧠 Technologies Used

### Frontend:

* React 18
* Vite
* React Router DOM
* Axios
* Tailwind CSS / Bootstrap

### Backend:

* Node.js
* Express
* Mongoose
* Multer (for file uploads)
* Dotenv
* Cors

### Database:

* MongoDB (Atlas or Local)

---

## 🔐 Environment Variables Summary

| Key            | Description               | Example                     |
| -------------- | ------------------------- | --------------------------- |
| `PORT`         | Server port               | `5000`                      |
| `MONGO_URI`    | MongoDB connection string | `mongodb+srv://...`         |
| `UPLOAD_PATH`  | Upload directory          | `uploads`                   |
| `VITE_API_URL` | Frontend API base URL     | `http://localhost:5000/api` |

---

## 🧰 Available Scripts

### In the client:

| Script            | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start the frontend (development) |
| `npm run build`   | Build for production             |
| `npm run preview` | Preview production build         |

### In the server:

| Script        | Description             |
| ------------- | ----------------------- |
| `npm run dev` | Run server with nodemon |
| `npm start`   | Run server normally     |

---

## 🧪 Testing

You can test the API using **Postman** or **Thunder Client**.

Example POST request to create a new post:

```json
{
  "title": "My First Blog Post",
  "content": "This is a MERN blog app!",
  "category": "Technology"
}
```

---

## 🌐 Deployment

You can deploy easily using:

* **Frontend:** [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/)
* **Backend:** [Render](https://render.com/), [Railway](https://railway.app/), or [Heroku](https://heroku.com/)
* **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 🧑‍💻 Author

**Nwamuta Raphael**
Full Stack Software Engineer
📧raphaelodinaka13@gmail.com  mailto: raphaelodinaka13@gmail.com
💼 [LinkedIn]: (https://www.linkedin.com/in/nwamuta-raphael-a40242182/) | 🌐 [Portfolio](https://yourportfolio.com)

---

## 📝 License

This project is licensed under the **MIT License** — feel free to use, modify, and share.

---

### 💡 Tip

When deploying, make sure to:

* Update API URLs in `.env`
* Set CORS correctly in your backend
* Use environment variables for MongoDB URI and cloud upload services
