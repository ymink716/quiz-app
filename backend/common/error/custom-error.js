class CustomError extends Error {
  constructor(type, statusCode, message) {
    super(message);

    this.type = type;        
    this.statusCode = statusCode;
  }
}

module.exports = CustomError;