const mongoose = require('mongoose');

const formatEnum = ['', 'ebook', 'audiobook', 'paper'];

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  subtitle: { type: String },
  author: { type: String },
  format: { type: String, enum: formatEnum },
  genre: { type: String },
  pageCount: { type: Number },
  yearPublished: { type: Number },
  recommender: { type: String },
  wantToRead: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
  summary: { type: String },
  reaction: { type: String },
  rereads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reread'
  }],
});

module.exports = mongoose.model('Book', bookSchema);
