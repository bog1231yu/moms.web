# Mom's Web - Backend Setup Guide

## Project Structure

```
backend/
├── models/              # Database models (User, Product, Order, etc.)
├── routes/              # API route definitions
├── controllers/         # Business logic and request handlers
├── config/              # Configuration files (database, payment gateways)
├── middleware/          # Custom middleware (auth, validation, error handling)
├── package.json         # Node.js dependencies
├── server.js            # Main server entry point
├── .env.example         # Environment variables template
└── README.md            # This file
```

## Getting Started

### 1. Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB or PostgreSQL

### 2. Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy the example .env file
cp .env.example .env

# Edit .env and add your configuration:
# - Database URL
# - JWT Secret
# - Email credentials
# - Payment gateway keys
```

### 4. Run the Server

```bash
# Development (with auto-reload using nodemon)
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000`

## Website Sections Overview

This backend supports all 12 sections of the website design:

1. **Project Setup** ✓ (Current)
2. **User Authentication & Authorization**
3. **User Management**
4. **Product/Service Management**
5. **Shopping Cart & Checkout**
6. **Payment Processing**
7. **Order Management**
8. **Email & Notifications**
9. **Admin Dashboard**
10. **Search & Filtering**
11. **Reviews & Ratings**
12. **API Documentation & Security**

## API Endpoints (To be implemented)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (Admin)

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart

### Reviews
- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/:id` - Delete review

## Next Steps

1. Connect to database (MongoDB or PostgreSQL)
2. Implement user authentication models and routes
3. Create product management system
4. Set up payment gateway integration
5. Implement order management
6. Add email notification service
7. Create admin dashboard endpoints
8. Set up search and filtering
9. Implement reviews and ratings
10. Add comprehensive API documentation
11. Implement security measures (rate limiting, input validation)
12. Deploy to production

## Troubleshooting

### Port already in use
Change the PORT in .env file

### Database connection error
Check DATABASE_URL in .env and ensure MongoDB/PostgreSQL is running

### Module not found error
Run `npm install` again

## Support

For issues or questions, refer to the main WEBSITE_DESIGN.md file in the root directory.
