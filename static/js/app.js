var searchBtn;
var stopList;

// Setup functions
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
    stopList.addEventListener("click", getArrivalsAndDeparturesForStop)
};

// Click Event Functions
function findNearbyStops() {
    console.log("clicked");
    geolocate.getCoordinates(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        console.log(lat, lon);

        // Query for nearby stops, then render
        fetch(`/api/stopsAtLocation?lat=${lat}&lon=${lon}`)
            .then(response => response.json())
            .then(stops => renderStops(stops))
    });
}

function getArrivalsAndDeparturesForStop(e) {
    if(e.target === stopList) return;
    
    fetch(`/api/stopDetails?stopid=${e.target.id}`)
        .then(response => response.json())
        .then(routes => renderRoutes(routes));
} 

// AJAX render functions
function renderStops(stops) {
    // console.log(stops);
    if(stops.data === "") {
        console.log("empty query");
        return;
    }
    console.log(stops); // Uncomment to view all the data available to a Stop in console
    stops.forEach(stop => {
        let li = document.createElement('li');
        let div = document.createElement('div');

        // ul > li > div
        li.appendChild(div);
        stopList.appendChild(li);

        li.textContent = `${stop.name} ${stop.direction ? `(${stop.direction})` : ""}`; 
        li.setAttribute('id', stop.id);
    });
}


function renderRoutes(routes) {
    // Removes all child nodes of stopList ul
    while(stopList.firstChild) {
        stopList.removeChild(stopList.firstChild);
    }
    let ul = document.createElement('ul');

    routes.forEach(route => { 
        let li = document.createElement('li');
        li.textContent = `Bus: ${route.routeShortName} | Trip: ${route.tripHeadsign} | 
            Distance from stop: ${route.distanceFromStop} | Schedule arrival time: ${route.scheduledArrivalTime}`;
        ul.appendChild(li);
    })
    stopList.appendChild(ul);
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

