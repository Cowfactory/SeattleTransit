const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true
    },
    intersection: {
        type: String,
        required: true
    },
    buslines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BusLine' }]    
}, {
    timestamps: true
});

module.exports = mongoose.model('Stop', stopSchema);