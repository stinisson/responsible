let getWeatherForecast = () => {
    const weatherSymbol = {
        1:  "Clear sky",
        2:  "Nearly clear sky",
        3:  "Variable cloudiness",
        4:  "Halfclear sky",
        5:  "Cloudy sky",
        6:  "Overcast",
        7:  "Fog",
        8:  "Light rain showers",
        9:  "Moderate rain showers",
        10: "Heavy rain showers",
        11: "Thunderstorm",
        12: "Light sleet showers",
        13: "Moderate sleet showers",
        14: "Heavy sleet showers",
        15: "Light snow showers",
        16: "Moderate snow showers",
        17: "Heavy snow showers",
        18: "Light rain",
        19: "Moderate rain",
        20: "Heavy rain",
        21: "Thunder",
        22: "Light sleet",
        23: "Moderate sleet",
        24: "Heavy sleet",
        25: "Light snowfall",
        26: "Moderate snowfall",
        27: "Heavy snowfall"
    }
    endPoint = "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/11.97/lat/57.71/data.json";
    $.getJSON(endPoint, {})
        .done((forecast) => {
            let currentTemp = forecast['timeSeries'][0]['parameters'][10]['values'][0]
            let currentWeather = forecast['timeSeries'][0]['parameters'][18]['values'][0];
            let forecastValidTime = new Date(forecast['timeSeries'][0]['validTime']).toISOString().replace('T', ' ').substr(0, 16);
            forecastValidTime += 'Z';
            console.log(forecastValidTime);
            $('#weather').text("The weather in Gothenburg is " + currentTemp + " °C with " + weatherSymbol[currentWeather].toLowerCase());
        })
        .fail((xhr) => {
            alert('Problem contacting server');
            console.log(xhr);
        });
}

let displayTempChart = (tempData, tempTS) => {
    const chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
    };

    const chartColorsTransparent = {
        red: 'rgba(255, 99, 132, 0.8)',
        orange: 'rgba(255, 159, 64, 0.8)',
        yellow: 'rgba(255, 205, 86, 0.8)',
        green: 'rgba(75, 192, 192, 0.8)',
        blue: 'rgba(54, 162, 235, 0.8)'
    }

    let tempBackgroundColor = [];
    let tempBorderColor = [];
    //let tempData = [-20, -5, 0, 15, 20, 30]

    //let tempData = [-20, -5, 0, 15, 20, 30;

    tempData.forEach(item => {
        if (item >= 25) {
            tempBorderColor.push(chartColors.red);
            tempBackgroundColor.push(chartColorsTransparent.red);
        }
        else if (item >= 20 && item < 25) {
            tempBorderColor.push(chartColors.orange);
            tempBackgroundColor.push(chartColorsTransparent.orange);
        }
        else if (item > 0 && item < 20) {
            tempBorderColor.push(chartColors.green);
            tempBackgroundColor.push(chartColorsTransparent.green);
        }
        else if (item <= 0) {
            tempBorderColor.push(chartColors.blue);
            tempBackgroundColor.push(chartColorsTransparent.blue);
        }
    });

    var ctx = document.getElementById('temperatureChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            // labels: ['2021-05-02 13:19', '2021-05-02 13:20Z', '2021-05-02 13:21Z', '2021-05-02 13:22Z', '2021-05-02 13:23Z',
            // '2021-05-02 13:23Z'],
            labels: tempTS,
            datasets: [{
                label: 'Current temperature',
                data: tempData,
                backgroundColor: tempBackgroundColor,
                borderColor: tempBorderColor[tempBorderColor.length - 1],
                borderWidth: 2,
                pointRadius: 7
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    display: true,
                    title: {
                        display: true,
                        text: 'Temperature °C'
                    },
                }
            }
        }
    });

}

$(document).ready(() => {
    console.log('Client-side code running');

    let tempData = [];
    let tempTS = [];

    //$('#tempReading').text('22 °C');

    $('#snapshotBtn').on("click", (evt) => {
        console.log("Clicked submitButton");
        console.log("Redirect to map");
        window.location.href = "/map";
    });



    $.get('/getTemp', {})
        .done((data) => {
            console.log("Temperature readings: " + data['result']);
            data['result'].forEach(element => {

                console.log("LENGHT ", data['result'].length);
                // TODO loop over length of retrieved temp items
                for(let i = 0; i < 10; i++) {
                    let latestTempReading = element['temperature'][i]['degreesCelsius'];
                    tempData.push(latestTempReading);

                    let latestReading = element['temperature'][i]['timestamp'];
                    latestReading = new Date(latestReading * 1000).toString().substr(15, 6);
                    tempTS.push(latestReading);
                }
                // TODO get the latest reading, resolve named element
                let latestTempReading = element['temperature'][9]['degreesCelsius'];
                let latestReading = element['temperature'][9]['timestamp'];
                latestReading = new Date(latestReading * 1000);

                console.log(element);
                console.log(latestTempReading);
                console.log(latestReading);
                $('#tempReading').text(latestTempReading + ' °C');
                $('#tempReadingTS').text('Latest reading: ' + latestReading.toString().substr(0, 21));


            })
            getWeatherForecast();
            displayTempChart(tempData, tempTS);
        })
        .fail((xhr) => {
            alert('Problem contacting server');
            console.log(xhr);
        });

});




