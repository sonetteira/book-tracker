import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'react-bootstrap';

function BookDetail() {
    const { id: bookID } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/getBook?bookID=${bookID}`)
            .then(res => res.json())
            .then(setBook)
            .catch(err => console.error(err));
    }, [bookID]);

    if (!book) return <div>Loading...</div>;

    return (
        <div>
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Format:</strong> {book.format}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Page Count:</strong> {book.pageCount}</p>
            <p><strong>Year Published:</strong> {book.yearPublished}</p>
            <p><strong>Start Date:</strong> {new Date(book.startDate).toLocaleDateString()}</p>
            <p><strong>Date Finished:</strong> {new Date(book.endDate).toLocaleDateString()}</p>
            <p><strong>Summary:</strong><br /> {book.summary}</p>
            <p><strong>Reaction:</strong><br /> {book.reaction}</p>
            <br />
            <p><a href="/" class="btn btn-secondary">Back</a></p>
        </div>
    );
}

export default BookDetail;