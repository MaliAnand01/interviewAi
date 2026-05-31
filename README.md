# PrepAI — AI-Powered Interview Prep

PrepAI is an AI platform that generates custom interview prep strategies (technical/behavioral questions, skill gap analysis, and roadmaps) by comparing a job description with a resume.

---

## Structure
- **`interviewai_backend`**: Spring Boot API (Java 17 + MongoDB + Gemini API).
- **`interviewai_frontend`**: React client (Vite + Tailwind CSS).

---

## Local Setup

### 1. Backend
1. Go to `interviewai_backend`
2. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Configure the variables in `.env`:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secure token secret key
   - `GEMINI_API_KEY`: Google Gemini API key
4. Build and Run:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```

### 2. Frontend
1. Go to `interviewai_frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` file:
   ```env
   VITE_API_URL=http://localhost:8080
   ```
4. Run:
   ```bash
   npm run dev
   ```

---

## Deployment (Free Tier)

### 1. Backend on Render (Docker)
Render will build and host the Spring Boot container using the provided `Dockerfile`.
1. Create a Web Service on **Render**.
2. Connect your GitHub repository.
3. Set **Root Directory** to `interviewai_backend`.
4. Select **Docker** runtime and the **Free** tier.
5. Add these environment variables:
   - `MONGODB_URI`: *Your Atlas Mongo string*
   - `MONGODB_DB`: `interview-master`
   - `JWT_SECRET`: *Your JWT token signing key*
   - `GEMINI_API_KEY`: *Your Google Gemini AI key*
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app` (update after deploying frontend)

### 2. Frontend on Vercel
1. Create a project on **Vercel** and import your GitHub repo.
2. Set **Root Directory** to `interviewai_frontend`.
3. Add environment variable:
   - `VITE_API_URL`: *Your deployed Render backend URL*
4. Click **Deploy**.
