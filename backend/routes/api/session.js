const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ^^^ You made this in ../../utils
const router = express.Router();

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'), // << Syntax of stacked .chain
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

// Log in
router.post( // The route is /api/session/
  '/',
  validateLogin, // << Take note this is how to connect the route to the middleware
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });

    if (!user) {
      // const err = new Error('Login failed');
      // err.status = 401;
      // err.title = 'Login failed';
      // err.errors = ['The provided credentials were invalid.'];
      // return next(err);
      res.status(401);
      return res.json({
        message: "Invalid credentials",
        statusCode: 401
      })
    }

    await setTokenCookie(res, user);

    return res.json({
      user: user
    });
  }
);

// Log out
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

// Restore session user
router.get('/', restoreUser, (req, res) => {
// restoreUser is middleware we made in auth.js.
// auth.js is becoming more and more prominent now, should go back and review what those do
  const { user } = req;
  if (user) { // If the user exists
    return res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
      }//.toSafeObject() // ?? I don't know what toSafeObject does. Go back and walkthrough
    });
  } else {
    return res.json({ user: null });
  }
});

module.exports = router;
