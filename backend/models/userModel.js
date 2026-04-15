const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Simple file-based storage for demo purposes
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Ensure data directory exists
const dataDir = path.dirname(USERS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

// User Schema (simplified for file storage)
class User {
  constructor(data) {
    this._id = data._id || crypto.randomUUID();
    this.id = this._id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email ? data.email.toLowerCase().trim() : data.email;
    this.password = data.password;
    this.phone = data.phone || null;
    this.address = data.address || {};
    this.role = data.role || 'user';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.profileImage = data.profileImage || null;
    this.lastLogin = data.lastLogin || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Hash password before saving
  async save() {
    if (this.password && !this.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    this.updatedAt = new Date();

    try {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      let users = JSON.parse(data);

      const index = users.findIndex(u => u._id === this._id);
      if (index === -1) {
        users.push(this);
      } else {
        users[index] = this;
      }

      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      return this;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  // Method to compare passwords
  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  // Method to get public user data (without password)
  getPublicData() {
    const user = { ...this };
    delete user.password;
    return user;
  }
}

// Static methods for file operations
User.find = async (query = {}) => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    let users = JSON.parse(data);

    // Apply filters
    if (query.isActive !== undefined) {
      users = users.filter(u => u.isActive === query.isActive);
    }

    return users.map(u => new User(u));
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

User.findById = async (id) => {
  try {
    const users = await User.find();
    const user = users.find(u => u._id === id);
    return user || null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

User.findOne = async (query) => {
  try {
    const users = await User.find();
    if (query.email) {
      const email = query.email.toLowerCase().trim();
      return users.find(u => u.email === email) || null;
    }
    return null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

User.create = async (data) => {
  try {
    const users = await User.find();
    const email = data.email.toLowerCase().trim();

    if (users.some(u => u.email === email)) {
      throw new Error('Email already in use');
    }

    const newUser = new User({ ...data, email });
    await newUser.save();

    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

User.findByIdAndUpdate = async (id, updateData) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return null;
    }

    Object.assign(user, updateData);
    await user.save();

    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

User.findByIdAndDelete = async (id) => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    let users = JSON.parse(data);

    const index = users.findIndex(u => u._id === id);
    if (index === -1) {
      return null;
    }

    const deletedUser = users.splice(index, 1)[0];
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    return new User(deletedUser);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

module.exports = User;
