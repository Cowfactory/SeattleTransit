require('dotenv').config();
require('./database');

const axios = require('axios');
const mongoose = require('mongoose');
const Stop = require('../models/Stop');
const URL = `http://api.pugetsound.onebusaway.org/api/where/stops-for-location.json?key=${process.env.ONEBUSAWAY_APIKEY}&lat=47.653435&lon=-122.305641&radius=500`

mongoose.connection.on('open', () => {
    // 1. Delete everything from db
    Stop.deleteMany({}, () => {
        console.log("Deleted all Stop documents from Collection")
    })
    // 2. Populate db w/ stops from OneBusAway API
    .then(() => {
        saveStops();
    })
    .catch(err => {
        console.log(err);
        process.exit();
    });
})


function saveStops() {
    queryAPIForAllStops()
        .then(response => {
            if(typeof response === undefined || typeof response.data.data.list === undefined) {
                console.log("No data received");
                Promise.reject("No data received");
            }

            stops = response.data.data.list;
            console.log("Stop list received. Writing stops to database...");

            let stopCount = 0;
            stops.forEach(stop => {
                Stop.create({
                    stop_name: stop.name,
                    stop_id: stop.id,
                    stop_lat: stop.lat,
                    stop_lon: stop.lon,
                    stop_direction: stop.direction,
                    stop_routesIds: stop.routeIds
                })
                stopCount++;
            })
            console.log(`Wrote ${stopCount} stops to database`);
            process.exit();
        })
        .catch(err => {
            console.log(err);
            process.exit();
        })
}

function queryAPIForAllStops() {
    try {
        console.log("Querying OneBusAway for stop list...")
        return axios.get(URL);
    } catch (error) {
        console.log(`${error}`);
        process.exit();
    }
}
