var express = require('express');
var router = express.Router();
var Book = require('../models/book');

router.get('/', async (req, res) => {
    // get year from query parameters
    const year = Number.isSafeInteger(+req.query.year) ? +req.query.year : null;
    if (!year) {
        return res.status(400).json({ message: 'Query parameter "year" is required and must be a valid integer.' });
    }
    try {
        // Fetch all the books read in the given year
        const books = await Book.find({endDate: {
            $gte: new Date(`${year}-01-01T05:00:00.000Z`),
            $lt: new Date(`${year+1}-01-01T05:00:00.000Z`)
        }
        }).sort({ 'endDate' : 1 });
        res.json(books); // Respond with the list of books as JSON
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ message: 'Error fetching books.' });
    }
});

module.exports = router;