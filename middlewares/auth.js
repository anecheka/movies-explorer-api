require('dotenv').config({ path: './.env' });
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { secretKey } = require('../utils/constants');

module.exports = (req, res, next) => {
  const jwtCookie = req.cookies.jwt;

  if (!jwtCookie) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(
      jwtCookie,
      secretKey,
    );
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
