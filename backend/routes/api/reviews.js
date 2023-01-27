
const express = require('express');
const { check } = require('express-validator');
const { Spot, Review, SpotImage, User, Booking, sequelize, ReviewImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//TODO Get all reviews of the current user
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

    if (spotImage.url) { // If there is a url (or else it gives null error on PG)
      jsonSpot.previewImage = spotImage.url;
    }
    jsonReview.Spot = jsonSpot;
    payload.push(jsonReview)
  }


  return res.json({
    Reviews: payload
  });
})

//TODO Add an image to a review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const review = await Review.findByPk(reviewId);
  const reviewImages = await ReviewImage.findAll({
    where: {
      reviewId: reviewId
    }
  })

  if (!review) { // if the review can't be found
    res.status(403);
    return res.json({
      message: "Review couldn't be found",
      statusCode: res.statusCode
    })
  }

  if (review.userId !== req.user.id) { // Must belong to current user
    res.status(403);
    res.json({
      message: "Must belong to current user",
      statusCode: res.statusCode
    })
  }


  // if there are already 10 images
  if (reviewImages.length === 10) {
    res.status(403);
    return res.json({
      message: "Maximum number of images for this resource was reached",
      statusCode: res.statusCode
    })
  }

  const newImage = await ReviewImage.create({
    url: req.body.url,
    reviewId: reviewId
  })

  return res.json({
    id: newImage.id,
    url: newImage.url
  });
})

const validateReviews = [
  check('review')
    .notEmpty({checkFalsy: true})
    .withMessage("Review text is required"),
  check('stars')
    .notEmpty({checkFalsy: true})
    .isFloat({min: 1, max: 5})
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
]

//TODO Edit a Review
router.put('/:reviewId', requireAuth, validateReviews, async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const reviewMain = await Review.findByPk(reviewId);
  const { review, stars } = req.body;
  // if review can't be found
  if (!reviewMain) {
    res.status(404);
    return res.json({
      "message": "Review couldn't be found",
      "statusCode": 404
    })
  }

  // Review must belong to the user
  if (reviewMain.userId !== req.user.id) {
    res.status(403);
    res.json({
      message: "You are not the owner of this review",
      statusCode: res.statusCode
    })
  }

  reviewMain.update({
    review: review,
    stars: stars
  })

  res.json(reviewMain);
})

//TODO Delete an Existing Review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const review = await Review.findByPk(reviewId);

  // Spot review couldn't be found
  if (!review) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found",
      statusCode: res.statusCode
    })
  }

  // Review must belong to the current user
  if (review.userId !== req.user.id) {
    res.status(403);
    return res.json({
      message: "Review must belong to the current user",
      statusCode: res.statusCode
    })
  }

  await review.destroy();

  return res.json({
    message: "Successfully deleted",
    statusCode: 200
  })
})

module.exports = router
