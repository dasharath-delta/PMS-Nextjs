# PMS‑Nextjs (Product Management System)

A Product & user management application built with **Next.js**, **NextAuth**, **Zustand**, **Drizzle ORM**, and **PostgreSQL**.  
Supports user roles (admin & user), product CRUD, profile management, and secure routing.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup & Installation](#setup--installation)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Middleware & Routing Behavior](#middleware--routing-behavior)
- [Future Improvements](#future-improvements)

---

## Features

- User authentication with role-based access (admin & user) using **NextAuth**.
- Admin can **add**, **edit**, **delete** products.
- Products listed publicly for users & guests (admins are redirected for product listing).
- Profile management (avatar upload, username updates).
- Protected routes and UI components depending on user role.
- RESTful API routes using Next.js App Router + Drizzle ORM.
- State management using **Zustand**.

---

## Tech Stack

- **Next.js** (App Router)
- **NextAuth.js** for authentication
- **Drizzle ORM** for type-safe queries with PostgreSQL
- **Zustand** for client-side state management
- **Cloudinary** (or similar) for image uploads
- **Shadcn/UI** component library for UI parts
- **React‑Toastify** for toast notifications

---

## Folder Structure

```
/app
  /api
    /auth
    /products
    /profile
  /components
  /drizzle
  /lib
  /middleware.js
/store
/util
/public
...other config files
```

- **app/api** → Contains API routes (auth, product CRUD, profile).
- **components** → Reusable UI components (Navbar, Card, etc.).
- **drizzle** → ORM schema files.
- **store** → Zustand stores (`useUserStore`, `useProductStore`).
- **middleware.js** → Route protection and redirection logic.

---

## Setup & Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/DasharathSuthar/PMS-Nextjs.git
   cd PMS-Nextjs
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Set up PostgreSQL database and environment variables (see below).

4. Run database migrations / Drizzle ORM setup if needed.

5. Start development server:

   ```bash
   npm run dev
   ```

6. Go to `http://localhost:3000` in your browser.

---

## Scripts

- `dev`: Run development server
- `build`: Build the project for production
- `start`: Run server in production mode
- `lint`: Lint codebase
- Add more if you have test or migration commands

---

## Environment Variables

Create a `.env.local` file in root with something like:

```
DATABASE_URL=postgresql://user:password@localhost:5432/your_db_name
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=some_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Make sure to configure any other keys you use (Cloudinary, etc.).

---

## Usage

- On first launch, register a user (you may need to manually set role = ‘admin’ in DB or via seed).
- Admin users can:
  - Visit `/dashboard` to manage users and reports.
  - Add new products via `/add-product`.
  - Edit/delete products from the “all products” view.
- Regular users / guests can:
  - View products list.
  - View product details.
  - Access `/profile` to see or update their profile.

---

## Middleware & Routing Behavior

Middleware uses `next-auth/jwt` to enforce:

- **Public paths**: `/login`, `/register`, `/forgot-password`, `/reset-password`, and `/products` (list view).
- **Admin-only** pages: `/dashboard`, `/users`, `/reports`, `/add-product`, `/all-products`. Non-admins are redirected to `/`.
- **User-only** pages: `/contact`. Admins trying to access are redirected to `/dashboard`.
- **Profile** route: accessible by both admin & user.
- Admins are blocked from accessing `/products` listing view (to avoid confusing UI when admin should use dashboard).

---

## Future Improvements

- Add pagination & filtering on product list.
- Add better image gallery / thumbnail previews.
- Add role management (grant/revoke roles).
- Add tests (unit & integration).
- Improve UI/UX (skeleton loaders, responsive improvements).
- Docker setup for development/production.

---

## License

Specify the license (e.g. MIT) if applicable.

---

**Thanks for checking out PMS‑Nextjs!**  
Any feedback or pull requests are welcome.
