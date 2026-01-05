import { useState, useEffect } from 'react';
import YearForm from '../components/yearForm';
import Modal from '../components/modal';
import YearBookTable from '../components/bookTable';
import { SimpleTooltip, LabeledTooltip, TitledTooltip } from '../components/tooltips'
import GaugeChart from 'react-gauge-chart';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
 } from 'recharts';

function Report() {
    const [ reportDetails, setReportDetails ] = useState(null);
    const [years, setYears] = useState([]);
    const [ year, setYear ] = useState(new Date().getFullYear());
    const [ data, setData ] = useState({});
    const [ open, setOpen ] = useState(false);
    const [ order, setOrder ] = useState([0, 'asc']);
    
    // handle open close functions for modal
    const handleClose = () => { 
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    // find min and max for a given property in a json array
    const findMaxMin = (array, prop) => {
        var max, min;
        array.forEach(el => {
            if( max == null || el[prop] > max[prop] )
                max = el;
            if( min == null || el[prop] < min[prop] )
                min = el;
        });
        return {max: max, min: min};
    }

    // find the top count of a given breakdown prop in a json array
    const findTopCount = (array, nameProp, countProp, maxLen) => {
        let target = 0;
        let highCount = null;
        let names = [];
        if(array.length == 0) {
            // no data
            return null;
        }
        // if(reportDetails.recommenderBreakdown[0]._id == "")
        if(array[0][nameProp] == "")
            target++;
        // while(reportDetails.recommenderBreakdown.length > target && 
        // (highCount == null || reportDetails.recommenderBreakdown[target].count == highCount)) {
        while(array.length > target && (maxLen === undefined || names.length < maxLen) &&
        (highCount == null || array[target][countProp] == highCount)) {
            // highCount = reportDetails.recommenderBreakdown[target].count;
            // names.push(reportDetails.recommenderBreakdown[target]._id);
            highCount = array[target][countProp];
            names.push(array[target][nameProp]);
            target++;
        }
        return {
            name: names.join(', '),
            count: highCount
        }
    }

    const dateFormatter = (date) => {
        return new Date(date).toLocaleDateString('en-US', {timeZone: 'UTC'});
    }

    // get all available years
    // set year to the most recent available
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/getYears`)
            .then(res => res.json())
            .then((years) => {
                years.length > 0 && setYear(years[0]._id);
            })
            .catch(err => console.error(err));
    },[]);

    // get yearly report for given year
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/reports/yearly?year=${encodeURIComponent(year)}`)
            .then(res => res.json())
            .then(setReportDetails)
            .catch(err => console.error(err));
    }, [year]);

    // set a data variable with formatted variables for display, charts
    useEffect(() => {
        if (!reportDetails) return;
        // data is a set of objects formatted for recharts
        var poles = findMaxMin(reportDetails.readingSpeed, 'days');
        var speedPoles = findMaxMin(reportDetails.readingSpeed, 'pagesPerDay');
        setData({
            // total page count, new and reread books
            pageCount: {
                'newBooks': reportDetails.pageCount.length > 0 ? reportDetails.pageCount[0].totalPageCount : 0,
                'rereadBooks': reportDetails.rereadPageCount.length > 0 ?reportDetails.rereadPageCount[0].totalPageCount : 0
            },
            // longest and shortest books for bar chart
            longestShortest: [
                {
                    name: 'longest',
                    pgCount: reportDetails.longest.length > 0 ? reportDetails.longest[0].maxPages.pageCount : 0
                },
                {
                    name: 'shortest',
                    pgCount: reportDetails.shortest.length > 0 ? reportDetails.shortest[0].minPages.pageCount : 0
                }
            ],
            // find top author (excluding blank string)
            topAuthor: (function () {
                return findTopCount(reportDetails.authorBreakdown, '_id', 'count', 4);
            }()),
            // find top recommender (excluding blank string)
            topRecommender: (function () {
                return findTopCount(reportDetails.recommenderBreakdown, '_id', 'count');
            }()),
            // return quickest read
            quickestBook: (function () {
                if (reportDetails.readingSpeed.length == 0) {
                    return null;
                }
                return {
                    title: poles.min.title,
                    days: poles.min.days
                }
            }()),
            // return slowest read
            slowestBook: (function () {
                if (reportDetails.readingSpeed.length == 0) {
                    return null;
                }
                return {
                    title: poles.max.title,
                    days: poles.max.days
                }
            }()),
            // return quickest reading time
            quickest: (function () {
                if (reportDetails.readingSpeed.length == 0) {
                    return null;
                }
                return {
                    title: speedPoles.max.title,
                    days: speedPoles.max.days,
                    pagesPerDay: speedPoles.max.pagesPerDay
                }
            }()),
            // return slowest reading time
            slowest: (function () {
                if (reportDetails.readingSpeed.length == 0) {
                    return null;
                }
                return {
                    title: speedPoles.min.title,
                    days: speedPoles.min.days,
                    pagesPerDay: speedPoles.min.pagesPerDay
                }
            }())
        });
    }, [reportDetails])

    // handle changes on year form
    const handleChange = (e) => {
        e.preventDefault();
        setYear(e.target.value);
    }

    if (!reportDetails) return <><YearForm handleChange={handleChange}/><div>Loading...</div></>
    // if (data) console.log(data.pageCount);

    return (
        <>
        {/* page controls */}
        <div className="d-flex flex-row justify-content-around">
            <YearForm handleChange={handleChange}/>
            <p><a href={`../year/${year}`} className="btn btn-secondary btn-lg active" role="button">See new {year} books</a></p>
        </div>
        {/* Total Books and Total Pages gauges */}
        <div className="d-flex flex-row justify-content-around">
            <div className="p-2 m-2 grey-tile" onClick={(e) => {
                setOrder([0, 'asc']); handleOpen();
              }}>
                <h4 className="text-center">New Books Read</h4>
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
            {data && data.pageCount && 
            (<div className="p-2 m-2 grey-tile" onClick={(e) => {
                setOrder([2, 'asc']); handleOpen();
              }}>
                <h4 className="text-center">New Books Page Count</h4>
                <p className="text-center">{data.pageCount.newBooks.toLocaleString()}</p>
                {/* max pages set to 20,000 */}
                <GaugeChart id="gauge-chart2" 
                    colors={["#ffd25fff", "#51ff60ff"]} 
                    nrOfLevels={4} 
                    percent={data.pageCount.newBooks / 20000}
                    hideText={true}
                    needleColor="#cacaca"
                />
            </div>)}
            <div className="p-2 m-2 grey-tile">
                <h4 className="text-center">Total Books Read</h4>
                <p className="text-center">{reportDetails && (reportDetails.bookCount + reportDetails.rereadCount).toLocaleString()}</p>
                {/* max books set to 80 */}
                <GaugeChart id="gauge-chart2" 
                    colors={["#FF5F6D", "#515affff"]} 
                    nrOfLevels={4} 
                    percent={(reportDetails.bookCount + reportDetails.rereadCount) / 80}
                    hideText={true}
                    needleColor="#cacaca"
                />
                <p className="text-center">Rereads: {reportDetails.rereadCount.toLocaleString()}</p>
            </div>
            {data && data.pageCount && 
            (<div className="p-2 m-2 grey-tile">
                <h4 className="text-center">Total Page Count</h4>
                <p className="text-center">{(data.pageCount.newBooks + data.pageCount.rereadBooks).toLocaleString()}</p>
                {/* max pages set to 20,000 */}
                <GaugeChart id="gauge-chart2" 
                    colors={["#ffd25fff", "#51ff60ff"]} 
                    nrOfLevels={4} 
                    percent={(data.pageCount.newBooks + data.pageCount.rereadBooks) / 20000}
                    hideText={true}
                    needleColor="#cacaca"
                />
                <p className="text-center">Rereads: {data.pageCount.rereadBooks.toLocaleString()}</p>
            </div>)}
        </div>
        {/* Longest/Shortest book tiles, bar graph */}
        <div className="d-flex flex-row justify-content-around">
            {reportDetails && reportDetails.longest.length > 0 && 
            (<div className="p-3 m-3 grey-tile" onClick={(e) => {
                setOrder([2, 'desc']); handleOpen();
              }}>
                <h4 className="text-center">Longest Book</h4>
                <p className="text-center">{reportDetails.longest[0].maxPages.title}</p>
                <p className="text-center">Pages: {reportDetails.longest[0].maxPages.pageCount.toLocaleString()}</p>
            </div>)}
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
            {reportDetails && reportDetails.shortest.length > 0 &&
            (<div className="p-3 m-3 grey-tile" onClick={(e) => {
                setOrder([2, 'asc']); handleOpen();
              }}>
                <h4 className="text-center">Shortest Book</h4>
                <p className="text-center">{reportDetails.shortest[0].minPages.title}</p>
                <p className="text-center">Pages: {reportDetails.shortest[0].minPages.pageCount.toLocaleString()}</p>
            </div>)}
        </div>
        {/* bar graphs for format and genre breakdowns */}
        <div className="d-flex flex-row justify-content-around">
            <div className="p-2 m-3 grey-tile" onClick={(e) => {
                setOrder([4, 'asc']); handleOpen();
              }}>
                <h4 className="text-center">Formats</h4>
                    <BarChart
                    width={400}
                    height={300}
                    data={reportDetails.formatBreakdown}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" stroke="#84ceff" />
                    <YAxis stroke="#84ceff" />
                    <Tooltip content={SimpleTooltip} isAnimationActive={false} cursor={false} offset={-15} />
                    <Bar dataKey="count" fill="#82ca9d" activeBar={<Rectangle fill="gray" stroke="black" />} />
                    </BarChart>
            </div>
            <div className="p-4 m-3 grey-tile" onClick={(e) => {
                setOrder([3, 'asc']); handleOpen();
              }}>
                <h4 className="text-center">Genres</h4>
                <BarChart
                width={800}
                height={300}
                data={reportDetails.genreBreakdown}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" stroke="#84ceff" />
                    <YAxis stroke="#84ceff" />
                    <Tooltip content={LabeledTooltip} isAnimationActive={false} cursor={false} offset={-15} />
                    <Bar dataKey="count" fill="#82ca9d" activeBar={<Rectangle fill="gray" stroke="black" />} />
                </BarChart>
            </div>
        </div>
        {/* Authors: top, bar chart of top 5 */}
        {data.topAuthor && data.topAuthor.count != null && 
        (<div className="d-flex flex-row justify-content-around">
            <div className="p-3 m-3 grey-tile" onClick={(e) => {
                setOrder([1, 'asc']); handleOpen();
              }}>
                <h4 className="text-center">Top Author</h4>
                <p className="text-center">{data.topAuthor.name}</p>
                <p className="text-center">Total Books: {data.topAuthor.count}</p>
            </div>
            <div className="p-4 m-3 grey-tile w-50" onClick={(e) => {
                setOrder([1, 'asc']); handleOpen();
              }}>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                width={500}
                height={300}
                data={reportDetails.authorBreakdown.filter(o => o._id != "").slice(0,5)}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" stroke="#84ceff" />
                    <YAxis stroke="#84ceff" />
                    <Tooltip content={LabeledTooltip} isAnimationActive={false} cursor={false} offset={-15} />
                    <Bar dataKey="count" fill="#82ca9d" activeBar={<Rectangle fill="gray" stroke="black" />} />
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>) }
        {/* Recommender: top, bar chart */}
        {data.topRecommender && data.topRecommender.count != null && 
        (<div className="d-flex flex-row justify-content-around">
            <div className="p-3 m-3 grey-tile" onClick={(e) => {
                setOrder([5, 'desc']); handleOpen();
              }}>
                <h4 className="text-center">Top Recommender</h4>
                <p className="text-center">{data.topRecommender.name}</p>
                <p className="text-center">Books Recommended: {data.topRecommender.count}</p>
            </div>
            <div className="p-4 m-3 grey-tile w-50" onClick={(e) => {
                setOrder([5, 'desc']); handleOpen();
              }}>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                width={500}
                height={300}
                data={reportDetails.recommenderBreakdown.filter(o => o._id != "")}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" stroke="#84ceff" />
                    <YAxis stroke="#84ceff" />
                    <Tooltip content={LabeledTooltip} isAnimationActive={false} cursor={false} offset={-15} />
                    <Bar dataKey="count" fill="#82ca9d" activeBar={<Rectangle fill="gray" stroke="black" />} />
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>) }
        {/* Total duration, speed tiles */}
        <div className="d-flex flex-row justify-content-around">
            {data.quickestBook && (<div className="p-3 m-3 grey-tile" onClick={(e) => {
                setOrder([6, 'asc']); handleOpen();
              }}>
                <h4 className="text-center">Fastest Book</h4>
                <p className="text-center">{data.quickestBook.title}: {data.quickestBook.days} Days</p>
            </div>) }
            {data.quickest && (<div className="p-3 m-3 grey-tile" onClick={(e) => {
                setOrder([7, 'desc']); handleOpen();
              }}>
                <h4 className="text-center">Fastest Reading Speed</h4>
                <p className="text-center">{data.quickest.title}: {data.quickest.days} Days</p>
                <p className="text-center">Pages Per Day: {Math.round(data.quickest.pagesPerDay)}</p>
            </div>) }
            {data.slowestBook && (<div className="p-3 m-3 grey-tile" onClick={(e) => {
                setOrder([6, 'desc']); handleOpen();
              }}>
                <h4 className="text-center">Slowest Book</h4>
                <p className="text-center">{data.slowestBook.title}: {data.slowestBook.days} Days</p>
            </div>) }
            {data.slowest && (<div className="p-3 m-3 grey-tile" onClick={(e) => {
                setOrder([7, 'asc']); handleOpen();
              }}>
                <h4 className="text-center">Slowest Reading Speed</h4>
                <p className="text-center">{data.slowest.title}: {data.slowest.days} Days</p>
                <p className="text-center">Pages Per Day: {Math.round(data.slowest.pagesPerDay)}</p>
            </div>) }
        </div>
        {/* Reading speed line graph */}
        { reportDetails.readingSpeed.length > 0 && (<div className="d-flex flex-row justify-content-around">
            <div className="p-3 m-3 grey-tile" onClick={(e) => {
                setOrder([0, 'asc']); handleOpen();
              }}>
                <h4 className="text-center">Reading Speed</h4>
                <LineChart width={730} height={250} data={reportDetails.readingSpeed}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="endDate" stroke="#84ceff" tickFormatter={dateFormatter} />
                    <YAxis stroke="#84ceff" />
                    <Tooltip includeHidden={true} content={TitledTooltip}/>
                    <Line type="monotone" dataKey="pagesPerDay" stroke="#8884d8" />
                    {/* hidden "lines" for inclusion in customized tooltip */}
                    <Line dataKey="title" hide={true} /> 
                    <Line dataKey="pageCount" hide={true} />
                    <Line dataKey="days" hide={true} />
                </LineChart>
            </div>
        </div> )}
        {/* modal book table with order customized by which chart was clicked */}
        <Modal isOpen={open} onClose={handleClose}>
            <YearBookTable year={year} startOrder={order} ></YearBookTable>
        </Modal>
        </>
    );
}

export default Report;