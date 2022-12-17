const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Log in
router.post(
  '/',
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });

    if (!user) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = ['The provided credentials were invalid.'];
      return next(err);
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
  const { user } = req; // Need clarification on how we are pulling from req (destructure?)
  if (user) { // If the user exists
    return res.json({
      user: user.toSafeObject() // ?? I don't know what toSafeObject does. Go back and walkthrough
    });
  } else {
    return res.json({ user: null });
  }
});

module.exports = router;
