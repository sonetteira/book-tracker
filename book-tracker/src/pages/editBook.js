import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import BookForm from '../components/bookForm';

function EditBook() {
    const { id: bookID } = useParams();
    const [book, setBook] = useState(null);
    const [submitResponse, setSubmitResponse] = useState(null);
    const [showForm, setShowForm] = useState(true);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/getBook?bookID=${encodeURIComponent(bookID)}`)
            .then(res => res.json())
            .then(setBook)
            .catch(err => console.error(err));
    }, [bookID]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/updateBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: bookID,
                title: e.target.formTitle.value.trim(),
                subtitle: e.target.formSubtitle.value.trim(),
                author: e.target.formAuthor.value.trim(),
                genre: e.target.formGenre.value.trim(),
                pageCount: e.target.formPgCount.value.trim(),
                yearPublished: e.target.formYearPublished.value.trim(),
                recommender: e.target.formRecommender.value.trim(),
                wantToRead: e.target.formWantToRead.checked,
                format: e.target.formFormat.value,
                startDate: e.target.formStartDate.value.trim(),
                endDate: e.target.formEndDate.value.trim(),
                summary: e.target.formSummary.value.trim(),
                reaction: e.target.formReaction.value.trim()
            })
        }).then(handleResponse)
        .then(() => {
            // hide the book form after submission
            setShowForm(false);
            e.target.reset();
            setBook(null);
            window.scrollTo(0, 0);
        })
        .catch(err => {
            console.error('Error updating book:', err);
            setSubmitResponse({ ok: false, message: 'Error updating book. Please try again later.' });
            window.scrollTo(0, 0);
        });
    }

    const handleResponse = async (response) => {
        if (response.ok) {
            const data = await response.json();
            data.ok = response.ok;
            setSubmitResponse(data);
        } else {
            console.error('Error editing book:', response.statusText);
        }
    }

    return (
    <>
        <h3>Edit Book</h3>
        {submitResponse && submitResponse.ok && (
            <div className="alert alert-success" role="alert">
                {submitResponse.message}
                <br />
                <a href={`/book/${bookID}`}>View edited book</a>
            </div>
        )}
            { showForm && ( book ? (
                <BookForm bookObject={book} handleSubmit={handleSubmit} submitText={'Edit Book'} />
            ) : (
                <p>Loading...</p>
            ))}
    </>
    );
}

export default EditBook;
