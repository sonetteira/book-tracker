const mongoose = require('mongoose');
const Book = require('../models/book');
const Reread = require('../models/reread');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then((result) => {
    console.log('connected to Mongodb');
}).catch((err) => {
    console.error(err);
});

async function createReread() {
    // const tnotw = await Book.find({'title': 'The Name of the Wind'});
    const tnotw = new Book({title: "The Name of the Wind","subtitle":"","author":"Patrick Rothfuss","format":"paper","genre":"Fantasy","pageCount":662,"yearPublished":2007,"recommender":"","wantToRead":false,"startDate":null,"endDate":"2010-01-01T00:00:00.000Z","summary":"","reaction":"This is one of my favorite books."});
    await tnotw.save();
    const reread = new Reread({book: tnotw._id, startDate: '2025-09-08T00:00:00.000Z', endDate: null, reaction:null});
    await reread.save();

    tnotw.rereads.push(reread._id);
    await tnotw.save()

    return reread;
}

createReread().then(() => {
    console.log('Reread inserted successfully!');
}).catch((err) => {
    console.error('Error inserting reread:', err);
});