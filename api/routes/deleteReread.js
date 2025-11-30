var express = require('express');
var router = express.Router();
var Reread = require('../models/reread');

router.post('/', async (req, res) => {
    // get reread details from request body
    const { id } = req.body;

    try {
        // find the reread by id and update its details
        const reread = await Reread.findByIdAndDelete(id, { new: true });

        if (!reread) {
            return res.status(404).send('Reread not found');
        }

        res.status(200).json({ message: 'Reread deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;