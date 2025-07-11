import React, { useEffect, useState, useRef } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import moment from 'moment';
 
DataTable.use(DT);

function BookTable() {
    const [apiResponse, setApiResponse] = useState([]);
    const table = useRef(null);

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

    const customSearch = () => {
        let api = table.current.dt();
        let searchTerm = api.search();
        if (!searchTerm) {
            fetch(`${process.env.REACT_APP_API_URL}/books`)
                .then(res => res.json())
                .then(data => {
                    api.clear().rows.add(data).draw();
                });
        }
        fetch(`${process.env.REACT_APP_API_URL}/searchMyBooks?searchTerm=${encodeURIComponent(searchTerm)}`)
            .then(res => res.json())
            .then(data => {
                api.clear().rows.add(data).draw();
            });
    }

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
        },
        {
            title: ' ',
            render: (data, type, row) => {
                if (type === 'display') {
                    return `<a href="/book/${row._id}" class="btn btn-primary">See More</a>`;
                }
                return '';
            },
            width: '100px',
            
        }
    ];

    return (
        <div>
            <h2>Finished Books</h2>
            <button className="btn btn-secondary mb-3 float-end" onClick={customSearch}>Search All</button>
            <DataTable
                data={apiResponse && apiResponse.length > 0 ? apiResponse : []}
                columns={columns}
                ref={table}
                options={{
                    paging: true,
                    searching: true,
                    ordering: true,
                    order: [[4]],
                }}
            />
            <p><a href="/addBook" className="btn btn-primary">Add New Book</a></p>
        </div>
    );
}

export default BookTable;
