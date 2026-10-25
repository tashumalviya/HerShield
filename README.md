# 🛡️ HerShield

A women's safety web app. With one tap, a user can send an **SOS alert** with her live location to her trusted emergency contacts by email, keep their details saved, and find emergency numbers quickly.

**🔗 Live demo:** [https://her-shield-ee6w.vercel.app](https://her-shield-ee6w.vercel.app)

> ℹ️ The backend runs on a free Render instance, so the **first request after a period of inactivity can take up to ~50 seconds** while the server wakes up.

---

## ✨ Features

- 🚨 **One-tap SOS**: sends an alert email with a live location link to all saved emergency contacts
- 📍 **Live location sharing**: contacts can follow the location through a tracking page
- 👥 **Emergency contacts**: add and manage trusted contacts (name, phone, email, relationship)
- 🗺️ **Map view**: see your current location on a map (Google Maps)
- ☎️ **National emergency numbers**: quick access to important helplines
- 🔐 **Secure login**: email-code authentication powered by Clerk
- 📱 **Mobile-first, responsive UI**

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Database | MySQL |
| Authentication | Clerk |
| Email alerts | EmailJS |
| Maps | Google Maps API |
| Hosting | Vercel (frontend), Render (backend) |

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- MySQL
- Accounts / keys for [Clerk](https://clerk.com), [EmailJS](https://www.emailjs.com) and Google Maps API

### Steps

1. **Clone the repo**
   ```bash
   git clone https://github.com/tashumalviya/HerShield.git
   cd HerShield
   ```

2. **Set up the database**
   Run `backend/schema.sql` in your MySQL server.

3. **Set up Clerk**
   Create an app in the Clerk dashboard and enable **Email code** login. Copy the publishable and secret keys.

4. **Create the `.env` files**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
   Fill in the values (see the tables below).

5. **Start the backend and frontend** in two terminals
   ```bash
   # Terminal 1
   cd backend
   npm install
   npm run dev

   # Terminal 2
   cd frontend
   npm install
   npm run dev
   ```

6. Open **http://localhost:5173**

---

## ☁️ Deployment

- **Frontend (Vercel):** set the project's **Root Directory** to `frontend`, add all `VITE_*` environment variables, and redeploy. `frontend/vercel.json` rewrites all routes to `index.html` so client-side routes work after login.
- **Backend (Render):** deploy the `backend` folder, add the environment variables, and set `CORS_ORIGINS` to the exact frontend origin, for example:
  ```
  CORS_ORIGINS=https://her-shield-ee6w.vercel.app
  ```
- After changing any environment variable, **redeploy** so the new values are picked up.

---

## 👩‍💻 Author

**Tashu Malviya**
GitHub: [@tashumalviya](https://github.com/tashumalviya)