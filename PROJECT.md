# ShopSphere - MCA Final Year Project

## Project Title
**ShopSphere** — Mini Full Stack E-Commerce Web Application

## Problem Statement
Build a scalable e-commerce platform where customers can browse products, manage cart/wishlist, and place orders; and admins can manage products, categories, and orders.

## Objectives
- RESTful API with JWT authentication and role-based access
- MySQL database with Prisma ORM
- Responsive React frontend with modern UI
- Admin panel for store management
- Order lifecycle management with invoice

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL |
| ORM | Prisma |
| Auth | JWT + bcrypt |

## Modules Implemented

1. **Authentication** — Register, Login, JWT, Admin/Customer roles
2. **Admin Panel** — Dashboard, Product CRUD, Category CRUD, Image Upload
3. **Customer** — Product browse, Search, Filters, Cart, Wishlist, Checkout
4. **Orders** — Place order, Order history, Admin status updates, Cancel, Invoice

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopsphere.com | admin123 |

Run `npm run db:seed` in backend to create admin user.

## Viva Demo Flow

1. Show home page and product listing with search/filter
2. Register/login as customer → add to cart & wishlist
3. Checkout and place order → print invoice
4. Login as admin → manage products/categories
5. Admin orders → update status (Pending → Confirmed → Shipped)
6. Show Prisma schema and API architecture

## Future Enhancements
- Payment gateway integration (Razorpay/Stripe)
- Product reviews and ratings UI
- Email notifications
- Forgot password with OTP
