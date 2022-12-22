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
const { Spot, Review, sequelize } = require('../../db/models')
const db = require('../../db/models')
const router = express.Router(); // (2)

// Get all Spots
router.get('/', async (req, res, next) => {

  // let { page, size } = req.query;

  // page = parseInt(page);
  // size = parseInt(size);

  // if (!page) page = 1;
  // if (!size) size = 20;

  // let pagination = {};

  // if ((page > 0) && (size > 0)) {
  //   pagination.limit = size;
  //   pagination.offset = size * (page - 1);
  // }

  const spots = await Spot.findAll({
    include: [
      {
        model: Review,
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
    ],
    group: ['Spot.id']
  })

  // Find average of the stars of a particular spot

  res.json({
    Spots: spots
  })
})

module.exports = router;
