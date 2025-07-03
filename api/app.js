var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require('./routes/testAPI');
var booksRouter = require('./routes/allBooks');
var searchBookRouter = require('./routes/getBook');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3001);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/testAPI', testAPIRouter);
app.use('/books', booksRouter);
app.use('/getBook', searchBookRouter);

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

app.get('/books', async (req, res) => {
  try {
    // Fetch all books from the database
    const books = await Book.find();
    res.json(books); // Respond with the list of books as JSON
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

server = app.listen(3001, () => {
  console.log(`Backend server is running on port ${app.get('port')}!`);
});

module.exports = app;
