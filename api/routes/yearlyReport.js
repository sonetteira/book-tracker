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
        // breakdown by format
        // pages read
        report.pageCount = await Book.aggregate([
            { $match: {endDate: {
                $gte: new Date(`${year}-01-01T05:00:00.000Z`),
                $lt: new Date(`${year+1}-01-01T05:00:00.000Z`)
            }}},
            { $group: {
                _id: null,
                totalPageCount: { $sum: '$pageCount' }
            }},
            { $project: { _id: 0, totalPageCount: 1 }}
        ]);
        // longest book
        report.longest = await Book.aggregate([
            { $match: {$and: 
                [
                    {pageCount: {$ne:null}},
                    {endDate: {
                        $gte: new Date(`${year}-01-01T05:00:00.000Z`),
                        $lt: new Date(`${year+1}-01-01T05:00:00.000Z`)
                    }}
                ]
            }},
            { $group: {
                _id: null,
                maxPages: { $max: {pageCount: '$pageCount', title: '$title'} }
            }},
            { $project: { _id: 0, title: '$title', maxPages: 1 }}
        ]);
        // shortest book
        report.shortest = await Book.aggregate([
            { $match: {$and: 
                [
                    {pageCount: {$ne:null}},
                    {endDate: {
                        $gte: new Date(`${year}-01-01T05:00:00.000Z`),
                        $lt: new Date(`${year+1}-01-01T05:00:00.000Z`)
                    }}
                ]
            }},
            { $group: {
                _id: null,
                minPages: { $min: {pageCount: '$pageCount', title: '$title'} }
            }},
            { $project: { _id: 0, title: '$title', minPages: 1 }}
        ]);
        // top recommender by count
        // quickest read
        // slowest read
        res.json(report);
    } catch (err) {
        console.error('Error fetching report:', err);
        res.status(500).json({ message: 'Error fetching report.' });
    }
});

module.exports = router;