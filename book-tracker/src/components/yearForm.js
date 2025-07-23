import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';

function YearForm ({ handleChange }) {
    const [years, setYears] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/getYears`)
            .then(res => res.json())
            .then(setYears)
            .catch(err => console.error(err));
    },[]);

    const getYear = (yrObj) => {
        return yrObj._id;
    }

    return (
        <Form className="mt-3">
            <Form.Group className="mb-3" controlId="formYear">
                <Form.Label>Year</Form.Label>
                <Form.Select aria-label="select year" onChange={handleChange}>
                    { years.map((obj) => <option key={getYear(obj)}>{getYear(obj)}</option>) }
                </Form.Select>
            </Form.Group>
        </Form>
    );
}

export default YearForm;