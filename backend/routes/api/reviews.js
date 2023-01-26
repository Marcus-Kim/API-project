
const express = require('express');
const { check } = require('express-validator');
const { Spot, Review, SpotImage, User, Booking, sequelize } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

// 



module.exports = router
