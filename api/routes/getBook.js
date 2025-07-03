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
    // get id from query parameters
    const bookID = req.query.bookID;
    try {
        // Fetch all books from the database
        const book = await Book.findById(bookID);
        res.json(book); // Respond with the book details as JSON
    } catch (err) {
        console.error('Error fetching book:', err);
        res.status(500).json({ message: 'Error fetching book details.' });
    }
});

module.exports = router;