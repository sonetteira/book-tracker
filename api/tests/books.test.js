const mongoose = require('mongoose');
const Book = require('../models/book'); // Path to the Book model
const dotenv = require('dotenv');
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);

  test('Database connection and book insertion', async () => {
    const count = await Book.countDocuments();
    expect(count).toBeGreaterThanOrEqual(3); // Check if 3 books were inserted
  });

  afterAll(() => {
    mongoose.connection.close();
  });