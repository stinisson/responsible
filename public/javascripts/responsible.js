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

let displayTempChart = () => {
    // const DATA_COUNT = 7;
    // const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};
    //
    // const labels = [
    //     'January',
    //     'February',
    //     'March',
    //     'April',
    //     'May',
    //     'June',
    //     'July',
    //     'August',
    //     'September',
    //     'October',
    //     'November',
    //     'December'
    // ];
    //
    // const data = {
    //     labels: labels,
    //     datasets: [
    //         {
    //             label: 'Dataset 1',
    //             data: [1, 2, 3, 4, 10, 12],
    //             borderColor: 'rgb(255, 205, 86)',
    //             backgroundColor: 'rgb(255, 205, 86)',
    //         }
    //     ]
    // };
    //
    // const config = {
    //     type: 'line',
    //     data: data,
    //     options: {
    //         responsive: true,
    //         plugins: {
    //             legend: {
    //                 position: 'top',
    //             },
    //             title: {
    //                 display: true,
    //                 text: 'Chart.js Line Chart'
    //             }
    //         }
    //     },
    // };
    //
    // var myChart = new Chart(
    //     document.getElementById('temperatureChart').getContext('2d'),
    //     config, data
    // );

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
    //let tempData = [21, 0, 15, 20, 30, 50];
    let tempData = [-20, -5, 0, 15, 20, 30]

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
            labels: ['2021-05-02 13:19', '2021-05-02 13:20Z', '2021-05-02 13:21Z', '2021-05-02 13:22Z', '2021-05-02 13:23Z',
            '2021-05-02 13:23Z'],
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

    $('#snapshotBtn').on("click", (evt) => {
        console.log("Clicked submitButton");
        console.log("Redirect to map");
        window.location.href = "/map";
    });

    getWeatherForecast();
    displayTempChart();

});




