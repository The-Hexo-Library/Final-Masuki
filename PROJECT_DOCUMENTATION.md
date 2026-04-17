# MasukiBooks - Complete Project Documentation

**Last Updated:** March 27, 2026

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Features Implemented](#4-features-implemented)
5. [API Documentation](#5-api-documentation)
6. [Database Design](#6-database-design)
7. [File Storage & PDF Handling](#7-file-storage--pdf-handling)
8. [Authentication System](#8-authentication-system)
9. [Development Timeline](#9-development-timeline)
10. [Challenges & Solutions](#10-challenges--solutions)
11. [Current Status](#11-current-status)
12. [Future Improvements](#12-future-improvements)
13. [Key Learnings](#13-key-learnings)

---

## 1. PROJECT OVERVIEW

### Purpose

**MasukiBooks** is a comprehensive e-commerce platform for an online bookstore designed to facilitate the digital and physical distribution of books. The application provides a seamless experience for customers to browse, purchase, and access books while giving administrators powerful tools to manage inventory, orders, and subscriptions.

### Problem Statement

The project addresses the need for:
- A modern, scalable e-commerce platform for book distribution
- Seamless integration of digital and physical book sales
- Role-based access control (User vs. Admin dashboards)
- Support for multiple content types (digital PDFs, physical books)
- Subscription-based access models for premium content
- Real-world payment gateway integration (Razorpay/Stripe ready)

### Application Type

- **Type:** Full-stack web application (SPA + REST API)
- **Architecture:** Monolithic backend with decoupled React frontend
- **Deployment:** Cloud-ready (Supabase/PostgreSQL, Render for backend, Netlify for frontend)
- **Industry:** E-commerce, Digital Publishing

---

## 2. TECHNOLOGY STACK

### Backend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Spring Boot | 3.3.5 | REST API framework with built-in features |
| **Language** | Java | 21 | Type-safe, performant backend language |
| **Database** | PostgreSQL | 14+ | Relational database via Supabase |
| **Database ORM** | Hibernate/JPA | 6.x | Object-relational mapping |
| **Security** | Spring Security | 6.x | Authentication & authorization |
| **Database Migrations** | Flyway | 9.x | Schema version control |
| **JWT** | JJWT | 0.12.5 | Token-based authentication |
| **Email** | Spring Mail | 3.3.5 | SMTP notifications |
| **Build Tool** | Maven | 3.8+ | Project build & dependency management |
| **API Docs** | SpringDoc OpenAPI | Latest | Swagger/OpenAPI documentation |
| **File Storage** | AWS S3 (Supabase S3) | - | Multi-part uploads & storage |

### Frontend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | React | 19.2.0 | Component-based UI library |
| **Language** | TypeScript | 5.8.3 | Type-safe JavaScript superset |
| **Build Tool** | Vite | 6.4.1 | Fast ES module bundler |
| **Styling** | Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| **State Management** | Redux Toolkit | 2.11.2 | Global state container |
| **Routing** | React Router | 7.13.1 | Client-side routing |
| **HTTP Client** | Axios | 1.13.6 | Promise-based HTTP client |
| **Database (Frontend)** | Supabase JS SDK | 2.98.0 | PostgreSQL + Auth + Storage |
| **Animation** | Framer Motion | 12.35.0 | React animation library |
| **Components** | Lucide React | 0.577.0 | Lightweight icon library |
| **Type Animation** | react-type-animation | 3.2.0 | Typing effect component |

### Infrastructure & Services

| Service | Provider | Purpose |
|---------|----------|---------|
| **Database** | Supabase (PostgreSQL) | Production data storage |
| **Authentication** | JWT (Self-hosted) + Supabase Auth Ready | User identity & session management |
| **File Storage** | Supabase Storage (S3-compatible) | PDF files & digital content |
| **Backend Hosting** | Render.com | API deployment (Linux container) |
| **Frontend Hosting** | Netlify | Static site hosting with SPA routing |
| **Payment** | Razorpay API (Integrated) | Payment processing gateway |

---

## 3. PROJECT STRUCTURE

### Backend Directory Structure

```
Masuki-Books-Backend/
├── pom.xml                                      # Maven configuration
├── mvnw, mvnw.cmd                              # Maven wrapper
├── README.md                                     # Setup documentation
├── src/
│   ├── main/
│   │   ├── java/com/masukibooks/
│   │   │   ├── config/                          # Spring Configuration
│   │   │   │   ├── SecurityConfig.java          # Spring Security & JWT setup
│   │   │   │   └── CorsConfig.java
│   │   │   ├── controller/                      # REST API Endpoints
│   │   │   │   ├── AuthController.java          # Login/Register
│   │   │   │   ├── AdminEbookController.java    # Admin management
│   │   │   │   ├── UserEbookController.java     # User shopping
│   │   │   │   ├── LibraryController.java       # Public library
│   │   │   │   └── SubscriptionController.java  # Subscription plans
│   │   │   ├── service/                         # Business Logic
│   │   │   │   ├── AuthService.java             # Registration & login
│   │   │   │   ├── ProductService.java          # Book CRUD
│   │   │   │   ├── CartService.java             # Shopping cart
│   │   │   │   ├── OrderService.java            # Orders & checkout
│   │   │   │   ├── BookStorageService.java      # S3 uploads
│   │   │   │   ├── PublicLibraryService.java    # Public catalog
│   │   │   │   └── SubscriptionService.java     # Subscription logic
│   │   │   ├── entity/                          # JPA Entities
│   │   │   │   ├── User.java                    # User account
│   │   │   │   ├── BooksMetadata.java           # Book records
│   │   │   │   ├── Category.java                # Book categories
│   │   │   │   ├── Cart.java
│   │   │   │   ├── CartItem.java
│   │   │   │   ├── Order.java
│   │   │   │   ├── OrderItem.java
│   │   │   │   ├── Payment.java
│   │   │   │   ├── UserLibrary.java             # User-purchased books
│   │   │   │   ├── Subscription.java            # Subscription plans
│   │   │   │   └── PublicLibrary.java           # Public catalog mapping
│   │   │   ├── repository/                      # Data Access Layer
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── BooksMetadataRepository.java
│   │   │   │   ├── CartRepository.java
│   │   │   │   ├── OrderRepository.java
│   │   │   │   ├── SubscriptionRepository.java
│   │   │   │   └── PublicLibraryRepository.java
│   │   │   ├── dto/                             # Data Transfer Objects
│   │   │   │   ├── request/                     # Input models
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   └── ProductRequest.java
│   │   │   │   └── response/                    # Output models
│   │   │   │       ├── AuthResponse.java
│   │   │   │       ├── ProductResponse.java
│   │   │   │       └── OrderResponse.java
│   │   │   ├── security/                        # Auth & security
│   │   │   │   ├── JwtTokenProvider.java        # JWT generation
│   │   │   │   ├── JwtAuthenticationFilter.java # JWT validation filter
│   │   │   │   └── RbacMiddleware.java
│   │   │   ├── exception/                       # Custom exceptions
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   └── BusinessException.java
│   │   │   └── MasukibooksBackendApplication.java
│   │   └── resources/
│   │       ├── application.yml                  # Main configuration
│   │       ├── application-dev.yml              # Dev profile
│   │       ├── application-prod.yml             # Production profile
│   │       └── db/migration/                    # Flyway migrations
│   │           ├── V1__books_metadata_and_required_entities.sql
│   │           └── V2__fix_users_role_defaults.sql
│   └── test/
│       └── java/com/masukibooks/                # Unit & integration tests
├── target/                                       # Maven build output
```

### Frontend Directory Structure

```
Masuki-Books-Frontend/
├── package.json                                 # npm dependencies
├── tsconfig.json                                # TypeScript config
├── vite.config.ts                               # Vite bundler config
├── tailwind.config.js                           # Tailwind CSS config
├── eslint.config.js                             # Code linting
├── .env                                         # Local environment
├── .env.example                                 # Template
├── netlify.toml                                 # Netlify deployment
├── public/
│   └── _redirects                               # SPA routing
├── index.html                                   # Entry HTML
├── src/
│   ├── main.tsx                                 # React entry point
│   ├── App.tsx                                  # Root component
│   ├── app/
│   │   └── store.ts                             # Redux store
│   ├── assets/                                  # Static images
│   ├── components/
│   │   ├── animations/                          # Reusable animations
│   │   ├── auth/                                # Login/Register forms
│   │   ├── books/                               # Book display components
│   │   ├── dashboard/                           # Dashboard widgets
│   │   ├── home/                                # Landing page
│   │   ├── layout/                              # Navigation & layout
│   │   ├── library/                             # Library views
│   │   ├── subscription/                        # Subscription UI
│   │   ├── ui/                                  # Low-level UI components
│   │   └── wallet/                              # Payment components
│   ├── features/                                # Feature-specific logic
│   │   ├── admin/                               # Admin dashboard
│   │   │   ├── AdminDashboardPage.tsx
│   │   │   └── products/
│   │   │       ├── useProductsAdmin.ts          # Admin book management
│   │   │       ├── types.ts
│   │   │       └── components/
│   │   ├── auth/                                # Auth features
│   │   │   ├── authSlice.ts                     # Redux auth state
│   │   │   └── pages
│   │   ├── catalog/                             # Book browsing
│   │   │   ├── CatalogPage.tsx
│   │   │   └── BookDetailPage.tsx
│   │   ├── cart/                                # Shopping cart
│   │   │   ├── CartPage.tsx
│   │   │   ├── cartSlice.ts                     # Redux cart state
│   │   │   └── CheckoutPage.tsx
│   │   ├── library/                             # User library
│   │   │   ├── PublicLibraryPage.tsx
│   │   │   └── PrivateLibraryPage.tsx
│   │   ├── orders/                              # Order management
│   │   └── user/                                # User dashboard
│   ├── routes/
│   │   └── AppRoutes.tsx                        # Route configuration
│   ├── services/                                # API & data layer
│   │   ├── api.ts                               # Axios instance
│   │   ├── authService.ts                       # Auth API calls
│   │   ├── booksService.ts                      # Book operations
│   │   ├── cartService.ts                       # Cart operations
│   │   ├── categoryService.ts
│   │   ├── orderService.ts
│   │   ├── subscriptionService.ts
│   │   ├── supabase.ts                          # Supabase client
│   │   └── [other services]
│   ├── types/                                   # TypeScript interfaces
│   │   ├── book.ts                              # Book & cart types
│   │   ├── auth.ts                              # User & auth types
│   │   └── subscription.ts
│   ├── index.css                                # Global styles
│   └── vite-env.d.ts                            # Vite type definitions
├── supabase/
│   └── books_setup.sql                          # Supabase schema setup
└── dist/                                         # Build output
```

### Key Directory Responsibilities

| Directory | Responsibility |
|-----------|-----------------|
| `controller/` | Define REST API endpoints and route requests |
| `service/` | Business logic, validations, and data transformations |
| `entity/` | JPA entities representing database tables |
| `repository/` | Database queries and persistence layer |
| `dto/` | Request/Response models for API contracts |
| `security/` | JWT generation, validation, security filters |
| `config/` | Spring Bean configurations and security setup |
| `db/migration/` | Flyway SQL scripts for schema versioning |

---

## 4. FEATURES IMPLEMENTED

### 4.1 User Authentication & Authorization

✅ **User Registration**
- Email-based registration with password hashing (BCrypt)
- Email & phone number uniqueness validation
- PII consent tracking
- Two roles: USER and ADMIN

✅ **User Login**
- JWT token generation on successful authentication
- Token expiration: 24 hours (configurable)
- Separate admin login endpoint with role validation
- Email/phone identifier support

✅ **Role-Based Access Control (RBAC)**
- @PreAuthorize("hasRole('USER')") for user endpoints
- @PreAuthorize("hasRole('ADMIN')") for admin endpoints
- JwtAuthenticationFilter validates tokens on each request
- Automatic role-based routing in frontend

### 4.2 Product Management (Admin)

✅ **Book Metadata Management**
- Create/Read/Update/Delete books
- Support for multiple formats: paperback, hardcover, ebook, audiobook
- Multi-language support (default: English)
- Pricing: base price and "compare at" price for discounts
- Metadata fields: ISBN, SKU, author, publisher, publication date

✅ **Digital Content Support**
- PDF/EPUB file uploads to S3 bucket
- File size tracking (max 50 MB configurable)
- Content type classification: physical, digital, or both
- Downloadable flag with max downloads limit

✅ **Category Management**
- Hierarchical categories (parent-child relationships)
- Slug-based SEO URLs
- Display ordering for UI presentation
- Active/inactive status for controlling visibility

✅ **Image Management (Schema Ready)**
- Infrastructure in place though currently minimal usage
- Image URL storage aligned with design patterns

### 4.3 Shopping Cart & Checkout

✅ **Shopping Cart**
- Per-user persistent cart
- Add/Update/Remove items
- Real-time price calculations
- Guest carts supported (identified by token)

✅ **Checkout Flow**
- Multi-step order processing
- Items snapshot (product title, quantity, unit price)
- Total calculation with discount support
- Order number generation (unique per order)

✅ **Order Management**
- Order status tracking: pending, confirmed, packed, shipped, delivered, cancelled, refunded
- Order items with historical pricing
- User order history retrieval
- Admin order review and status updates

### 4.4 Payment Integration (Ready)

✅ **Payment Processing Setup**
- Razorpay API integration points defined
- Payment status tracking: pending, success, failed, refunded
- Support multiple payment methods: card, UPI, net banking, wallet
- Payment gateway abstraction (Razorpay/Stripe ready)

### 4.5 Subscription System

✅ **Subscription Plans**
- Admin-defined subscription plans
- Configurable duration (days)
- Plan pricing and descriptions
- Plan listing (public and authenticated)

✅ **User Subscriptions**
- Activate/manage subscriptions
- Auto-renewal support
- Subscription expiration tracking
- Active status verification for premium features

✅ **Access Control**
- Private library restricted to active subscribers
- Access limit verification before adding books
- Subscription status response with plan details

### 4.6 User Library

✅ **Personal Library Management**
- Add books to library (for subscribed users)
- Remove books from library
- Access type tracking: purchased, borrowed, sample
- Expiration support for borrowed content

✅ **Public Library (Catalog)**
- Admin-managed public book catalog
- Featured books support
- Visibility control (public/private)
- Featured books customization

### 4.7 File Storage & PDF Handling

✅ **S3-Compatible Storage (Supabase)**
- Multi-part file uploads to S3 bucket
- Public URL generation for direct viewing/downloads
- Object key organization: `books/{productId}/files/{uuid}-{filename}`
- Meta adata storage to S3: `books/{productId}/metadata.json`

✅ **PDF Management**
- PDF files uploaded during book creation
- File size validation (max 52 MB)
- Public URL resolution for viewing
- Downloadable setup (HTTP range requests supported)

### 4.8 Search & Filtering (Schema Ready)

✅ **Product Search**
- Keyword-based search on titles and authors
- Category filtering
- Language filtering
- Price range filtering
- Status filtering (active, inactive, draft)
- Pagination support

✅ **Catalog Browsing**
- Public library display
- Category navigation
- Sorting options: price (asc/desc), date (asc/desc)
- Featured books highlighting

### 4.9 Admin Dashboard

✅ **Admin Features**
- User management (list all users)
- Book management (CRUD operations)
- Category management
- Order management (view, status updates)
- Subscription plan management
- Public library management

### 4.10 NotImplemented/Partial Features

⚠️ **Address Management**
- Schema prepared but not yet integrated into checkout
- One-to-many relationship with User defined
- Shipping address snapshot in Order entity

⚠️ **Reviews & Ratings**
- Entity structure prepared
- Service layer not yet implemented
- Data collection ready for future integration

⚠️ **Inventory Logging**
- Schema prepared for stock tracking
- Admin interfaces defined but not fully connected

---

## 5. API DOCUMENTATION

### 5.1 Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 200 OK
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "token": "jwt-token",
    "role": "USER"
  }
}
```

#### User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "token": "jwt-token",
    "role": "USER"
  }
}
```

#### Admin Login
```http
POST /auth/admin/login
Content-Type: application/json

{
  "email": "admin@masukibooks.com",
  "password": "Admin@2024!"
}

Response: 200 OK
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "userId": "uuid",
    "email": "admin@masukibooks.com",
    "token": "jwt-token",
    "role": "ADMIN"
  }
}
```

---

### 5.2 Admin Book Management Endpoints

#### Create Book
```http
POST /admin/books
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "The Art of Programming",
  "author": "Robert Martin",
  "categoryId": "category-uuid",
  "isbn": "978-0-13-468599-1",
  "sku": "BOOK-001",
  "price": 49.99,
  "compareAtPrice": 69.99,
  "language": "en",
  "format": "hardcover",
  "pages": 432,
  "publisher": "Prentice Hall",
  "description": "A guide to writing clean code",
  "status": "active",
  "contentType": "physical"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "productId": "uuid",
    "title": "The Art of Programming",
    "status": "active",
    "createdAt": "2026-03-27T10:00:00Z"
  }
}
```

#### List Books (Admin)
```http
GET /admin/books?status=active&page=0&size=50
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "content": [
      { "productId": "...", "title": "...", ... }
    ],
    "totalElements": 150,
    "totalPages": 3,
    "currentPage": 0
  }
}
```

#### Upload Book File
```http
POST /admin/books/{bookId}/file
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: <binary PDF file>

Response: 200 OK
{
  "success": true,
  "data": {
    "productId": "bookId",
    "fileKey": "books/uuid/files/uuid-filename.pdf",
    "fileUrl": "https://.../books/uuid/files/...",
    "fileFormat": "pdf",
    "fileSizeBytes": 2048576,
    "contentType": "digital"
  }
}
```

#### Update Book
```http
PUT /admin/books/{bookId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 39.99,
  "status": "active"
}

Response: 200 OK
```

#### Delete Book
```http
DELETE /admin/books/{bookId}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Book metadata deleted"
}
```

---

### 5.3 User Shopping Endpoints

#### Get User Cart
```http
GET /user/cart
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "cartId": "uuid",
    "items": [
      {
        "cartItemId": "uuid",
        "productId": "uuid",
        "productTitle": "Book Title",
        "quantity": 2,
        "unitPrice": 49.99,
        "lineTotal": 99.98
      }
    ],
    "total": 99.98
  }
}
```

#### Add Item to Cart
```http
POST /user/cart/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "book-uuid",
  "quantity": 1
}

Response: 200 OK
{
  "success": true,
  "message": "Item added to cart",
  "data": { ... cart updated ... }
}
```

#### Update Cart Item
```http
PUT /user/cart/items/{cartItemId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}

Response: 200 OK
```

#### Remove Item from Cart
```http
DELETE /user/cart/items/{cartItemId}
Authorization: Bearer {token}

Response: 200 OK
```

---

### 5.4 Checkout & Orders

#### Checkout (Initiate Payment)
```http
POST /user/checkout
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentMethod": "card",
  "gateway": "razorpay",
  "shippingName": "John Doe",
  "shippingAddress": "123 Main St",
  "shippingCity": "New York",
  "shippingZip": "10001",
  "shippingCountry": "US",
  "shippingPhone": "+1-555-1234"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "ORD-20260327-0001",
    "razorpayOrderId": "razorpay-order-id",
    "totalAmount": 99.98,
    "currency": "INR"
  }
}
```

#### Get User Orders
```http
GET /user/orders?page=0&size=20
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "content": [
      {
        "orderId": "uuid",
        "orderNumber": "ORD-...",
        "status": "delivered",
        "totalAmount": 99.98,
        "items": [ ... ],
        "createdAt": "2026-03-20T..."
      }
    ],
    "totalElements": 5
  }
}
```

---

### 5.5 Library & Public Catalog

#### Get Public Library (Catalog)
```http
GET /api/library/public
(No auth required)

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "productId": "uuid",
      "title": "Book Title",
      "author": "Author Name",
      "fileUrl": "https://.../file.pdf",
      "visibility": "public",
      "isFeatured": true
    }
  ]
}
```

#### Get Private Library (Subscribed Users)
```http
GET /api/library/private?page=0&size=20
Authorization: Bearer {token}

Response: 200 OK (if subscribed)
{
  "success": true,
  "data": {
    "content": [
      {
        "userLibraryId": "uuid",
        "productId": "uuid",
        "productTitle": "...",
        "accessType": "purchased",
        "acquiredAt": "...",
        "expiresAt": null
      }
    ]
  }
}

Response: 403 Forbidden (if not subscribed)
{
  "success": false,
  "message": "Subscribe to access your private library"
}
```

#### Add Book to User Library
```http
POST /user/library/{bookId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "accessType": "purchased"
}

Response: 200 OK
```

---

### 5.6 Subscription Endpoints

#### List Subscription Plans
```http
GET /api/subscriptions/plans
(No auth required)

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "subscriptionId": "uuid",
      "planName": "Premium",
      "price": 9.99,
      "durationDays": 30,
      "description": "Full access to all books"
    }
  ]
}
```

#### Activate Subscription
```http
POST /user/subscriptions/activate
Authorization: Bearer {token}
Content-Type: application/json

{
  "subscriptionPlanId": "plan-uuid"
}

Response: 200 OK
{
  "success": true,
  "message": "Subscription activated"
}
```

#### Get My Subscription Status
```http
GET /api/subscriptions/my
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "active": true,
    "planName": "Premium",
    "expiresAt": "2026-04-27T...",
    "accessPercentage": 75,
    "usedBooks": 15,
    "allowedBooks": 20
  }
}
```

---

### 5.7 Categories & Browsing

#### Get Categories
```http
GET /user/categories
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "categoryId": "uuid",
      "name": "Fiction",
      "slug": "fiction",
      "url": "/fiction",
      "description": "Fiction books",
      "displayOrder": 1,
      "isActive": true
    }
  ]
}
```

---

### 5.8 Authentication in Requests

All protected endpoints require the JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Structure:**
- Subject (sub): User ID (UUID)
- Claims:
  - email: User email
  - role: USER or ADMIN
- Expiration: 24 hours

---

## 6. DATABASE DESIGN

### 6.1 Core Entities & Relationships

#### Users Table
```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profession VARCHAR(100),
  preferred_language VARCHAR(10) DEFAULT 'en',
  role VARCHAR(20) DEFAULT 'USER',  -- USER, ADMIN
  status VARCHAR(20) DEFAULT 'active',  -- active, inactive, banned
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  pii_consent BOOLEAN DEFAULT FALSE,
  pii_consent_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

**Relationships:**
- User → UserLibrary (1:Many)
- User → Cart (1:1 or 1:Many)
- User → Order (1:Many)
- User → Subscription (1:Many)
- User → Address (1:Many) - *Not yet integrated*

---

#### BooksMetadata Table (Books)
```sql
CREATE TABLE books_metadata (
  product_id UUID PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(category_id),
  sku VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  author VARCHAR(255) NOT NULL,
  publisher VARCHAR(255),
  isbn VARCHAR(20) UNIQUE,
  description TEXT,
  language VARCHAR(10) DEFAULT 'en',
  format VARCHAR(20),  -- paperback, hardcover, ebook, audiobook
  pages INTEGER,
  publication_date DATE,
  price NUMERIC(10,2) NOT NULL,
  compare_at_price NUMERIC(10,2),
  status VARCHAR(20) DEFAULT 'active',
  
  -- Digital content fields
  content_type VARCHAR(20) DEFAULT 'physical',  -- physical, digital, both
  file_key VARCHAR(500),  -- S3 object key
  file_format VARCHAR(20),  -- pdf, epub
  file_size_bytes BIGINT,
  total_pages INTEGER,
  preview_pages INTEGER DEFAULT 10,
  downloadable BOOLEAN DEFAULT FALSE,
  max_downloads INTEGER DEFAULT 3,
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  
  INDEX idx_books_metadata_category (category_id)
);
```

**Relationships:**
- BooksMetadata → Category (Many:1)
- BooksMetadata → CartItem (1:Many)
- BooksMetadata → OrderItem (1:Many)
- BooksMetadata → UserLibrary (1:Many)
- BooksMetadata → PublicLibrary (1:1)

---

#### Categories Table
```sql
CREATE TABLE categories (
  category_id UUID PRIMARY KEY,
  parent_category_id UUID REFERENCES categories(category_id),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  collections TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

**Relationships:**
- Category → Category (Self-referencing Many:1 - parent/child)
- Category → BooksMetadata (1:Many)

---

#### Cart & CartItem Tables
```sql
CREATE TABLE carts (
  cart_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(user_id),
  guest_token VARCHAR(255) UNIQUE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  
  INDEX idx_carts_user (user_id)
);

CREATE TABLE cart_items (
  cart_item_id UUID PRIMARY KEY,
  cart_id UUID NOT NULL REFERENCES carts(cart_id),
  product_id UUID NOT NULL REFERENCES books_metadata(product_id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  
  UNIQUE(cart_id, product_id),
  INDEX idx_cart_items_cart (cart_id)
);
```

---

#### Orders & OrderItems Tables
```sql
CREATE TABLE orders (
  order_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(user_id),
  guest_email VARCHAR(255),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  order_type VARCHAR(20) DEFAULT 'physical',
  subtotal NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2),
  total_amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  notes TEXT,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  
  INDEX idx_orders_user (user_id)
);

CREATE TABLE order_items (
  order_item_id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(order_id),
  product_id UUID REFERENCES books_metadata(product_id),
  product_title VARCHAR(500) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  
  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_product (product_id)
);
```

---

#### Payments Table
```sql
CREATE TABLE payments (
  payment_id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(order_id),
  payment_method VARCHAR(20),
  gateway VARCHAR(100) NOT NULL,
  gateway_payment_id VARCHAR(255),
  gateway_transaction_id VARCHAR(255),
  amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10),
  status VARCHAR(20),  -- pending, success, failed, refunded
  failure_reason TEXT,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  
  INDEX idx_payments_order (order_id)
);
```

---

#### UserLibrary Table
```sql
CREATE TABLE user_library (
  user_library_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(user_id),
  product_id UUID NOT NULL REFERENCES books_metadata(product_id),
  access_type VARCHAR(20) NOT NULL,  -- purchased, borrowed, sample
  acquired_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP,
  order_id UUID REFERENCES orders(order_id),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  
  UNIQUE(user_id, product_id),
  INDEX idx_user_library_user (user_id)
);
```

**Business Logic:**
- When user purchases a book, UserLibrary entry created with `access_type='purchased'`
- When subscription expires, status can be revoked for borrowed books
- Used for access control: only active entries grant access

---

#### Subscription Table
```sql
CREATE TABLE subscription (
  subscription_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(user_id),
  plan_name VARCHAR(120) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  duration_days INTEGER NOT NULL,
  is_plan BOOLEAN DEFAULT TRUE,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  started_at TIMESTAMP,
  expires_at TIMESTAMP,
  auto_renew BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

**Types:**
- When `is_plan=TRUE`: Represents a subscription plan (template)
- When `is_plan=FALSE`: Represents user subscription (instance)
- Status: ACTIVE, EXPIRED, CANCELLED

---

#### PublicLibrary Table
```sql
CREATE TABLE public_library (
  public_library_id UUID PRIMARY KEY,
  product_id UUID NOT NULL UNIQUE REFERENCES books_metadata(product_id),
  is_featured BOOLEAN DEFAULT FALSE,
  visibility VARCHAR(20) DEFAULT 'public',
  notes TEXT,
  editable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

**Purpose:**
- Bridges BooksMetadata with visibility settings
- Admin controls which books appear in public catalog
- Featured flag for homepage highlighting

---

### 6.2 Schema Versioning (Flyway)

**V1__books_metadata_and_required_entities.sql**
- Renames `products` to `books_metadata` for schema clarity
- Adds `role` column to users
- Creates subscription, public_library tables
- Establishes relationships and constraints

**V2__fix_users_role_defaults.sql**
- Ensures `users.role` has proper defaults and non-null constraint
- Backfills existing records with 'USER' role
- Maintains data consistency

---

### 6.3 Key Design Patterns

**Soft Deletes Not Used**
- Books: `status` field (active, inactive, draft) controls visibility
- Users: `status` field (active, inactive, banned) controls account state
- Physical deletion preferred for GDPR compliance

**Temporal Data**
- All tables have `created_at` and `updated_at`
- Updated with Hibernate @CreationTimestamp and @UpdateTimestamp
- Used for audit trails and sorting

**UUID Primary Keys**
- PostgreSQL `gen_random_uuid()` for all PKs
- Improves security (non-sequential), supports distributed systems
- Type-safe in Java (java.util.UUID)

**Indexing Strategy**
- Foreign key columns indexed for join performance
- Categories: indexed on parent for hierarchy navigation
- Carts: indexed on user_id for lookup by user
- Orders: indexed on user_id for user order history

---

## 7. FILE STORAGE & PDF HANDLING

### 7.1 Storage Architecture

**Primary Storage:** Supabase Storage (S3-compatible)
- **Endpoint:** `https://bbrxdsaojiqdgrdyghih.storage.supabase.co/storage/v1/s3`
- **Region:** ap-northeast-2 (Seoul)
- **Bucket:** `books` (public for anonymous reads)
- **Max File Size:** 50 MB

### 7.2 Upload Flow (Backend)

```
1. Admin uploads PDF via /admin/books/{bookId}/file
   ↓
2. File received as MultipartFile
   ↓
3. BookStorageService.uploadBookFile(productId, file)
   ↓
4. Generate S3 object key: books/{productId}/files/{uuid}-{filename}
   ↓
5. Upload to S3 with PutObjectRequest
   ↓
6. Store fileKey in BooksMetadata.fileKey
   ↓
7. Set BooksMetadata.contentType = "digital"
   ↓
8. Auto-create PublicLibrary entry for visibility
   ↓
9. Resolve public URL: ${S3_PUBLIC_URL_PREFIX}/{fileKey}
   ↓
10. Return ProductResponse with fileUrl
```

### 7.3 Public URL Resolution

**Backend Method:**
```java
public String resolvePublicUrl(String objectKey) {
  if (isBlank(objectKey) || isBlank(publicUrlPrefix)) {
    return null;
  }
  String cleanPrefix = publicUrlPrefix.endsWith("/")
    ? publicUrlPrefix.substring(0, publicUrlPrefix.length() - 1)
    : publicUrlPrefix;
  String cleanKey = objectKey.startsWith("/") ? objectKey.substring(1) : objectKey;
  return cleanPrefix + "/" + cleanKey;
}
```

**Result:** `https://bbrxdsaojiqdgrdyghih.supabase.co/storage/v1/object/public/books/books/{productId}/files/{uuid}-{file}.pdf`

### 7.4 Frontend Download/View Flow

```
1. Book detail page loads ProductResponse with fileUrl
   ↓
2. If fileUrl present, display "View PDF" and "Download PDF" buttons
   ↓
3. Click → Axios redirects to S3 via fileUrl
   ↓
4. Browser displays PDF inline (target="_blank" rel="noreferrer")
   ↓
5. Download attribute allows direct file save
```

### 7.5 Metadata Storage (Future Use)

Backend also stores book metadata as JSON in S3:
```
Key: books/{productId}/metadata.json
Content: {
  productId, sku, title, author, publisher, isbn,
  description, language, format, pages, publicationDate,
  price, compareAtPrice, status, contentType, createdAt, updatedAt
}
```

**Purpose:** Archive and bulk export capability for data warehousing.

### 7.6 Configuration Settings

```yaml
storage:
  s3:
    endpoint: ${S3_ENDPOINT}             # Supabase S3 endpoint
    region: ${S3_REGION}                 # ap-northeast-2
    access-key: ${S3_ACCESS_KEY}         # Supabase API key
    secret-key: ${S3_SECRET_KEY}         # Supabase service role key
    bucket: ${S3_BUCKET:books}           # Bucket name
    max-file-size: ${S3_MAX_FILE_SIZE:52428800}  # 50 MB
    public-url-prefix: ${S3_PUBLIC_URL_PREFIX}   # Public base URL
```

### 7.7 Frontend Supabase Storage Setup

**File:** `supabase/books_setup.sql`

```sql
-- Create public.books table for Supabase direct uploads
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Storage bucket (public for direct PDF access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('books', 'books', true);

-- RLS: Anyone can read
CREATE POLICY books_select_public ON books
  FOR SELECT USING (true);

-- RLS: Authenticated can insert
CREATE POLICY books_insert_authenticated ON books
  FOR INSERT TO authenticated WITH CHECK (true);
```

---

## 8. AUTHENTICATION SYSTEM

### 8.1 JWT Token Generation & Validation

**Component:** `JwtTokenProvider`

**Token Generation:**
```java
public String generateToken(UUID userId, String email, String role) {
  return Jwts.builder()
    .subject(userId.toString())           // Subject: User ID
    .claim("email", email)                // Claim: Email
    .claim("role", role)                  // Claim: Role (USER/ADMIN)
    .issuedAt(new Date())                 // Issued at (now)
    .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
    .signWith(getSigningKey())            // Sign with HS256
    .compact();                            // Build token
}
```

**Token Structure:**
```
Header: { alg: "HS256", typ: "JWT" }
Payload: {
  "sub": "uuid",
  "email": "user@example.com",
  "role": "USER",
  "iat": 1711533600,
  "exp": 1711620000
}
Signature: HMACSHA256(header.payload, secret)
```

**Expiration:**
- Access Token: 24 hours (86400000 ms)
- Refresh Token: 7 days (604800000 ms) - *Infrastructure ready*

**Validation:**
```java
public boolean validateToken(String token) {
  try {
    Jwts.parser()
      .verifyWith(getSigningKey())         // Verify signature
      .build()
      .parseSignedClaims(token);           // Parse & validate
    return true;
  } catch (JwtException | IllegalArgumentException e) {
    return false;
  }
}
```

---

### 8.2 Authentication Filter

**Component:** `JwtAuthenticationFilter extends OncePerRequestFilter`

**Flow:**
```
1. Request arrives
   ↓
2. Extract token from "Authorization: Bearer {token}" header
   ↓
3. Validate token signature and expiration
   ↓
4. Parse userId and role from token
   ↓
5. Lookup User from database
   ↓
6. Create Spring Security Authentication object
   ↓
7. Set in SecurityContextHolder
   ↓
8. Pass to next filter
```

**Admin Token Handling (Special Case):**
- If role is ADMIN but user not in database
- Create synthetic User object with ADMIN role
- Allows admins not yet added to users table

---

### 8.3 Security Configuration

**Component:** `SecurityConfig`

**Key Settings:**
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // Enable @PreAuthorize annotations
public class SecurityConfig {

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();  // Hash passwords with bcrypt
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())       // Disable CSRF (stateless API)
      .cors(cors -> cors...)              // Enable CORS
      .sessionManagement(session -> 
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/auth/**").permitAll()               // Public
        .requestMatchers("/api/library/public").permitAll()    // Public catalog
        .requestMatchers("/admin/**").hasRole("ADMIN")         // Admin only
        .requestMatchers("/user/**").hasAnyRole("USER","ADMIN")// Authenticated
        .anyRequest().authenticated())                         // Default deny
      .addFilterBefore(jwtAuthenticationFilter, 
        UsernamePasswordAuthenticationFilter.class)
  }
}
```

**CORS Configuration:**
- Allowed Origins: Frontend URL (configurable)
- Allowed Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Allowed Headers: Content-Type, Authorization
- Max Age: 3600 seconds (1 hour)

---

### 8.4 Registration & Login Process

**Registration:**
```
1. POST /auth/register with email, password, firstName, lastName
   ↓
2. AuthService.register(request)
   ↓
3. Validate request (email format, password strength)
   ↓
4. Check email uniqueness
   ↓
5. Hash password with BCryptPasswordEncoder
   ↓
6. Create and save User entity
   ↓
7. Generate JWT token
   ↓
8. Return AuthResponse with user details and token
```

**Login:**
```
1. POST /auth/login with email, password
   ↓
2. AuthService.login(request)
   ↓
3. Find user by email
   ↓
4. Compare provided password against stored hash (BCrypt)
   ↓
5. If match, generate JWT token
   ↓
6. Return AuthResponse with token
```

**Admin Login:**
```
Similar to login but with role verification:
- Lookup user by email
- Verify role is ADMIN
- If not admin, throw UnauthorizedException
- Otherwise, generate token with ADMIN role
```

---

### 8.5 Request Authentication Flow

```
1. Client stores JWT token from login response
2. Include in all authenticated requests:
   Authorization: Bearer {token}
3. Spring Security chain intercepts request
4. JwtAuthenticationFilter extracts token
5. Validates token (signature, expiration)
6. Creates UsernamePasswordAuthenticationToken
7. Sets in SecurityContextHolder
8. @PreAuthorize checks authority (hasRole, hasAnyRole)
9. If authorized, method executes
10. If unauthorized, returns 403 Forbidden
```

---

### 8.6 Authorization & Role-Based Access

**Method-Level Authorization:**
```java
@GetMapping("/users")
@PreAuthorize("hasRole('ADMIN')")  // Only ADMIN role
public ResponseEntity<Page<User>> getUsers(...) { ... }

@PostMapping("/cart/items")
@PreAuthorize("hasAnyRole('USER','ADMIN')")  // USER or ADMIN
public ResponseEntity<...> addCartItem(...) { ... }

@GetMapping("/admin/books")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<...> listBooks(...) { ... }
```

**Available Authorities:**
- ROLE_USER
- ROLE_ADMIN

---

## 9. DEVELOPMENT TIMELINE

### Project Overview
- **Status:** Active development with core features implemented
- **Git Repository:** Not version controlled (standalone directories)
- **Development Approach:** Feature-driven, backend-first then frontend integration

### Key Development Phases (Inferred)

#### Phase 1: Foundation (Base Setup)
- Spring Boot project initialization with Java 21
- PostgreSQL/Supabase database setup
- Maven dependency configuration
- User entity and authentication scaffold
- JWT token provider implementation

#### Phase 2: User Management & Auth (Early)
- User registration endpoint
- User login endpoint
- Admin login with role differentiation
- BCrypt password hashing
- Spring Security configuration
- CORS configuration for frontend

#### Phase 3: Product Management (Core)
- BooksMetadata entity creation
- Category management (CRUD)
- Product/Book CRUD operations
- Category hierarchies (parent-child relationships)
- Metadata service layer

#### Phase 4: Shopping Cart & Orders (Mid)
- Cart and CartItem entities
- Add/Update/Remove cart operations
- Order entity with status tracking
- OrderItem entity for order line items
- Checkout flow implementation
- Payment entity scaffold (Razorpay/Stripe ready)

#### Phase 5: File Storage Integration (Recent)
- S3/Supabase storage configuration
- BookStorageService for upload handling
- Multi-part file upload support
- Public URL resolution for PDFs
- Metadata JSON storage to S3
- Auto-publish to public library on file upload

#### Phase 6: Subscription System (Recent)
- Subscription plan management
- User subscription entities
- Access control based on active subscriptions
- User library with access types (purchased, borrowed, sample)
- Private library access restriction

#### Phase 7: Admin Dashboard (In Progress)
- Admin product management UI
- Book creation/editing with PDF upload
- Category management interface
- Order management interface
- Public library visibility controls

#### Phase 8: Frontend UI (In Progress)
- React + Redux setup with TypeScript
- User authentication UI (login/register)
- Home page with book catalog
- Admin dashboard for book management
- Shopping cart UI
- Checkout flow UI
- User library and subscription display

---

## 10. CHALLENGES & SOLUTIONS

### Challenge 1: S3 File Upload Configuration
**Problem:** Initially, uploaded files were not persisting in S3 bucket or becoming visible.

**Root Cause:**
- Missing S3_ACCESS_KEY, S3_SECRET_KEY environment variables
- Incorrect S3 endpoint configuration
- Public URL prefix not configured properly
- Files uploaded but not automatically published

**Solution:**
- Added validations in BookStorageService to check all required S3 configs
- Implemented URL resolution method to generate public-facing URLs from S3 keys
- Added auto-publish logic: when file uploaded, automatically create PublicLibrary entry
- Updated ProductResponse and PublicLibraryResponse DTOs to include fileUrl
- Merged Supabase and backend book sources in frontend to prevent visibility loss
- Frontend now displays "View PDF" and "Download PDF" buttons when fileUrl available

### Challenge 2: Uploaded Books Not Visible in Catalog
**Problem:** After uploading a book via admin panel, it didn't appear in public listings.

**Root Cause:**
- Backend created book metadata but didn't automatically add to public_library
- Frontend fetched books from two sources (Supabase and backend) without merging
- One source could shadow books from the other

**Solution:**
- Implemented ensurePublicVisibility() method in ProductService
- Called after file upload to create PublicLibrary entry
- Updated frontend booksService to merge both sources (deduplication by id+title+author)
- Now books populate visibility pipeline automatically

### Challenge 3: Role-Based Access Control Complexity
**Problem:** Admins not in database couldn't access admin endpoints despite valid JWT token with ADMIN role.

**Solution:**
- Modified JwtAuthenticationFilter to create synthetic User object for admin tokens
- If JWT role is ADMIN but user not in DB, create User entity with ADMIN role
- Allows external admin users (e.g., from other systems) to access API

### Challenge 4: Digital vs Physical Content Handling
**Problem:** Schema mixed physical and digital content without clear separation strategy.

**Solution:**
- Added contentType field (physical, digital, both) to BooksMetadata
- Implemented fileKey and fileFormat for digital content
- Added downloadable flag with max_downloads limit
- Separated logic: physical orders skip download, digital books include file URL
- Frontend conditionally shows download/view buttons based on contentType

### Challenge 5: Subscription Access Control
**Problem:** How to balance free access (public catalog) with paid access (private library + features)?

**Solution:**
- Public library (anyone can browse, no auth required)
- Private library (requires active subscription)
- UserLibrary entities track access type: purchased, borrowed, sample
- SubscriptionService validates active subscription before library access
- Subscription expiration automatically transitions user state

### Challenge 6: Cart vs Order Data Consistency
**Problem:** Cart items had prices, but orders needed historical prices at purchase time.

**Solution:**
- OrderItem entity captures product_title and unit_price snapshot
- Cart has current prices; order freezes prices at checkout time
- Even if product price changes, order item shows paid price
- Prevents billing disputes from price changes

### Challenge 7: JWT Secret Management
**Problem:** How to securely manage JWT secret across environments?

**Solution:**
- Externalized JWT secret to environment variable (JWT_SECRET)
- Default fallback for development (should never be used in production)
- Environment variable required for production deployments
- 256-bit (64-char hex) secrets provide strong security

### Challenge 8: Cross-Origin Requests (CORS)
**Problem:** Frontend (different origin) couldn't call backend API.

**Solution:**
- CorsConfigurationSource bean configured in SecurityConfig
- Allowed origins from FRONTEND_URL environment variable
- Allowed credentials for cookie/auth header passing
- Max age 3600 seconds to cache preflight requests

### Challenge 9: File Upload Size Limits
**Problem:** Default Spring multipart size too small for large PDFs.

**Solution:**
- Configured in application.yml:
  ```yaml
  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 55MB
  ```

### Challenge 10: Pagination for Large Datasets
**Problem:** Returning all books at once would be slow and memory-intensive.

**Solution:**
- Spring Data Pageable interface for all list endpoints
- Default page size 20-50 (configurable)
- Frontend pagination: load more button or offset pagination
- Database indexes on frequently filtered columns

---

## 11. CURRENT STATUS

### ✅ COMPLETED FEATURES

#### Authentication & Authorization
- ✅ User registration with email
- ✅ User login with JWT tokens
- ✅ Admin login with role verification
- ✅ Role-based access control (USER, ADMIN)
- ✅ Spring Security integration
- ✅ CORS configuration
- ✅ Password hashing (BCrypt)

#### Product Management
- ✅ Create/Read/Update/Delete books
- ✅ Category management with hierarchies
- ✅ SKU and ISBN uniqueness validation
- ✅ Multi-language support
- ✅ Status tracking (active, inactive, draft)

#### Digital Content
- ✅ PDF file uploads to S3
- ✅ File storage with metadata
- ✅ Public URL generation
- ✅ Download/view links in frontend
- ✅ File size tracking
- ✅ Auto-publish to public library

#### Shopping & Orders
- ✅ Shopping cart (add/update/remove items)
- ✅ Order creation & tracking
- ✅ Order status management
- ✅ Payment entity scaffold
- ✅ Razorpay integration ready
- ✅ Discount code infrastructure

#### Subscription System
- ✅ Subscription plan management
- ✅ User subscription activation
- ✅ Access control based on subscriptions
- ✅ User library (purchased/borrowed/sample)
- ✅ Subscription status endpoints

#### Frontend
- ✅ Landing page with animations
- ✅ User registration & login pages
- ✅ User dashboard
- ✅ Admin dashboard
- ✅ Book catalog browsing
- ✅ Shopping cart UI
- ✅ Checkout page
- ✅ Book upload (admin)
- ✅ PDF view/download buttons
- ✅ Redux state management
- ✅ TypeScript full coverage
- ✅ Responsive design with Tailwind

#### Database
- ✅ PostgreSQL schema via Supabase
- ✅ Flyway migrations (v1, v2)
- ✅ Relationships & constraints
- ✅ Indexing for performance
- ✅ Temporal data tracking

#### DevOps & Deployment
- ✅ Maven build pipeline
- ✅ Spring Boot configuration management
- ✅ Environment variable externalization
- ✅ Render.com backend deployment ready
- ✅ Netlify frontend deployment ready
- ✅ Supabase database ready

---

### ⚠️ PARTIALLY IMPLEMENTED FEATURES

#### Payment Processing
- ⚠️ Payment entity & repository created
- ⚠️ Razorpay API endpoints defined in controllers
- ⚠️ Payment status tracking ready
- ❌ **Not yet:** Actual payment gateway webhook integration
- ❌ **Not yet:** Payment verification logic
- ❌ **Not yet:** Refund processing

#### Reviews & Ratings
- ⚠️ Schema prepared (tables/entities ready)
- ❌ **Not yet:** Service layer implementation
- ❌ **Not yet:** API endpoints
- ❌ **Not yet:** Frontend review form

#### Address Management
- ⚠️ Entity structure prepared
- ⚠️ One-to-many relationship with User
- ⚠️ Order tables have shipping address snapshot
- ❌ **Not yet:** Address CRUD endpoints
- ❌ **Not yet:** Address validation
- ❌ **Not yet:** Frontend address form

#### Inventory & Stock Tracking
- ⚠️ Infrastructure in place
- ❌ **Not yet:** Stock deduction on order
- ❌ **Not yet:** Stock-out handling
- ❌ **Not yet:** Inventory logs

#### Multi-language UI
- ⚠️ Database field for preferred_language in User
- ⚠️ Language parameter in search
- ❌ **Not yet:** i18n implementation in React
- ❌ **Not yet:** Translation files

---

### ❌ NOT IMPLEMENTED FEATURES

#### Advanced Features
- ❌ Email notifications (infrastructure ready, need SMTP config)
- ❌ OTP verification for registration
- ❌ OAuth/Social login (infrastructure ready)
- ❌ Wishlist functionality
- ❌ Book recommendations based on purchase history
- ❌ Search analytics
- ❌ Promo codes/coupon engine (ready in schema)
- ❌ Partial downloads (streaming)
- ❌ Reading progress tracking
- ❌ Book borrowing/lending system (ready in schema)
- ❌ Author profiles & biographies
- ❌ Book series management
- ❌ Digital rights management (DRM)

#### Admin Features
- ❌ Advanced analytics dashboard
- ❌ Bulk operations (bulk upload, bulk category assignment)
- ❌ Report generation (sales, inventory)
- ❌ User account suspension/ban
- ❌ Audit logging for admin actions
- ❌ API key management for partners

#### Operational
- ❌ Shipment tracking (ready in schema)
- ❌ Invoice generation
- ❌ Return/refund management
- ❌ Customer support ticketing
- ❌ Seller ratings/reviews
- ❌ A/B testing infrastructure

---

### BUILD & DEPLOYMENT STATUS

| Component | Status | Details |
|-----------|--------|---------|
| Backend Build | ✅ Success | Maven clean build succeeds, no errors |
| Frontend Build | ✅ Success | Vite TypeScript build passes, ready for Netlify |
| Database | ✅ Ready | Supabase PostgreSQL configured |
| S3 Storage | ✅ Ready | Supabase S3 bucket configured |
| Frontend Deploy | ✅ Ready | Netlify build ready |
| Backend Deploy | ✅ Ready | Render.com container deployment ready |

---

## 12. FUTURE IMPROVEMENTS

### High Priority (Next Phase)

#### 1. Payment Gateway Implementation
- Integrate Razorpay webhook handlers
- Implement payment status callbacks
- Test payment flow end-to-end
- Add manual payment verification endpoint
- Implement refund processing

#### 2. Email Notifications
- Configure SMTP server (already in application.yml)
- Email templates for registration, order confirmation, shipping updates
- Send notifications on order status changes
- Subscription expiration reminders
- User registration confirmation emails

#### 3. Reviews & Ratings
- Implement review service layer
- API endpoints for create/edit/delete reviews
- Moderation queue for admin approval
- Average rating calculation
- Frontend review form in book detail page

#### 4. Advanced Search & Filtering
- Implement full-text search on book titles and descriptions
- Elasticsearch integration (optional for scaling)
- Filter by rating, price range, language
- Sort by popularity, rating, new arrivals
- Search suggestions/autocomplete

#### 5. Analytics Dashboard
- User acquisition metrics
- Revenue tracking by time period
- Best-selling books
- Genre performance
- User behavior analytics
- Admin dashboard visualization

---

### Medium Priority (Later Phase)

#### 1. Social Features
- Wishlist functionality
- Book sharing (social media integration)
- User profiles with purchase history
- Following authors
- User-to-user recommendations

#### 2. Subscription Enhancements
- Plan tiering (e.g., Basic, Premium, VIP)
- Trial period support
- Family plans (multiple users)
- Gift subscriptions
- Plan recommendation engine

#### 3. Mobile App
- React Native cross-platform app
- Offline reading capability
- Sync purchase history across devices
- Mobile-optimized checkout
- Push notifications

#### 4. Content Delivery
- CDN integration for PDF caching
- Progressive web app (PWA) support
- Offline book reading with service workers
- Partial downloads for large files
- Reading progress sync across devices

#### 5. Partner Portal
- Bulk book uploads for publishers
- Sales reporting
- Revenue analytics
- Royalty calculations
- API keys for programmatic access

---

### Low Priority (Nice to Have)

#### 1. Machine Learning
- Book recommendations based on user behavior
- Personalized homepage
- Price optimization
- Fraud detection for payments
- Churn prediction for subscriptions

#### 2. Community Features
- Book discussion forums
- Author Q&A sessions
- Reader book clubs
- Book ratings and reviews with helpfulness voting
- User-generated reading lists

#### 3. Localization
- Multi-language UI (i18n)
- Currency support (USD, EUR, etc.)
- Regional payment methods
- Regional pricing

#### 4. Advanced Admin Features
- Bulk import/export of books
- Scheduled promotions
- Custom reports
- API rate limiting (per partner)
- Admin activity audit logs

#### 5. DRM & Licensing
- Digital rights management
- License key generation
- Device activation/deactivation
- License expiration handling
- Concurrent user limits

---

## 13. KEY LEARNINGS

### Architecture & Design Patterns

#### 1. Separation of Concerns
- **Learning:** Clear separation of controller → service → repository layers leads to maintainable code
- **Applied:** Each business domain (Cart, Order, Product) has dedicated service classes
- **Benefit:** Easy to unit test services in isolation without database dependency

#### 2. Entity Relationships & Schema Design
- **Learning:** Proper JPA entity relationships (ManyToOne, OneToMany) with cascade policies prevent orphaned records
- **Applied:** UserLibrary correctly maps User:BooksMetadata with proper constraints
- **Benefit:** Database integrity maintained automatically by Hibernate

#### 3. DTOs vs Entities
- **Learning:** Never return entities directly to API; use DTOs for clean API contracts
- **Applied:** ProductResponse, AuthResponse, OrderResponse separate API model from persistence model
- **Benefit:** API contract stable even if entity structure changes

#### 4. Temporal Data & Auditing
- **Learning:** Adding created_at and updated_at to all tables enables audit trails and debugging
- **Applied:** @CreationTimestamp and @UpdateTimestamp annotations on all entities
- **Benefit:** Track when changes occurred without separate audit table

---

### Security Best Practices

#### 1. Password Security
- **Learning:** Never store plain passwords; always hash with strong algorithm
- **Applied:** BCryptPasswordEncoder with configurable strength (default rounds = 10)
- **Benefit:** Even if database is breached, passwords are unrecoverable

#### 2. JWT Token Security
- **Learning:** Short expiration (24 hours) limits damage from stolen tokens
- **Applied:** Access token 24 hours, refresh token 7 days (infrastructure ready)
- **Benefit:** Users must re-authenticate regularly; stolen tokens have limited window

#### 3. Role-Based Authorization
- **Learning:** Check authorization at method level, not just controller level
- **Applied:** @PreAuthorize("hasRole('ADMIN')") on service/controller methods
- **Benefit:** Prevents accidental privilege escalation; clear security boundary

#### 4. CORS Management
- **Learning:** Configure CORS explicitly; never use wildcard in production
- **Applied:** CorsConfigurationSource with specific allowed origins
- **Benefit:** Prevents browser from loading API responses on unauthorized sites

#### 5. Environment Configuration
- **Learning:** Never hardcode secrets in source code; use environment variables
- **Applied:** All sensitive config (DB password, JWT secret, API keys) externalised
- **Benefit:** Safe deployment across dev/staging/production without code changes

---

### Frontend Best Practices

#### 1. State Management with Redux
- **Learning:** Global state (Redux) for user auth and cart prevents prop drilling
- **Applied:** authSlice and cartSlice for cross-component state
- **Benefit:** Any component can access user info without passing through props

#### 2. Service Layer Abstraction
- **Learning:** API calls isolated to service layer; components use services, not axios
- **Applied:** booksService, cartService, authService centralize API logic
- **Benefit:** Easy to mock services in tests; centralized error handling

#### 3. Type Safety with TypeScript
- **Learning:** TypeScript catches API contract mismatches at compile time
- **Applied:** Interfaces for Book, Order, ProductResponse; DTOs match backend exactly
- **Benefit:** Fewer runtime errors; IDE autocomplete and refactoring support

#### 4. Responsive Design
- **Learning:** Mobile-first design with Tailwind CSS utilities simplifies responsive layouts
- **Applied:** responsive grid layouts, hidden/visible based on breakpoints
- **Benefit:** Works on mobile, tablet, and desktop without custom media queries

#### 5. Component Composition
- **Learning:** Small, reusable components (Button, Card, Modal) reduce code duplication
- **Applied:** Shared UI components in components/ui/ folder
- **Benefit:** Consistent UI across app; theme changes apply everywhere

---

### DevOps & Deployment

#### 1. Environment-Specific Configuration
- **Learning:** Different configs for dev, staging, production prevents accidental mistakes
- **Applied:** application.yml, application-dev.yml, application-prod.yml
- **Benefit:** Develop locally; deploy to cloud with different configs

#### 2. Database Schema Versioning (Flyway
)
- **Learning:** Version-controlled migrations ensure schema consistency across deployments
- **Applied:** V1__ and V2__ migration files track schema evolution
- **Benefit:** Rollback possible; clear audit trail of schema changes

#### 3. Containerization Ready
- **Learning:** Docker + containers simplify deployment and scaling
- **Status:** Render.com supports Git-based deployment with automatic container building
- **Benefit:** No manual server configuration; scale horizontally by adding containers

#### 4. Cloud-Native Architecture
- **Learning:** Microservice-ready design (independent services, stateless)
- **Applied:** Separate backend API, frontend SPA, and database
- **Benefit:** Each component scales independently based on demand

---

### File Storage & Media

#### 1. S3-Compatible Storage
- **Learning:** Using S3-compatible APIs (not AWS-specific) enables multi-cloud portability
- **Applied:** Supabase Storage (S3-compatible) with same AWS SDK
- **Benefit:** Can switch providers (AWS S3, MinIO, Backblaze) without code changes

#### 2. Public URL Resolution
- **Learning:** Generate public URLs server-side; never expose internal object keys
- **Applied:** BookStorageService.resolvePublicUrl() transforms internal keys to public URLs
- **Benefit:** Can change URL structure or CDN without client-side changes

#### 3. Metadata Alongside Files
- **Learning:** Store metadata JSON alongside binary files for archive/export
- **Applied:** Both file (PDF) and metadata (JSON) uploaded to S3
- **Benefit:** Data warehouse can import metadata without querying database

---

### Business Logic Insights

#### 1. Book Visibility Pipeline
- **Learning:** Books don't automatically appear public; explicit publishing decision needed
- **Applied:** PublicLibrary entity mediates between metadata and visibility
- **Benefit:** Admins can draft books, stage content, then publish when ready

#### 2. Subscription Access Control
- **Learning:** Clear access tiers (free public, paid private) prevent support issues
- **Applied:** Public library (anyone), private library (subscription required)
- **Benefit:** Users understand value proposition; reduces churn from unexpected restrictions

#### 3. Price Snapshots in Orders
- **Learning:** Lock prices at purchase time; prevent future price changes from affecting past orders
- **Applied:** OrderItem captures unit_price; if product price changes, order unaffected
- **Benefit:** No billing disputes; clear audit trail of what customer paid

#### 4. Historical Data Preservation
- **Learning:** Archive orders/payments/subscriptions indefinitely for compliance
- **Applied:** Never delete orders; mark inactive with status field
- **Benefit:** Tax audits, chargeback disputes, historical analysis all possible

---

### Project Maturity Assessment

**Development Stage:** Early production-ready
- Core CRUD operations stable
- Authentication & authorization comprehensive
- Database schema well-designed with constraints
- Missing: payment processing, email notifications, reviews
- Missing: analytics, advanced admin features, customer support

**Code Quality:**
- ✅ Proper separation of concerns
- ✅ Type safety with TypeScript and Java
- ✅ Configuration externalized
- ✅ Error handling in place
- ⚠️ Limited unit/integration tests visible
- ⚠️ No API documentation (Swagger/OpenAPI) generated

**Production Readiness:**
- ✅ Database: scaling ready with indices
- ✅ Backend: stateless, horizontally scalable
- ✅ Frontend: SPA, deployed to CDN
- ⚠️ Monitoring: no observability infrastructure visible
- ⚠️ Backup: depends on provider (Supabase/Render)
- ⚠️ Disaster recovery: provider-dependent

**Recommendation for Next Developer:**
1. Add integration tests for business logic
2. Implement payment webhook handlers
3. Add email notification system
4. Generate API documentation (Swagger)
5. Add basic monitoring/logging
6. Create deployment runbook
7. Implement database backup strategy

---

## APPENDIX: Running the Project Locally

### Backend Setup

```bash
# Prerequisites
- Java 21+ installed
- Maven 3.8+ installed
- PostgreSQL 14+ or Supabase account

# Clone and navigate
cd Masuki-Books-Backend

# Configure
cp .env.example .env
# Edit .env with local database credentials and S3 keys

# Run Flyway migrations (automatic on startup)
# Build and run
mvn clean install
mvn spring-boot:run

# Server starts on http://localhost:8001
# Swagger UI available at http://localhost:8001/swagger-ui.html
```

### Frontend Setup

```bash
# Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

# Clone and navigate
cd Masuki-Books-Frontend

# Install dependencies
npm install

# Configure
cp .env.example .env
# Set VITE_API_URL=http://localhost:8001
# Set Supabase credentials

# Run development server
npm run dev

# Open http://localhost:5173 in browser
```

### Database Setup (Supabase)

```sql
-- Run supabase/books_setup.sql in Supabase SQL editor
-- Creates books table and storage policies
-- Run backend migrations (Flyway) automatically
```

---

## CONCLUSION

MasukiBooks is a well-architected, feature-rich e-commerce platform for book distribution. The project demonstrates solid backend engineering (Spring Boot, PostgreSQL, JWT security) combined with modern frontend development (React, TypeScript, Redux). 

Core e-commerce functionality (shopping, orders, payments ready) and digital content support (PDF uploads, S3 storage) are production-ready. The subscription system enables recurring revenue model. Role-based access control separates user and admin experiences cleanly.

Primary gaps for production deployment are payment webhook integration, email notifications, and observability infrastructure. Future roadmap includes advanced features (reviews, analytics, recommendations) and mobile app expansion.

The codebase is well-suited for a small team to build upon; clear separation of concerns, type safety, and externalized configuration support rapid feature development and safe deployment across environments.

---

**Document Generated:** March 27, 2026  
**Project Status:** Active Development  
**Deployment Ready:** Staging (backend + frontend builds successful)  
**Production Ready:** Requires payment integration + monitoring setup

