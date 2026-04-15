(() => {
  const ignoredMessages = [
    'Did not receive CSRF token',
    "Cannot read properties of undefined (reading 'f_sku_values_3dr')",
  ];

  window.addEventListener('unhandledrejection', event => {
    const message = event.reason && (event.reason.message || String(event.reason));
    if (ignoredMessages.some(text => message && message.includes(text))) {
      event.preventDefault();
    }
  });

  async function getBoxes() {
    try {
      const response = await fetch('/api/admin/boxes');
      const data = await response.json();
      return data && data.success && Array.isArray(data.boxes) ? data.boxes : [];
    } catch (error) {
      return [];
    }
  }

  async function simplifyMenuBoxes() {
    const path = window.location.pathname;
    const isMainPage = path === '/' || path.endsWith('/index.html');
    const isOrderPage = path.endsWith('/order.html');
    if (!isMainPage && !isOrderPage) return;

    const limit = isOrderPage ? 8 : 4;
    const boxes = await getBoxes();
    const tabs = document.querySelector('.w-tabs');
    if (!tabs) return;

    const tabMenu = tabs.querySelector('.tab-menu-round');
    if (tabMenu) tabMenu.remove();

    const items = Array.from(tabs.querySelectorAll('.menu-item'));
    const selectedItems = items.slice(0, limit);
    const firstPane = tabs.querySelector('.w-tab-pane');
    const firstList = firstPane && firstPane.querySelector('.w-dyn-items');
    if (!firstPane || !firstList) return;

    tabs.querySelectorAll('.w-tab-pane').forEach((pane, index) => {
      if (index === 0) {
        pane.classList.add('w--tab-active');
        pane.style.display = 'block';
      } else {
        pane.remove();
      }
    });

    firstList.innerHTML = '';
    selectedItems.forEach((item, index) => {
      const box = boxes[index] || {};
      const imageWrap = item.querySelector('.food-image-square');
      const image = item.querySelector('.food-image');
      if (imageWrap && image && box.image) {
        image.src = box.image;
        image.alt = `box${index + 1}`;
        imageWrap.removeAttribute('href');
      } else if (imageWrap) {
        imageWrap.remove();
      }
      const paragraph = item.querySelector('.paragraph');
      if (paragraph && box.description) {
        paragraph.textContent = box.description;
      } else if (paragraph) {
        paragraph.remove();
      }
      item.querySelectorAll('.quantity').forEach(element => {
        element.type = 'hidden';
      });
      const title = item.querySelector('h6');
      if (title) title.textContent = `box${index + 1}`;
      const price = item.querySelector('.price');
      if (price) price.textContent = `$${Number(box.price || 0).toFixed(2)} USD`;
      item.querySelectorAll('a[href]').forEach(link => link.removeAttribute('href'));
      firstList.appendChild(item);
    });

    firstPane.querySelectorAll('.pagination').forEach(element => element.remove());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', simplifyMenuBoxes);
  } else {
    simplifyMenuBoxes();
  }
})();