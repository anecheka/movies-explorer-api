require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { limiter } = require('./middlewares/rate-limiter');
const router = require('./routes/index');
const errorHandler = require('./errors/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DATABASE, PORT } = require('./utils/constants');

const app = express();

app.use(cookieParser());

mongoose.connect(DATABASE);

app.use(express.json());

app.use(requestLogger);

app.use(limiter);

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

if (process.env.NODE_ENV === 'development') {
  console.log('Код запущен в режиме разработки');
}

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
