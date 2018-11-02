const locationBtn = document.getElementById("locationBtn");
const searchBtn = document.getElementById("searchBtn");
const locationSetBtn = document.getElementById("locationSetBtn");

document.addEventListener("DOMContentLoaded", function() {
    cacheDomElements();

    locationBtn.addEventListener("click", function(e) {
        geolocation.getLocation();
    });

    searchBtn.addEventListener("click", function(e) {
        geolocation.getLocation();
        fetch(`/api/stopsAtLocation?`${})
    });

    locationSetBtn.addEventListener("click", function(e) {
        // e.preventDefault();
        
    });
});

function cacheDomElements() {


}