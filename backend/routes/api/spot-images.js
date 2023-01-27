const express = require('express');
const { check } = require('express-validator');
const { Spot, Review, SpotImage, User, Booking, sequelize, ReviewImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//TODO Delete a Spot Image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const imageId = req.params.imageId;
  const image = await SpotImage.findByPk(imageId);

  if (!image) {
    res.status(404);
    res.json({
      "message": "Spot Image couldn't be found",
      "statusCode": res.statusCode
    })
  }

  const spot = await Spot.findOne({
    where: {
      id: image.spotId
    }
  })

  // Spot must belong to current user
  if (spot.ownerId !== req.user.id) {
    res.status(403);
    res.json({
      message: "Spot must belong to current user",
      statusCode: res.statusCode
    })
  }

  await image.destroy();

  return res.json({
    "message": "Successfully deleted",
    "statusCode": 200
  })
})



module.exports = router
