class LolotApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.stack = null;
  }
}

class ErrorHandlerService {
  handleError(statusCode, message) {
    throw new LolotApiError(statusCode, message);
  }
}

module.exports = ErrorHandlerService;
