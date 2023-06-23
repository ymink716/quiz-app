const { validationResult } = require('express-validator');

const catchValidationError = (req, res, next) => {
  const errors = validationResult(req);
    
  if (errors.isEmpty()) {
    return next();  
  }
  
  return res.status(400).json({ success: false, errors: errors.array()[0].msg });
}

module.exports = { catchValidationError };