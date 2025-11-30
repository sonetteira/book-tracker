import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'react-bootstrap';
import Reread from '../components/rereads';
import RereadForm from '../components/rereadForm';
import Modal from '../components/modal';

function BookDetail() {
    const { id: bookID } = useParams();
    const [book, setBook] = useState(null);
    const [open, setOpen] = useState(false);
    const [rereadObject, setReread] = useState(null);
    const [submitResponse, setSubmitResponse] = useState(null);
    const [showForm, setShowForm] = useState(true);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/getBook?bookID=${encodeURIComponent(bookID)}`)
            .then(res => res.json())
            .then(setBook)
            .catch(err => console.error(err));
    }, [bookID]);

    // handle open close functions for modal
    const handleClose = () => { 
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    // handler for edit reread buttons
    const editRRHandler = (e) => {
        e.preventDefault();
        console.log(e.target.index.value);
        setReread(book.rereads[e.target.index.value])
        setOpen(true);
    };

    const handleEditRereadSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/updateReread`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: rereadObject,
                startDate: e.target.formStartDate.value.trim(),
                endDate: e.target.formEndDate.value.trim(),
                reaction: e.target.formReaction.value.trim()
            })
        })//.then(handleResponse)
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

    // const handleResponse = async (response) => {
    //     if (response.ok) {
    //         const data = await response.json();
    //         data.ok = response.ok;
    //         setSubmitResponse(data);
    //     } else {
    //         console.error('Error editing reread:', response.statusText);
    //     }
    // }

    if (!book) return <div>Loading...</div>;

    return (
        <>
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
                {book.rereads.map((item, index) => <Reread i={index} rr={item} editHandler={editRRHandler}></Reread>)}</>}
            </div>
        </div>
        {/* modal edit/add reread form */}
        <Modal isOpen={open} onClose={handleClose}>
            { showForm && 
            <RereadForm rereadObject={rereadObject} handleSubmit={handleEditRereadSubmit} submitText={'Edit Reread'}></RereadForm>}
        </Modal>
        </>
    );
}

export default BookDetail;