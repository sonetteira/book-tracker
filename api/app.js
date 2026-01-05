var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)
.then((result) => {
    console.log('connected to Mongodb');
}).catch((err) => {
    console.error(err);
});

var indexRouter = require('./routes/index');
var searchBookRouter = require('./routes/searchExternalBooks');
var yearsRouter = require('./routes/getYears');
var booksRouter = require('./routes/allBooks');
var yearlyBookRouter = require('./routes/yearlyBooks');
var getBookRouter = require('./routes/getBook');
var searchMyBooksRouter = require('./routes/searchBooks');
var addBookRouter = require('./routes/addBook');
var updateBookRouter = require('./routes/updateBook');
var addRereadRouter = require('./routes/addReread');
var updateRereadRouter = require('./routes/updateReread');
var deleteRereadRouter = require('./routes/deleteReread');
var yearlyRereadsRouter = require('./routes/yearlyRereads');

// reports
var yearlyReportRouter = require('./routes/yearlyReport');

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
app.use('/getYears', yearsRouter);
app.use('/searchBooks', searchBookRouter);
app.use('/books', booksRouter);
app.use('/yearBooks', yearlyBookRouter);
app.use('/getBook', getBookRouter);
app.use('/searchMyBooks', searchMyBooksRouter);
app.use('/addBook', addBookRouter);
app.use('/updateBook', updateBookRouter);
app.use('/addReread', addRereadRouter);
app.use('/updateReread', updateRereadRouter);
app.use('/deleteReread', deleteRereadRouter);
app.use('/yearRereads', yearlyRereadsRouter);


// reports
app.use('/reports/yearly', yearlyReportRouter);

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

server = app.listen(3001, () => {
  console.log(`Backend server is running on port ${app.get('port')}!`);
});

module.exports = app;
