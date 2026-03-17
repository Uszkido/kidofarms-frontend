# Kido Farms – Local Development Guide

A full-stack e-commerce platform for fresh Nigerian farm produce.

```
kido-farms-ecommerce/
├── frontend/    → Next.js 16 (React, Tailwind CSS, NextAuth)
├── backend/     → Express.js (Node.js, Drizzle ORM, PostgreSQL/Neon)
├── package.json → Root workspace orchestrator (concurrently)
└── README.md
```

---

### 1. Project Status (Orbit 5.0 Synced)
*   **Sovereign Food Operating System (Orbit 5.0)**: [FULLY IMPLEMENTED] 🚀
*   **Neural Nodes (AI Agentic Layers)**: [ACTIVE] Gemini 1.5 Flash integrated with live tool-use.
*   **Universal Registry Console**: [ACTIVE] Real-time management (Users, Harvests, Logistics, Energy).
*   **Mastery Academy**: [ACTIVE] Gamified career pathways and soil health certification.
*   **Sovereign Energy Marketplace**: [ACTIVE] Biomass-to-Credit carbon economy.
*   **Global Bridge**: [ACTIVE] Export certification automation (ISO/Organic standards).

### 1. Install all dependencies
```bash
npm run install:all
```

### 2. Configure Environment Variables

**`backend/.env`**
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="kido-farms-super-secret-12345"
PORT=5000
```

**`frontend/.env`**
```env
DATABASE_URL="postgresql://..."
NEXT_AUTH_SECRET="kido-farms-super-secret-12345"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### 3. Run both servers together
```bash
npm run dev
```

This starts:
- 🟢 **Backend** → http://localhost:5000
- 🟦 **Frontend** → http://localhost:3000

---

## 🔧 Individual Commands

| Task | Command | Directory |
|------|---------|-----------|
| Start backend only | `npm start` | `backend/` |
| Start frontend only | `npm run dev` | `frontend/` |
| Push DB schema | `npm run db:push` | `frontend/` |
| DB Studio (GUI) | `npm run db:studio` | `frontend/` |
| Build frontend | `npm run build` | root |

---

## 🌐 API Endpoints (Backend – port 5000)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/signup` | User registration |
| GET/POST | `/api/products` | Product listing & creation |
| GET/POST | `/api/categories` | Categories |
| GET/POST | `/api/blog` | Blog posts |
| GET/POST | `/api/subscribers` | Newsletter subscribers |
| GET | `/api/orders` | Orders |
| GET | `/api/users` | Users (admin) |

---

## 🛡️ Admin Access

Default admin seed script: `frontend/src/db/seed-admin.ts`  
Run with: `npx tsx src/db/seed-admin.ts` from the `frontend/` directory.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Auth | NextAuth v4 (JWT strategy) |
| Backend | Express.js 4, Node.js |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| Images | Cloudinary |
| Deployment | Vercel (frontend) + Vercel serverless (backend) |
