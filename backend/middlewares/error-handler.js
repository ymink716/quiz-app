const CustomError = require("../common/errors/custom-error");
const { InternalServerError } = require('../common/errors/error-type').ErrorType;

// TODO: logging 
const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    const { statusCode, type, message } = err;
    return res.status(statusCode).json({ type, message }); 
  }
   
  console.error(err);
  return res.status(500).json({ message: err.message });
};

module.exports = errorHandler;