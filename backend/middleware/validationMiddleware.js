// Input validation middleware

const validator = require('validator');

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

const validatePhone = (phone) => {
  return validator.isMobilePhone(phone);
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
};
