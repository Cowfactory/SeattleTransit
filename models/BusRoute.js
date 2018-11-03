const mongoose = require('mongoose');

const busRouteSchema = new mongoose.Schema({
    route_id: {
        type: Number,
        required: true
    },
    route_short_name: {
        type: String,
        required: true
    },
    route_long_name: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('BusRoute', busRouteSchema);