var express = require('express');
var router = express.Router();

/* GET home page. API Documentation */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Book Tracker', 
    endpoints: [
      { name: 'Get All Books', path: '/books' },
      { name: 'Get Book by ID', path: '/getBook', 
        note: 'Use query parameter "bookID" to enter a MongoDB ObjectID' },
      { name: 'Search External Books', path: '/searchBooks',
        note: 'Searches Open Library API for books. \n' +
        'Use query parameter "q" to enter a search query.' }
    ]
   });
});

module.exports = router;
