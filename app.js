require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { limiter } = require('./middlewares/rate-limiter');
const router = require('./routes/index');
const NotFoundError = require('./errors/not-found-err');
const errorHandler = require('./errors/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DATABASE } = require('./utils/constants');

const { PORT = 3001 } = process.env;

const app = express();

app.use(cookieParser());

mongoose.connect(`mongodb://localhost:27017/${DATABASE}`);

app.use(express.json());

app.use(requestLogger);

app.use(limiter);

app.use('/', router);

app.use((req, res, next) => {
  next(new NotFoundError('Запрошенный роут не существует'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
