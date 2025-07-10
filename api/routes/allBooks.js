const express = require('express');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)
.then((result) => {
    console.log('connected to Mongodb');
}).catch((err) => {
    console.error(err);
});
var router = express.Router();
var Book = require('../models/book');

router.get('/', async (req, res) => {
  try {
    // Fetch top 50 read books from the database
    const books = await Book.find({'wantToRead': false}).limit(50);
    res.json(books); // Respond with the list of books as JSON
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Error fetching books.' });
  }
});

module.exports = router;