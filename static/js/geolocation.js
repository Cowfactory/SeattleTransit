    document.addEventListener("DOMContentLoaded", function(){
        document.getElementById("mybutton").addEventListener("click", function(e){
            e.preventDefault();
            getLocation();
        });
    });

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, errorCallback);
    } else {
        var location = document.getElementById("currentlocation");
        location.innerHTML = "Geolocation is not supported by this browser.";
    }
};
function showPosition(position) {
    var location = document.getElementById("currentlocation");
    console.log('success function!', position);
    location.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude; 
};

function errorCallback(err){
    console.log('Houston...we have a problem. User did not allow the app to check for location', err);
}