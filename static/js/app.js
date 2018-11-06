var searchBtn;
var newStops = [];
var searchBtnEl;
var stopListEl;

// Setup functions
document.addEventListener("DOMContentLoaded", function() {
    cacheDomElements();
    addEventListeners();
    sideNav();
});

function cacheDomElements() {
    locationBtn = document.getElementById("locationBtn");
    searchBtnEl = document.getElementById("searchBtn");
    locationSetBtn = document.getElementById("locationSetBtn");
    stopListEl = document.getElementById("stopList");
};

function addEventListeners() {
    // "Find Nearby Stops" button queries database for stops near the current geolocation
    searchBtnEl.addEventListener("click", findNearbyStops);
    stopListEl.addEventListener("click", getArrivalsAndDeparturesForStop)
};

// Click Event Functions
function findNearbyStops() {
    // Via browser geolocation api call (unstable)
    // geolocation.getCoordinates(position => {
    //     let lat = position.coords.latitude;
    //     let lon = position.coords.longitude;

    //     // Query for nearby stops, then render
    //     fetch(`/api/stopsAtLocation?lat=${lat}&lon=${lon}`)
    //         .then(response => response.json())
    //         .then(stops => renderStops(stops));
    // });

    pos = map.getCoordinates();
    // Query for nearby stops, then render
    fetch(`/api/stopsAtLocation?lat=${pos.lat}&lon=${pos.lon}`)
        .then(response => response.json())
        .then(stops => renderStops(stops));
}

function getArrivalsAndDeparturesForStop(e) {
    if(e.target === stopListEl) return;
    
    fetch(`/api/stopDetails?stopid=${e.target.id}`)
        .then(response => response.json())
        .then(routes => renderRoutes(routes));
} 

// AJAX render functions
function renderStops(stops) {
    console.log(stops); // Uncomment to view all the data available to a Stop in console
    newStops = [];

    // Add every stop to an li element in DOM
    stops.forEach(stop => {
        stopObj = {};

        let li = document.createElement('li');
        stopListEl.appendChild(li);

        li.textContent = `${stop.name} ${stop.direction ? `(${stop.direction})` : ""}`; 
        li.setAttribute('id', stop.id);
        stopObj.coordinates = [stop.lon, stop.lat];
        stopObj.name = stop.name;
        stopObj.id = stop.id;
        newStops.push(stopObj);
    });
    
    return newStops;
};

function renderRoutes(routes) {
    // console.log(routes); // Uncomment to view all the Routes available to a Stop in console

    // Removes all child nodes of stopList ul
    while(stopListEl.firstChild) {
        stopListEl.removeChild(stopListEl.firstChild);
    }
    let ul = document.createElement('ul');

    routes.forEach(route => { 
        let li = document.createElement('li');
        li.textContent = `Bus: ${route.routeShortName} | Trip: ${route.tripHeadsign} | 
            Distance from stop: ${route.distanceFromStop} | Schedule arrival time: ${route.scheduledArrivalTime}`;
        ul.appendChild(li);
    })
    stopListEl.appendChild(ul);
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

