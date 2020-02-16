const express = require('express');
const path = require('path');
const redis = require('redis');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const passport = require('passport');
const helmet = require('helmet');
const flash = require('connect-flash');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const logger = require('./lib/logger');
const authentication = require('./routes/authentication/index');
const indexRouter = require('./routes/index');
const digitalRouter = require('./routes/digital');	
const helperpath = require('./views/helpers/index.js');

const app = express();


/**
 * For Security Purpose using Helmet
 */
app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());
app.use(helmet.xssFilter());


/**
 * The Strict-Transport-Security HTTP header tells browsers to stick with HTTPS and never visit.
 * the insecure HTTP version.
 */
const sixtyDaysInSeconds = 5184000;
app.use(helmet.hsts({
  maxAge: sixtyDaysInSeconds,
}));

/**
 * view engine setup
 */
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '/views/layouts/'),
  partialsDir: path.join(__dirname, '/views/partials/'),
  helpers: helperpath,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/**
 *logger setup
 */
logger.init();
app.use(morgan('dev'));

/**
 * Redis Configuration
 */
app.use(session({
  secret: 'qwertyuiopasdfghjklzxcvbnm',
  key: 'sid',
  cookie: {
    secure: false,
    // maxAge: config.sessionTimeoutTime,
  },
  rolling: true,
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({
    client: redis.createClient(process.env.REDIS_URL),
  }),
}));

/**
 * Configuring Passport
 */
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});
app.use('/', indexRouter);	
app.use('/authentication', authentication);
app.use('/digital',digitalRouter);
app.get('/*', (req, res) => {
  res.redirect('/');
});

/**
 * catch 404 and forwarding to error handler
 */
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * error handlers
 * development error handler,will print stacktrace
 */
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

/**
 * production error handler,no stacktraces leaked to user
 */
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


module.exports = app;
