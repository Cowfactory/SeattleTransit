var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

// database connection event
mongoose.connection.once('open', function () {
    console.log(`Mongoose connected to: ${process.env.MONGODB_URI}`);
});

mongoose.connection.on('error', function(err) {
    console.error(`Database error:\n${err}`);
});