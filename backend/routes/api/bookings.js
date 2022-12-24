const express = require('express');
const { Booking, Spot, SpotImage, Review, User, sequelize } = require('../../db/models');
const user = require('../../db/models/user');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();



//TODO     Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res, next) => {
  const userId = req.user.id;

  const currentUserBookings = await Booking.findAll({
    where: {
      userId: userId
    }
  });
//                              This Promise.all is waiting for all promises to finish
  const modifiedCurrentUserBookings = await Promise.all(currentUserBookings.map(async booking => {
    const spotId = booking.spotId;
    const spotWithPreview = await Spot.findOne({
      where: {
        id: spotId
      },
      include: [
        {
          model: SpotImage,
          as: "SpotImages",
          attributes: []
        }
      ],
      attributes: {
        include: [[sequelize.col("SpotImages.url"), "previewImage"]],
        exclude: ['description', 'createdAt', 'updatedAt']
      }
    });
    return {
      ...booking.toJSON(),
      Spot: spotWithPreview
    };
  }));

  if (!currentUserBookings) {
    res.status(404);
    return res.json({
      message: "User has no bookings",
      statusCode: res.statusCode
    })
  }

  return res.json({
    Bookings: modifiedCurrentUserBookings
  })
})



module.exports = router;
