var express = require('express');
var router = express.Router();
var Book = require('../models/book');

router.get('/', async (req, res) => {
  // get optional query parameters
  const wantToRead = req.query.toread === 'T' ? true : false;
  try {
    // Fetch top 50 read books from the database
    // If wantToRead is true, fetch books that are marked as wantToRead
    wantToReadQuery = wantToRead ? { 'wantToRead': true } : 
      { $or: [ { 'wantToRead': false }, { 'wantToRead': null } ] };
    const books = await Book.find( { ...wantToReadQuery } 
      ).sort({ 'endDate': -1 }).limit(50);
    res.json(books); // Respond with the list of books as JSON
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Error fetching books.' });
  }
});

module.exports = router;