import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AutoComplete } from 'primereact/autocomplete';
import BookForm from '../components/bookForm';

function AddBook() {
    const emptyBook = { fullTitle: '', title: '', subtitle: '', author: '', yearPublished: '', display: '' };
    const [bookObject, setBookObject] = useState(emptyBook);
    const [selectedBook, setSelectedBook] = useState(emptyBook);
    const [filteredBooks, setFilteredBooks] = useState([emptyBook]);
    const [submitResponse, setSubmitResponse] = useState(null);
    const replaceSpaces = (str) => str.replace(/\s/g, '+');

    const getBookApiResponse = (event) => {
        if (!event.query.trim().length) {
            setFilteredBooks([]);
            return;
        } else {
            return fetch(`${process.env.REACT_APP_API_URL}/searchBooks?q=${encodeURIComponent(replaceSpaces(event.query.trim()))}`)
            .then(res => res.json())
            .then(data => { if (data.docs && data.numFound > 0) {
                setFilteredBooks(data.docs.map(item => ({
                    fullTitle: item.title,
                    title: item.title.split(':')[0] || item.title,
                    subtitle: item.title.split(':')[1] || '',
                    // title: item.title,
                    // subtitle: item.subtitle,
                    author: item.author_name,
                    yearPublished: item.first_publish_year,
                    display: `${item.title} by ${item.author_name ? item.author_name.join(', ') : 'Unknown Author'}`,
                    // cover_i: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : null
                })))
            } else {
                setFilteredBooks([]);
            }})
            .catch(err => console.error(err));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/addBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
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
        .then(() => {e.target.reset(); 
            setBookObject(emptyBook); setSelectedBook(emptyBook); 
            window.scrollTo(0, 0);
        })
        .catch(err => {
            console.error('Error adding book:', err);
            setSubmitResponse({ ok: false, message: 'Error adding book. Please try again later.' });
            window.scrollTo(0, 0);
        });
    }

    const handleResponse = async (response) => {
        if (response.ok) {
            const data = await response.json();
            data.ok = response.ok;
            setSubmitResponse(data);
        } else {
            console.error('Error adding book:', response.statusText);
        }
    }

    return (
    <>
        <h3>Add A Book</h3>
        {submitResponse && submitResponse.ok && (
            <div className="alert alert-success" role="alert">
                {submitResponse.message}
                <br />
                Add another book or <a href="/">view all books</a>.
            </div>
        )}
        {submitResponse && !submitResponse.ok && (
            <div className="alert alert-danger" role="alert">
                {submitResponse.message}
            </div>
        )}
        <Form onSubmit={(e) => {
            e.preventDefault();
            setBookObject(selectedBook);
        }}>
            <Form.Group className="mb-3" controlId="formTitle">
                <p>Search:</p>
                <AutoComplete
                    field = "display"
                    value={selectedBook}
                    suggestions={filteredBooks}
                    completeMethod={getBookApiResponse}
                    onChange={(e) => setSelectedBook(e.value)}
                />
            </Form.Group>
            <Button variant="primary" type="submit">Fill</Button>
        </Form>
        
        <BookForm bookObject={bookObject} handleSubmit={handleSubmit} submitText={'Add Book'}/>
    </>
    );
}

export default AddBook;