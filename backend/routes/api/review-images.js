const express = require('express');
const { check } = require('express-validator');
const { Spot, Review, SpotImage, User, Booking, sequelize, ReviewImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//TODO Delete a review Image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const imageId = req.params.imageId;
  const reviewImage = await ReviewImage.findByPk(imageId);
  const review = await Review.findOne({
    where: {
      id: reviewImage.reviewId
    }
  })

  // If no review image found
  if (!reviewImage) {
    res.status(404);
    return res.json({
      "message": "Review Image couldn't be found",
      "statusCode": 404
    })
  }

  // If image doesn't belong to current user
  if (review.userId !== req.user.id) {
    res.status(403);
    res.json({
      message: "Review must belong to current user",
      statusCode: res.statusCode
    })
  }

  await reviewImage.destroy();

  res.json({
    message: "Successfully deleted",
    statusCode: res.statusCode
  })
})




module.exports = router
