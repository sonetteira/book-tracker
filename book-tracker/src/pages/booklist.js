import React, { useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import moment from 'moment';
 
DataTable.use(DT);

function BookTable() {
    const [apiResponse, setApiResponse] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/books`)
            .then(res => res.json())
            .then(setApiResponse)
            .catch(err => console.error(err));
    }, []);

    const capitalizeFirstLetter = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const columns = [
        { title: 'Title', data: 'title' },
        { title: 'Author', data: 'author' },
        { 
            title: 'Format', 
            data: 'format', 
            render: data => !data ? '' : capitalizeFirstLetter(data)
        },
        { title: 'Genre', data: 'genre' },
        { 
            title: 'Date Finished', 
            data: 'endDate',
            render: data => moment(data).format("MM/DD/YYYY")
        }
    ];

    return (
        <div>
            <h2>Book List</h2>
            <DataTable
                data={apiResponse}
                columns={columns}
                options={{
                    paging: true,
                    searching: true,
                    ordering: true,
                    order: [[4, 'desc']],
                }}
            />
        </div>
    );
}

export default BookTable;
