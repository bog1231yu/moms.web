# Frontend-Backend Integration Guide

## Section 4: Product Management - COMPLETED ✅

Your website is now connected to a backend API for managing products and cart operations!

---

## Getting Started

### 1. Start the Backend Server

```bash
# Navigate to backend directory
cd backend

# Install dependencies (first time only)
npm install

# Run the server
npm start
```

The server will start on `http://localhost:5000`

### 2. See Available API Endpoints

The following product endpoints are now available:

**Public Endpoints:**
- `GET /api/products` - Get all products (with filtering, sorting, search)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:id` - Get product details

**Admin Endpoints:**
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PUT /api/products/:id/stock` - Update stock

---

## Frontend API Functions

All API functions are available in `js/api.js` and can be called from your HTML pages.

### Product Functions

```javascript
// Get all products
getAllProducts(category, sortBy, search, page, limit)

// Get product by ID
getProductById(productId)

// Get all categories
getCategories()

// Get products by category
getProductsByCategory(category)

// Display products on page
displayProducts(containerId, category)
```

### Cart Functions

```javascript
// Get user's cart
getCart()

// Add item to cart
addToCart(productId, quantity)

// Update cart item quantity
updateCartItem(productId, quantity)

// Remove item from cart
removeFromCart(productId)

// Clear entire cart
clearCart()

// Apply discount code
applyDiscount(discountCode, discountAmount)

// Apply shipping cost
applyShipping(shippingCost)

// Display cart on page
displayCart(containerId)
```

### Auth Functions

```javascript
// Register user
register(firstName, lastName, email, password, passwordConfirm)

// Login user
login(email, password)

// Logout user
logout()

// Check if logged in
isLoggedIn()

// Get auth token
getToken()
```

---

## How to Insert Test Products

### Option 1: Using MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Connect to your MongoDB (usually `mongodb://localhost:27017`)
3. Create database: `moms-web`
4. Create collection: `products`
5. Insert sample documents:

```json
{
  "name": "Burger Combo",
  "description": "Delicious beef burger with fries and drink",
  "price": 12.99,
  "salePrice": 9.99,
  "category": "Food",
  "image": "https://via.placeholder.com/300?text=Burger",
  "images": ["https://via.placeholder.com/300?text=Burger"],
  "stock": 50,
  "sku": "BURGER-001",
  "tags": ["popular", "combo"],
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

### Option 2: Using Postman or cURL

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Pizza",
    "description": "Cheese pizza with toppings",
    "price": 15.99,
    "category": "Food",
    "image": "https://via.placeholder.com/300?text=Pizza",
    "stock": 30,
    "sku": "PIZZA-001"
  }'
```

### Option 3: Node.js Script

Create `backend/seed.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/productModel');

const products = [
  {
    name: "Burger Combo",
    description: "Delicious beef burger with fries and drink",
    price: 12.99,
    salePrice: 9.99,
    category: "Food",
    image: "https://via.placeholder.com/300?text=Burger",
    stock: 50,
    sku: "BURGER-001",
    tags: ["popular"],
    isActive: true,
  },
  {
    name: "Pizza Margherita",
    description: "Classic pizza with fresh mozzarella",
    price: 15.99,
    category: "Food",
    image: "https://via.placeholder.com/300?text=Pizza",
    stock: 40,
    sku: "PIZZA-001",
    tags: ["classic"],
    isActive: true,
  },
  {
    name: "Caesar Salad",
    description: "Fresh salad with chicken and dressing",
    price: 8.99,
    category: "Salads",
    image: "https://via.placeholder.com/300?text=Salad",
    stock: 60,
    sku: "SALAD-001",
    tags: ["healthy"],
    isActive: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/moms-web');
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert products
    const result = await Product.insertMany(products);
    console.log(`✅ ${result.length} products inserted`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
```

Run with:
```bash
node seed.js
```

---

## Using Products on Your Website

### Example 1: Display All Products

```html
<!-- Add a container in your HTML -->
<div id="productsContainer"></div>

<!-- Call this function -->
<script>
  // On page load
  displayProducts('productsContainer');
</script>
```

### Example 2: Add Products by Category

```html
<div id="foodProducts"></div>

<script>
  displayProducts('foodProducts', 'Food');
</script>
```

### Example 3: Create Order Button

```html
<button onclick="addToCart('PRODUCT_ID_HERE', 1)">
  Add to Cart
</button>
```

### Example 4: Display Shopping Cart

```html
<div id="cartContainer"></div>

<script>
  displayCart('cartContainer');
</script>
```

---

## Testing the Integration

1. **Register a new user** (visit your frontend and sign up)
2. **Browse products** (products should display from API)
3. **Add to cart** (click Add to Cart button)
4. **View cart** (cart should show items from database)
5. **Update quantities** (change amounts in cart)
6. **Remove items** (delete from cart)

---

## Common Issues & Troubleshooting

### "Cart is empty" message
- Make sure you're logged in first
- Check browser console for errors (F12 → Console)
- Verify backend is running on port 5000

### Products not showing
- Backend server not running
- MongoDB not connected
- No products in database (use seed script)
- Check browser console for errors

### "Please log in" message
- User authentication required
- Create user account first
- Token may have expired

### CORS error
- Backend CORS is already configured
- Make sure backend is running
- Check the API_BASE_URL in js/api.js

---

## Next Steps

Section 5 (Shopping Cart & Checkout) is already implemented! 
- Cart calculations work automatically
- Total, tax, shipping, and discount calculations are included
- Next: Implement payment processing (Stripe/PayPal)

---

## File Locations

**Backend Files:**
- `backend/controllers/productController.js` - Product logic
- `backend/routes/productRoutes.js` - Product endpoints
- `backend/models/productModel.js` - Product schema

**Frontend Files:**
- `js/api.js` - All API functions
- `index.html` - Connected to API
- `order.html` - Connected to API
