# Environment Configuration

You need to configure environment variables for both the backend and frontend to run this project.

## Backend (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Port to run the Express server on
PORT=3001

# Allowed origin for CORS (e.g., your local Vite server or Vercel URL)
FRONTEND_ORIGIN=http://localhost:5173
```

## Frontend (`my-app/.env`)

Create a `.env` file in the `my-app/` directory:

```env
# URL for the Express API
VITE_API_URL=http://localhost:3001/api/content
```

*Note: In Vite, only environment variables prefixed with `VITE_` are exposed to the client-side code.*
