# Japanese Learning App - Backend 🚀

This is the backend API for a highly interactive, dynamic Japanese learning platform built with Node.js, Express, and MySQL. It handles data access for vocabulary, kanji, and kana lessons; manages dynamic quiz sessions; and safely tracks user accounts, streaks, and progress achievements.

## 🗂️ Architecture & Folder Structure

To ensure the backend is **easy to maintain** and **highly scalable**, it is organized using standard Express best practices:

```
backend/
├── data/                  # Source JSON files used for initial database seeding
├── src/
│   ├── config/            # DB, environment, and 3rd party config settings
│   │   └── db.js          # MySQL2 connection pool setup
│   ├── controllers/       # Contains endpoints logic (Request/Response handling)
│   ├── middlewares/       # Express middlewares 
│   │   ├── authMiddleware.js # JWT verification
│   │   └── errorHandler.js   # Global error handling and formatting
│   ├── models/            # Separated Database models (For future scaling)
│   ├── routes/            # Route definition files mapping URLs to controllers
│   │   └── index.js       # The "Master Router" mapping all resources to /api
│   ├── seeders/           # Migration scripts to build or reset local DB data
│   │   └── seed.js        # Parses JSON files to seed MySQL databases
│   ├── utils/             # Helper utilities and shared functions
│   │   └── asyncHandler.js# Wrapper to gracefully pass async errors to 'next()'
│   └── server.js          # Application entry point & core Express configuration
├── .env                   # Environment variable configs (Port, JWT secrets)
└── package.json
```

## 🛠️ How it scales

1. **Global Error Handling (`middlewares/errorHandler.js`)**
   Instead of writing `res.status(500).json({ error })` inside `try...catch` blocks repeatedly across hundred of controllers, all errors are passed down to **one centralized location**. This ensures that error responses sent to the client are consistent everywhere in the application.

2. **Async Handler (`utils/asyncHandler.js`)**
   Instead of wrapping every DB query inside `try { ... } catch(err) { next(err) }`, wrap the controller in `asyncHandler(async (req, res) => {...})`! This trims boilerplate and automatically redirects rejected promises to your `errorHandler`.

3. **Master Routing File (`routes/index.js`)**
   Instead of dumping 30 separate `app.use()` calls inside `server.js`, `index.js` acts as a routing catalog. `server.js` remains clean and completely focused on server initialization, CORS setup, and basic middleware.

4. **Dedicated Seeders (`seeders/seed.js`)**
   Your database migration completely empties dependent tables via `SET FOREIGN_KEY_CHECKS = 0` and correctly re-seeds from raw `.json` files.

## 🚀 Getting Started

### 1. Requirements
*   Node.js v16+
*   MySQL Server v8+

### 2. Environment Variables (`.env`)
Create a `.env` file at the root of `backend/` and provide your configuration:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=japanese_learning_db

JWT_SECRET=super_secret_access_key
JWT_REFRESH_SECRET=super_secret_refresh_key
```

### 3. Install & Seed
```bash
npm install
npm run seed  # Caution: Drops internal DB quiz/learning data and rebuilds it.
npm run dev   # Starts Nodemon watcher for live development
```

## 🌐 API Resources

All Endpoints are configured under `/api/*`

*   **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`
*   **Content**: `/api/lessons`, `/api/vocab`, `/api/kanji`, `/api/kana`
*   **Quizzes**: `/api/questions`
*   **Sessions**: `/api/sessions`
*   **Progress/Analytics**: `/api/progress/history/:userId`, `/api/progress/achievements`
