# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MasukiBooks** is a full-stack e-commerce platform for an online bookstore with:
- **Backend**: Spring Boot 3.3.5 (Java 21) + PostgreSQL/Supabase
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + Redux Toolkit
- **Architecture**: Decoupled SPA frontend consuming REST API backend

The project includes user authentication (JWT), shopping cart, order management, file storage (S3/Supabase), subscription system, and role-based admin/user dashboards.

---

## Repository Structure

```
Demo/
├── Masuki-Books-Backend/     # Spring Boot backend API
│   ├── src/main/java/com/masukibooks/
│   │   ├── config/          # Security, CORS configuration
│   │   ├── controller/      # REST endpoints (Auth, AdminEbook, UserEbook, Library, Subscription)
│   │   ├── service/         # Business logic (Auth, Product, Cart, Order, Subscription, BookStorage)
│   │   ├── entity/          # JPA entities (User, BooksMetadata, Cart, Order, etc.)
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── dto/             # Request/Response objects
│   │   ├── security/        # JWT token provider & authentication filter
│   │   └── resources/       # application.yml, Flyway migrations
│   ├── pom.xml              # Maven dependencies
│   └── .env                 # Environment configuration (not in git)
│
├── Masuki-Books-Frontend/    # React + TypeScript frontend
│   ├── src/
│   │   ├── app/             # Redux store configuration
│   │   ├── components/      # Reusable UI components (animations, auth, books, dashboard, layout, library, subscription, ui, wallet)
│   │   ├── features/        # Feature modules (admin, auth, catalog, cart, library, orders, user)
│   │   ├── routes/          # AppRoutes.tsx - routing configuration
│   │   ├── services/        # API clients (api.ts, authService.ts, booksService.ts, supabase.ts, etc.)
│   │   └── types/           # TypeScript interfaces (book.ts, auth.ts, subscription.ts)
│   ├── package.json         # npm dependencies
│   ├── vite.config.ts       # Vite bundler configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── eslint.config.js     # ESLint configuration
│   └── .env                 # Frontend environment variables
│
├── PROJECT_DOCUMENTATION.md # Comprehensive project documentation (API, DB schema, features)
└── CLAUDE.md                # This file
```

---

## Common Development Commands

### Backend (Spring Boot)

```bash
cd Masuki-Books-Backend

# Build the project
mvn clean install

# Run in development mode
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Run in production mode
mvn spring-boot:run -Dspring-boot.run.profiles=prod

# Run tests
mvn test

# Run specific test
mvn test -Dtest=AuthServiceTest

# Generate API docs (Swagger/OpenAPI)
# Access at http://localhost:8081/swagger-ui.html when running

# Package JAR
mvn clean package -DskipTests

# Run packaged JAR
java -jar target/masukibooks-backend-1.0.0.jar --spring.profiles.active=dev
```

**Default backend port**: 8081 (configurable via `server.port` in application.yml)

### Frontend (React + Vite)

```bash
cd Masuki-Books-Frontend

# Install dependencies
npm install

# Run development server (hot reload)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build locally
npm run preview

# Run type checking
npx tsc --noEmit
```

**Default frontend dev server**: http://localhost:5173

---

## Environment Configuration

### Backend (.env)
The backend requires these key environment variables:

```properties
# Database (Supabase or local PostgreSQL)
DATABASE_URL=jdbc:postgresql://db.[project-ref].supabase.co:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password

# JWT Authentication
JWT_SECRET=your_64_character_secure_random_secret
JWT_EXPIRATION_MS=86400000  # 24 hours

# Email (SMTP)
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# CORS & URLs
FRONTEND_URL=http://localhost:5173

# S3 Storage (Supabase)
S3_ENDPOINT=https://bbrxdsaojiqdgrdyghih.storage.supabase.co/storage/v1/s3
S3_REGION=ap-northeast-2
S3_ACCESS_KEY=your_supabase_anon_key
S3_SECRET_KEY=your_supabase_service_role_key
S3_BUCKET=books
S3_PUBLIC_URL_PREFIX=https://bbrxdsaojiqdgrdyghih.supabase.co/storage/v1/object/public
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8081
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## High-Level Architecture

### Backend Patterns
- **Layered Architecture**: Controller → Service → Repository → Database
- **Spring Security with JWT**: Stateless authentication using Bearer tokens
- **Role-Based Access Control**: `@PreAuthorize("hasRole('ADMIN')")` on endpoints
- **DTO Pattern**: Separate request/response models from entities
- **Flyway Migrations**: Version-controlled database schema (V1__, V2__)
- **S3-Compatible Storage**: File uploads via Supabase Storage (AWS SDK)

**Key Controllers**:
- `AuthController` - Registration, login (user/admin)
- `AdminEbookController` - Book CRUD, file upload (ADMIN only)
- `UserEbookController` - Cart operations, orders, library (authenticated)
- `LibraryController` - Public catalog access
- `SubscriptionController` - Subscription plans and activation

**Important Services**:
- `AuthService` - User registration, login, password hashing (BCrypt)
- `ProductService` - Book management, category operations
- `CartService` - Shopping cart logic
- `OrderService` - Checkout, order status management
- `BookStorageService` - S3 file uploads, public URL resolution
- `SubscriptionService` - Subscription validation, access control
- `PublicLibraryService` - Public catalog visibility management

### Frontend Patterns
- **Feature-Based Organization**: `src/features/` contains feature modules with components, logic, and types
- **Redux Toolkit**: Global state for `auth` (user, token, role) and `cart`
- **Service Layer**: All API calls isolated in `src/services/` (use Axios)
- **React Router**: Role-based routing (redirects admin vs user)
- **Supabase JS SDK**: Direct database access for book catalog (bypasses backend in some places)
- **TypeScript**: Strict typing for API contracts matching backend DTOs

**Key Feature Modules**:
- `admin/` - Admin dashboard, product management
- `auth/` - Login/register pages + Redux slice
- `catalog/` - Book browsing, search, details
- `cart/` - Shopping cart + checkout
- `library/` - Public and private libraries
- `user/` - User dashboard, profile

---

## Database Schema Highlights

**Core Tables**:
- `users` - User accounts with role (USER/ADMIN)
- `books_metadata` - Book/product information + digital file metadata
- `categories` - Hierarchical categories (parent-child)
- `carts`, `cart_items` - Shopping cart
- `orders`, `order_items` - Order history with price snapshots
- `user_library` - User's purchased/borrowed books
- `public_library` - Book visibility in public catalog
- `subscription` - Subscription plans + user subscriptions
- `payments` - Payment transaction records

All tables include `created_at`, `updated_at` timestamps. UUID primary keys.

---

## Testing

### Backend
```bash
# Run all tests (minimal test coverage currently)
mvn test

# Run with coverage report
mvn clean test jacoco:report
# Report: target/site/jacoco/index.html
```

### Frontend
```bash
# No test suite currently configured
# Consider adding Vitest or Jest if adding tests
```

---

## API Quick Reference

**Base URL**: `http://localhost:8081` (or `VITE_API_URL`)

**Authentication**: Include `Authorization: Bearer <jwt_token>` header for protected endpoints

**Key Endpoints**:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/admin/login` - Admin login
- `GET /user/cart` - Get cart
- `POST /user/cart/items` - Add to cart
- `POST /user/checkout` - Create order
- `GET /user/orders` - Order history
- `GET /api/library/public` - Public book catalog
- `GET /api/library/private` - Subscriber-only books
- `POST /admin/books` - Create book (ADMIN)
- `POST /admin/books/{id}/file` - Upload PDF (ADMIN)

Full API documentation available at: `http://localhost:8081/swagger-ui.html`

---

## Important Notes

### File Uploads (PDF/EPUB)
- Files uploaded via `/admin/books/{id}/file` go to Supabase S3 bucket
- Max file size: 50 MB
- Files stored with key pattern: `books/{productId}/files/{uuid}-{filename}`
- Public URLs generated automatically; stored in `BooksMetadata.fileKey` and `fileUrl`
- After upload, book automatically added to `public_library` for visibility

### Subscription Access Control
- Public library accessible without authentication
- Private library requires active subscription
- `SubscriptionService.validateSubscriptionAccess()` checks active status
- `access_type` in `user_library` tracks how book was acquired (purchased, borrowed, sample)

### JWT Tokens
- Expiration: 24 hours (configurable via `JWT_EXPIRATION_MS`)
- Token contains: `sub` (user ID), `email`, `role`
- Generated by `JwtTokenProvider`, validated by `JwtAuthenticationFilter`
- Backend accepts both USER and ADMIN roles for `/user/**` endpoints

### Supabase Integration
- Backend uses Supabase as PostgreSQL database
- Frontend uses Supabase JS SDK to query `books` table directly for catalog
- Backend also provides `/api/library/public` endpoint
- Frontend merges both sources (backend + Supabase) to ensure visibility

### Admin Bootstrap
- `AdminBootstrapRunner` creates default ADMIN user on startup if none exists
- Default admin credentials defined in `src/main/java/com/masukibooks/config/AdminBootstrapRunner.java`
- Admin can login via `/auth/admin/login` even if not present in `users` table (JWT role check)

---

## Troubleshooting

### Backend won't start
- Check database connection (Supabase project must be active)
- Verify environment variables in `.env`
- Ensure port 8081 is available
- Check Flyway migrations are applied (happens automatically)

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct (default: `http://localhost:8081`)
- Check backend is running
- Check CORS configuration in `SecurityConfig` allows your frontend origin

### File uploads failing
- Verify S3 credentials (S3_ACCESS_KEY, S3_SECRET_KEY)
- Check S3_PUBLIC_URL_PREFIX is set correctly
- Ensure Supabase bucket `books` exists and is public
- Check file size < 50 MB

### Admin can't access admin endpoints
- Verify admin login used correct endpoint `/auth/admin/login`
- Check JWT token has `role` claim = "ADMIN"
- Token must be included: `Authorization: Bearer <token>`

---

## Code Style Guidelines

- **Java**: Follow Spring Boot conventions; Lombok for boilerplate reduction
- **TypeScript**: Strict mode enabled; match backend DTO shapes exactly
- **React**: Functional components with hooks; feature-based organization
- **CSS**: Tailwind utilities preferred; component-specific styles in files
- **Naming**: camelCase for variables/methods; PascalCase for components/classes
- **Entities**: JPA annotations; UUID primary keys
- **Endpoints**: RESTful; plural nouns (`/admin/books`, `/user/cart`)

---

## Security Considerations

- **Never** commit `.env` files or hardcode secrets
- JWT secret must be strong (64+ chars) in production
- BCrypt handles password hashing (no plain text passwords)
- CORS restricted to configured FRONTEND_URL
- All admin endpoints require `hasRole('ADMIN')`
- File uploads validated for content type and size

---

## Migration Notes

### Moving from Supabase-Only to Backend-First
The project initially used Supabase directly for book catalog. Now backend provides unified API. Frontend merges both sources to maintain compatibility. Future work should consolidate to backend-only.

### Database Schema Versioning
Flyway migration files:
- `V1__books_metadata_and_required_entities.sql` - Initial schema
- `V2__fix_users_role_defaults.sql` - Role column fixes

---

## References

- **Full Documentation**: `PROJECT_DOCUMENTATION.md` (API specs, DB schema, feature details)
- **Backend README**: `Masuki-Books-Backend/README.md`
- **Frontend README**: `Masuki-Books-Frontend/README.md`
- **Supabase Setup**: `Masuki-Books-Frontend/supabase/books_setup.sql`

---

**Last Updated**: 2026-03-28
**Status**: Active Development (Core features complete; payment integration pending)
