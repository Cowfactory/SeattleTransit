const map = (() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3V0dGhpcmF0aCIsImEiOiJjam52ZTB0ZzUxZWt6M3Jwcjl2ZDdiODdqIn0.LfK0nDgbQ3mUWTgvAn0spQ';

    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [-96, 37.8], // starting position
        zoom: 3 // starting zoom
    });

    // Add geolocate control to the map.
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));

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
