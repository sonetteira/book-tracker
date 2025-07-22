var express = require('express');
var router = express.Router();
var Book = require('../models/book');

router.get('/', async (req, res) => {
    // get year from query parameters
    const year = Number.isSafeInteger(+req.query.year) ? +req.query.year : null;
    if (!year) {
        return res.status(400).json({ message: 'Query parameter "year" is required and must be a valid integer.' });
    }
    // build a json response of aggregate data
    try {
        let report = {};
        // get the number of books finished during the year
        report.bookCount = await Book.countDocuments({endDate: {
            $gte: new Date(`${year}-01-01T05:00:00.000Z`),
            $lt: new Date(`${year+1}-01-01T05:00:00.000Z`)
        }});
        res.json(report);
    } catch (err) {
        console.error('Error fetching report:', err);
        res.status(500).json({ message: 'Error fetching report.' });
    }
});

module.exports = router;