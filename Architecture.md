# Architecture Overview

## Data Flow

1. **Content Data:**
   `React App` <--> `Axios HTTP Requests` <--> `Express Server` <--> `MongoDB Atlas`
   - The Express server acts as a RESTful API.
   - All movie and series metadata is stored in MongoDB.

2. **User Authentication:**
   `React App` <--> `Firebase Auth SDK` <--> `Google Identity Services`
   - Authentication bypasses the Express backend completely.
   - Generates a permanent `user.uid` for logged-in users.

3. **User Data (Watchlists):**
   `React App` <--> `Firestore SDK` <--> `Cloud Firestore`
   - Watchlists are stored at `users/{uid}/watchlist/items`.
   - Security Rules ensure users can only access their own watchlists.

## State Boundaries
- **CORS:** The Express server explicitly allows requests from the Frontend Origin using the `cors` middleware.
- **Frontend State:** Managed using React `useState` and `useEffect`.
- **Real-time Sync:** Firestore's `onSnapshot` is used to sync the watchlist instantly across sessions.
