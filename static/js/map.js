const map = (() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3V0dGhpcmF0aCIsImEiOiJjam52ZTB0ZzUxZWt6M3Jwcjl2ZDdiODdqIn0.LfK0nDgbQ3mUWTgvAn0spQ';

    var map;
    var mb_geolocate;

    init();

    function init() {
        geolocation.getCoordinates(
            (position) => { // Geolocation lookup success
                let lat = position.coords.latitude.toFixed(3);
                let lon = position.coords.longitude.toFixed(3);
                map = new mapboxgl.Map({
                    container: 'map', // container id
                    style: 'mapbox://styles/mapbox/streets-v9',
                    center: [lon, lat], // starting position
                    zoom: 14 // starting zoom
                });
                addMapCustomizations();
                map.on('click', renderBus);
            },
            () => { // Geolocation lookup timeout or error
                console.log("Using default map position");
                map = new mapboxgl.Map({
                    container: 'map', 
                    style: 'mapbox://styles/mapbox/streets-v9',
                    center: [-122.329, 47.614], // Default Position Seattle downtown
                    zoom: 14 
                });
                addMapCustomizations();
                map.on('click', renderBus);
            }
        );
    }

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
            accessToken: mapboxgl.accessToken
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

    function renderBus() {
        let points = 0;
        let stopId = 0;
        stopCoords.forEach(stop => {
            // START TEST
            let section = $(`<section class='carousel-item card active' id='stop ${stopId++}'><p>${stop}</p></section>`);
            $(section).appendTo($('#carousel'));
            $('#decoy').remove();
            M.AutoInit();

            let chapters = {
                'baker': {
                    bearing: 27,
                    center: [-0.15591514, 51.51830379],
                    zoom: 15.5,
                    pitch: 20
                }
            };

            console.log('Apending shit....');
            // END TEST
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
    }

    return {
        getCoordinates // getCoordinates via harvesting mapBox's "user-dot's" position
    }
    
})();

// START TEST
$(document).ready(function(){
    $('.carousel').carousel();
  });
// END TEST