var express = require('express');
var router = express.Router();
var Book = require('../models/book');

router.post('/', async (req, res) => {
    // get book details from request body
    const { id, title, subtitle, author, genre, pageCount, yearPublished,
        recommender, wantToRead, format, startDate, endDate, 
        summary, reaction
     } = req.body;

    try {
        // find the book by id and update its details
        const book = await Book.findByIdAndUpdate(id, {
            title, subtitle, author, genre, pageCount, yearPublished,
            recommender, wantToRead, format, startDate, endDate,
            summary, reaction
        }, { new: true });

        if (!book) {
            return res.status(404).send('Book not found');
        }

        res.status(200).json({ message: 'Book updated successfully!', book: book });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;