const router = require('express').Router();
const axios = require('axios');

API_ENDPOINT = 'http://api.pugetsound.onebusaway.org/api/where'
OBA_KEY = process.env.ONEBUSAWAY_APIKEY;

STOPS_FOR_LOCATION = `${API_ENDPOINT}stops-for-location.json${OBA_KEY}`

router.get('/stopsAtLocation', function (req, res, next) {
    getStopsForLocation(req.query.lat, req.query.lon)
        .then(response => {
            stops = response.data.data.list;
            res.status(200).json(stops);
        })
        .catch(err => {
            res.status(404);
        })
});

function getStopsForLocation(lat, lon) {
    try {
        return axios.get(`${API_ENDPOINT}/stops-for-location.json`, {
            params: {
                key: OBA_KEY,
                lat: lat,
                lon: lon
            }
        });
    } catch (error) {
        console.error(`${error}`);
    }
}

module.exports = router;