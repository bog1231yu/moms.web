const ADMIN_CODE_KEY = 'adminBoxCode';
const adminCodeInput = document.getElementById('admin-code');
const loadButton = document.getElementById('load-boxes');
const saveButton = document.getElementById('save-boxes');
const adminForm = document.getElementById('admin-form');
const adminActions = document.getElementById('admin-actions');
const adminMessage = document.getElementById('admin-message');

adminCodeInput.value = localStorage.getItem(ADMIN_CODE_KEY) || '';

function setAdminMessage(message) {
  adminMessage.textContent = message;
}

function apiBase() {
  return `${window.location.protocol}//${window.location.host}/api`;
}

function boxCard(box, index) {
  const boxNumber = index + 1;
  const imageValue = box.image || '';
  const imagePreview = imageValue
    ? `<img class="admin-image-preview" src="${imageValue}" alt="box${boxNumber} preview" />`
    : '<div class="admin-image-placeholder">No picture</div>';

  return `
    <section class="admin-box-card" data-index="${index}" data-id="${box._id || `box-${boxNumber}`}">
      <div class="admin-box-title">
        <h2>box${boxNumber}</h2>
        <span>${box.sku || `BOX-${String(boxNumber).padStart(3, '0')}`}</span>
      </div>
      ${imagePreview}
      <label>
        Price
        <input class="auth-input admin-price" type="number" min="0" step="0.01" value="${Number(box.price || 0).toFixed(2)}" />
      </label>
      <label>
        Picture URL
        <input class="auth-input admin-image" type="url" placeholder="https://..." value="${imageValue}" />
      </label>
      <label>
        Description
        <textarea class="auth-input admin-description" rows="4" placeholder="Describe this box">${box.description || ''}</textarea>
      </label>
    </section>
  `;
}

function renderBoxes(boxes) {
  adminForm.innerHTML = boxes.map(boxCard).join('');
  adminForm.style.display = 'grid';
  adminActions.style.display = 'flex';

  adminForm.querySelectorAll('.admin-image').forEach(input => {
    input.addEventListener('input', () => {
      const card = input.closest('.admin-box-card');
      const oldPreview = card.querySelector('.admin-image-preview, .admin-image-placeholder');
      const value = input.value.trim();
      const replacement = document.createElement(value ? 'img' : 'div');
      if (value) {
        replacement.className = 'admin-image-preview';
        replacement.src = value;
        replacement.alt = `${card.querySelector('h2').textContent} preview`;
      } else {
        replacement.className = 'admin-image-placeholder';
        replacement.textContent = 'No picture';
      }
      oldPreview.replaceWith(replacement);
    });
  });
}

async function loadBoxes() {
  const code = adminCodeInput.value.trim();
  localStorage.setItem(ADMIN_CODE_KEY, code);
  setAdminMessage('Loading boxes...');

  const response = await fetch(`${apiBase()}/admin/boxes`);
  const data = await response.json();
  if (!data.success) {
    setAdminMessage(data.message || 'Could not load boxes.');
    return;
  }

  renderBoxes(data.boxes);
  setAdminMessage('Boxes loaded. Make changes, then save.');
}

function collectBoxes() {
  return Array.from(adminForm.querySelectorAll('.admin-box-card')).map((card, index) => {
    const boxNumber = index + 1;
    return {
      _id: card.dataset.id || `box-${boxNumber}`,
      name: `box${boxNumber}`,
      sku: `BOX-${String(boxNumber).padStart(3, '0')}`,
      price: Number(card.querySelector('.admin-price').value || 0),
      image: card.querySelector('.admin-image').value.trim(),
      description: card.querySelector('.admin-description').value.trim(),
      stock: 100,
      isActive: true,
    };
  });
}

async function saveBoxes() {
  const code = adminCodeInput.value.trim();
  if (!code) {
    setAdminMessage('Enter the admin code before saving.');
    return;
  }

  localStorage.setItem(ADMIN_CODE_KEY, code);
  setAdminMessage('Saving boxes...');

  const response = await fetch(`${apiBase()}/admin/boxes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-code': code,
    },
    body: JSON.stringify({ boxes: collectBoxes() }),
  });
  const data = await response.json();

  if (data.success) {
    renderBoxes(data.boxes);
    setAdminMessage('Saved. The order page and home menu now use these box details.');
  } else {
    setAdminMessage(data.message || 'Save failed.');
  }
}

loadButton.addEventListener('click', loadBoxes);
saveButton.addEventListener('click', saveBoxes);

if (adminCodeInput.value) {
  loadBoxes();
}