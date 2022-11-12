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
const cors = require('cors');

const app = express();

app.use(cookieParser());

mongoose.connect(DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(requestLogger);

app.use(limiter);

const allowedCors = [
  'https://cinematheque.nomorepartiesxyz.ru',
  'http://cinematheque.nomorepartiesxyz.ru',
  'localhost:3000',
  'http://localhost:3000',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

// app.use((req, res, next) => {
//   const { origin } = req.headers;
//   const { method } = req;
//   const requestHeaders = req.headers['access-control-request-headers'];

//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//     res.header('Access-Control-Allow-Credentials', true);
//   }

//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     return res.end();
//   }

//   next();
// });

app.use(
  cors({
    origin: allowedCors,
    methods: DEFAULT_ALLOWED_METHODS,
    credentials: true,
  })
)

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
