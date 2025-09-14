var express = require('express');
var router = express.Router();
var Book = require('../models/book');

router.get('/', async (req, res) => {
  // get optional query parameters
  const wantToRead = req.query.toread === 'T' ? true : false;
  const inProgress = req.query.progress == 'T' ? true : false;
  try {
    // Fetch top 50 read books from the database
    // If wantToRead is true, fetch books that are marked as wantToRead
    wantToReadQuery = wantToRead ? { 'wantToRead': true } : 
      { $or: [ { 'wantToRead': false }, { 'wantToRead': null } ] };
    // If inProgress is true, fetch books with a start date but without end date
    inProgressQuery = inProgress ? { $and: [{'startDate': { $ne: null }}, {'endDate': null}]} : '';
    // collect query. prioritizes wantToRead
    selectQuery = wantToRead ? wantToReadQuery : inProgressQuery;
    // query database
    const books = await Book.find( { ...selectQuery }
      ).sort({ 'endDate': -1, 'startDate': -1 }).limit(50);
    res.json(books); // Respond with the list of books as JSON
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Error fetching books.' });
  }
});

module.exports = router;