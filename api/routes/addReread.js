var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Reread = require('../models/reread');

router.post('/', async (req, res) => {
    // get reread details from request body
    const { bookID, startDate, endDate, reaction } = req.body;
    try {
        // find book reference
        const book = await Book.findById(bookID);
        // Create a new reread instance
        const newReread = new Reread({
            book,
            startDate,
            endDate,
            reaction
        });
        
        // Save the reread to the database
        await newReread.save();
        // push reread to book record
        book.rereads.push(newReread._id);
        await book.save();
        
        res.status(201).json({ message: 'Reread added successfully!', reread: newReread });
    } catch (err) {
        console.error('Error adding reread:', err);
        res.status(500).json({ message: 'Error adding reread.' });
    }
});

module.exports = router;