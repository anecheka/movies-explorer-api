const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, updateUser, logout, getUserById, doesUserExist,
} = require('../controllers/users');

router.get('/me', getUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}),
doesUserExist, getUserById);

router.get('/me/logout', logout);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}),
updateUser);

module.exports = router;
