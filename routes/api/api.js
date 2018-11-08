const router = require('express').Router();
const axios = require('axios');

API_ENDPOINT = 'http://api.pugetsound.onebusaway.org/api/where'
OBA_KEY = process.env.ONEBUSAWAY_APIKEY;
STOPS_FOR_LOCATION = `${API_ENDPOINT}stops-for-location.json${OBA_KEY}`

// const CancelToken = axios.CancelToken;
// const source = CancelToken.source();

// Query OneBusAway API for all Bus Stops near a latitude and longitude
router.get('/stopsAtLocation', function(req, res, next) {
    // If OneBusAway API fails to respond - return a 500 code
    // setTimeout(function() {
    //     source.cancel('Request timed out');
    // }, 20000); //Responses up to 20 seconds late are acceptable

    axios.get(`${API_ENDPOINT}/stops-for-location.json`, {
        params: {
            key: OBA_KEY,
            lat: req.query.lat,
            lon: req.query.lon,
            radius: 300
        }})//, 
        //cancelToken: source.token })
    .then(response => {
        stops = response.data.data.list;
        res.status(200).json(stops);
    })
    .catch(err => {
        // if(axios.isCancel(err)) {
        //     console.log(`GET request to OneBusAway /stops-for-location failed, reason: ${err.message}`);
        //     res.status(500);
        // } else {
            console.log("Error in GET request to /stopsAtLocation");
            res.status(500);
        //}
        })
});

// Query OneBusAway API for the details of a particular Stop - including bus data 
router.get('/stopDetails', function(req, res, next) {
    // If OneBusAway API fails to respond - return a 500 code
    // setTimeout(function() {
    //     source.cancel('Request timed out');
    // }, 20000);

    // Get Data
    axios.get(`${API_ENDPOINT}/arrivals-and-departures-for-stop/${req.query.stopid}.json?key=${OBA_KEY}`)//,
        // { cancelToken: source.token })
    // Then send JSON to application
    .then(response => {
        arrivalsAndDepartures = response.data.data.entry.arrivalsAndDepartures;
        res.status(200).json(arrivalsAndDepartures);
    })
    // If an error happens
    .catch(err => {
        // if(axios.isCancel(err)) {
        //     console.log(`GET request to OneBusAway /arrivals-and-departures-for-stop failed, reason: ${err.message}`);
        //     res.status(500);
        // } else {
            console.log("Error in GET request to /stopDetails");
            res.status(500);
        //}
    });

})

module.exports = router;