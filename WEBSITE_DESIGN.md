# Website Design - 12 Sections

## ✅ Section 1: Project Setup (COMPLETED)
**Backend Framework:** Node.js/Express

### Folder Structure:
```
backend/
├── models/          # Database models and schemas
├── routes/          # API routes and endpoints
├── controllers/     # Request handlers and business logic
├── config/          # Configuration files (database, API keys)
├── middleware/      # Custom middleware (auth, validation, logging)
└── server.js        # Main server entry point
```

### Technologies:
- Node.js (Runtime)
- Express.js (Web Framework)
- MongoDB/PostgreSQL (Database)
- JWT (Authentication)
- Dotenv (Environment variables)

---

## ✅ Section 2: User Authentication & Authorization (COMPLETED)
- User registration/login
- JWT token generation
- Role-based access control (Admin, User, Guest)
- Password encryption (bcrypt)
- Session management

**Files:**
- `controllers/authController.js`
- `middleware/authMiddleware.js`
- `routes/authRoutes.js`

---

## ✅ Section 3: User Management (COMPLETED)
- User profiles
- User data management
- Account settings
- User preferences

**Files:**
- `controllers/userController.js`
- `models/userModel.js`
- `routes/userRoutes.js`

---

## ✅ Section 4: Product/Service Management (COMPLETED)
- List products/services
- Product details
- Inventory management
- Categories and filters

**Files:**
- `controllers/productController.js`
- `models/productModel.js`
- `routes/productRoutes.js`

---

## ✅ Section 5: Shopping Cart & Checkout (COMPLETED)
- ✅ Product display with dynamic loading
- ✅ Add to cart functionality
- ✅ Cart management (add, remove, update quantities)
- ✅ Cart persistence
- ✅ Cart count display
- ⚠️ **Payment sections removed** - Will be implemented separately
- ⚠️ **Security Notice:** Browser blocks cart functionality on HTTP sites

**Current Status:** Cart works but payment processing removed for separate implementation.

**Security Considerations:**
- Modern browsers block certain features on HTTP sites
- HTTPS required for full e-commerce functionality
- Development mode shows fallback products when API is blocked

**Page Visibility Fixes:**
- ✅ Removed opacity:0 styles that were hiding content
- ✅ Added proper page title and description
- ✅ Fixed tabbed menu structure for product display
- ✅ JavaScript now targets active tab for product loading

**Files:**
- `controllers/cartController.js`
- `models/cartModel.js`
- `routes/cartRoutes.js`
- `js/api.js` (Frontend API calls)
- `order.html` (Updated with cart functionality and visibility fixes)

---

## ⏭️ Section 6: Payment Processing (MOVED TO SEPARATE IMPLEMENTATION)
- Payment gateway integration (Stripe, PayPal)
- Secure payment processing
- Payment confirmation
- Transaction handling

**Status:** Moved to separate implementation due to complexity and security requirements.

---
- Order payment status
- Transaction records
- Refund handling

**Files:**
- `controllers/paymentController.js`
- `config/paymentConfig.js`
- `routes/paymentRoutes.js`

---

## ✅ Section 7: Order Management
- ✅ Create orders from cart
- ✅ Order tracking and history
- ✅ Order status updates (Admin)
- ✅ Order cancellation
- ✅ Stock management on order creation/cancellation

**Features:**
- Order creation from user's cart
- Automatic stock reduction when orders are placed
- Stock restoration when orders are cancelled
- Order status tracking (pending → confirmed → preparing → ready → delivered)
- User order history
- Admin order management
- Order details with full item information

**Files:**
- `controllers/orderController.js`
- `models/orderModel.js`
- `routes/orderRoutes.js`

---

## ☐ Section 8: Email & Notifications
- Email notifications (confirmations, status updates)
- SMS notifications
- In-app notifications
- Newsletter subscription

**Files:**
- `controllers/notificationController.js`
- `middleware/emailMiddleware.js`
- `config/emailConfig.js`

---

## ☐ Section 9: Admin Dashboard
- User management
- Product management
- Order analytics
- Revenue reports
- Settings management

**Files:**
- `controllers/adminController.js`
- `routes/adminRoutes.js`
- `middleware/adminMiddleware.js`

---

## ☐ Section 10: Search & Filtering
- Product search functionality
- Advanced filters (price, category, ratings)
- Search suggestions/autocomplete
- Search analytics

**Files:**
- `controllers/searchController.js`
- `routes/searchRoutes.js`

---

## ☐ Section 11: Reviews & Ratings
- Product reviews
- User ratings
- Review moderation
- Rating analytics

**Files:**
- `controllers/reviewController.js`
- `models/reviewModel.js`
- `routes/reviewRoutes.js`

---

## ☐ Section 12: API Documentation & Security
- API endpoint documentation
- Rate limiting
- CORS configuration
- Input validation
- Error handling
- Security headers

**Files:**
- `config/securityConfig.js`
- `middleware/validationMiddleware.js`
- `middleware/errorHandler.js`
- `API_DOCUMENTATION.md`

---

## Getting Started

### Install Node.js dependencies:
```bash
npm install express dotenv bcryptjs jsonwebtoken mongoose cors
```

### Environment variables (.env):
```
PORT=5000
NODE_ENV=development
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
SMTP_HOST=your_email_host
STRIPE_SECRET_KEY=your_stripe_key
```

### Run the server:
```bash
npm start
```
