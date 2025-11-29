import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function RereadForm({ rereadObject, handleSubmit, submitText }) {
    const {register, watch} = useForm();

    const processDate = (date) => {
        // convert datetime string to YYYY-MM-DD format
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    return (
        <Form onSubmit={handleSubmit} className="mt-3">    
            {/* <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control type="Text" placeholder="Title" readOnly defaultValue={ rereadObject.book } />
            </Form.Group> */}

            <Form.Group className="mb-3" controlId="formStartDate">
                <Form.Label>Date Started</Form.Label>
                <Form.Control type="date" defaultValue={processDate(rereadObject.startDate)}
                {...register("startdate")} disabled={watch("notread")} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEndDate">
                <Form.Label>Date Finished</Form.Label>
                <Form.Control type="date" defaultValue={processDate(rereadObject.endDate)}
                {...register("enddate")} disabled={watch("notread")} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formReaction">
                <Form.Label>Reaction</Form.Label>
                <Form.Control as="textarea" rows={3} defaultValue={rereadObject.reaction}
                {...register("reaction")} disabled={watch("notread")} />
            </Form.Group>

            <Button variant="primary" type="submit">{submitText}</Button>
            <Button variant="secondary" type="button" className="ms-2" onClick={() => window.history.back()}>Cancel</Button>
        </Form>
    );

}

export default RereadForm;