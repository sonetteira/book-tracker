import React from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import moment from 'moment';
 
DataTable.use(DT);

class BookTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };
    }

    callAPI() {
        fetch(`${process.env.REACT_APP_API_URL}/books`)
        .then(res => res.json())
        .then(res => this.setState({ apiResponse: res }))
        .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }

    capitalizeFirstLetter(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    
    render() {
        const columns = [
            { name: 'Title', data: 'title' },
            { name: 'Author', data: 'author' },
            { name: 'Format', data: 'format', format: row => this.capitalizeFirstLetter(row.format) },
            { name: 'Genre', data: 'genre' },
            { name: 'Date Finished', data: 'endDate', format: row => moment(row.timestamp).format('lll') },
        ];
        return (
            <div>
                <h2>Book List</h2>
                <DataTable
                    data={this.state.apiResponse}
                    columns={columns}
                    options={{
                        paging: true,
                        searching: true,
                        ordering: true,
                        order: [[4, 'desc']], // Order by Date Finished descending
                    }}
                />
            </div>
        );
    }
}

export default BookTable;
