const Product = require('./models/productModel');

const sampleProducts = [
  {
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, onion, and our special sauce",
    price: 12.99,
    salePrice: 9.99,
    category: "Food",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
    images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300"],
    stock: 50,
    sku: "BURGER-001",
    tags: ["popular", "beef"],
    isActive: true,
  },
  {
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, and basil on our signature crust",
    price: 15.99,
    category: "Food",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300",
    images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300"],
    stock: 30,
    sku: "PIZZA-001",
    tags: ["vegetarian", "classic"],
    isActive: true,
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with parmesan cheese, croutons, and Caesar dressing",
    price: 8.99,
    category: "Salads",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300",
    images: ["https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300"],
    stock: 40,
    sku: "SALAD-001",
    tags: ["healthy", "vegetarian"],
    isActive: true,
  },
  {
    name: "French Fries",
    description: "Golden crispy fries served with ketchup",
    price: 4.99,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300",
    images: ["https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300"],
    stock: 100,
    sku: "FRIES-001",
    tags: ["side", "crispy"],
    isActive: true,
  },
  {
    name: "Chocolate Milkshake",
    description: "Rich and creamy chocolate milkshake topped with whipped cream",
    price: 6.99,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300",
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300"],
    stock: 25,
    sku: "SHAKE-001",
    tags: ["sweet", "cold"],
    isActive: true,
  },
];

const seedDB = async () => {
  try {
    // Clear existing products by overwriting the file
    const fs = require('fs');
    const path = require('path');
    const PRODUCTS_FILE = path.join(__dirname, 'data/products.json');
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));

    console.log('🧹 Cleared existing products');

    // Insert sample products one by one
    const insertedProducts = [];
    for (const productData of sampleProducts) {
      const product = await Product.create(productData);
      insertedProducts.push(product);
    }

    console.log(`✅ ${insertedProducts.length} products inserted successfully!`);

    // Show what was inserted
    console.log('\n📦 Sample Products Added:');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} (${product.category}) - $${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();