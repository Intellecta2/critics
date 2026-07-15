# CriticsApp

A curated streaming platform where content is aggregated by professional reviews, featuring metrics like critics' scores, technical specs, and highly optimized video streaming.

## Project Structure

This project is a decoupled full-stack application:
- `backend/`: Node.js + Express + MongoDB Atlas
- `my-app/`: React + Vite + Vanilla CSS + Firebase

## Features

- **Authentication**: Email/Password and Google OAuth via Firebase Auth.
- **Database**: MongoDB Atlas for content metadata; Firestore for user watchlists.
- **Security**: Firestore Rules configured to ensure users can only read/write their own watchlists.
- **Frontend**: Responsive, modern UI using a pure Vanilla CSS design system.
- **Video**: HLS Adaptive video playback.

## Getting Started

Please see the [Deployment](Deployment.md) and [Environment](Environment.md) guides for instructions on running locally or deploying to production.
