const { NODE_ENV, JWT_KEY } = process.env;

const secretKey = NODE_ENV === 'production' ? JWT_KEY : 'dev-secret';

const DATABASE = NODE_ENV === 'production' ? process.env.DATABASE_PROD_URL : process.env.DATABASE_LOCAL_URL;

module.exports = {
  NODE_ENV,
  JWT_KEY,
  secretKey,
  DATABASE,
};
