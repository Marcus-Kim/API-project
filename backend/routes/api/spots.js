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
    group: ['Spot.id', 'Reviews.stars', 'SpotImages.url']
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
    group: ["Spot.id"]
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
    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

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

  const bookings = await 
})




module.exports = router;
