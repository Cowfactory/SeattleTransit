const router = require('express').Router();
const axios = require('axios');

API_ENDPOINT = 'http://api.pugetsound.onebusaway.org/api/where'
OBA_KEY = process.env.ONEBUSAWAY_APIKEY;
STOPS_FOR_LOCATION = `${API_ENDPOINT}stops-for-location.json${OBA_KEY}`

// Query OneBusAway API for all Bus Stops near a latitude and longitude
router.get('/stopsAtLocation', function(req, res, next) {
    // If OneBusAway API fails to respond - return a 500 code
    setTimeout(function() {
        res.status(500);
    }, 1000);

    axios.get(`${API_ENDPOINT}/stops-for-location.json`, {
        params: {
            key: OBA_KEY,
            lat: req.query.lat,
            lon: req.query.lon,
            radius: 300
        }
        })
        .then(response => {
            stops = response.data.data.list;
            res.status(200).json(stops);
        })
        .catch(err => {
            res.status(500);
        })
});

// Query OneBusAway API for the details of a particular Stop - including bus data 
router.get('/stopDetails', function(req, res, next) {
    // If OneBusAway API fails to respond - return a 500 code
    setTimeout(function() {
        res.status(500);
    }, 1000);

    axios.get(`${API_ENDPOINT}/arrivals-and-departures-for-stop/${req.query.stopid}.json?key=${OBA_KEY}`)
        .then(response => {
            arrivalsAndDepartures = response.data.data.entry.arrivalsAndDepartures;
            res.status(200).json(arrivalsAndDepartures);
        })
        .catch(err => {
            res.status(500);
        })
})

module.exports = router;