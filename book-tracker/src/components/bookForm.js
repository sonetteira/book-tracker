import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function BookForm({ bookObject, handleSubmit, submitText }) {
    const {register, watch} = useForm();

    const processDate = (date) => {
        // convert datetime string to YYYY-MM-DD format
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    return (
        <Form onSubmit={handleSubmit} className="mt-3">    
            <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control type="Text" placeholder="Title" required defaultValue={ bookObject.title } />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubtitle">
                <Form.Label>Subtitle</Form.Label>
                <Form.Control type="Text" placeholder="Subtitle" defaultValue={ bookObject.subtitle } />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formAuthor">
                <Form.Label>Author</Form.Label>
                <Form.Control type="Text" placeholder="Author" defaultValue={ bookObject.author } />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGenre">
                <Form.Label>Genre</Form.Label>
                <Form.Control type="Text" placeholder="Genre" defaultValue={ bookObject.genre } />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPgCount">
                <Form.Label>Page Count</Form.Label>
                <Form.Control type="Number" size="sm" defaultValue={ bookObject.pageCount } />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formYearPublished">
                <Form.Label>Year Published</Form.Label>
                <Form.Control type="Number" size="sm" defaultValue={ bookObject.yearPublished } />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRecommender">
                <Form.Label>Recommender</Form.Label>
                <Form.Control type="Text" placeholder="Recommender" defaultValue={ bookObject.recommender } />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formWantToRead">
                <Form.Check type="checkbox" name="notread" checked={bookObject.wantToRead}
                {...register("notread")} label="Want To Read" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formFormat">
                <Form.Label>Format</Form.Label>
                <Form.Select aria-label="select format" defaultValue={bookObject.format || ''}
                {...register("format")} disabled={watch("notread")}>
                    <option value="">---</option>
                    <option value="paper">Paper</option>
                    <option value="ebook">E-Book</option>
                    <option value="audiobook">Audio Book</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formStartDate">
                <Form.Label>Date Started</Form.Label>
                <Form.Control type="date" defaultValue={processDate(bookObject.startDate)}
                {...register("startdate")} disabled={watch("notread")} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEndDate">
                <Form.Label>Date Finished</Form.Label>
                <Form.Control type="date" defaultValue={processDate(bookObject.endDate)}
                {...register("enddate")} disabled={watch("notread")} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSummary">
                <Form.Label>Summary</Form.Label>
                <Form.Control as="textarea" rows={3} defaultValue={bookObject.summary}
                {...register("summary")} disabled={watch("notread")} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formReaction">
                <Form.Label>Reaction</Form.Label>
                <Form.Control as="textarea" rows={3} defaultValue={bookObject.reaction}
                {...register("reaction")} disabled={watch("notread")} />
            </Form.Group>

            <Button variant="primary" type="submit">{submitText}</Button>
            <Button variant="secondary" type="button" className="ms-2" onClick={() => window.history.back()}>Cancel</Button>
        </Form>
    );

}

export default BookForm;