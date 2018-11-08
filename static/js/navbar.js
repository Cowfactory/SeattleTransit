var locationPermBtn = document.getElementById('locationPermBtn');

locationPermBtn.addEventListener('click', function() {
    navigator.permissions.query({'name': 'geolocation'})
    .then( permission => console.log(permission) )
})