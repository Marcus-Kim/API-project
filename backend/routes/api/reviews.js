
const express = require('express');
const { check } = require('express-validator');
const { Spot, Review, SpotImage, User, Booking, sequelize, ReviewImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

// Get all reviews of the current user
router.get('/current', requireAuth, async (req, res, next) => {
  const userId = req.user.id;

  const reviews = await Review.findAll({
    where: {
      userId: userId
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  })

  // Add related Spot+previewImage to each review
  let payload = [];

  for (let review of reviews) {
    const spot = await Spot.findByPk(review.spotId, {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });
    const spotImage = await SpotImage.findOne({
      where: {
        spotId: spot.id
      }
    })
    const jsonReview = review.toJSON();
    const jsonSpot = spot.toJSON();

    jsonSpot.previewImage = spotImage.url;
    jsonReview.Spot = jsonSpot;
    payload.push(jsonReview)
  }


  res.json({
    Reviews: payload
  });
})





module.exports = router
