const mongoose = require('mongoose');
const request = require('supertest');
const Book = require('../models/book'); // Path to the Book model
const app = require('../app'); // Import the Express app

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/books');

// Current URL
const url = 'http://localhost:3002'

afterAll(() => {
    mongoose.connection.close();
    server.close();
});

test('All books query', async () => {
    const response = await request(app).get('/books');
    expect(response.statusCode).toBe(200);
    const books = response.body;
    expect(Array.isArray(books)).toBe(true);
    expect(books.length).toBeGreaterThan(0);
});

test('Get book by ID', async () => {
    const newest_book = await Book.findOne({}, {}, { sort: { 'created_at' : -1 } })
    const bookID = newest_book._id;
    const response = await request(app).get(`/getBook?bookID=${bookID}`);
    expect(response.statusCode).toBe(200);
    const book = response.body;
    expect(book).toHaveProperty('title');
    expect(book.title).not.toBeNull();
});