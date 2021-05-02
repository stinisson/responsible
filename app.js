const mongodb = require('mongodb');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

// MongoDB setup
const MongoClient = mongodb.MongoClient;
const dbURL = "mongodb://localhost";

var indexRouter = require('./routes/index');
var mapRouter = require('./routes/map');
var usersRouter = require('./routes/users');
//var usersRouter = require('./routes/temp');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/map', mapRouter);
app.use('/users', usersRouter);
//app.use('/getTemp', tempRouter);


MongoClient.connect(dbURL, { useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;

  else {
    const db = client.db('responsible');
    const tempReading = db.collection('tempReading');
    tempReading.find({}).toArray( (err, tempData) => {
      if (err) throw err;
      else {
        console.log("\n\t\t\t\t\tTEMPREADING")
        tempData.forEach(element => {
          console.log(element);
        });
      }
      client.close();
      //res.json( {result: tempData} );
    });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
