// DOM Elements
var incomingBussesEl;
var carouselParentEl;
var loadScreen;
var dist;
var favoriteBtn; 

// Setup functions
document.addEventListener("DOMContentLoaded", function() {
    cacheDomElements();
    addEventListeners();
    sideNav();
    configureMomentJs();
});

$(document).ready(function() {
    $('#toggle').hide();
    $('#incomingbusses').hide();
})

function cacheDomElements() {
    incomingBussesEl = document.getElementById("incomingbusses")
    loadScreen = document.getElementById("loadscreen");
    favoriteBtn = document.getElementById('addfavoritebtn');
};

function addEventListeners() {
    // "Find Nearby Stops" button queries database for stops near the current geolocation
    searchBtnEl.addEventListener("click", findNearbyStops);
};

function removeLoadScreen() {
    loadScreen.parentNode.removeChild(loadScreen);
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

function getArrivalsAndDeparturesForStop(stopId) {
    console.log(stopId);
    setStatusMsg('Getting Bus List...');
    toggleStatusVisibility();
    fetch(`/api/stopDetails?stopid=${stopId}`)
        .then(response => response.json())
        .then(routes => renderRoutes(routes))
        .then(() => {
            setStatusMsg("");
            toggleStatusVisibility();
        });
} 


// AJAX render functions
function renderStops(stops) {
    // Removes carousel
    $('#carouselParent').empty();

    let carousel = $(`<div class='carousel center' id='carousel'></div>`);
    $(carousel).appendTo($('.map-overlay'));
    // Add every stop to the element in DOM
    let stopMap = {}
    stops.forEach(stop => {
        distance(stop);
        let section = $(
        `<section class='carousel-item card center valign-wrapper' id=${stop.id}> 
            <div>
                <h5>${stop.name}</h5>
                <h6>Distance: ${dist}mi</h6>
            </div>
        </section>`);
        $(section).appendTo($('#carousel'));
        M.AutoInit();
        map.addStopToMap(stop);
        map.flyToStop(stop);
        stopMap[stop.id] = stop
    });
    setupCarousel(stopMap);
};

function distance(stop, unit) {
    let lat1 = localStorage.getItem('lastKnownLat');
    let lon1 = localStorage.getItem('lastKnownLon');
    let lat2 = stop.lat;
    let lon2 = stop.lon;

	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        dist = dist.toFixed(2);
		return dist;
	}
}

// Carousel related stuff
function setupCarousel(stopMap) {
    $('.carousel').carousel({
        onCycleTo: () => {
            let stopId = document.getElementsByClassName('active')[0].id;
            map.flyToStop(stopMap[stopId]);
            
        }   
    })
    $('.active').click(function(){
        $('.carousel').hide( "slide", { direction: "down" }, "slow" );
        $('#toggle').show( "slide", { direction: "up" }, "slow" );
        $('#incomingbusses').show( "slide", { direction: "up" })
    }); 
    $('#toggle').click(function(){
        $('#toggle').hide( "slide", { direction: "up" }, "slow" );
        $('#incomingbusses').hide( "slide", { direction: "up" });
        $('.carousel').show( "slide", { direction: "down" }, "slow" );
    }); 
    $('.carousel').click(function(e){
        let target; 
        //reject clicks on carousel container
        if(e.target.classList.contains('transparent') || e.target.classList.contains('carousel')) {
            console.log("rejecting click");
            return;
        }
        //reject clicks on neighbor carousel items - accept click on the section part of active item
        if(e.target.classList.contains('carousel-item') && 
                e.target.classList.contains('active') || 
                e.target.parentNode.parentNode.localName === 'section' && 
                e.target.parentNode.parentNode.classList.contains('active')) { // !== 'section') {
            //check if click is on parent section or child divs (both are valid)
            if(e.target.localName === 'section') {
                target = e.target;
            } else {
                target = e.target.parentNode.parentNode;
            } 
        }
        else {
            return;
        }
        getArrivalsAndDeparturesForStop(target.id);

    })
}

function renderRoutes(routes) {
    // Removes all child nodes of stopList ul
    while(incomingBussesEl.firstChild) {
        incomingBussesEl.removeChild(incomingBussesEl.firstChild);
    }
    // Add every Arrival And Departure "route" to the element in DOM
    routes.forEach(route => { 
        let containingDiv = document.createElement('div');
        containingDiv.innerHTML = constructCardHtml(route); 
        containingDiv.classList.add("incomingbuscard");
        incomingBussesEl.appendChild(containingDiv);
    })
};

function constructCardHtml({routeShortName, tripHeadsign, scheduledArrivalTime, distanceFromStop}) {
    return `
            <div class="tripheadsign">
                <span>☆</span><div><h5>${tripHeadsign}</h5></div>
            </div>
            <div class="routeshortname"><h4>${routeShortName}</h4></div>
            <div class="distancefromstop"><h5>${convertMetersToMiles(distanceFromStop)}</h5></div>
            <div class="scheduledarrivaltime"><h5>${moment(scheduledArrivalTime).fromNow()}</h5></div>
    `;
}

function convertMetersToMiles(meters) {
    let feet = (meters*3.2808);
    let miles = (feet / 5280).toFixed(2) + " mi";
    return miles;
};

function sideNav() {
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem);
};

function configureMomentJs() {
    moment.updateLocale('en', {
        relativeTime : {
            future: "in %s",
            past:   "%s ago",
            s  : 'a few seconds',
            ss : '%d seconds',
            m:  "a min",
            mm: "%d m",
            h:  "an hour",
            hh: "%d hours",
            d:  "a day",
            dd: "%d days",
            M:  "a month",
            MM: "%d months",
            y:  "a year",
            yy: "%d years"
        }
    });
}
