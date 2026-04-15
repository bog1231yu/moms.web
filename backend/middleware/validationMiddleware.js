// Input validation middleware

const validator = require('validator');

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

const validatePhone = (phone) => {
  return validator.isMobilePhone(phone);
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
};
