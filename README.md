# HerShield v2 - local run

1. MySQL me `backend/schema.sql` run karo.
2. Clerk dashboard: app banao, Email code login ON rakho. Keys copy karo.
3. `backend/.env.example` -> `backend/.env`, `frontend/.env.example` -> `frontend/.env`, values bharo.
4. Do terminals:  `cd backend && npm i && npm run dev`   |   `cd frontend && npm i && npm run dev`
5. Browser: http://localhost:5173

Deploy: sirf .env values badlo (VITE_API_URL, FRONTEND_URL, CORS_ORIGINS) - code me koi change nahi.
