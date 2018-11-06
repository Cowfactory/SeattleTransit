/*
*  'geolocation' uses the browser's geolocation API to query the user's latitude and longitude 
*
*/
const geolocation = (() => {
    var options = {
        enableHighAccuracy: true,
        timeout: 3000, // Err callback is called after 3 seconds
        maximumAge: 300000 // Positional data is cached for up to 5 minutes  
    };

    function getPosition(err, cb) {
        if (!navigator.geolocation){
            err('Geolocation is not supported by your browser');
        }
      
        function success(position) {
            // Get the geolocation position data
            var pos = {};
            pos.lat = position.coords.latitude;
            pos.lon = position.coords.longitude;
            
            // Save this latitude and Longitude into local storage
            localStorage.setItem('lastKnownLat', pos.lat);
            localStorage.setItem('lastKnownLon', pos.lon);

            // Call the callback w/ the position data passed in
            cb(pos); 
        }
        
        function error() {
            // Call the error callback w/ this error message passed
            err("Geolocation lookup timed out");
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
    };    
    
    return {
        getPosition
    }
})();