// custom tooltips for reports

const SimpleTooltip = ({ active, payload }) => {
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

const TitledTooltip = ({ active, payload, label }) => {
    const isVisible = active && payload && payload.length;
    return (
        <div className="custom-tooltip no-border-radius" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
        {isVisible && (
            <>
            <p className="label">Title: { payload[1].value }<br />
            { Math.round(payload[0].value) } pages per day<br />
            { payload[2] != undefined && (<>Book Length: { payload[2].value } pages<br /></>)}
            { payload[3] != undefined && (<>Reading Time: { payload[3].value } days</>)}
            </p>
            </>
        )}
        </div>
    );
};

export {
    SimpleTooltip, 
    LabeledTooltip,
    TitledTooltip
}