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

Book.createCollection().then(function (collection) {
  console.log('Book collection created');
});

// Insert books into the database
const books = [
  {title: 'The River Has Roots', author: 'Amal El-Mohtar', format: 'paper', genre: 'Fantasy', pageCount: 133, yearPublished: 2025, startDate: new Date('2025-06-23'), endDate: new Date('2025-06-25')},
  {title: 'Meet You In Hell', subtitle: 'Andrew Carnegie, Henry Clay Frick, and the Bitter Partnership That Changed America', author: 'Les Standiford', format: 'paper', genre: 'History', pageCount: 336, yearPublished: 2006, startDate: new Date('2025-06-13'), endDate: new Date('2025-06-23'), summary: 'The nasty relationships between two immensely greedy and insecure men.'},
  {title: 'The Teller of Small Fortunes', author: 'Julie Leong', format: 'ebook', genre: 'Fantasy', pageCount: 336, yearPublished: 2024, startDate: new Date('2025-06-08'), endDate: new Date('2025-06-14'), summary: 'A story of a young woman who finds a family.', reaction: 'This story subverts the dark, cynical tropes common this fantasy stories. It constantly surprised me by being wholesome and hopeful.'},
  {title: "The Name of the Wind","subtitle":"","author":"Patrick Rothfuss","format":"paper","genre":"Fantasy","pageCount":662,"yearPublished":2007,"recommender":"","wantToRead":false,"startDate":null,"endDate":"2010-01-01T00:00:00.000Z","summary":"","reaction":"This is one of my favorite books."}
];

// Insert multiple documents (books) into the collection
Book.insertMany(books)
  .then(() => {
    console.log('Books inserted successfully');
  })
  .catch((err) => {
    console.error('Error inserting books:', err);
  });

Reread.createCollection().then(function (collection) {
  console.log('Reread collection created.')
});

// Insert a reread into the database
var tnotw = Book.find({title: "The Name of the Wind"});
const tnotwReread = {book: tnotw._id, startDate: '2025-09-08T00:00:00.000Z', endDate: null, reaction:null};
Reread.insertOne(tnotwReread).then(() => {
  console.log('Reread inserted successfully!');
}).catch((err) => {
  console.error('Error inserting reread:', err);
});