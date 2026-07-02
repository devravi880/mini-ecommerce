# ShopSphere - Mini Full Stack E-Commerce

A production-quality mini e-commerce application built for **MCA Final Year Project**.

![Tech Stack](https://img.shields.io/badge/React-19-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MySQL](https://img.shields.io/badge/MySQL-Prisma-orange)

---

## Features

### Customer
- Browse products with search and category filters
- Product details with add to cart / wishlist
- Shopping cart with quantity management
- Checkout with shipping details
- Order history and printable invoice
- Cancel pending orders

### Admin
- Dashboard with store statistics
- Product & category CRUD with image upload
- Order management with status updates
- Role-based protected admin panel

### Technical
- JWT authentication with bcrypt password hashing
- RESTful API with standardized responses
- Prisma ORM with MySQL
- Responsive Tailwind CSS UI
- Clean architecture (controllers → services → Prisma)

---

## Tech Stack

| Frontend | Backend | Database |
|----------|---------|----------|
| React 19 | Node.js | MySQL |
| Vite | Express.js | Prisma ORM |
| Tailwind CSS | JWT + bcrypt | |
| Axios | Multer | |
| React Router | CORS | |

---

## Project Structure

```
mca-project/
├── frontend/                 # React + Vite app
│   └── src/
│       ├── api/              # Axios API services
│       ├── components/       # Reusable UI components
│       ├── context/          # Auth, Cart, Wishlist state
│       ├── hooks/            # Custom React hooks
│       ├── layouts/          # MainLayout, AdminLayout
│       ├── pages/            # Route pages
│       └── styles/           # Tailwind CSS
├── backend/                  # Express API
│   └── src/
│       ├── controllers/      # HTTP request handlers
│       ├── services/         # Business logic
│       ├── routes/           # API routes
│       ├── middlewares/      # Auth, upload, errors
│       ├── prisma/           # Schema & migrations
│       └── uploads/          # Product images
├── PROJECT.md                # MCA project documentation
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL (XAMPP recommended)
- npm

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. Configure Database

Edit `backend/.env`:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/shopsphere"
JWT_SECRET=your_secret_key_here
```

> URL-encode special characters in password (`@` → `%40`)

Create database in MySQL:
```sql
CREATE DATABASE shopsphere;
```

### 3. Run Migrations & Seed

```bash
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 4. Start Servers

```bash
# Terminal 1 - Backend (port 5001)
cd backend && npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend && npm run dev
```

| App | URL |
|-----|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5001/api |
| Health Check | http://localhost:5001/api/health |
| Admin Panel | http://localhost:5173/admin |

### Default Admin Login
```
Email:    admin@shopsphere.com
Password: admin123
```

---

## API Reference

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |

### Products & Categories
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/products?search=&categoryId=` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| GET | `/api/categories` | Public |
| POST | `/api/categories` | Admin |

### Cart, Wishlist, Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| GET/POST | `/api/cart` | Customer |
| GET/POST | `/api/wishlist` | Customer |
| POST | `/api/orders` | Customer |
| GET | `/api/orders` | Customer |
| PUT | `/api/orders/:id/cancel` | Customer |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/admin/dashboard` | Admin |
| GET | `/api/admin/orders` | Admin |
| PUT | `/api/admin/orders/:id/status` | Admin |

**Response Format:**
```json
{ "success": true, "message": "", "data": {} }
```

---

## Deployment

### Backend (Production)

1. Set environment variables on server:
```env
NODE_ENV=production
PORT=5001
DATABASE_URL=mysql://user:pass@host:3306/shopsphere
JWT_SECRET=strong_random_secret
CLIENT_URL=https://your-frontend-domain.com
```

2. Build & run:
```bash
cd backend
npm install --production
npm run db:generate
npm run db:migrate
npm start
```

Use **PM2** for process management:
```bash
npm install -g pm2
pm2 start src/server.js --name shopsphere-api
```

### Frontend (Production)

1. Update `frontend/.env`:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

2. Build:
```bash
cd frontend
npm run build
```

3. Deploy `frontend/dist/` to **Vercel**, **Netlify**, or **Nginx**.

### Nginx Example (serve frontend + proxy API)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /var/www/shopsphere/dist;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5001;
    }

    location /uploads {
        proxy_pass http://localhost:5001;
    }
}
```

---

## Development Commands

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | frontend/backend | Start dev server |
| `npm run build` | frontend | Production build |
| `npm run db:migrate` | backend | Run DB migrations |
| `npm run db:seed` | backend | Seed admin user |
| `npm run db:studio` | backend | Open Prisma Studio |

---

## Development Status

- [x] Phase 1: Project setup (Frontend, Backend, Prisma, MySQL)
- [x] Phase 2: Authentication (JWT, Register, Login, Roles)
- [x] Phase 3: Admin Panel (Dashboard, Products, Categories, Upload)
- [x] Phase 4: Customer (Browse, Cart, Wishlist, Checkout)
- [x] Phase 5: Orders (History, Admin management, Invoice)
- [x] Phase 6: Testing, Responsive UI, Documentation

---

## License

This project is created for educational purposes — MCA Final Year Project.
