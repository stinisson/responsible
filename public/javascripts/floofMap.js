
$(document).ready(() => {

    var mymap = L.map('floofMap').setView([57.71, 11.97], 12);

    var greenIcon = L.icon({
        iconUrl: 'images/smol-dog.jpg',
        //shadowUrl: 'images/smol-dog.jpg',

        iconSize:     [80, 80], // size of the icon
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


});
