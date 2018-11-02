    document.addEventListener("DOMContentLoaded", function(){
        document.getElementById("mybutton").addEventListener("click", function(e){
            e.preventDefault();
            getLocation();
        });
    });

function getLocation() {
    console.log('getLocation is getting called');
    console.log('location', location);
    console.log('navigator', navigator.geolocation)
    if (navigator.geolocation) {
        console.log('it exists')
        navigator.geolocation.getCurrentPosition(showPosition, errorCallback);
    } else {
        console.log('geolocation is null')
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
    console.log('well darn, an error', err);
}