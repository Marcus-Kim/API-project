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

//TODO Update and return an existing booking
router.put('/:bookingId', requireAuth, async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const { startDate, endDate } = req.body; // These have to be same name as listed in body
  const startDateObject = new Date(startDate);
  const endDateObject = new Date(endDate);
  const booking = await Booking.findOne({
    where: {
      id: bookingId
    }
  })

  // if the booking with specified id couldn't be found
  if (!booking) {
    res.status(404);
    res.json({
      message: "Booking couldn't be found",
      statusCode: res.statusCode
    })
  }

  // if the endDate comes before the startDate
  if (endDateObject.getTime() <= startDateObject.getTime()) {
    res.status(400)
    return res.json({
      message: "Validation error",
      statusCode: res.statusCode,
      errors: {
        endDate: "endDate cannot be on or before startDate"
      }
    })
  }
  const now = new Date()
  const bookingDate = new Date(booking.endDate.toDateString())
  // can't edit a booking that's past the end date
  if (now.getTime() > bookingDate.getTime()) {
    res.status(403);
    res.json({
      message: "Past bookings can't be modified",
      statusCode: res.statusCode
    })
  }

  // booking conflict
  const allBookings = await Booking.findAll({ where: { id: bookingId }});

  allBookings.forEach(booking => {
    const startDateString = booking.startDate.toDateString();
    const startDateStringDate = new Date(startDateString);
    const startDateTime = startDateStringDate.getTime();
    const endDateString = booking.endDate.toDateString();
    const endDateStringDate = new Date(endDateString);
    const endDateTime = endDateStringDate.getTime();

    // if the startDate is equal to an existing startDate
    if (startDateObject.getTime() === startDateTime) {
      res.status(403)
      res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: res.statusCode,
        errors: {
          startDate: "Start date conflicts with an existing booking"
        }
      })
    }
    // if the startDate is after an existing startDate and before an existing endDate
    if (startDateObject.getTime() > startDateTime && startDateObject.getTime() < endDateTime) {
      res.status(403)
      res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: res.statusCode,
        errors: {
          startDate: "Start date conflicts with an existing booking"
        }
      })
    }
    // if the endDate is equal to another endDate
    if (endDateObject.getTime() === endDateTime) {
      res.status(403)
      res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: res.statusCode,
        errors: {
          endDate: "End date conflicts with an existing booking"
        }
      })
    }
    // if the endDate is between another startDate and endDate
    if (endDateObject.getTime() > startDateTime && endDateObject.getTime() < endDateTime) {
      res.status(403)
      res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: res.statusCode,
        errors: {
          endDate: "End date conflicts with an existing booking"
        }
      })
    }
  })

  // edit the booking
  booking.set({
    startDate: startDate,
    endDate: endDate
  })

  await booking.save();

  res.json(booking)
})

router.delete('/:bookingId', requireAuth, async (req, res, next) => {
  const currentUserId = req.user.id;
  const bookingId = req.params.bookingId;
  const booking = await Booking.findOne({
    where: {
      id: bookingId
    }
  })
  const spotId = booking.spotId
  const spot = await Spot.findOne({
    where: {
      id: spotId
    }
  })

  // Couldn't find a Booking with the specified id
  if (!booking) {
    res.status(404);
    res.json({
      message: "Booking couldn't be found",
      statusCode: res.statusCode
    })
  }

  // Bookings that have been started can't be deleted
  const now = new Date();
  const start = new Date(booking.startDate.toDateString());
  const end = new Date(booking.endDate.toDateString());

  if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) {
    res.status(403);
    res.json({
      message: "Bookings that have been started can't be deleted",
      statusCode: res.statusCode
    })
  }

  // Booking must belong to the current user or the Spot must belong to the current user
  if (booking.userId === currentUserId || spot.userId === currentUserId) {
    await booking.destroy()
    res.status(200)
    res.json({
      message: "Successfully deleted",
      statusCode: res.statusCode
    })
  }
})

module.exports = router;
