var searchBtn;
var stopList;

document.addEventListener("DOMContentLoaded", function() {
    cacheDomElements();
    addEventListeners();
    sideNav();
});

function cacheDomElements() {
    locationBtn = document.getElementById("locationBtn");
    searchBtn = document.getElementById("searchBtn");
    locationSetBtn = document.getElementById("locationSetBtn");
    stopList = document.getElementById("stopList");
};

function addEventListeners() {
    // "Find Nearby Stops" button queries database for stops near the current geolocation
    searchBtn.addEventListener("click", findNearbyStops);
};

function findNearbyStops() {
    geolocate.getCoordinates(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        queryStopsAtLocation(lat, lon);
    });
}

function queryStopsAtLocation(lat, lon) {
    fetch(`/api/stopsAtLocation?lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(stops => renderStops(stops))
}

function renderStops(stops) {
    // console.log(stops); // Uncomment to view all the data available to a Stop in console
    stops.forEach(stop => {
        let el = document.createElement('li');
        let div = document.createElement('div');
        el.appendChild(div);
        stopList.appendChild(el);

        div.textContent = `${stop.name} ${stop.direction ? `(${stop.direction})` : ""}`; 
    });
}

function sideNav() {
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem);
    var collapsibleElem = document.querySelector('.collapsible');
    // var collapsibleInstance = new M.Collapsible(collapsibleElem);
    // Initialize collapsible (uncomment the lines below if you use the dropdown variation)
    // var collapsibleElem = document.querySelector('.collapsible');
    // var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);
};