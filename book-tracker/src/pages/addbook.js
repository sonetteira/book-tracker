import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AutoComplete } from 'primereact/autocomplete';


function AddBook() {
    const emptyBook = { fullTitle: '', title: '', subtitle: '', author: '', yearPublished: '', display: '' };
    const [bookObject, setBookObject] = useState(emptyBook);
    const [selectedBook, setSelectedBook] = useState(emptyBook);
    const [filteredBooks, setFilteredBooks] = useState([emptyBook]);
    const [submitResponse, setSubmitResponse] = useState(null);
    const {register, watch} = useForm();
    const replaceSpaces = (str) => str.replace(/\s/g, '+');

    const getBookApiResponse = (event) => {
        if (!event.query.trim().length) {
            setFilteredBooks([]);
            return;
        } else {
            return fetch(`${process.env.REACT_APP_API_URL}/searchBooks?q=${replaceSpaces(event.query.trim())}`)
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
        const response = fetch(`${process.env.REACT_APP_API_URL}/addBook`, {
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
        .catch(err => console.error('Error adding book:', err));
    }

    const handleResponse = async (response) => {
        if (response.ok) {
            const data = await response.json();
            setSubmitResponse(data);
        } else {
            console.error('Error adding book:', response.statusText);
        }
    }

    return (
    <>
        <h3>Add A Book</h3>
        {submitResponse && (
            <div className="alert alert-success" role="alert">
                {submitResponse.message}
                <br />
                Add another book or <a href="/">view all books</a>.
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
        <Form onSubmit={handleSubmit} className="mt-3">    
            <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control type="Text" placeholder="Title" required defaultValue={ bookObject.title.trim() } />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubtitle">
                <Form.Label>Subtitle</Form.Label>
                <Form.Control type="Text" placeholder="Subtitle" defaultValue={ bookObject.subtitle.trim() } />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formAuthor">
                <Form.Label>Author</Form.Label>
                <Form.Control type="Text" placeholder="Author" defaultValue={ bookObject.author } />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGenre">
                <Form.Label>Genre</Form.Label>
                <Form.Control type="Text" placeholder="Genre" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPgCount">
                <Form.Label>Page Count</Form.Label>
                <Form.Control type="Number" size="sm"/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formYearPublished">
                <Form.Label>Year Published</Form.Label>
                <Form.Control type="Number" size="sm" defaultValue={ bookObject.yearPublished } />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRecommender">
                <Form.Label>Recommender</Form.Label>
                <Form.Control type="Text" placeholder="Recommender" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formWantToRead">
                <Form.Check type="checkbox" name="notread" {...register("notread")} label="Want To Read" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formFormat">
                <Form.Label>Format</Form.Label>
                <Form.Select aria-label="select format" {...register("format")} disabled={watch("notread")}>
                    <option value="">---</option>
                    <option value="paper">Paper</option>
                    <option value="ebook">E-Book</option>
                    <option value="audiobook">Audio Book</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formStartDate">
                <Form.Label>Date Started</Form.Label>
                <Form.Control type="date" {...register("startdate")} disabled={watch("notread")} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEndDate">
                <Form.Label>Date Finished</Form.Label>
                <Form.Control type="date" {...register("enddate")} disabled={watch("notread")} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSummary">
                <Form.Label>Summary</Form.Label>
                <Form.Control as="textarea" rows={3} {...register("summary")} disabled={watch("notread")} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formReaction">
                <Form.Label>Reaction</Form.Label>
                <Form.Control as="textarea" rows={3} {...register("reaction")} disabled={watch("notread")} />
            </Form.Group>

            <Button variant="primary" type="submit">
                Add Book
            </Button>
        </Form>
    </>
    );
}

export default AddBook;