const map = (() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3V0dGhpcmF0aCIsImEiOiJjam52ZTB0ZzUxZWt6M3Jwcjl2ZDdiODdqIn0.LfK0nDgbQ3mUWTgvAn0spQ';

    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [-122.329, 47.614], // starting position
        zoom: 12 // starting zoom
    });

    // Add geolocate control to the map
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }), 'top-right',);

    // User search input
    map.addControl(new MapboxGeocoder({
        accessToken: mapboxgl.accessToken
    }), 'top-left'); 

    // Map display controls
    map.addControl(new mapboxgl.NavigationControl());

    // // START TEST
    // var title = document.getElementById('location-title');
    // var description = document.getElementById('location-description');

    // var locations = [{
    //     "id": "2",
    //     "title": "The Bronx",
    //     "description": "This is where hip-hop was born, where the Yankees became a dynasty and where you can find New York City's leading zoo and botanical garden.",
    //     "camera": {
    //         center: [-73.8709, 40.8255],
    //         zoom: 12.21,
    //         pitch: 50
    //     }
    // }, {
    //     "id": "3",
    //     "title": "Brooklyn",
    //     "description": "No matter how hip it looks on TV, NYC's most populous borough is best experienced in person. Read on to find out about live music, Prospect Park, Nets basketball and more.",
    //     "camera": {
    //         center: [-73.9499, 40.6260],
    //         bearing: -8.9,
    //         zoom: 11.68
    //     }
    // }];

    // function highlightBorough(code) {
    //     // Only show the polygon feature that cooresponds to `borocode` in the data
    //     map.setFilter('highlight', ["==", "borocode", code]);
    // }
    
    // function playback(index) {
    //     title.textContent = locations[index].title;
    //     description.textContent = locations[index].description;
    
    //     highlightBorough(locations[index].id ? locations[index].id : '');
    
    //     // Animate the map position based on camera properties
    //     map.flyTo(locations[index].camera);
    
    //     map.once('moveend', function() {
    //         // Duration the slide is on screen after interaction
    //         window.setTimeout(function() {
    //             // Increment index
    //             index = (index + 1 === locations.length) ? 0 : index + 1;
    //             playback(index);
    //         }, 3000); // After callback, show the location for 3 seconds.
    //     });
    // }
    
    // // Display the last title/description first
    // title.textContent = locations[locations.length - 1].title;
    // description.textContent = locations[locations.length - 1].description;

    // // END TEST

    // Render bus stops on map
    map.on('click', function () {
        let points = 0;
        stopCoord.forEach(stop => {
            map.addLayer({
                "id": `points ${points++}`,
                "type": "symbol",
                "source": {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": stop
                            },
                            "properties": {
                                "icon": "bus"
                            }
                        }]
                    }
                },
                "layout": {
                    "icon-image": "{icon}-15"
                }
            });
        });

        // map.addLayer({
        //     "id": "highlight",
        //     "type": "fill",
        //     "source": {
        //         "type": "vector",
        //         "url": "mapbox://mapbox.8ibmsn6u"
        //     },
        //     "source-layer": "original",
        //     "paint": {
        //         "fill-color": "#fd6b50",
        //         "fill-opacity": 0.25
        //     },
        //     "filter": ["==", "borocode", ""]
        // }, 'neighborhood_small_label'); // Place polygon under the neighborhood labels.
    
        // // Start the playback animation for each borough
        // playback(0);

    });

    // Current location
    function getCoordinates() {
        let gl = [];
        lat = map.transform._center.lat;
        lng = map.transform._center.lng;
        gl.push(lat);
        gl.push(lng);
        return gl;
    }

    return {
        getCoordinates
    }
    
})();