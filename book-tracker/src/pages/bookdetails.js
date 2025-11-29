import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'react-bootstrap';
import Reread from '../components/rereads';

function BookDetail() {
    const { id: bookID } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/getBook?bookID=${encodeURIComponent(bookID)}`)
            .then(res => res.json())
            .then(setBook)
            .catch(err => console.error(err));
    }, [bookID]);

    if (!book) return <div>Loading...</div>;

    return (
        <div className="d-flex flex-row justify-content-around">
            <div>
                <title>Book Details</title>
                <h2>{book.title}</h2>
                {book.subtitle && <p><strong>Subtitle:</strong> {book.subtitle}</p>}
                <p><strong>Author:</strong> {book.author}</p>
                {book.format && <p><strong>Format:</strong> {book.format}</p>}
                {book.genre && <p><strong>Genre:</strong> {book.genre}</p>}
                {book.pageCount && <p><strong>Page Count:</strong> {book.pageCount}</p>}
                {book.yearPublished && <p><strong>Year Published:</strong> {book.yearPublished}</p>}
                {book.recommender && <p><strong>Recommender:</strong> {book.recommender}</p>}
                { book.wantToRead && <p>Want To Read</p>}
                { !book.wantToRead && // only display if wantToRead is false
                <>
                <p><strong>Start Date:</strong> {book.startDate && new Date(book.startDate).toLocaleDateString('en-US', {timeZone: 'UTC'})}</p>
                <p><strong>Date Finished:</strong> {book.endDate && new Date(book.endDate).toLocaleDateString('en-US', {timeZone: 'UTC'})}</p>
                {book.summary && <p><strong>Summary:</strong><br /> {book.summary}</p>}
                {book.reaction && <p><strong>Reaction:</strong><br /> {book.reaction}</p>}
                </>}
                <br />
                <p><a href={`/editBook/${bookID}`} className='btn btn-primary'>Edit Book</a></p>
                <p><button onClick={() => window.history.back()} className="btn btn-secondary">Back</button></p>
            </div>
            <div>
                {book.rereads.length > 0 && <><h3>Rereads</h3><br />
                {book.rereads.map(item => <Reread rr={item}></Reread>)}</>}
            </div>
        </div>
    );
}

export default BookDetail;