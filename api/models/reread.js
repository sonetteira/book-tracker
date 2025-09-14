const mongoose = require('mongoose');

const rereadSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    startDate: { type: Date },
    endDate: { type: Date },
    reaction: { type: String }
});

module.exports = mongoose.model('Reread', rereadSchema);