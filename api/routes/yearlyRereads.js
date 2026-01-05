var express = require('express');
var router = express.Router();
var Reread = require('../models/reread');

router.get('/', async (req, res) => {
    // get year from query parameters
    const year = Number.isSafeInteger(+req.query.year) ? +req.query.year : null;
    if (!year) {
        return res.status(400).json({ message: 'Query parameter "year" is required and must be a valid integer.' });
    }
    try {
        const books = await Reread.aggregate([
            { $match: { $and: [
                { endDate: {
                    $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    $lt: new Date(`${year+1}-01-01T00:00:00.000Z`)
                }}
            ]}},
            { $lookup: {
                from: 'books',
                localField: 'book',
                foreignField: '_id',
                as: 'book'
            }},
            { $addFields: {
                days: { $divide: [{$subtract: ['$endDate', '$startDate']}, 60*60*24*1000]}
            }},
            { $addFields: {
                pagesPerDay: { $divide: ['$pageCount', '$days'] }
            }},
            { $sort: {endDate: 1}},
        ]);
        res.json(books); // Respond with the list of books as JSON
    } catch (err) {
        console.error('Error fetching rereads:', err);
        res.status(500).json({ message: 'Error fetching rereads.' });
    }
});

module.exports = router;