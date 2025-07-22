var express = require('express');
var router = express.Router();
var Book = require('../models/book');

router.get('/', async (req, res) => {
    // get id from query parameters
    const bookID = req.query.bookID;
    if (!bookID) {
        return res.status(400).json({ message: 'Query parameter "bookID" is required.' });
    }
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