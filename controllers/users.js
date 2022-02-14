require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const { secretKey } = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const {
    name,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name,
    }))
    .then((user) => res.send({ user: user.toJSON() }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      runValidators: true,
      new: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Данные неполные или заполнены некорректно'));
      } if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        secretKey,
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .status(200)
        .send({ user });
    })
    .catch(() => next(new UnauthorizedError('Не получилось залогиниться. Попробуйте снова.')));
};

module.exports.logout = (req, res) => res
  .clearCookie('jwt')
  .status(200)
  .send({ message: 'Successful logout' });
