var express = require('express');
var router = express.Router();
var Book = require('../models/book');

router.post('/', async (req, res) => {
    // get book details from request body
    const { title, subtitle, author, genre, pageCount, yearPublished,
        recommender, wantToRead, format, startDate, endDate, 
        summary, reaction
     } = req.body;
    try {
        // Create a new book instance
        const newBook = new Book({
            title,
            subtitle,
            author,
            yearPublished,
            genre,
            pageCount,
            recommender,
            wantToRead,
            format,
            startDate,
            endDate,
            summary,
            reaction
        });
        
        // Save the book to the database
        await newBook.save();
        
        res.status(201).json({ message: 'Book added successfully!', book: newBook });
    } catch (err) {
        console.error('Error adding book:', err);
        res.status(500).json({ message: 'Error adding book.' });
    }
});

module.exports = router;