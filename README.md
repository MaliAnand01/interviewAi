# PrepAI — AI-Powered Interview Preparation Platform

PrepAI is an intelligent platform designed to help job seekers prepare for interviews by analyzing target job descriptions against their resumes/profiles. It generates customized interview strategies, including technical questions (with intentions and model answers), behavioral questions, skill gap analyses, and a tailored day-by-day preparation roadmap.

---

## Project Structure

The project is split into two main directories:
- **[interviewai_backend](file:///d:/Users/as/Desktop/interviewAi/interviewai_backend/)**: A Spring Boot application built with Java 17 and Maven, utilizing MongoDB for persistence, Spring Security for stateless JWT authentication, and the Google Gemini API for structured AI generation.
- **[interviewai_frontend](file:///d:/Users/as/Desktop/interviewAi/interviewai_frontend/)**: A modern, interactive React web interface built with Vite, Tailwind CSS, and Axios.

---

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.x / 4.x
- **Language**: Java 17
- **Database**: MongoDB (Atlas or Local)
- **Security**: Spring Security + JWT
- **AI Engine**: Google Gemini API (`gemini-2.5-flash`)
- **PDF Processing**: Apache PDFBox 3.x & OpenHTMLtoPDF

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router 7
- **Icons**: Lucide React
- **API Client**: Axios

---

## Local Setup & Environment Variables

Make sure you have **Java 17+** and **Node.js 18+** installed.

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd interviewai_backend
   ```
2. Create your local environment configuration file:
   ```bash
   cp .env.example .env
   ```
3. Populate `.env` with your credentials:
   - `MONGODB_URI`: Your MongoDB connection string (e.g. MongoDB Atlas).
   - `JWT_SECRET`: A secure string for signing JWT tokens.
   - `GEMINI_API_KEY`: Your Google AI Studio API key.
4. Compile the project:
   ```bash
   .\mvnw.cmd clean compile
   ```
5. Run the Spring Boot application:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```
   *The server runs on port `8080` by default.*

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd interviewai_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your local environment configuration file:
   ```bash
   cp .env.example .env.local
   ```
4. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The client runs on `http://localhost:5173` by default.*

---

## Security & Best Practices

- **Credentials Safety**: All secrets (MongoDB URI, JWT secret, and Google Gemini API key) have been removed from the static source files and are loaded dynamically via environment variables. Do not check `.env` files into Git.
- **Error Handling**: Exception messages are sanitized before returning to the frontend to avoid information disclosure.
- **CORS Config**: CORS settings are dynamic and read from backend properties, preventing hardcoded local origins in production.

---

## Deployment Guide

### Database
- Use **MongoDB Atlas** for a fully managed, free-tier cloud database. Configure the backend `MONGODB_URI` environment variable to point to your Atlas cluster.

### Backend Deployment
Deploy the backend Java JAR on platforms supporting Java runtimes (e.g. **Render**, **Railway**, **Heroku**, or a VPS like **DigitalOcean**):
1. Package the application to a runnable JAR:
   ```bash
   .\mvnw.cmd clean package -DskipTests
   ```
2. Set the following environment variables in your deployment dashboard:
   - `MONGODB_URI`: Your production MongoDB URI.
   - `JWT_SECRET`: A strong, randomly generated production secret.
   - `GEMINI_API_KEY`: Your Gemini API key.
   - `CORS_ALLOWED_ORIGINS`: The URL of your deployed frontend (e.g., `https://prepai.vercel.app`).
   - `PORT`: Usually provided by the hosting provider.

### Frontend Deployment
Deploy the React frontend on static hosts (e.g. **Vercel**, **Netlify**, or **Cloudflare Pages**):
1. Connect your repository to Vercel/Netlify.
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Configure the environment variables:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://prepai-backend.onrender.com`).
