const fs = require('fs');
const path = require('path');

// Simple file-based storage for demo purposes
const ORDERS_FILE = path.join(__dirname, '../data/orders.json');

// Ensure data directory exists
const dataDir = path.dirname(ORDERS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize orders file if it doesn't exist
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

// Order Schema (simplified for file storage)
class Order {
  constructor(data) {
    this._id = data._id || Date.now().toString();
    this.userId = data.userId;
    this.items = data.items || []; // Array of {productId, name, price, quantity}
    this.total = data.total || 0;
    this.status = data.status || 'pending'; // pending, confirmed, preparing, ready, delivered, cancelled
    this.deliveryAddress = data.deliveryAddress || {};
    this.paymentMethod = data.paymentMethod || 'cash';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Save order to file
  async save() {
    this.updatedAt = new Date();

    try {
      const data = fs.readFileSync(ORDERS_FILE, 'utf8');
      let orders = JSON.parse(data);

      const index = orders.findIndex(o => o._id === this._id);
      if (index === -1) {
        orders.push(this);
      } else {
        orders[index] = this;
      }

      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
      return this;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  }

  // Get public order data (without sensitive info)
  getPublicData() {
    return {
      _id: this._id,
      userId: this.userId,
      items: this.items,
      total: this.total,
      status: this.status,
      deliveryAddress: this.deliveryAddress,
      paymentMethod: this.paymentMethod,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Static methods for file operations
Order.find = async (query = {}) => {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    let orders = JSON.parse(data);

    // Apply filters
    if (query.userId) {
      orders = orders.filter(o => o.userId === query.userId);
    }
    if (query.status) {
      orders = orders.filter(o => o.status === query.status);
    }

    return orders.map(o => new Order(o));
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
};

Order.findById = async (id) => {
  try {
    const orders = await Order.find();
    const order = orders.find(o => o._id === id);
    return order || null;
  } catch (error) {
    console.error('Error finding order:', error);
    return null;
  }
};

Order.findByIdAndUpdate = async (id, updateData) => {
  try {
    const order = await Order.findById(id);
    if (!order) {
      return null;
    }

    Object.assign(order, updateData);
    await order.save();

    return order;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

Order.findByIdAndDelete = async (id) => {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    let orders = JSON.parse(data);

    const index = orders.findIndex(o => o._id === id);
    if (index === -1) {
      return null;
    }

    const deletedOrder = orders.splice(index, 1)[0];
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));

    return new Order(deletedOrder);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

Order.create = async (data) => {
  try {
    const newOrder = new Order(data);
    await newOrder.save();
    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

module.exports = Order;