import React from 'react';
import {useForm} from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function AddBook() {
    const {register, watch} = useForm();
    return (
    <>
        <h3>Add A Book</h3>
        <Form>
            <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control type="Text" placeholder="Title" />
            </Form.Group>
        
            <Form.Group className="mb-3" controlId="formAuthor">
                <Form.Label>Author</Form.Label>
                <Form.Control type="Text" placeholder="Author" />
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
                <Form.Control type="Number" size="sm"/>
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