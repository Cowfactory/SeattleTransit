geolocate = (function () {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function getCoordinates(cb) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(cb, err, options);
        } else {
            let location = document.getElementById("currentlocation"); //A "#currentlocation" element must be present on index.ejs
            location.innerHTML = "Geolocation is not supported by this browser.";
        }
    };

    function err(err){
        console.log('Houston...we have a problem. User did not allow the app to check for location', err);
    }

    return {
        getCoordinates
    }
})();   

