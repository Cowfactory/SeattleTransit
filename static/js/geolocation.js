geolocation = (function () {
    var options = {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0
    };

    function getCoordinates(cb, err) {
        if ("geolocation" in navigator) {
            err ? // if err callback provided, use it 
                navigator.geolocation.getCurrentPosition(cb, err, options) :
                navigator.geolocation.getCurrentPosition(cb, defaultErr, options);
            
        } else {
            console.log("Geolocation not available");
            // A "#currentlocation" element must be present on index.ejs
            // let location = document.getElementById("currentlocation"); 
            // location.innerHTML = "Geolocation is not supported by this browser.";
        }
    };

    function defaultErr(err) {
        console.log('Houston...we have a problem. User did not allow the app to check for location', err);
    }

    return {
        getCoordinates
    }
})();   

