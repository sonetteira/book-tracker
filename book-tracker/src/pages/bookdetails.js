import React, { useState, useEffect, useRef } from 'react';
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
    const [showMsg, setShowMsg] = useState(false);
    const [resetBook, setResetBook] = useState(false);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/getBook?bookID=${encodeURIComponent(bookID)}`)
            .then(res => res.json())
            .then(setBook)
            .catch(err => console.error(err));
    }, [bookID, resetBook]);

    // handle open close functions for modal
    const handleClose = () => { 
        setSubmitResponse(null);
        setShowForm(true);
        setShowMsg(false);
        setOpen(false);
    };
    const handleOpen = (form, msg) => {
        setShowForm(form);
        setShowMsg(msg);
        setOpen(true);
    };
    // handler for edit reread buttons
    const editRRHandler = (e) => {
        e.preventDefault();
        console.log(e.target.index.value);
        setReread(book.rereads[e.target.index.value])
        setOpen(true);
        setResetBook(false);
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
        })
        .then(() => {
            // hide the reread form after submission, print a message
            setSubmitResponse( {ok: true, message: 'Reread edited successfully'});
            handleOpen(false, true);
            // reset form and reload book obj
            e.target.reset();
            setResetBook(true);
        })
        .catch(err => {
            console.error('Error updating reread:', err);
            setSubmitResponse({ ok: false, message: 'Error updating reread. Please try again later.' });
            handleOpen(false, true);
        });
    }

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
        { showMsg && <p>{submitResponse.message}</p>}
        { showForm && 
            <RereadForm rereadObject={rereadObject} handleSubmit={handleEditRereadSubmit} submitText={'Edit Reread'}></RereadForm>}
        </Modal>
        </>
    );
}

export default BookDetail;