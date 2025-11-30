import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// object for displaying rereads
function Reread({ i, rr, editHandler, ref }) {
    return (
        <>
        <p><strong>Start Date:</strong> {rr.startDate && new Date(rr.startDate).toLocaleDateString('en-US', {timeZone: 'UTC'})}</p>
        <p><strong>Date Finished:</strong> {rr.endDate && new Date(rr.endDate).toLocaleDateString('en-US', {timeZone: 'UTC'})}</p>
        {rr.reaction && <p><strong>Reaction:</strong> {rr.reaction}</p>}
        <Form onSubmit={editHandler}>
            <Form.Control type='hidden' name='index' ref={ref} defaultValue={i}></Form.Control>
            <button className='btn btn-outline-primary btn-sm' type="submit">Edit Reread</button>
        </Form>
        </>
    );
}



export default Reread;