# Deployment Guide

This project is designed to be deployed with the Frontend on Vercel and the Backend on Render.

## 1. Backend (Render)

1. Connect your GitHub repository to Render.
2. Create a new **Web Service**.
3. Set the Root Directory to `backend` (or just leave blank and Render will use the settings from `render.yaml` if you connect using Blueprint).
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Set the Environment Variables:
   - `PORT`: `3001`
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `FRONTEND_ORIGIN`: The URL of your Vercel deployment (e.g., `https://criticsapp.vercel.app`).

*Note: You can use the included `backend/render.yaml` as a Blueprint.*

## 2. Frontend (Vercel)

1. Connect your GitHub repository to Vercel.
2. Create a new Project.
3. Set the Framework Preset to **Vite**.
4. Set the Root Directory to `my-app`.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Set the Environment Variables:
   - `VITE_API_URL`: The URL of your Render backend deployment (e.g., `https://criticsapp-backend.onrender.com/api/content`).

*Note: The included `my-app/vercel.json` configures SPA routing rewrites.*

## 3. Firebase (Firestore Rules)

To deploy the Firestore security rules:
1. Ensure you have the Firebase CLI installed (`npm install -g firebase-tools`).
2. Run `firebase login` and `firebase use critics-da3a0`.
3. Run `firebase deploy --only firestore:rules`.
