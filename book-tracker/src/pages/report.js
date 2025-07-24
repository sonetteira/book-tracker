import { useState, useEffect } from 'react';
import YearForm from '../components/yearForm';

function Report() {
    const [ reportDetails, setReportDetails ] = useState(null);
    const [ year, setYear ] = useState(new Date().getFullYear());

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/reports/yearly?year=${encodeURIComponent(year)}`)
            .then(res => res.json())
            .then(setReportDetails)
            .catch(err => console.error(err));
    }, [year]);

    const handleChange = (e) => {
        e.preventDefault();
        setYear(e.target.value);
    }

    if (!reportDetails) return <><YearForm handleChange={handleChange}/><div>Loading...</div></>

    return (
        <>
        <YearForm handleChange={handleChange}/>
        <div class="d-flex flex-row justify-content-around">
            <div class="p-3"><h4>Total Books Read:</h4>
                {reportDetails && reportDetails.bookCount.toLocaleString()}</div>
            <div class="p-3"><h4>Total Page Count:</h4>
                {reportDetails && reportDetails.pageCount[0].totalPageCount.toLocaleString()}</div>

            <div class="p-3"><h3>Longest Book</h3>{reportDetails.longest[0].maxPages.title}<br/>
                Pages: {reportDetails.longest[0].maxPages.pageCount.toLocaleString()}</div>
            <div class="p-3"><h3>Shortest Book</h3>{reportDetails.shortest[0].minPages.title}<br/>
                Pages: {reportDetails.shortest[0].minPages.pageCount.toLocaleString()}</div>
        </div>
        </>
    );
}

export default Report;