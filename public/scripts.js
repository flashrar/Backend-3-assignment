let map;

const navEL = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY >= 56){
        navEL.classList.add('navbar-scrolled')
    } else if (window.scrollY < 56){
        navEL.classList.remove('navbar-scrolled')
    }
}
);

function initMap() {
    const mapOptions = {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 13,
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    fetch('locations.json')
            .then(response => response.json())
            .then(data => {
                // Iterate through the data and add markers
                data.forEach(location => {
                    const marker = new google.maps.Marker({
                        position: { lat: location.latitude, lng: location.longitude },
                        map: map,
                        title: location.name, // Add a title for the marker
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
  
}

document.addEventListener("DOMContentLoaded", function () {
    
    initMap();
    function addMarker(position, title) {
        const marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: title,
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    }

    function drawRoute() {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

        const request = {
            origin: "Paris, France",
            destination: "Eiffel Tower, Paris, France", 
            travelMode: google.maps.TravelMode.DRIVING,
        };

        directionsService.route(request, function (result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
            }
        });
    }

    function searchNearbyPlaces() {
        const placesService = new google.maps.places.PlacesService(map);
        const request = {
            location: map.getCenter(),
            radius: 5000, 
            types: ["restaurant", "cafe", "lodging"], 
        };

        placesService.nearbySearch(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
                    const place = results[i];
                    addMarker(place.geometry.location, place.name);
                }
            }
        });
    }

    drawRoute();
    searchNearbyPlaces();
});

window.onload = function () {
    initMap();
};


let player;

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        player.stopVideo();
    }
}

function onYouTubeIframeAPIReady() {
    const videoId = '3ymwOvzhwHs'; // Replace with the extracted video ID
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: videoId,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}


function fetchWeatherData() {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=965c3d8856882153b1168286a3ab9b96&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;
            const description = data.weather[0].description;

            const weatherInfoElement = document.getElementById('weather-info');
            weatherInfoElement.innerHTML = `<p>Temperature: ${temperature}°C</p>
                                            <p>Description: ${description}</p>`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

document.addEventListener('DOMContentLoaded', fetchWeatherData);


