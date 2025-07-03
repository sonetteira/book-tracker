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
            { title: 'Title', data: 'title' },
            { title: 'Author', data: 'author' },
            { title: 'Format', data: 'format', render: data => !data ? '' : data.charAt(0).toUpperCase() + data.slice(1)},
            { title: 'Genre', data: 'genre' },
            { title: 'Date Finished', data: 'endDate', 
                render: data => moment(data).format("MM/DD/YYYY") }, 
                // Prefer Mon DD, YYYY format?
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
