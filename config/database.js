var mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

// database connection event
mongoose.connection.once('open', function () {
    console.log(`Mongoose connected to: ${process.env.DATABASE_URL}`);
});

mongoose.connection.on('error', function(err) {
    console.error(`Database error:\n${err}`);
});