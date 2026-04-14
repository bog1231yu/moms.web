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
})();