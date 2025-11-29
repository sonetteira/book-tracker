// object for displaying rereads

function Reread({ i, rr, clickHandler }) {
    return (
        <>
        <p><strong>Start Date:</strong> {rr.startDate && new Date(rr.startDate).toLocaleDateString('en-US', {timeZone: 'UTC'})}</p>
        <p><strong>Date Finished:</strong> {rr.endDate && new Date(rr.endDate).toLocaleDateString('en-US', {timeZone: 'UTC'})}</p>
        {rr.reaction && <p><strong>Reaction:</strong> {rr.reaction}</p>}
        <button id={i} className='btn btn-outline-primary btn-sm' onClick={clickHandler}>Edit Reread</button>
        </>
    );
}



export default Reread;