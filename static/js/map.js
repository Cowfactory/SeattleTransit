/*
*  'map' represents the mapbox object
*
*/
const map = (() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3V0dGhpcmF0aCIsImEiOiJjam52ZTB0ZzUxZWt6M3Jwcjl2ZDdiODdqIn0.LfK0nDgbQ3mUWTgvAn0spQ';

    var map;

    // File geolocation.js - Function geolocation.getPosition(err,cb) 
    // Create the map w/ either geolocation data as the starting point or w/ a default position
    geolocation.getPosition(createMapWithDefaultPosition, createMapWithGeolocationData);

    // Success Callback - use user's location data as map center
    function createMapWithGeolocationData(pos) {
        map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [pos.lon, pos.lat], // starting position
            zoom: 12 // starting zoom
        });
        addMapCustomizations();
    }

    // Error Callback - use a default location as map center
    function createMapWithDefaultPosition(errMsg) {
        console.log(`${errMsg}; Using default map position`);
        map = new mapboxgl.Map({
            container: 'map', 
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [-122.329, 47.614], // Default Position is Seattle downtown
            zoom: 14 
        });
        addMapCustomizations();
    }

    function addMapCustomizations() {
        // Add geolocate control to the map
        var mb_geolocate;
        mb_geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserLocation: true     
        });
        map.addControl(mb_geolocate, 'top-right');
        
        // User search input - Reimplement in MVP 2
        // map.addControl(new MapboxGeocoder({
        //     accessToken: mapboxgl.accessToken,
        //     country: 'us',
        // })); 

        // Map display controls
        map.addControl(new mapboxgl.NavigationControl());   

        // Trigger a geolocate on map startup
        map.on('load', function() {
            hideLoadScreen();
            mb_geolocate.trigger();
        })        
    }

    function flyToStop(stop) {
        let location = {};
        let locationObj = {};
        locationObj.center = [stop.lon, stop.lat];
        locationObj.zoom = 18;
        location[stop.id] = locationObj;
        var sectionId = document.getElementsByClassName('active')[0].id;
        if (stop.id === sectionId) {
            map.flyTo(locationObj);
        }
    }

    function addStopToMap(stop) {
        // console.log(stop);
        let coords = [];
        coords.push(stop.lon);
        coords.push(stop.lat);
        map.addLayer({
            "id": stop.id,
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": coords
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
    }
    
    return {
        addStopToMap,
        flyToStop
    }
})();
