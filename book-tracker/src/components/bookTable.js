import { useEffect, useState } from "react";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';

DataTable.use(DT);

function YearBookTable({year, startOrder}) {
    console.log(startOrder);
    const [apiResponse, setApiResponse] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/yearBooks?year=${year}`)
            .then(res => res.json())
            .then(setApiResponse)
            .catch(err => console.error(err));
    }, [year]);
    // this isn't going to give read time. more efficient to calculate w/ express

    const capitalizeFirstLetter = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const columns = [
        { title: 'Title', data: 'title' },
        { title: 'Author', data: 'author' },
        { title: 'Page Count', data: 'pageCount' },
        { title: 'Genre', data: 'genre' },
        { 
            title: 'Format', 
            data: 'format', 
            render: data => !data ? '' : capitalizeFirstLetter(data)
        },
        { title: 'Recommender', data: 'recommender' },
        // read time
    ]

    return (
        <div>
            <DataTable
                data={apiResponse && apiResponse.length > 0 ? apiResponse : []}
                columns={columns}
                options={{
                    paging: true,
                    pageLength: 25,
                    searching: false,
                    ordering: true,
                    // order: [[{startOrder}]],
                    order: [[0, 'asc']]
                }}
            />
        </div>
    );
}

export default YearBookTable;