const fs = require('fs');
const path = require('path');

// Simple file-based storage for demo purposes
const CARTS_FILE = path.join(__dirname, '../data/carts.json');

// Ensure data directory exists
const dataDir = path.dirname(CARTS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize carts file if it doesn't exist
if (!fs.existsSync(CARTS_FILE)) {
  fs.writeFileSync(CARTS_FILE, JSON.stringify([], null, 2));
}

// Cart Schema (simplified for file storage)
class Cart {
  constructor(data) {
    this.user = data.user;
    this.items = data.items || [];
    this.subtotal = data.subtotal || 0;
    this.tax = data.tax || 0;
    this.taxRate = data.taxRate || 0.1; // 10% tax
    this.shippingCost = data.shippingCost || 0;
    this.discountCode = data.discountCode || null;
    this.discountAmount = data.discountAmount || 0;
    this.total = data.total || 0;
    this.notes = data.notes || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Method to calculate totals
  calculateTotals() {
    // Calculate subtotal
    this.subtotal = this.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Calculate tax
    this.tax = Number((this.subtotal * this.taxRate).toFixed(2));

    // Calculate total
    this.total = this.subtotal + this.tax + this.shippingCost - this.discountAmount;
    this.total = Number(this.total.toFixed(2));

    return this;
  }

  // Method to add item to cart
  addItem(productId, quantity, price) {
    const existingItem = this.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        product: productId,
        quantity,
        price,
        addedAt: new Date(),
      });
    }

    this.calculateTotals();
    return this;
  }

  // Method to remove item from cart
  removeItem(productId) {
    this.items = this.items.filter(item => item.product.toString() !== productId);
    this.calculateTotals();
    return this;
  }

  // Method to update item quantity
  updateItemQuantity(productId, quantity) {
    const item = this.items.find(item => item.product.toString() === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
      }
    }

    this.calculateTotals();
    return this;
  }

  // Method to clear cart
  clearCart() {
    this.items = [];
    this.calculateTotals();
    return this;
  }

  // Method to get item count
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }
}

// Static methods for file operations
Cart.findOne = async (query) => {
  try {
    const data = fs.readFileSync(CARTS_FILE, 'utf8');
    const carts = JSON.parse(data);

    if (query.user) {
      const cart = carts.find(c => c.user === query.user);
      return cart ? new Cart(cart) : null;
    }

    return null;
  } catch (error) {
    console.error('Error reading carts:', error);
    return null;
  }
};

Cart.findOneAndUpdate = async (query, updateData, options = {}) => {
  try {
    const data = fs.readFileSync(CARTS_FILE, 'utf8');
    let carts = JSON.parse(data);

    if (query.user) {
      const index = carts.findIndex(c => c.user === query.user);

      if (index === -1) {
        // Create new cart if upsert is true
        if (options.upsert) {
          const newCart = new Cart({ user: query.user, ...updateData });
          carts.push(newCart);
          fs.writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2));
          return newCart;
        }
        return null;
      }

      // Update existing cart
      Object.assign(carts[index], updateData, { updatedAt: new Date() });
      fs.writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2));

      return new Cart(carts[index]);
    }

    return null;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

Cart.findOneAndDelete = async (query) => {
  try {
    const data = fs.readFileSync(CARTS_FILE, 'utf8');
    let carts = JSON.parse(data);

    if (query.user) {
      const index = carts.findIndex(c => c.user === query.user);

      if (index === -1) {
        return null;
      }

      const deletedCart = carts.splice(index, 1)[0];
      fs.writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2));

      return new Cart(deletedCart);
    }

    return null;
  } catch (error) {
    console.error('Error deleting cart:', error);
    throw error;
  }
};

module.exports = Cart;
