const { NODE_ENV, JWT_KEY, PORT = 3001 } = process.env;

const secretKey = NODE_ENV === 'production' ? JWT_KEY : 'dev-secret';

const DATABASE = NODE_ENV === 'development' ? process.env.DATABASE_LOCAL_URL : process.env.DATABASE_PROD_URL;

module.exports = {
  NODE_ENV,
  JWT_KEY,
  secretKey,
  DATABASE,
  PORT,
};
