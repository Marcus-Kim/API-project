const router = require('express').Router();
const sessionRouter = require('./session');
const usersRouter = require('./users');
const spotsRouter = require('./spots')
const bookingsRouter = require('./bookings')
const reviewsRouter = require('./reviews')
const reviewImagesRouter = require('./review-images.js')
const spotImagesRouter = require('./spot-images.js')
const { restoreUser } = require('../../utils/auth.js');


router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/bookings', bookingsRouter);

router.use('/reviews', reviewsRouter)

router.use('/review-images', reviewImagesRouter);

router.use('/spot-images', spotImagesRouter)

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
})

module.exports = router;
