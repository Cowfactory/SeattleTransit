geolocation = (() => {
    function getPosition(err, cb) {
        var timeout;

        if (!navigator.geolocation){
            err('Geolocation is not supported by your browser');
        }
      
        function success(position) {
            // Clear the timeout to stop the err callback 
            clearTimeout(timeout);

            var pos = {};
            var latitude  = position.coords.latitude;
            var longitude = position.coords.longitude;
            
            pos.lat = latitude;
            pos.lon = longitude;
            
            cb(pos); 
        }
        
        function timeoutErr() {
            err('Geolocation lookup timed out');
        }
        
        timeout = setTimeout(timeoutErr, 3000);
        navigator.geolocation.getCurrentPosition(success, err);
    };    
    
    return {
        getPosition
    }
})();