const fs = require('fs');
const path = require('path');

// Simple file-based storage for demo purposes
const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

// Ensure data directory exists
const dataDir = path.dirname(PRODUCTS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize products file if it doesn't exist
if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
}

// Product Schema (simplified for file storage)
class Product {
  constructor(data) {
    this._id = data._id || Date.now().toString();
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.salePrice = data.salePrice || null;
    this.category = data.category;
    this.image = data.image;
    this.images = data.images || [data.image];
    this.stock = data.stock;
    this.sku = data.sku;
    this.rating = data.rating || 0;
    this.reviewCount = data.reviewCount || 0;
    this.tags = data.tags || [];
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Get public data (without sensitive info)
  getPublicData() {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      price: this.price,
      salePrice: this.salePrice,
      category: this.category,
      image: this.image,
      images: this.images,
      stock: this.stock,
      sku: this.sku,
      rating: this.rating,
      reviewCount: this.reviewCount,
      tags: this.tags,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// Static methods for file operations
Product.find = async (query = {}) => {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    let products = JSON.parse(data);

    // Apply filters
    if (query.isActive !== undefined) {
      products = products.filter(p => p.isActive === query.isActive);
    }

    if (query.category) {
      products = products.filter(p => p.category === query.category);
    }

    if (query.$text) {
      const searchTerm = query.$text.$search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    return products.map(p => new Product(p));
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

Product.findById = async (id) => {
  try {
    const products = await Product.find();
    const product = products.find(p => p._id === id);
    return product || null;
  } catch (error) {
    console.error('Error finding product:', error);
    return null;
  }
};

Product.findOne = async (query) => {
  try {
    const products = await Product.find();
    if (query.sku) {
      return products.find(p => p.sku === query.sku) || null;
    }
    if (query.email) {
      return products.find(p => p.email === query.email) || null;
    }
    return null;
  } catch (error) {
    console.error('Error finding product:', error);
    return null;
  }
};

Product.create = async (data) => {
  try {
    const products = await Product.find();
    const newProduct = new Product(data);

    // Check for duplicate SKU
    if (products.some(p => p.sku === newProduct.sku)) {
      throw new Error('Product with this SKU already exists');
    }

    products.push(newProduct);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

Product.findByIdAndUpdate = async (id, updateData) => {
  try {
    const products = await Product.find();
    const index = products.findIndex(p => p._id === id);

    if (index === -1) {
      return null;
    }

    // Update the product
    Object.assign(products[index], updateData, { updatedAt: new Date() });

    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

    return new Product(products[index]);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

Product.findByIdAndDelete = async (id) => {
  try {
    const products = await Product.find();
    const index = products.findIndex(p => p._id === id);

    if (index === -1) {
      return null;
    }

    const deletedProduct = products.splice(index, 1)[0];
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

    return new Product(deletedProduct);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

Product.distinct = async (field) => {
  try {
    const products = await Product.find();
    const values = [...new Set(products.map(p => p[field]))];
    return values.filter(v => v !== undefined && v !== null);
  } catch (error) {
    console.error('Error getting distinct values:', error);
    return [];
  }
};

Product.countDocuments = async (query = {}) => {
  try {
    const products = await Product.find(query);
    return products.length;
  } catch (error) {
    console.error('Error counting documents:', error);
    return 0;
  }
};

Product.deleteMany = async () => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
    return { deletedCount: 0 }; // Simplified
  } catch (error) {
    console.error('Error deleting products:', error);
    throw error;
  }
};

Product.insertMany = async (productsData) => {
  try {
    const existingProducts = await Product.find();
    const newProducts = productsData.map(data => new Product(data));

    // Check for duplicate SKUs
    for (const product of newProducts) {
      if (existingProducts.some(p => p.sku === product.sku)) {
        throw new Error(`Product with SKU ${product.sku} already exists`);
      }
    }

    const allProducts = [...existingProducts, ...newProducts];
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(allProducts, null, 2));

    return newProducts;
  } catch (error) {
    console.error('Error inserting products:', error);
    throw error;
  }
};

module.exports = Product;
