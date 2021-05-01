
$(document).ready(() => {

    var mymap = L.map('floofMap').setView([57.71, 11.97], 12);

    var greenIcon = L.icon({
        iconUrl: 'images/pup.png',
        //shadowUrl: 'images/smol-dog.jpg',

        iconSize:     [80, 105], // size of the icon
        shadowSize:   [80, 80], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [20, -90] // point from which the popup should open relative to the iconAnchor
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    L.marker([57.71, 11.97], {icon: greenIcon}).addTo(mymap)
        .bindPopup('Pupperino is on the move')
        .openPopup();

    $.getJSON('https://icanhazdadjoke.com/', {})
        .done((data) => {
            $('#dadJoke').text(data['joke']);
        })
        .fail((xhr) => {
            alert('Problem contacting server');
            console.log(xhr);
        });

    smhiEndPoint = "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/11.97/lat/57.71/data.json";

    $.getJSON(smhiEndPoint, {})
        .done((forecast) => {
            //var forecast = forecast;
            var returnedLatitude = null;
            var returnedLongitude = null;
            var approvedTime = new Date(forecast.approvedTime).toISOString().replace(/[a-zA-Z]/g, ' ').substr(0, 16);
            var referenceTime = new Date(forecast.referenceTime).toISOString().replace(/[a-zA-Z]/g, ' ').substr(0, 16);
            console.log(forecast['timeSeries'][0]['parameters'][10]['values'][0])
            var currentTemp = forecast['timeSeries'][0]['parameters'][10]['values'][0]

            $('#weather').text("The temperature is currently " + currentTemp + "°C in Gothenburg");
        })
        .fail((xhr) => {
            alert('Problem contacting server');
            console.log(xhr);
        });

    // $.getJSON(smhiEndPoint).done(function (forecast) {
    //
    //     smhi.forecast = forecast;
    //     smhi.returnedLatitude = null;
    //     smhi.returnedLongitude = null;
    //     smhi.approvedTime = new Date(forecast.approvedTime).toISOString().replace(/[a-zA-Z]/g, ' ').substr(0, 16);
    //     smhi.referenceTime = new Date(forecast.referenceTime).toISOString().replace(/[a-zA-Z]/g, ' ').substr(0, 16);
    //
    //     callback(forecast);
    // });

});
