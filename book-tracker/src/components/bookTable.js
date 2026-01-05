import { useEffect, useState } from "react";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';

DataTable.use(DT);

function YearBookTable({year, startOrder, rereads = false}) {
    // console.log(startOrder);
    const [apiResponse, setApiResponse] = useState([]);
    const [apiEndpoint, setapiEndpoint] = useState('yearBooks');

    // use the rereads flag to handle whether to get from the 
    // yearBooks or yearRereads api endpoint
    useEffect(() => {
        if(rereads) {
            setapiEndpoint('yearRereads');
        } 
        // otherwise use default yearBooks
    }, [rereads]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/${apiEndpoint}?year=${year}`)
            .then(res => res.json())
            .then(setApiResponse)
            .catch(err => console.error(err));
    }, [year, apiEndpoint]);
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
        { title: 'Days', data: 'days' },
        { title: 'Pages per Day', data: 'pagesPerDay', render: data => !data ? '' : Math.round(data) }
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
                    order: [...startOrder],
                    // order: [[0, 'asc']]
                }}
            />
        </div>
    );
}

export default YearBookTable;