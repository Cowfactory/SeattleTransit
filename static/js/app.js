// DOM Elements
var searchBtnEl;
var searchMsgEl;
var statusMsgEl;
var statusCircleEl;
var incomingBussesEl;
var carouselParentEl;
var loadScreen;

// Setup functions
document.addEventListener("DOMContentLoaded", function() {
    cacheDomElements();
    addEventListeners();
    sideNav();
});

function cacheDomElements() {
    searchMsgEl = document.getElementById("searchMsg");
    searchBtnEl = document.getElementById("searchBtn");
    statusCircleEl = document.getElementById("statusCircle");
    statusMsgEl = document.getElementById("statusMsg");
    incomingBussesEl = document.getElementById("incomingbusses")

    carouselParentEl = document.getElementById("carouselParent");
    loadScreen = document.getElementById("loadscreen");
};

function addEventListeners() {
    // "Find Nearby Stops" button queries database for stops near the current geolocation
    searchBtnEl.addEventListener("click", findNearbyStops);
    carouselParentEl.addEventListener("click", getArrivalsAndDeparturesForStop)
};

function hideLoadScreen() {
    loadScreen.classList.add("hide");
}

// Click Events
function findNearbyStops() {
    setStatusMsg('Getting location...');
    toggleStatusVisibility();
    geolocation.getPosition(
        function errCb(errMsg) {
            // Use the last known lat and lon from localStorage instead
            let lastKnownLat = localStorage.getItem('lastKnownLat');
            let lastKnownLon = localStorage.getItem('lastKnownLon');
            console.log("Using local storage for lat and lon data");

            //If we have a last known position: 
            if(lastKnownLat && lastKnownLon) {
                // statusMsgEl.innerHTML = `<p>${errMsg} ... Using last known location: <br>
                //     Latitude is: ${lastKnownLat} <br> Longitude is: ${lastKnownLon}</p>`
                setStatusMsg("Using last known location...")
                fetchStopsFromApi(lastKnownLat, lastKnownLon);
            } 
            // Else failure
            else {
                console.log(`${errMsg}`);
                setStatusMsg(`Please Try Again`);
            }
        },
        function successCb(pos) {
            setStatusMsg('Fetching stops...');
            // Query Api for Stops near this position
            fetchStopsFromApi(pos.lat, pos.lon);
        }
    );

    function fetchStopsFromApi(lat, lon) {
        fetch(`/api/stopsAtLocation?lat=${lat}&lon=${lon}`)
            .then(response => response.json())
            .then(stops => renderStops(stops))
            .then(() => {
                setStatusMsg("");
                toggleStatusVisibility();
            });
    };

}

function getArrivalsAndDeparturesForStop(e) {
    if(e.target === carouselParentEl) return; // also needs to filter out the carousel itself
    // console.log(e);
    console.log(e.target.id);
    fetch(`/api/stopDetails?stopid=${e.target.id}`)
        .then(response => response.json())
        .then(routes => renderRoutes(routes))
        .then(() => {
            setStatusMsg("");
            toggleStatusVisibility();
        });
} 

function toggleStatusVisibility() {
    statusCircleEl.classList.toggle('hide');
    statusMsgEl.classList.toggle('hide');
    searchMsgEl.classList.toggle('hide');
}
function setStatusMsg(msg) {
    statusMsgEl.textContent = msg;
}

// AJAX render functions
function renderStops(stops) {
    console.log(stops); // Uncomment to view all the data available to a Stop in console
    // Removes carousel
    $('#carouselParent').empty();
    // $('.carousel').destroy();

    let carousel = $(`<div class='carousel center' id='carousel'></div>`);
    $(carousel).appendTo($('.map-overlay'));
    // Add every stop to the element in DOM
    const stopMap = {}
    stops.forEach(stop => {
        let section = $(`<section class='carousel-item card' id=${stop.id}><p>${stop.name}</p></section>`);
        $(section).appendTo($('#carousel'));
        M.AutoInit();
        map.addStopToMap(stop);
        map.flyToStop(stop);
        stopMap[stop.id] = stop
    });
    $('.carousel').carousel({
        onCycleTo: () => {
            const stopId = document.getElementsByClassName('active')[0].id;
            map.flyToStop(stopMap[stopId]);
        }
    })
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
            Distance from stop: ${distanceFromStop(route.distanceFromStop)} <br> Schedule arrival time: ${moment(route.scheduledArrivalTime).fromNow()}`;
            // ul.appendChild(div);
        incomingBussesEl.appendChild(div);
        return route;
    })
    // stopListEl.appendChild(ul);
};

function distanceFromStop(meters) {
    let feet = (meters*3.2808);
    let miles = (feet / 5280).toFixed(2) + " mi";
    return miles;
};

function sideNav() {
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem);
    var collapsibleElem = document.querySelector('.collapsible');
    // var collapsibleInstance = new M.Collapsible(collapsibleElem);
    // Initialize collapsible (uncomment the lines below if you use the dropdown variation)
    // var collapsibleElem = document.querySelector('.collapsible');
    // var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);
};