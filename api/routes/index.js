var express = require('express');
var router = express.Router();

/* GET home page. API Documentation */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Book Tracker', 
    endpoints: [
      { name: 'Get Finished Books', path: '/books', note:
        'Defaults to returning most recent 50 read books from the database. \n' +
        'Use query parameter toread=T to return books with want to read flag set.'
      },
      { name: 'Get Books by Read year', path: '/yearBooks', note:
        'Use query parameter "year" to gets a list of books finished in the given year.'
      },
      { name: 'Get Book by ID', path: '/getBook', note: 
        'Use query parameter "bookID" to enter a MongoDB ObjectID' 
      },
      { name: 'Search My Books', path: '/searchMyBooks', note:
        'Searches MongoDB for books for a search query based on title, subtitle, author. \n' +
        'Use query parameter "searchTerm" to enter a search query.'
      },
      { name: 'Search External Books', path: '/searchBooks', note: 
        'Searches Open Library API for books. \n' +
        'Use query parameter "q" to enter a search query.'
      },
      { name: 'Add Book', path: '/addBook', note: 
        'Use POST request to add a book to the MongoDB.'
      },
      {
        name: 'Update Book', path: '/updateBook', note:
        'Use POST request to update a book in the MongoDB using its ID.'
      },
      {
        name: 'Get Years', path: 'getYears', note:
        'Returns an array of all years for which book records are kept.'
      }
    ]
   });
});

module.exports = router;
