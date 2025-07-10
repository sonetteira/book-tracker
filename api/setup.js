const mongoose = require('mongoose');
const Book = require('../models/book'); // Path to the Book model
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then((result) => {
    console.log('connected to Mongodb');
}).catch((err) => {
    console.error(err);
});

// Insert books into the database
const books = [
  {title: 'The River Has Roots', author: 'Amal El-Mohtar', format: 'paper', genre: 'Fantasy', pageCount: 133, yearPublished: 2025, startDate: new Date('2025-06-23'), endDate: new Date('2025-06-25')},
  {title: 'Meet You In Hell', subtitle: 'Andrew Carnegie, Henry Clay Frick, and the Bitter Partnership That Changed America', author: 'Les Standiford', format: 'paper', genre: 'History', pageCount: 336, yearPublished: 2006, startDate: new Date('2025-06-13'), endDate: new Date('2025-06-23'), summary: 'The nasty relationships between two immensely greedy and insecure men.'},
  {title: 'The Teller of Small Fortunes', author: 'Julie Leong', format: 'ebook', genre: 'Fantasy', pageCount: 336, yearPublished: 2024, startDate: new Date('2025-06-08'), endDate: new Date('2025-06-14'), summary: 'A story of a young woman who finds a family.', reaction: 'This story subverts the dark, cynical tropes common this fantasy stories. It constantly surprised me by being wholesome and hopeful.'}
];

// Insert multiple documents (books) into the collection
Book.insertMany(books)
  .then(() => {
    console.log('Books inserted successfully');
  })
  .catch((err) => {
    console.error('Error inserting books:', err);
  });