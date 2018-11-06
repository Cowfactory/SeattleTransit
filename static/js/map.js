const map = (() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3V0dGhpcmF0aCIsImEiOiJjam52ZTB0ZzUxZWt6M3Jwcjl2ZDdiODdqIn0.LfK0nDgbQ3mUWTgvAn0spQ';

    var map;
    var mb_geolocate;

    init();

    function init() {
        geolocation.getPosition(
            function err(errMsg) {
                console.log(`${errMsg}; Using default map position`);
                map = new mapboxgl.Map({
                    container: 'map', 
                    style: 'mapbox://styles/mapbox/streets-v9',
                    center: [-122.329, 47.614], // Default Position Seattle downtown
                    zoom: 14 
                });
                additionalInitialization();
            },
            function cb(pos) {
                map = new mapboxgl.Map({
                    container: 'map', // container id
                    style: 'mapbox://styles/mapbox/streets-v9',
                    center: [pos.lon, pos.lat], // starting position
                    zoom: 14 // starting zoom
                });
                additionalInitialization();
            }
        );

        function additionalInitialization() {
            addMapCustomizations();
        }
    };

    function addMapCustomizations() {
        // Add geolocate control to the map
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

    function getCoordinates() {
        let pos = {};
        pos.lat = mb_geolocate._userLocationDotMarker._lngLat.lat;
        pos.lon = mb_geolocate._userLocationDotMarker._lngLat.lng;
        return pos;
    }

    return {
        getCoordinates // getCoordinates via harvesting mapBox's "user-dot's" position
    }
    
})();