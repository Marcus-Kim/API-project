const express = require('express')
/*
  ^^^ Used to import the express library into this file.
  In this case, we are using it to initiate?? instance?? a router
*/

const { check } = require('express-validator'); // from express-validator
const { handleValidationErrors } = require('../../utils/validation'); // You made this

const { setTokenCookie, requireAuth } = require('../../utils/auth');
// Set token cookie is coming from auth.js in (../utils)
const { User } = require('../../db/models');
// We are importing the User model in order to access the User.signup() declared in user. Thats it.
const router = express.Router();

/*
For validateSignup:
  - Why are these functions inside of an array?
  - Is it necessary to have them in an array?

  - Do we have them in this format for reusability? Plugging in to different route methods?
  - Are these functions being invoked upon delcaration or is it waiting until the entire array is being passed in as middleware
  - Do they invoke in order, same time, or is it random
*/

const validateSignup = [ //? Is this another error handling 'module??'
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors // how does this work being passed in as the last element
];

// Sign up
router.post(
  '/',
  validateSignup, //* here we are passing in the array of error-handling middleware
  async (req, res) => { // been seeing lots of async
    const { email, password, username, firstName, lastName } = req.body; // Taking the user input and storing them into variables
    // I think order of email, password, and username matters depending on how req.body is formatted

    // add the error handler for if email exists
    if (await User.findOne({ where: { email: email } })) {
      res.status(403)
      return res.json({
        message: "User already exists",
        statusCode: res.statusCode,
        errors: {
          email: "User with that email already exists"
        }
      })
    }

    // add the error handler for if username already exists
    if (await User.findOne({ where: { username: username } })) {
      res.status(403)
      return res.json({
        message: "User already exists",
        statusCode: 403,
        errors: {
          username: "User with that username already exists"
        }
      })
    }

    const user = await User.signup({ email, username, password, firstName, lastName }); // The creation of a new user using the input. Will successfully create a new user if the input data given is valid.

    await setTokenCookie(res, user); // Using the created user's data, set a token cookie (figure out how a token cookie works EXACTLY)

    return res.json({ // Custom response object
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      token: ""
    });
  }
);

module.exports = router;
