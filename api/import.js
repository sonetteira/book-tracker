const mongoose = require('mongoose');
const Book = require('./models/book');
const dotenv = require('dotenv');
const fs = require("fs");
const { parse } = require("csv-parse");
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then((result) => {
    console.log('connected to Mongodb');
}).catch((err) => {
    console.error(err);
});


fs.createReadStream("./data/goodreads_library_export.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    // console.log(row);
    // data.push(row);
    writeToDB(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  }).on("close", function () {
    console.log("CSV file successfully processed");
  });

function writeToDB(book) {
    // don't write duplicates
    var dup = false;
    var title = book[1].split(':')[0].replace(/\s*\(.*?\)\s*/g, '').trim() || book[1].replace(/\s*\(.*?\)\s*/g, '').trim() || book[1]
    
    Book.findOne({ title: title })
    .then((result) => {
        if (result) { dup = true; console.log(`Duplicate book found: ${result.title}`);}
    }).then(() => {
        // don't write duplicates
        if (!dup) {
            var subtitle = book[1].split(':')[1] ? book[1].split(':')[1].trim() : '';
            var author = book[2];
            var pageCount = book[11];
            var yearPublished = book[12];
            var endDate = book[14] ? new Date(book[14]) : null;
            var wantToRead = book[18] == 'to-read' ? true : false;
            const newBook = new Book({
                title: title,
                subtitle: subtitle,
                author: author,
                format: '',
                genre: '',
                pageCount: pageCount,
                yearPublished: yearPublished,
                recommender: '',
                wantToRead: wantToRead,
                startDate: null,
                endDate: endDate,
                summary: null,
                reaction: null
            });
            newBook.save();
            console.log(`Saved book: ${newBook.title}`);
        }
    });
}
