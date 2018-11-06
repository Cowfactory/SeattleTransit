/*
*  'map' represents the mapbox object
*
*/
const map = (() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3V0dGhpcmF0aCIsImEiOiJjam52ZTB0ZzUxZWt6M3Jwcjl2ZDdiODdqIn0.LfK0nDgbQ3mUWTgvAn0spQ';

    var map; // The mapbox object

    init(); // Create the map object

    function init() {
        // File geolocation.js - Function geolocation.getPosition(err,cb) 
        // Create the map w/ either geolocation data as the starting point or w/ a default position
        geolocation.getPosition(createMapWithDefaultPosition, createMapWithGeolocationData);

        // Success Callback - use user's location data as map center
        function createMapWithGeolocationData(pos) {
            map = new mapboxgl.Map({
                container: 'map', // container id
                style: 'mapbox://styles/mapbox/streets-v9',
                center: [pos.lon, pos.lat], // starting position
                zoom: 14 // starting zoom
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
            
            // User search input
            map.addControl(new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                country: 'us',
            }), 'top-left'); 
    
            // Map display controls
            map.addControl(new mapboxgl.NavigationControl());   
    
            // Trigger a geolocate on map startup
            map.on('load', function() {
                mb_geolocate.trigger();
            })        
        }
    };

    // Harvest latitude and longitude from the position of the "user-dot"
    function getDotPosition() {
        let pos = {};
        pos.lat = mb_geolocate._userLocationDotMarker._lngLat.lat;
        pos.lon = mb_geolocate._userLocationDotMarker._lngLat.lng;
        return pos;
    }

    return {
        getDotPosition // via harvesting mapBox's "user-dot's" position
    }
    
})();