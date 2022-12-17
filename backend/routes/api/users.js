const express = require('express')
/*
  ^^^ Used to import the express library into this file.
  In this case, we are using it to initiate?? instance?? a router
*/


const { setTokenCookie, requireAuth } = require('../../utils/auth');
// Set token cookie is coming from auth.js in (../utils)
const { User } = require('../../db/models');
// We are importing the User model in order to access the User.signup() declared in user. Thats it.
const router = express.Router();

// Sign up
router.post(
  '/',
  async (req, res) => { // been seeing lots of async
    const { email, password, username } = req.body; // Taking the user input and storing them into variables
    // I think order of email, password, and username matters depending on how req.body is formatted
    const user = await User.signup({ email, username, password }); // The creation of a new user using the input. Will successfully create a new user if the input data given is valid.

    await setTokenCookie(res, user); // Using the created user's data, set a token cookie (figure out how a token cookie works EXACTLY)

    return res.json({ // Custom response object
      user: user
    });
  }
);

module.exports = router;
