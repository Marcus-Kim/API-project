const { validationResult } = require('express-validator') // Giving us access to validationResult and .isEmpty()
// Slow down; ^^^ Not 100% sure what this does

const handleValidationErrors = (req, res, next) => {  // Simply an error handler specific for validations
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()                   // <<< learn more about this syntax, could be good for readability
      .map((error) => `${error.msg}`);

    const err = Error('Bad request')
    err.errors = errors; // The only thing hard to see here so far is what `errors` looks like
    err.status = 400;
    err.title = 'Bad request.';
    next(err);
  }
  next();
}

module.exports = {
  handleValidationErrors
};
