const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        required: true
    },
    bio: String,
    favoriteStops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stop' }],
    
    // reminders: {} // Stretch goal
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
