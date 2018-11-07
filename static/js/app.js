// DOM Elements
var newStops = [];
var searchBtnEl;
var stopListEl;
var outputEl;
var incomingBussesEl;

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
    incomingBussesEl = document.getElementById("incomingbusses")
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
    newStops = [];

    // Add every stop to an li element in DOM
    
    // Removes all child nodes of stopList ul
    while(stopListEl.firstChild) {
        stopListEl.removeChild(stopListEl.firstChild);
    }

    // Add every stop to the element in DOM
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
    while(incomingBussesEl.firstChild) {
        incomingBussesEl.removeChild(incomingBussesEl.firstChild);
    }


    // Add every Arrival And Departure "route" to the element in DOM
    routes.forEach(route => { 
        // console.log(route);
        let div = document.createElement('div');
        div.classList.add("card-panel");
        div.innerHTML = `<h5>Bus: ${route.routeShortName}</h5> <h6>Trip: ${route.tripHeadsign}</h6> 
            Distance from stop: ${route.distanceFromStop} <br> Schedule arrival time: ${route.scheduledArrivalTime}`;
            // ul.appendChild(div);
        incomingBussesEl.appendChild(div);
    })

        // stopListEl.appendChild(ul);
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

