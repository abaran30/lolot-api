const expect = require('chai').expect;

const ErrorHandlerService = require('../utility-services/error-handler.service');

describe('\"Error Handler\" utility service', () => {
  it('should handle the creation and throwing of an error', () => {
    try {
      const errorHandlerService = new ErrorHandlerService();
      errorHandlerService.handleError(500, 'Internal server error from test');
    } catch (error) {
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal('Internal server error from test');
    }
  });
});
