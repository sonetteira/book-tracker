import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
 
DataTable.use(DT);

function BookTable() {
    const [apiResponse, setApiResponse] = useState([]);
    const table = useRef(null);
    const urlParams = useParams();
    var toReadSet = urlParams.view && urlParams.view.toLocaleUpperCase() === 'TOREAD';
    var yearSet = urlParams.view && urlParams.view.toLocaleUpperCase() === 'YEAR';
    var year = urlParams.year;

    const apiCall = (() => { 
        // set the apiCall variable with the correct url based on the view params
        if(toReadSet)
            return 'books?toread=T';
        else if(yearSet)
            return `yearBooks?year=${year}`;
        else
            return 'books';
    })();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/${apiCall}`)
            .then(res => res.json())
            .then(setApiResponse)
            .catch(err => console.error(err));
    }, [yearSet, year, toReadSet]);

    useEffect(() => {
        // handle enter key event on search bar
        const handleKeyDown = event => {
            if(event.key === 'Enter'){
                customSearch();
            }
        };
        // yes this is ugly. don't worry about it.
        let searchInput = document.getElementById('dt-search-1');
        // console.log(`search input: ${searchInput}`);
        if(searchInput) {
            searchInput.addEventListener('keydown', handleKeyDown);

            return () => {
                searchInput.removeEventListener('onKeyDown', handleKeyDown);
            };
        }        
      }, [table]);

    const capitalizeFirstLetter = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const customSearch = () => {
        let api = table.current.dt();
        let searchTerm = api.search();
        if (!searchTerm) {
            fetch(`${process.env.REACT_APP_API_URL}/${apiCall}`)
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

    const finishedViewColumns = [ //columns included only if viewing finished books
        { 
            title: 'Date Finished', 
            data: 'endDate',
            render: data => {
                if (!data) return '';
                return new Date(data).toLocaleDateString('en-US', {timeZone: 'UTC'});
            }
        },
    ];

    const allViewColumns = [ 
        //columns included in all views
        { title: 'Title', data: 'title' },
        { title: 'Author', data: 'author' },
        { 
            title: 'Format', 
            data: 'format', 
            render: data => !data ? '' : capitalizeFirstLetter(data)
        },
        { title: 'Genre', data: 'genre' },
    ];

    const seeMoreColumns = [
        // see more column
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

    // set columns based on view
    const columns = toReadSet ? [...allViewColumns, ...seeMoreColumns] : [...allViewColumns, ...finishedViewColumns, ...seeMoreColumns]

    return (
        <div>
            <title>{toReadSet ? 'Books To Read' : 'Finished Books'}</title>
            <h2>{toReadSet ? 'Books To Read' : 'Finished Books'}</h2>
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
