const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    stop_name: {
        type: String,
        required: true
    },
    stop_id: {
        type: String,
        required: true
    },
    stop_lat: {
        type: Number,
        required: true
    },
    stop_lon: {
        type: Number,
        required: true
    },
    stop_direction: String,
    stop_routeIds: [{ type: String }],    
    stop_routes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute' }]    
}, {
    timestamps: true
});

module.exports = mongoose.model('Stop', stopSchema);