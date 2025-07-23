var express = require('express');
var router = express.Router();
var Book = require('../models/book');

router.get('/', async (req, res) => {
    // get a list of available years from the database
    try {
        const years = await Book.aggregate([
    {
        '$addFields': {
        'year': {
            '$year': '$endDate'
        }
        }
    }, {
        '$match': {
        'endDate': {
            '$ne': null
        }
        }
    }, {
        '$group': {
        '_id': '$year'
        }
    }, {
        '$sort': {
        '_id': -1
        }
    }
    ]);
        res.json(years);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ message: 'Error fetching data.' });
    }
});

module.exports = router;