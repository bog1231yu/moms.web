// API Configuration
const API_BASE_URL = (function() {
  if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
    return `${window.location.protocol}//${window.location.host}/api`;
  }
  return 'http://localhost:5000/api';
})();
const TOKEN_KEY = 'authToken';

// Ensure auth methods are available globally for inline scripts
window.login = async function(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem(TOKEN_KEY, data.token);
      console.log('Login successful');
      return data;
    }

    alert('Login failed: ' + (data.message || 'Unknown error'));
    return null;
  } catch (error) {
    console.error('Login error:', error);
    alert('Login error: ' + (error.message || 'Network or server issue.'));
    return null;
  }
};

window.register = async function(firstName, lastName, email, password, passwordConfirm) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, passwordConfirm }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem(TOKEN_KEY, data.token);
      console.log('Registration successful');
      return data;
    }

    alert('Registration failed: ' + (data.message || 'Unknown error'));
    return null;
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration error: ' + (error.message || 'Network or server issue.'));
    return null;
  }
};

// ============================================
// PRODUCT FUNCTIONS
// ============================================

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  console.log('Logged out');
}

function isLoggedIn() {
  return localStorage.getItem(TOKEN_KEY) !== null;
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// ============================================
// PRODUCT FUNCTIONS
// ============================================

async function getAllProducts(category = null, sortBy = null, search = null, page = 1, limit = 10) {
  try {
    let url = `${API_BASE_URL}/products?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    if (search) url += `&search=${search}`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}

async function getProductById(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    const data = await response.json();
    if (data.success) {
      return data.product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    const data = await response.json();
    if (data.success) {
      return data.categories;
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getProductsByCategory(category) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return null;
  }
}

// ============================================
// CART FUNCTIONS
// ============================================

async function getCart() {
  try {
    const token = getToken();
    if (!token) {
      console.log('User not logged in');
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (data.success) {
      return data.cart;
    }
    return null;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

async function addToCart(productId, quantity) {
  try {
    const token = getToken();
    if (!token) {
      alert('Please log in first');
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();
    if (data.success) {
      console.log('Added to cart:', data.message);
      alert('Product added to cart!');
      return data.cart;
    } else {
      alert('Error: ' + data.message);
      return null;
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
}

async function updateCartItem(productId, quantity) {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();
    if (data.success) {
      return data.cart;
    }
    return null;
  } catch (error) {
    console.error('Error updating cart:', error);
    return null;
  }
}

async function removeFromCart(productId) {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (data.success) {
      console.log('Removed from cart');
      return data.cart;
    }
    return null;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return null;
  }
}

async function clearCart() {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (data.success) {
      console.log('Cart cleared');
      return data.cart;
    }
    return null;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return null;
  }
}

async function applyDiscount(discountCode, discountAmount) {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/cart/discount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ discountCode, discountAmount }),
    });

    const data = await response.json();
    if (data.success) {
      return data.cart;
    }
    return null;
  } catch (error) {
    console.error('Error applying discount:', error);
    return null;
  }
}

async function applyShipping(shippingCost) {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/cart/shipping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shippingCost }),
    });

    const data = await response.json();
    if (data.success) {
      return data.cart;
    }
    return null;
  } catch (error) {
    console.error('Error applying shipping:', error);
    return null;
  }
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

async function displayProducts(containerId, category = null) {
  const data = await getAllProducts(category);
  if (!data || !data.products) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  data.products.forEach(product => {
    const price = product.salePrice || product.price;
    const html = `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-image"/>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description.substring(0, 100)}...</p>
        <div class="product-price">
          <span>$${price.toFixed(2)}</span>
        </div>
        <button onclick="addToCart('${product._id}', 1)" class="add-to-cart-btn">
          Add to Cart
        </button>
      </div>
    `;
    container.innerHTML += html;
  });
}

async function displayCart(containerId) {
  const cart = await getCart();
  if (!cart) {
    document.getElementById(containerId).innerHTML = '<p>Please log in to view cart</p>';
    return;
  }

  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (cart.items.length === 0) {
    container.innerHTML = '<p>Cart is empty</p>';
    return;
  }

  let html = '<table class="cart-table"><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th>Action</th></tr>';

  cart.items.forEach(item => {
    const itemTotal = item.price * item.quantity;
    html += `
      <tr>
        <td>${item.product.name || 'Product'}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td><input type="number" value="${item.quantity}" onchange="updateCartItem('${item.product._id}', this.value)"/></td>
        <td>$${itemTotal.toFixed(2)}</td>
        <td><button onclick="removeFromCart('${item.product._id}')">Remove</button></td>
      </tr>
    `;
  });

  html += '</table>';
  html += `
    <div class="cart-summary">
      <p>Subtotal: $${cart.subtotal.toFixed(2)}</p>
      <p>Tax (10%): $${cart.tax.toFixed(2)}</p>
      <p>Shipping: $${cart.shippingCost.toFixed(2)}</p>
      <p>Discount: -$${cart.discountAmount.toFixed(2)}</p>
      <h3>Total: $${cart.total.toFixed(2)}</h3>
      <button onclick="clearCart()" class="clear-cart-btn">Clear Cart</button>
      <button onclick="checkout()" class="checkout-btn">Checkout</button>
    </div>
  `;

  container.innerHTML = html;
}

function checkout() {
  alert('Proceeding to checkout...');
  // Will be implemented in next sections
}
