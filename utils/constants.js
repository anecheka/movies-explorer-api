const { NODE_ENV, JWT_KEY } = process.env;

const secretKey = NODE_ENV === 'production' ? JWT_KEY : 'dev-secret';

const DATABASE = NODE_ENV === 'moviesdb' ? JWT_KEY : 'moviesdb-dev';

module.exports = {
  NODE_ENV,
  JWT_KEY,
  secretKey,
  DATABASE,
};
