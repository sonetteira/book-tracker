import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AutoComplete } from 'primereact/autocomplete';


function AddBook() {
    const [bookObject, setBookObject] = useState({ title: '', author: '', yearPublished: '' });
    const [selectedBook, setSelectedBook] = useState({ title: '', author: '', yearPublished: '', display: '' });
    const [filteredBooks, setFilteredBooks] = useState([{ title: '', author: '', yearPublished: '', display: '' }]);
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
                    title: item.title,
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
    
    return (
    <>
        <h3>Add A Book</h3>
        <Form onSubmit={(e) => {
            e.preventDefault();
            console.log('Selected Book:', selectedBook);
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
        <Form>    
            <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control type="Text" placeholder="Title" defaultValue={ bookObject.title } />
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

            <Form.Group className="mb-3" controlId="formWantToRead">
                <Form.Check type="checkbox" name="notread" {...register("notread")} label="Want To Read" />
            </Form.Group>

            <Form.Group className="mb-3" controlID="formFormat">
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