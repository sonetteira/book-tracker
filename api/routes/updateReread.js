var express = require('express');
var router = express.Router();
var Reread = require('../models/reread');

router.post('/', async (req, res) => {
    // get reread details from request body
    const { id, startDate, endDate, reaction } = req.body;

    try {
        // find the reread by id and update its details
        const reread = await Reread.findByIdAndUpdate(id, {
            startDate, endDate, reaction
        }, { new: true });

        if (!reread) {
            return res.status(404).send('Reread not found');
        }

        res.status(200).json({ message: 'Reread updated successfully!', reread: reread });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;