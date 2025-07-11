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
    // get search term from query parameters
    const searchTerm = req.query.searchTerm;
    if (!searchTerm) {
        return res.status(400).json({ message: 'Query parameter "searchTerm" is required.' });
    }
    try {
        // Fetch books from the database that match the search term
        const books = await Book.find({ 
            $or: [{ title: new RegExp(searchTerm, 'i')}, { subtitle: new RegExp(searchTerm, 'i')}, { author: new RegExp(searchTerm, 'i') }]
        });
        res.json(books); // Respond with the list of books as JSON
    } catch (err) {
        console.error('Error searching books:', err);
        res.status(500).json({ message: 'Error searching books.' });
    }
});

module.exports = router;