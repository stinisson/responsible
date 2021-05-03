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
    tempData.forEach(temp => {
        if (temp > 25) {
            tempBorderColor.push(chartColors.red);
            tempBackgroundColor.push(chartColorsTransparent.red);
        }
        else if (temp > 20 && temp <= 25) {
            tempBorderColor.push(chartColors.orange);
            tempBackgroundColor.push(chartColorsTransparent.orange);
        }
        else if (temp > -5 && temp <= 20) {
            tempBorderColor.push(chartColors.green);
            tempBackgroundColor.push(chartColorsTransparent.green);
        }
        else if (temp <= -5) {
            tempBorderColor.push(chartColors.blue);
            tempBackgroundColor.push(chartColorsTransparent.blue);
        }
    });

    // Display only the time of the reading as x-axis label
    let readingTime = tempTS.map(function(e) {
        e = e.toString().substr(16, 5);
        return e;
    });
    var ctx = document.getElementById('temperatureChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: readingTime,
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
                        text: 'Temperature °C',
                        font: {
                            size: 16
                        }
                    },
                    grid: {
                        display:false
                    },
                    ticks: {
                        font: {
                            size: 16
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                        font: {
                            size: 16
                        }
                    },
                    grid: {
                        display:false
                    },
                    ticks: {
                        font: {
                            size: 16
                        }
                    }
                }
            }
        }
    });

}

$(document).ready(() => {
    console.log('Client-side code running');

    $('#snapshotBtn').on("click", (evt) => {
        console.log("Clicked submitButton");
        console.log("Redirect to map");
        window.location.href = "/map";
    });

    let tempData = [];
    let tempTS = [];
    $.get('/getTemp', {})
        .done((data) => {
            console.log("Temperature readings: " + data['result']);

            data['result'].forEach(element => {
                console.log("LENGHT ", data['result'][0]['temperature'].length);
                let numReadinngs = data['result'][0]['temperature'].length;
                // TODO loop over length of retrieved temp items
                for(let i = 0; i < numReadinngs; i++) {
                    let latestTempReading = element['temperature'][i]['degreesCelsius'];
                    tempData.push(latestTempReading);

                    let readingTS = element['temperature'][i]['timestamp'];
                    readingTS = new Date(readingTS * 1000);
                    tempTS.push(readingTS);
                }
            });
            let latestTempReading = tempData[tempData.length - 1];
            let latestReading = tempTS[tempTS.length - 1].toString();

            $('#tempReading').text(latestTempReading + ' °C');
            $('#tempReadingTS').text('Latest reading: ' + latestReading.toString().substr(0, 21));

            const chartColorsTransparent = {
                red: 'rgba(255, 99, 132, 0.8)',
                orange: 'rgba(255, 159, 64, 0.8)',
                yellow: 'rgba(255, 205, 86, 0.8)',
                green: 'rgba(75, 192, 192, 0.8)',
                blue: 'rgba(54, 162, 235, 0.8)'
            }

            if (latestTempReading > 25) {
                $("#tempReading").css({"color": chartColorsTransparent.red});
                $("#tempReadingTS").css({"color": chartColorsTransparent.red});

                $('#snapshotBtn').css({background: 'linear-gradient(to right,rgba(255, 99, 132, 0.8) 0%, ' +
                        'rgba(255, 159, 64, 0.8) 50%, rgba(255, 99, 132, 0.8) 100%)'});
                $('#snapshotBtn').css({background: '-webkit-gradient(to right,rgba(255, 99, 132, 0.8) 0%, ' +
                        'rgba(255, 159, 64, 0.8) 50%, rgba(255, 99, 132, 0.8) 100%)'});
                $("h1").css({color: chartColorsTransparent.orange});
                $("#weather").css({color: chartColorsTransparent.red});

            }
            else if (latestTempReading > 20 && latestTempReading <= 25) {
                $("#tempReading").css({"color": chartColorsTransparent.orange});
                $("#tempReadingTS").css({"color": chartColorsTransparent.orange});

                $('#snapshotBtn').css({background: 'linear-gradient(to right,rgba(255, 99, 132, 0.8) 0%, ' +
                        'rgba(255, 159, 64, 0.8) 50%, rgba(255, 205, 86, 0.8) 100%)'});
                $('#snapshotBtn').css({background: '-webkit-gradient(to right,rgba(255, 99, 132, 0.8) 0%, ' +
                        'rgba(255, 159, 64, 0.8) 50%, rgba(255, 205, 86, 0.8) 100%)'});
                $("h1").css({color: chartColorsTransparent.red});
                $("#weather").css({color: chartColorsTransparent.orange});
            }
            else if (latestTempReading > -5 && latestTempReading <= 20) {
                $("#tempReading").css({"color": chartColorsTransparent.green});
                $("#tempReadingTS").css({"color": chartColorsTransparent.green});

                $('#snapshotBtn').css({background: 'linear-gradient(to right, rgba(75, 192, 192, 0.8) 0%, ' +
                        'rgba(54, 162, 235, 0.8) 50%, rgba(75, 192, 192, 0.8) 100%)'});
                $('#snapshotBtn').css({background: '-webkit-gradient(to right, rgba(75, 192, 192, 0.8) 0%, ' +
                        'rgba(54, 162, 235, 0.8) 50%, rgba(75, 192, 192, 0.8) 100%)'});
                $("h1").css({color: chartColorsTransparent.blue});
                $("#weather").css({color: chartColorsTransparent.green});
            }
            else if (latestTempReading <= -5) {
                $("#tempReading").css({"color": chartColorsTransparent.blue});
                $("#tempReadingTS").css({"color": chartColorsTransparent.blue});

                $('#snapshotBtn').css({background: 'linear-gradient(to right,rgba(54, 162, 235, 0.8) 0%, ' +
                        'rgba(75, 192, 192, 0.8) 50%, rgba(54, 162, 235, 0.8) 100%)'});
                $('#snapshotBtn').css({background: '-webkit-gradient(to right,rgba(54, 162, 235, 0.8) 0%, ' +
                        'rgba(75, 192, 192, 0.8) 50%, rgba(54, 162, 235, 0.8) 100%)'});
                $("h1").css({color: chartColorsTransparent.green});
                $("#weather").css({color: chartColorsTransparent.blue});
            }
            else {
                $('#tempReading').text('Something went wrong');
                $('#tempReadingTS').text('Something went wrong');
            }

            getWeatherForecast();
            displayTempChart(tempData, tempTS);
        })
        .fail((xhr) => {
            alert('Problem contacting server');
            console.log(xhr);
        });

});




