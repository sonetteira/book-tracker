import { useState, useEffect } from 'react';
import YearForm from '../components/yearForm';
import Modal from '../components/modal';
import YearBookTable from '../components/bookTable';
import GaugeChart from 'react-gauge-chart';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Report() {
    const [ reportDetails, setReportDetails ] = useState(null);
    const [ year, setYear ] = useState(new Date().getFullYear());
    const [ data, setData ] = useState({});
    const [ open, setOpen ] = useState(false);
    const [ order, setOrder ] = useState([0, 'asc']);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const SimpleTooltip = ({ active, payload, label }) => {
        const isVisible = active && payload && payload.length;
        return (
          <div className="custom-tooltip" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
            {isVisible && (
                <p>{`${payload[0].value}`}</p>
            )}
          </div>
        );
    };

    const LabeledTooltip = ({ active, payload, label }) => {
        const isVisible = active && payload && payload.length;
        return (
          <div className="custom-tooltip" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
            {isVisible && (
                <>
                <p className="label">{label}<br />
                {payload[0].value}</p>
                </>
            )}
          </div>
        );
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/reports/yearly?year=${encodeURIComponent(year)}`)
            .then(res => res.json())
            .then(setReportDetails)
            .catch(err => console.error(err));
    }, [year]);

    useEffect(() => {
        if (!reportDetails) return;
        // data is a set of objects formatted for recharts
        setData({
            // longest and shortest books for bar chart
            longestShortest: [
                {
                    name: 'longest',
                    pgCount: reportDetails.longest[0].maxPages.pageCount
                },
                {
                    name: 'shortest',
                    pgCount: reportDetails.shortest[0].minPages.pageCount
                }
            ],
            // map format breakdown for bar chart
            formatBreakdown: (function () {
                return reportDetails.formatBreakdown.map(o => ({name: o._id, count: o.count}));
            }()),
            // map genre breakdown for bar chart
            genreBreakdown: (function () {
                return reportDetails.genreBreakdown.map(o => ({name: o._id, count: o.count}));
            }()),
            // choose top recommender (excluding blank string)
            topRecommender: (function () {
                let target = 0;
                if(reportDetails.recommenderBreakdown.length == 0) {
                    // no data
                    return null;
                }
                if(reportDetails.recommenderBreakdown[0]._id == "") {
                    if(reportDetails.recommenderBreakdown.length > 1) {
                        // blank, return second entry
                        target = 1;
                    } else {
                        return null;
                    }
                }
                return {
                    name: reportDetails.recommenderBreakdown[target]._id,
                    count: reportDetails.recommenderBreakdown[target].count
                }
            }()),
            // return quickest read
            quickest: (function () {
                if (reportDetails.readingSpeed.length == 0) {
                    return null;
                }
                return {
                    title: reportDetails.readingSpeed[0].title,
                    days: reportDetails.readingSpeed[0].days,
                    pagesPerDay: reportDetails.readingSpeed[0].pagesPerDay
                }
            }()),
            // return slowest read
            slowest: (function () {
                if (reportDetails.readingSpeed.length == 0) {
                    return null;
                }
                return {
                    title: reportDetails.readingSpeed[reportDetails.readingSpeed.length - 1].title,
                    days: reportDetails.readingSpeed[reportDetails.readingSpeed.length - 1].days,
                    pagesPerDay: reportDetails.readingSpeed[reportDetails.readingSpeed.length - 1].pagesPerDay
                }
            }()),
        });
    }, [reportDetails])

    const handleChange = (e) => {
        e.preventDefault();
        setYear(e.target.value);
    }

    if (!reportDetails) return <><YearForm handleChange={handleChange}/><div>Loading...</div></>
    // if (data) console.log(data);

    return (
        <>
        <div className="d-flex flex-row justify-content-around">
            <YearForm handleChange={handleChange}/>
            <p><a href={`../year/${year}`} className="btn btn-secondary btn-lg active" role="button">See all {year} books</a></p>
        </div>
        <div className="d-flex flex-row justify-content-around">
            <div className="p-2 m-3 grey-tile" onClick={(e) => {
                setOrder([0, 'asc']); handleOpen();
              }}>
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
            <div className="p-2 m-3 grey-tile" onClick={(e) => {
                setOrder([2, 'asc']); handleOpen();
              }}>
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
            <div className="p-3 m-3 grey-tile" onClick={(e) => {
                setOrder([2, 'desc']); handleOpen();
              }}>
                <h4 className="text-center">Longest Book</h4>
                <p className="text-center">{reportDetails.longest[0].maxPages.title}</p>
                <p className="text-center">Pages: {reportDetails.longest[0].maxPages.pageCount.toLocaleString()}</p>
            </div>
            <div className="p-2 m-3 grey-tile w-50" onClick={(e) => {
                setOrder([2, 'asc']); handleOpen();
              }}>
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
                    <Bar dataKey="pgCount" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="p-3 m-3 grey-tile" onClick={(e) => {
                setOrder([2, 'asc']); handleOpen();
              }}>
                <h4 className="text-center">Shortest Book</h4>
                <p className="text-center">{reportDetails.shortest[0].minPages.title}</p>
                <p className="text-center">Pages: {reportDetails.shortest[0].minPages.pageCount.toLocaleString()}</p>
            </div>
        </div>
        <div className="d-flex flex-row justify-content-around">
            <div className="p-2 m-3 grey-tile" onClick={(e) => {
                setOrder([4, 'asc']); handleOpen();
              }}>
                <h4 className="text-center">Formats</h4>
                {/* <ResponsiveContainer width="100%" height="100%"> */}
                    <BarChart
                    width={400}
                    height={300}
                    data={data.formatBreakdown}
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
                    <Tooltip content={SimpleTooltip} isAnimationActive={false} cursor={false} offset={-15} />
                    <Bar dataKey="count" fill="#82ca9d" activeBar={<Rectangle fill="gray" stroke="black" />} />
                    </BarChart>
                {/* </ResponsiveContainer> */}
            </div>
            <div className="p-4 m-3 grey-tile" onClick={(e) => {
                setOrder([3, 'asc']); handleOpen();
              }}>
                <h4 className="text-center">Genres</h4>
                {/* <ResponsiveContainer width="100%" height="100%"> */}
                    <BarChart
                    width={800}
                    height={300}
                    data={data.genreBreakdown}
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
                    <Tooltip content={LabeledTooltip} isAnimationActive={false} cursor={false} offset={-15} />
                    <Bar dataKey="count" fill="#82ca9d" activeBar={<Rectangle fill="gray" stroke="black" />} />
                    </BarChart>
                {/* </ResponsiveContainer> */}
            </div>
        </div>
        <div className="d-flex flex-row justify-content-around">
            {data.topRecommender && (<div className="p-3 m-3 grey-tile">
                <h4 className="text-center">Top Recommender</h4>
                <p className="text-center">{data.topRecommender.name}</p>
                <p className="text-center">Book Count: {data.topRecommender.count}</p>
            </div>) }
            {data.quickest && (<div className="p-3 m-3 grey-tile">
                <h4 className="text-center">Fastest Read</h4>
                <p className="text-center">{data.quickest.title}: {data.quickest.days} Days</p>
                <p className="text-center">Pages Per Day: {Math.round(data.quickest.pagesPerDay)}</p>
            </div>) }
            {data.slowest && (<div className="p-3 m-3 grey-tile">
                <h4 className="text-center">Slowest Read</h4>
                <p className="text-center">{data.slowest.title}: {data.slowest.days} Days</p>
                <p className="text-center">Pages Per Day: {Math.round(data.slowest.pagesPerDay)}</p>
            </div>) }
        </div>
        <Modal isOpen={open} onClose={handleClose}>
            <YearBookTable year={year} startOrder={order} ></YearBookTable>
        </Modal>
        </>
    );
}

export default Report;