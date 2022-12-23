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
const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models')
const db = require('../../db/models');
const user = require('../../db/models/user');
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
        attributes: []
      }
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
      [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
      [sequelize.col("SpotImages.url"), "previewImage"]
    ],
    group: ['Spot.id']
  })

  res.json({
    Spots: spots
  })
})

// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
  const id = req.user.id;
  const userSpots = await Spot.findAll({
    where: {
      ownerId: id
    },
    include: [
      {
        model: Review,
        attributes: []
      },
      {
        model: SpotImage,
        attributes: []
      }
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
      [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
      [sequelize.col("SpotImages.url"), "previewImage"]
    ],
    group: ['Spot.id']
  });

  res.json({
    Spots: userSpots
  });
})

//TODO Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
  const id = req.params.spotId;

  const spot = await Spot.findOne({
    where: {
      id: id
    },
    include: [
      {
        model: Review,
        attributes: []
      },
      {
        model: SpotImage,
        as: "SpotImages",
        attributes: ['id', 'url', 'preview']
      },
      {
        model: User,
        as: "Owner",
        attributes: ['id', 'firstName', 'lastName']
      },
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
      [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
    ],
  });

  if (spot.id == null) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
      statusCode: 404
    })
  }

  const jsonSpot = spot.toJSON();

  jsonSpot.numReviews = await Review.count({
    where: {
      spotId: id
    }
  })

  res.json(jsonSpot);
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

module.exports = router;
