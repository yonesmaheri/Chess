You are a senior backend engineer. Build a production-ready authentication system using NestJS.

## Tech Stack Requirements:
- NestJS (latest stable)
- PostgreSQL (running in Docker)
- Prisma ORM
- Cookie-based authentication (NOT JWT in localStorage)
- TypeScript

## Core Requirements:

### 1. Authentication Strategy
Implement secure cookie-based auth using httpOnly cookies:
- Access token stored in httpOnly cookie
- Refresh token stored in httpOnly cookie (optional but recommended)
- Secure, SameSite=strict/lax depending on environment
- CSRF protection strategy included

### 2. Features
Implement full auth system:

- User registration
- User login
- Logout
- Get current user (/me)
- Password hashing using bcrypt
- Token refresh mechanism (if refresh token is used)
- Protected routes using Guards

### 3. Database (Prisma + PostgreSQL)
Create Prisma schema with:
- User model:
    based on register field in frontend

Optional:
- refreshTokenVersion or hashed refresh token support

Generate:
- Prisma schema
- migrations setup
- seed (optional)

### 4. NestJS Architecture
Follow clean modular architecture:

modules/
  auth/
    auth.controller.ts
    auth.service.ts
    auth.module.ts
    strategies/ (if needed)
    guards/
  users/
    users.service.ts
    users.module.ts
    users.repository.ts

shared/
  prisma.service.ts
  decorators/current-user.decorator.ts

### 5. Security Requirements
- Hash passwords with bcrypt (salt rounds 10+)
- Validate input with class-validator DTOs
- Prevent common auth vulnerabilities:
  - brute force protection (basic rate limit optional)
  - password hashing never exposed
- Use Helmet middleware

### 6. Cookie Handling
- Set cookies using res.cookie()
- httpOnly = true
- secure = true in production
- sameSite configured properly
- clear cookies on logout

### 7. API Endpoints

Auth:
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh (if implemented)
- GET /auth/me

### 8. Docker Integration
Assume PostgreSQL is already running in Docker.
Provide:
- Prisma DATABASE_URL config
- .env example
- migration commands

### 9. Output Requirements
Provide:
- Full NestJS code structure
- Prisma schema
- DTOs
- Auth service implementation
- Auth controller
- Guards
- Prisma service
- Clear setup instructions

Make it production-ready, clean, and scalable.
Avoid pseudo-code. Provide real implementation.