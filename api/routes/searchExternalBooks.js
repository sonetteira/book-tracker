var express = require("express");
var router = express.Router();
const searchEndpoint = 'search.json?q=';

const search = (query) => {
    return fetch(`${process.env.BOOK_SEARCH_API_URL}/${searchEndpoint}${query}`)
    .then(res => res.json())
    .catch(err => console.error(err));
}

router.get("/", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ message: 'Query parameter "q" is required.' });
    }
    
    try {
        const response = await search(query);
        res.json(response);
    } catch (err) {
        console.error('Error searching books:', err);
        res.status(500).json({ message: 'Error searching books.' });
    }
});

module.exports = router;