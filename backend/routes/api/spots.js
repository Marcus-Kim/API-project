/*
TODO 1. Import statements at the top
TODO 2. Initiate Router
TODO 3. Routes
TODO 4. Export the router
-----------------------
- Import this router in index.js as spotsRouter
  ?? Do the order of routers matter
*/

const express = require('express'); // (1)
const { check } = require('express-validator');
const { Spot, Review, SpotImage, User, Booking, sequelize, ReviewImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router(); // (2)

// Get all Spots
router.get('/', async (req, res, next) => {

  const spots = await Spot.findAll({
    include: [
      {
        model: Review,
        attributes: []
      },
      {
        model: SpotImage,
        as: 'SpotImages',
        attributes: []
      }
    ],
    order: [
      ['id', 'ASC']
    ],
    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
      [sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("Reviews.stars")), 2), "avgRating"],
      [sequelize.col("SpotImages.url"), "previewImage"]
    ],
    group: ['Spot.id', 'SpotImages.url']
  })

  res.json({
    Spots: spots
  })
})

// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
  const id = req.user.id;
  // const userSpots = await Spot.findAll({
  //   where: {
  //     ownerId: id
  //   },
  //   include: [
  //     {
  //       model: Review,
  //       attributes: []
  //     },
  //     {
  //       model: SpotImage,
  //       as: 'SpotImages',
  //       attributes: []
  //     }
  //   ],
  //   order: [
  //     ['id', 'ASC']
  //   ],
  //   attributes: [
  //     "id",
  //     "ownerId",
  //     "address",
  //     "city",
  //     "state",
  //     "country",
  //     "lat",
  //     "lng",
  //     "name",
  //     "description",
  //     "price",
  //     "createdAt",
  //     "updatedAt",
  //     [sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("Reviews.stars")), 2), "avgRating"],
  //     [sequelize.col("SpotImages.url"), "previewImage"]
  //   ],
  //   group: ['Spot.id', 'Reviews.stars', 'SpotImages.url']
  // });

  const userSpots = await Spot.findAll({
    where: {
      ownerId: id
    },
    order: [['id', 'ASC']]
  })

  // Add the average rating to each spot
    // Loop over each spot in the array
      // for each spot, get the sum of all the ratings and the number of ratings
      // Add the property to the spot (turn into a pojo)
  let payload = [];
  for (let spot of userSpots) {
    const numberOfRatings = await Review.count({ where: { spotId: spot.id }})//?-----NUMBER OF REVIEWS
    const sumOfRatings = await Review.sum('stars', {where: { spotId: spot.id }})//?--TOTAL STARS FROM ALL RELEVANT REVIEWS
    const avgRating = sumOfRatings/numberOfRatings//?--------------------------------FORMULA FOR AVERAGE
    const previewImage = await SpotImage.findOne({where: {spotId: spot.id}})//?      SPOT IMAGE
    let pojoSpot = spot.toJSON()//?--------------------------------------------------TURN THE SPOT INTO A POJO
    if (numberOfRatings > 0) {
      pojoSpot.avgRating = avgRating;//?                                               ADD THE RATING ONTO THE POJO
    } else {
      pojoSpot.avgRating = "No ratings yet"
    }
    if (previewImage) {
      pojoSpot.previewImage = previewImage.url;//?-------------------------------------ADD THE IMAGE URL ONTO POJO
    } else {
      pojoSpot.previewImage = "No preview images available"
    }
    payload.push(pojoSpot);//?-------------------------------------------------------ADD THE NEWLY FORMATTED POJO INTO PAYLOAD
  }

  res.json({//?----------------------------------------------------------------------YOU CAN FORMAT THE RESPONSE HOWEVER YOU WANT LIKE THIS
    Spots: payload
  });
})

//TODO Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
  const id = req.params.spotId;
  const spot = await Spot.findByPk(id)
  const numReviews = await Review.count({
    where: {
      spotId: id
    }
  })

  // If there is no spot with specified id
  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
      statusCode: 404
    })
  }

  const allReviews = await Review.findAll({
    where: {
      spotId: id
    }
  })

  let starSum = 0; // Sum of stars

  for (let review of allReviews) {
    starSum += review.stars
  }

  let averageStarRating = starSum / numReviews

  // Spot images
  const spotImages = await SpotImage.findAll({
    where: {
      spotId: id
    },
    attributes: ['id', 'url', 'preview']
  })

  // Owner
  const owner = await User.findByPk(spot.ownerId, {
    attributes: ['id', 'firstName', 'lastName']
  })


  return res.json({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    numReviews: numReviews,
    avgStarRating: averageStarRating,
    spotImages: spotImages,
    owner: owner
  })
})

const validateSpots = [
  check('city')
    .notEmpty()
    .withMessage("City is required"),
  check('address')
    .notEmpty({ checkFalsy: true })
    .withMessage("address should not be empty"),
  check('state')
    .notEmpty()
    .withMessage("State is required"),
  check('country')
    .notEmpty()
    .withMessage("Country is required"),
  check('lat')
    .notEmpty()
    .isNumeric()
    .withMessage("Latitude is not valid"),
  check('lng')
    .notEmpty()
    .isNumeric()
    .withMessage("Longitude is not valid"),
  check('name')
    .notEmpty()
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check('description')
    .notEmpty()
    .withMessage("Description is required"),
  check('price')
    .notEmpty()
    .withMessage("Price per day is required"),

  handleValidationErrors,
]

//TODO Create a spot
router.post('/', [requireAuth, validateSpots], async (req, res, next) => {
  const currentUserId = req.user.id
  const { address, city, state, country, lat, lng, name, description, price } = req.body

  const newSpot = await Spot.create({
    ownerId: currentUserId,
    address: address,
    city: city,
    state: state,
    country: country,
    lat: lat,
    lng: lng,
    name: name,
    description: description,
    price: price
  })

  res.json(newSpot)
})

//TODO Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const id = req.params.spotId;
  const { url, preview } = req.body;

  const spot = await Spot.findOne({
    where: {
      id: id
    }
  });

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
      statusCode: res.statusCode
    })
  }

  let newImage;
  if (spot.ownerId === req.user.id) {
    newImage = await SpotImage.create({
      spotId: id,
      url: url,
      preview: preview
    });
  } else {
    res.status(404)
    return res.json({
      message: 'Spot must belong to the current user to add an image',
      statusCode: res.statusCode
    })
  }

  return res.json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview
  });
})

//TODO Edit a Spot
router.put('/:spotId', [requireAuth, validateSpots], async (req, res, next) => {
  const id = req.params.spotId;

  const spot = await Spot.findOne({
    where: {
      id: id
    }
  });

  if (!spot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
      statusCode: res.statusCode
    })
  }

  if (spot.ownerId !== req.user.id) {
    res.status(403);
    return res.json({
      message: "Forbidden",
      statusCode: res.statusCode
    })
  }

  const { address, city, state, country, lat, lng, name, description, price } = req.body

  if (spot) {
    spot.set({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    }
    )
    await spot.save()

    return res.json(spot);
  }

})

router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const id = req.params.spotId;

  const spot = await Spot.findOne({
    where: {
      id: id
    }
  })

  if (!spot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
      statusCode: res.statusCode
    })
  }
  console.log(spot);
  console.log("SPOT-OWNER_ID: ", spot.ownerId);
  console.log("CURRENT USER ID: ", req.user.id);


  if (spot.ownerId !== req.user.id) { // Checking if the current user is the owner of that spot (maybe make a middleware to handle this)
    res.status(403);
    return res.json({
      message: "Forbidden",
      statusCode: res.statusCode
    })
  }

  await spot.destroy({
    cascade: true
  });

  return res.json({
    message: "Successfully deleted",
    statusCode: res.statusCode
  })
})

//TODO Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const spot = await Spot.findOne({ // has to be findOne because the findAll returns an empty array
    where: {
      id: spotId
    }
  })

  if (!spot) {
    res.status(404)
    res.json({
      message: "Spot couldn't be found",
      statusCode: res.statusCode
    })
  }

  // if you are NOT the owner of the spot
  if (spot.ownerId !== userId) {
    const booking = await Booking.findAll({
      where: {
        spotId: spotId
      },
      attributes: ['spotId', 'startDate', 'endDate']
    })
    return res.json({
      Bookings: booking
    });
  }
  // if you ARE the owner of the spot
  if (spot.ownerId === userId) {
    const booking = await Booking.findAll({
      where: {
        spotId: spotId
      },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }
    })

    res.json({
      Bookings: booking
    })
  }
})

//TODO Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const spotId = parseInt(req.params.spotId);
  const spot = await Spot.findOne({
    where: {
      id: spotId
    }
  })
  const { startDate, endDate } = req.body; // These have to be same name as listed in body
  const startDateObject = new Date(startDate);
  const endDateObject = new Date(endDate);

  // Couldn't find a Spot with the specified id
  if (!spot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
      statusCode: res.statusCode
    })
  }
  // if the endDate is on or before startDate
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

  // booking conflict
  const allBookings = await Booking.findAll({ where: { spotId: spotId }});

  allBookings.forEach(booking => {
    const startDateString = booking.startDate.toDateString(); // This is turning the startDate of current booking to check into a string
    const startDateStringDate = new Date(startDateString); // This is turning ^ into a new date
    const startDateTime = startDateStringDate.getTime(); // This is getting the measurable time from the new start date
    const endDateString = booking.endDate.toDateString(); // This is doing the same thing with endDate
    const endDateStringDate = new Date(endDateString);
    const endDateTime = endDateStringDate.getTime(); // Comparable time
    console.log(booking.startDate)
    // if the startDate is equal to an existing startDate
    if (startDateObject.getTime() === startDateTime) { // StartDateObject is the measurable time of the booking we are trying to create --- startDateTime is current comparison from list of bookings
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

  if (req.user.id === spotId) {
    res.status(403)
    res.json({
      message: "Spot cannot belong to the current user",
      statusCode: res.statusCode
    })
  }

  const booking = await Booking.create({
    spotId: spotId,
    userId: req.user.id,
    startDate: startDate,
    endDate: endDate
  })

  res.json({
    id: booking.id,
    spotId: spotId,
    userId: req.user.id,
    startDate: startDate,
    endDate: endDate,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt
  })
})

//TODO Get all reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {
  const spotId = req.params.spotId;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
      statusCode: res.statusCode
    })
  }

  const reviews = await Review.findAll({
    where: {
      spotId: spotId
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

  res.json(reviews)
})

// const validateSpots = [
//   check('city')
//     .notEmpty()
//     .withMessage("City is required"),
//   check('address')
//     .notEmpty({ checkFalsy: true })
//     .withMessage("address should not be empty"),
//   check('state')
//     .notEmpty()
//     .withMessage("State is required"),
//   check('country')
//     .notEmpty()
//     .withMessage("Country is required"),
//   check('lat')
//     .notEmpty()
//     .isNumeric()
//     .withMessage("Latitude is not valid"),
//   check('lng')
//     .notEmpty()
//     .isNumeric()
//     .withMessage("Longitude is not valid"),
//   check('name')
//     .notEmpty()
//     .isLength({ max: 50 })
//     .withMessage("Name must be less than 50 characters"),
//   check('description')
//     .notEmpty()
//     .withMessage("Description is required"),
//   check('price')
//     .notEmpty()
//     .withMessage("Price per day is required"),

//   handleValidationErrors,
// ]

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

//TODO Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReviews, async (req, res, next) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);
  const spotReviews = await Review.findAll({
    where: {
      spotId: spotId
    }
  })

  // Loop over the array of spot reviews
  for (let review of spotReviews) {
    // pull the userId from each review
    const userId = review.userId;
    if (userId === req.user.id) {
      res.status(403);
      return res.json({
        "message": "User already has a review for this spot",
        "statusCode": 403
      })
    }
  }

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
      statusCode: res.statusCode
    })
  }

  const { review, stars } = req.body;
  const newReview = await Review.create({
    review: review,
    stars: stars,
    spotId: spotId,
    userId: req.user.id
  })

  return res.json({
    Review: newReview
  })
})





module.exports = router;
