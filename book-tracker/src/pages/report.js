import { useState, useEffect } from 'react';
import YearForm from '../components/yearForm';
import GaugeChart from 'react-gauge-chart'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Report() {
    const [ reportDetails, setReportDetails ] = useState(null);
    const [ year, setYear ] = useState(new Date().getFullYear());
    const [ data, setData ] = useState({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/reports/yearly?year=${encodeURIComponent(year)}`)
            .then(res => res.json())
            .then(setReportDetails)
            .catch(err => console.error(err));
    }, [year]);

    useEffect(() => {
        if (!reportDetails) return;
        setData({
            longestShortest: [
                {
                    name: 'longest',
                    pgCount: reportDetails.longest[0].maxPages.pageCount
                },
                {
                    name: 'shortest',
                    pgCount: reportDetails.shortest[0].minPages.pageCount
                }
            ]
        });
    }, [reportDetails])

    const handleChange = (e) => {
        e.preventDefault();
        setYear(e.target.value);
    }

    if (!reportDetails) return <><YearForm handleChange={handleChange}/><div>Loading...</div></>

    return (
        <>
        <div className="d-flex flex-row justify-content-around">
            <YearForm handleChange={handleChange}/>
            <p><a href={`../year/${year}`} class="btn btn-secondary btn-lg active" role="button">See all {year} books</a></p>
        </div>
        <div className="d-flex flex-row justify-content-around">
            <div className="p-2 m-3 grey-tile">
                <h4 className="text-center">Total Books Read</h4>
                <p className="text-center">{reportDetails && reportDetails.bookCount.toLocaleString()}</p>
                {/* max books set to 80 */}
                <GaugeChart id="gauge-chart2" 
                    colors={["#FF5F6D", "#515affff"]} 
                    nrOfLevels={4} 
                    percent={reportDetails.bookCount / 80}
                    hideText={true}
                    needleColor="#cacaca"
                />
            </div>
            <div className="p-2 m-3 grey-tile">
                <h4 className="text-center">Total Page Count</h4>
                <p className="text-center">{reportDetails && reportDetails.pageCount[0].totalPageCount.toLocaleString()}</p>
                {/* max pages set to 20,000 */}
                <GaugeChart id="gauge-chart2" 
                    colors={["#ffd25fff", "#51ff60ff"]} 
                    nrOfLevels={4} 
                    percent={reportDetails.pageCount[0].totalPageCount / 20000}
                    hideText={true}
                    needleColor="#cacaca"
                />
            </div>
        </div>
        <div className="d-flex flex-row justify-content-around">
            <div className="p-3 m-3 grey-tile">
                <h4 className="text-center">Longest Book</h4>
                <p className="text-center">{reportDetails.longest[0].maxPages.title}</p>
                <p className="text-center">Pages: {reportDetails.longest[0].maxPages.pageCount.toLocaleString()}</p>
            </div>
            <div className="p-2 m-3 grey-tile w-50">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    width={500}
                    height={300}
                    data={data.longestShortest}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#84ceff" />
                    <YAxis stroke="#84ceff" />
                    <Bar dataKey="pgCount" fill="#82ca9d" activeBar={<Rectangle fill="gray" stroke="black" />} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="p-3 m-3 grey-tile">
                <h4 className="text-center">Shortest Book</h4>
                <p className="text-center">{reportDetails.shortest[0].minPages.title}</p>
                <p className="text-center">Pages: {reportDetails.shortest[0].minPages.pageCount.toLocaleString()}</p>
            </div>
        </div>
        </>
    );
}

export default Report;