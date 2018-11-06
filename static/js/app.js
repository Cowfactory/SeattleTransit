// DOM Elements
var searchBtnEl;
var stopListEl;
var outputEl;

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
    outputEl = document.getElementById("locationStatus");
};

function addEventListeners() {
    // "Find Nearby Stops" button queries database for stops near the current geolocation
    searchBtnEl.addEventListener("click", findNearbyStops);
    stopListEl.addEventListener("click", getArrivalsAndDeparturesForStop)
};

// Click Events
function findNearbyStops() {
    geolocation.getPosition(
        function errCb(errMsg) {
            // Use the last known lat and lon from localStorage instead
            let lastKnownLat = localStorage.getItem('lastKnownLat');
            let lastKnownLon = localStorage.getItem('lastKnownLon');
            console.log("Using local storage for lat and lon data");

            //If we have a last known position: 
            if(lastKnownLat && lastKnownLon) {
                outputEl.innerHTML = `<p>${errMsg} ... Using last known location: <br>
                    Latitude is: ${lastKnownLat} <br> Longitude is: ${lastKnownLon}</p>`
                fetchStopsFromApi(lastKnownLat, lastKnownLon);
            } 
            // Else failure
            else {
                outputEl.innerHTML = `<p>${errMsg}`
            }
        },
        function successCb(pos) {
            outputEl.innerHTML = `<p>Latitude is ${pos.lat}'° <br>Longitude is ${pos.lon}'°</p>`;
            // Query Api for Stops near this position
            fetchStopsFromApi(pos.lat, pos.lon);
        }
    );

    function fetchStopsFromApi(lat, lon) {
        fetch(`/api/stopsAtLocation?lat=${lat}&lon=${lon}`)
            .then(response => response.json())
            .then(stops => renderStops(stops));
    };

    outputEl.innerHTML = "<p>Locating…</p>";
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
    
    // Removes all child nodes of stopList ul
    while(stopListEl.firstChild) {
        stopListEl.removeChild(stopListEl.firstChild);
    }

    // Add every stop to the element in DOM
    stops.forEach(stop => {
        let li = document.createElement('li');
        stopListEl.appendChild(li);

        li.textContent = `${stop.name} ${stop.direction ? `(${stop.direction})` : ""}`; 
        li.setAttribute('id', stop.id);
    });
}

function renderRoutes(routes) {
    console.log(routes); // Uncomment to view all the Routes available to a Stop in console

    // Removes all child nodes of stopList ul
    while(stopListEl.firstChild) {
        stopListEl.removeChild(stopListEl.firstChild);
    }

    // Add every Arrival And Departure "route" to the element in DOM
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

