const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const globalErrorHandler = require('./controllers/error.controller');
const morganMiddleware = require('./config/morgan');
const mainRouter = require('./routes/index');

global.__basedir = __dirname;

const app = express();

app.use(morganMiddleware);

app.use(cors());

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(
  express.json({
    limit: '15kb',
  })
);

app.get('/*',function(req,res,next){
  res.header('Referrer-Policy', 'unsafe-url');
  res.header('Access-Control-Allow-Origin', '*')
  next();
});

app.use(xss());

app.use(hpp());

app.use(mainRouter);

app.use(globalErrorHandler);

module.exports = app;
