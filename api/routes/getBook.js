var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Reread = require('../models/reread')

router.get('/', async (req, res) => {
    // get id from query parameters
    const bookID = req.query.bookID;
    if (!bookID) {
        return res.status(400).json({ message: 'Query parameter "bookID" is required.' });
    }
    try {
        // Fetch this book from the database
        const book = await Book.findById(bookID).populate('rereads');
        res.json(book); // Respond with the book details as JSON
    } catch (err) {
        console.error('Error fetching book:', err);
        res.status(500).json({ message: 'Error fetching book details.' });
    }
});

module.exports = router;