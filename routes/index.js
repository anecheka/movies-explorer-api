const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');

router.use('/', userRouter);
router.use('/movies', movieRouter);

module.exports = router;
